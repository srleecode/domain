import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('domain grouping folder', () => {
  it('should create directory', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:domainGroupingFolder --name test-domain --groupingFolder libs/ng-test-app`
    );
    checkFilesExist('libs/ng-test-app/test-domain');
  });
});
