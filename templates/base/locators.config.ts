export const locatorConfig = {
  separator: '.',
  pattern: /^[A-Z][A-Za-z0-9]*\.[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/,
} as const;

export function createLocator(component: string, instanceName: string, slot: string) {
  const locator = [component, instanceName, slot].join(locatorConfig.separator);
  if (!locatorConfig.pattern.test(locator)) {
    throw new Error(`Invalid stable locator: ${locator}`);
  }
  return locator;
}
