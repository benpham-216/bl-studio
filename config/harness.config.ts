export const harnessConfig = {
  schemaVersion: 1,
  contrastMin: 4.5,
  allowedPrimitiveRoots: [
    'color.brand',
    'font',
    'radius',
    'spacing',
  ],
  contrastPairs: [
    { foreground: 'color.onPrimary', background: 'color.primary', min: 4.5 },
    { foreground: 'color.text.primary', background: 'color.surface.default', min: 4.5 },
  ],
} as const;

export type HarnessConfig = typeof harnessConfig;
