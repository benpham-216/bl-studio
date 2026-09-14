import fs from 'node:fs/promises';
import path from 'node:path';

interface ComponentDefinition {
  name: string;
  slots: Record<string, { tokens: string[] }>;
}
interface FormDefinition {
  name: string;
  components: Array<{ component: string; instanceName: string }>;
}
interface PageDefinition {
  name: string;
  forms: string[];
}

export interface TokenUsage {
  components: string[];
  forms: string[];
  pages: string[];
  total: number;
}

async function readDirectory<T>(directory: string): Promise<T[]> {
  const names = (await fs.readdir(directory)).filter((name) => name.endsWith('.json')).sort();
  return Promise.all(names.map(async (name) => JSON.parse(await fs.readFile(path.join(directory, name), 'utf8')) as T));
}

export async function buildBlastRadiusIndex(repoRoot: string): Promise<Record<string, TokenUsage>> {
  const base = path.join(repoRoot, 'templates/base');
  const components = await readDirectory<ComponentDefinition>(path.join(base, 'components'));
  const forms = await readDirectory<FormDefinition>(path.join(base, 'forms'));
  const pages = await readDirectory<PageDefinition>(path.join(base, 'pages'));
  const componentTokens = new Map(components.map((component) => [component.name, new Set(Object.values(component.slots).flatMap((slot) => slot.tokens))]));
  const index = new Map<string, { components: Set<string>; forms: Set<string>; pages: Set<string> }>();

  for (const [component, tokens] of componentTokens) {
    for (const token of tokens) {
      const usage = index.get(token) ?? { components: new Set(), forms: new Set(), pages: new Set() };
      usage.components.add(component);
      index.set(token, usage);
    }
  }

  for (const form of forms) {
    const tokens = new Set(form.components.flatMap((item) => [...(componentTokens.get(item.component) ?? [])]));
    for (const token of tokens) index.get(token)?.forms.add(form.name);
  }

  const formsByName = new Map(forms.map((form) => [form.name, form]));
  for (const page of pages) {
    const pageComponents = page.forms.flatMap((formName) => formsByName.get(formName)?.components ?? []);
    const tokens = new Set(pageComponents.flatMap((item) => [...(componentTokens.get(item.component) ?? [])]));
    for (const token of tokens) index.get(token)?.pages.add(page.name);
  }

  return Object.fromEntries([...index.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([token, usage]) => {
    const components = [...usage.components].sort();
    const forms = [...usage.forms].sort();
    const pages = [...usage.pages].sort();
    return [token, { components, forms, pages, total: components.length + forms.length + pages.length }];
  }));
}
