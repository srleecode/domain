import {
  checkFilesExist,
  newNxProject,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';

describe('app grouping folder', () => {
  beforeAll(async () => {
    newNxProject('@srleecode/domain', 'dist/packages/domain');
    await runNxCommandAsync(`generate @srleecode/domain:ng-add`);
  }, 180000);

  it('should create directory with language prefixed to name', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:appGroupingFolder --name test-app --applicationType ng`
    );
    checkFilesExist('libs/ng-test-app');
  });
});
