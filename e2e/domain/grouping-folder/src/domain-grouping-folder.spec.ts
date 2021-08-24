import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('domain grouping folder', () => {
  it('should create directory', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:domainGroupingFolder --name test-domain --baseFolder libs/ng-test-app`
    );
    checkFilesExist('libs/ng-test-app/test-domain');
  });
});
