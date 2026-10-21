const UNITS = { s: 1, m: 60, h: 3600, d: 86400 } as const;

export const parseDurationToSeconds = (value: string): number => {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) throw new Error(`Invalid duration: "${value}"`);
  return Number(match[1]) * UNITS[match[2] as keyof typeof UNITS];
};
