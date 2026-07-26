export function selectPublishedServiceLevel<T extends { code: string }>(
  levels: T[],
  requestedCode?: string,
): T | undefined {
  return levels.find((level) => level.code === requestedCode) ?? levels[0];
}
