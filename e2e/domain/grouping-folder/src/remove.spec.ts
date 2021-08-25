import { fileExists, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('remove', () => {
  const groupingFolder = 'libs/ng-test-app/new-domain';

  it('should remove domain grouping folder', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:removeGroupingFolder --groupingFolder ${groupingFolder}`
    );
    expect(fileExists(`${groupingFolder}/util/src/index.ts`)).toBe(false);
  });
});
