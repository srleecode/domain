export const getNormalisedPath = (path: string): string =>
  (path || '').replace(/\\/g, '/').replace(/\/\//g, '/');
