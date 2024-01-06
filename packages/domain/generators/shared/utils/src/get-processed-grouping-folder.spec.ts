import { getProcessedGroupingFolder } from './get-processed-grouping-folder';

describe('getProcessedGroupingFolder', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should remove / from end of grouping folder', async () => {
    expect(getProcessedGroupingFolder(groupingFolder + '/')).toBe(
      groupingFolder,
    );
  });

  it('should return grouping folder when it doesnt end in /', async () => {
    expect(getProcessedGroupingFolder(groupingFolder)).toBe(groupingFolder);
  });
});
