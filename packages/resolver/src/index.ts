import fs from 'node:fs/promises';
import path from 'node:path';
import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';

export interface StudioProject {
  schemaVersion: 1;
  name: string;
  extends: string;
  releaseVersion: string;
}

export interface ResolvedToken {
  id: string;
  value: unknown;
  type?: string;
  source: 'base' | 'project';
  sourcePath: string;
  semantic: boolean;
}

export interface ResolvedProject {
  project: StudioProject;
  tokens: ResolvedToken[];
}

export async function readProject(repoRoot: string, projectName: string): Promise<StudioProject> {
  const file = path.join(repoRoot, 'projects', projectName, 'project.json');
  return JSON.parse(await fs.readFile(file, 'utf8')) as StudioProject;
}

export async function listProjects(repoRoot: string): Promise<string[]> {
  const root = path.join(repoRoot, 'projects');
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

function dictionaryFor(repoRoot: string, project: StudioProject) {
  const base = path.join(repoRoot, project.extends);
  const projectRoot = path.join(repoRoot, 'projects', project.name);

  return new StyleDictionary({
    usesDtcg: true,
    include: [path.join(base, 'tokens/**/*.tokens.json')],
    source: [path.join(projectRoot, 'overrides/**/*.tokens.json')],
    platforms: {
      inspect: {},
      css: {
        transformGroup: transformGroups.css,
        buildPath: `${path.join(repoRoot, 'dist', project.name)}${path.sep}`,
        files: [
          {
            destination: 'variables.css',
            format: formats.cssVariables,
            options: { outputReferences: true, showFileHeader: false },
          },
        ],
      },
    },
  });
}

export async function resolveProject(repoRoot: string, projectName: string): Promise<ResolvedProject> {
  const project = await readProject(repoRoot, projectName);
  const dictionary = await dictionaryFor(repoRoot, project).getPlatformTokens('inspect');

  const tokens = dictionary.allTokens
    .map((token) => {
      const dtcg = token as typeof token & { $value?: unknown; $type?: string };
      const relativePath = path.relative(repoRoot, token.filePath ?? '').split(path.sep).join('/');
      return {
        id: token.path.join('.'),
        value: dtcg.$value ?? token.value,
        type: dtcg.$type ?? token.type,
        source: token.isSource ? ('project' as const) : ('base' as const),
        sourcePath: relativePath,
        semantic: relativePath.endsWith('/semantic.tokens.json'),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  return { project, tokens };
}

export async function buildProjectCss(repoRoot: string, projectName: string): Promise<void> {
  const project = await readProject(repoRoot, projectName);
  await dictionaryFor(repoRoot, project).buildPlatform('css');
}
