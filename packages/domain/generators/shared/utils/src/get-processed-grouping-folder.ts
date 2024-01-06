export const getProcessedGroupingFolder = (groupingFolder: string): string =>
  groupingFolder.endsWith('/') ? groupingFolder.slice(0, -1) : groupingFolder;
