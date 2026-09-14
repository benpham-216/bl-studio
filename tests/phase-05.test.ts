import { describe, expect, it } from 'vitest';
import { harnessConfig } from '../config/harness.config.js';
import { buildBlastRadiusIndex } from '../packages/blast-radius/src/index.js';
import { resolveProject } from '../packages/resolver/src/index.js';
import { validateOverrideTokenPaths, validateRepository } from '../packages/validator/src/index.js';
import { createLocator } from '../templates/base/locators.config.js';

const repoRoot = process.cwd();

describe('Git-backed Phase 0.5 contract', () => {
  it('inherits base semantics while allowing project primitive overrides', async () => {
    const acme = await resolveProject(repoRoot, 'acme');
    const globex = await resolveProject(repoRoot, 'globex');
    const value = (project: typeof acme, id: string) => project.tokens.find((token) => token.id === id)?.value;

    expect(value(acme, 'color.primary')).toBe('#e11d48');
    expect(value(globex, 'color.primary')).toBe('#0f766e');
    expect(acme.tokens.filter((token) => token.semantic).map((token) => token.id))
      .toEqual(globex.tokens.filter((token) => token.semantic).map((token) => token.id));
  });

  it('rejects semantic paths in project overrides', () => {
    expect(validateOverrideTokenPaths(['color.primary'], harnessConfig.allowedPrimitiveRoots))
      .toContain('Project override is outside allowed primitive roots: color.primary');
  });

  it('keeps locators independent from project identity', () => {
    expect(createLocator('Button', 'login-submit', 'root')).toBe('Button.login-submit.root');
  });

  it('computes token blast radius from definitions instead of a hand-maintained map', async () => {
    const index = await buildBlastRadiusIndex(repoRoot);
    expect(index['color.primary']).toEqual({
      components: ['Button'],
      forms: ['LoginForm'],
      pages: ['LoginPage'],
      total: 3,
    });
  });

  it('resolves deterministically and passes repository gates', async () => {
    const first = await resolveProject(repoRoot, 'acme');
    const second = await resolveProject(repoRoot, 'acme');
    expect(second).toEqual(first);
    await expect(validateRepository(repoRoot, harnessConfig)).resolves.toEqual({ valid: true, errors: [] });
  });
});
