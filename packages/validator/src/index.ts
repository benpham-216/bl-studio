import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import { listProjects, resolveProject, type ResolvedToken } from '../../resolver/src/index.js';

export interface ValidationOptions {
  allowedPrimitiveRoots: readonly string[];
  contrastPairs: readonly { foreground: string; background: string; min: number }[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function jsonFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return jsonFiles(full);
    return entry.name.endsWith('.json') ? [full] : [];
  }));
  return nested.flat().sort();
}

function tokenPaths(value: unknown, prefix: string[] = []): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  const record = value as Record<string, unknown>;
  if ('$value' in record) return [prefix.join('.')];
  return Object.entries(record).flatMap(([key, child]) => tokenPaths(child, [...prefix, key]));
}

export function validateOverrideTokenPaths(paths: readonly string[], allowedRoots: readonly string[]): string[] {
  return paths
    .filter((tokenPath) => !allowedRoots.some((root) => tokenPath === root || tokenPath.startsWith(`${root}.`)))
    .map((tokenPath) => `Project override is outside allowed primitive roots: ${tokenPath}`);
}

async function validateSchemas(repoRoot: string): Promise<string[]> {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const contracts = path.join(repoRoot, 'contracts');
  const schemaFiles = ['project', 'template', 'component', 'form', 'page'];
  const validators = new Map<string, ReturnType<typeof ajv.compile>>();

  for (const name of schemaFiles) {
    validators.set(name, ajv.compile(await readJson(path.join(contracts, `${name}.schema.json`))));
  }

  const targets: Array<{ file: string; schema: string }> = [
    { file: path.join(repoRoot, 'templates/base/template.json'), schema: 'template' },
  ];

  for (const projectName of await listProjects(repoRoot)) {
    targets.push({ file: path.join(repoRoot, 'projects', projectName, 'project.json'), schema: 'project' });
  }

  for (const [folder, schema] of [['components', 'component'], ['forms', 'form'], ['pages', 'page']] as const) {
    for (const file of await jsonFiles(path.join(repoRoot, 'templates/base', folder))) targets.push({ file, schema });
  }

  const errors: string[] = [];
  for (const target of targets) {
    const validate = validators.get(target.schema)!;
    const valid = validate(await readJson(target.file));
    if (!valid) {
      for (const error of validate.errors ?? []) {
        errors.push(`${path.relative(repoRoot, target.file)}${error.instancePath || '/'} ${error.message}`);
      }
    }
  }
  return errors;
}

async function validateOverrides(repoRoot: string, allowedRoots: readonly string[]): Promise<string[]> {
  const errors: string[] = [];
  for (const projectName of await listProjects(repoRoot)) {
    const overrideRoot = path.join(repoRoot, 'projects', projectName, 'overrides');
    for (const file of await jsonFiles(overrideRoot)) {
      if (path.basename(file) !== 'primitives.tokens.json') {
        errors.push(`${path.relative(repoRoot, file)}: projects may override primitives.tokens.json only`);
        continue;
      }
      errors.push(...validateOverrideTokenPaths(tokenPaths(await readJson(file)), allowedRoots));
    }
  }
  return errors;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const raw = match[1];
  return [0, 2, 4].map((offset) => Number.parseInt(raw.slice(offset, offset + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number | null {
  const fg = luminance(foreground);
  const bg = luminance(background);
  if (fg === null || bg === null) return null;
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

function validateContrast(tokens: ResolvedToken[], pairs: ValidationOptions['contrastPairs'], project: string): string[] {
  const byId = new Map(tokens.map((token) => [token.id, token.value]));
  const errors: string[] = [];
  for (const pair of pairs) {
    const foreground = byId.get(pair.foreground);
    const background = byId.get(pair.background);
    if (typeof foreground !== 'string' || typeof background !== 'string') {
      errors.push(`${project}: contrast pair is missing a string color: ${pair.foreground} / ${pair.background}`);
      continue;
    }
    const ratio = contrastRatio(foreground, background);
    if (ratio === null || ratio < pair.min) {
      errors.push(`${project}: contrast ${pair.foreground} on ${pair.background} = ${ratio?.toFixed(2) ?? 'invalid'}; minimum ${pair.min}`);
    }
  }
  return errors;
}

export async function validateRepository(repoRoot: string, options: ValidationOptions): Promise<ValidationResult> {
  const errors = [
    ...(await validateSchemas(repoRoot)),
    ...(await validateOverrides(repoRoot, options.allowedPrimitiveRoots)),
  ];

  let semanticIds: string[] | undefined;
  for (const projectName of await listProjects(repoRoot)) {
    const resolved = await resolveProject(repoRoot, projectName);
    errors.push(...validateContrast(resolved.tokens, options.contrastPairs, projectName));
    const currentSemanticIds = resolved.tokens.filter((token) => token.semantic).map((token) => token.id).sort();
    if (!semanticIds) semanticIds = currentSemanticIds;
    else if (JSON.stringify(semanticIds) !== JSON.stringify(currentSemanticIds)) {
      errors.push(`${projectName}: semantic token identity differs from the base contract`);
    }
  }

  return { valid: errors.length === 0, errors };
}
