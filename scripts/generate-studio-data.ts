import fs from 'node:fs/promises';
import path from 'node:path';
import { harnessConfig } from '../config/harness.config.js';
import { buildBlastRadiusIndex } from '../packages/blast-radius/src/index.js';
import { buildProjectCss, listProjects, resolveProject } from '../packages/resolver/src/index.js';
import { validateRepository } from '../packages/validator/src/index.js';

const repoRoot = process.cwd();
const validateOnly = process.argv.includes('--validate-only');
const validation = await validateRepository(repoRoot, harnessConfig);
if (!validation.valid) {
  console.error(validation.errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Studio contracts, overrides, semantic invariants and contrast gates passed.');
}

if (!validation.valid || validateOnly) process.exit();

const blastRadius = await buildBlastRadiusIndex(repoRoot);
const projects = [];
for (const projectName of await listProjects(repoRoot)) {
  const resolved = await resolveProject(repoRoot, projectName);
  await buildProjectCss(repoRoot, projectName);
  projects.push({
    ...resolved.project,
    tokens: resolved.tokens.map((token) => ({ ...token, usage: blastRadius[token.id] ?? null })),
  });
}

const output = { schemaVersion: 1, projects, blastRadius };
const outputFile = path.join(repoRoot, 'apps/studio-web/src/generated/studio-data.json');
await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Generated ${path.relative(repoRoot, outputFile)} and dist/<project>/variables.css.`);
