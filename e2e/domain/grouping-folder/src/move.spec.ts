import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('move', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';
  const movedDomainGroupingFolder = 'libs/ng-test-app/new-domain';

  it('should move domain grouping folder', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngUtilLayer --groupingFolder ${groupingFolder}`
    );
    await runNxCommandAsync(
      `generate @srleecode/domain:moveGroupingFolder --groupingFolder ${groupingFolder} --destination ${movedDomainGroupingFolder}`
    );
    checkFilesExist(`${movedDomainGroupingFolder}/util-layer/src/index.ts`);
  });
});
