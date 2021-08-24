import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';

describe('app grouping folder', () => {
  beforeAll(() => {
    ensureNxProject('@srleecode/domain', 'dist/packages/domain');
  });

  it('should create directory with language prefixed to name', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:appGroupingFolder --name test-app --applicationType ng`
    );
    checkFilesExist('libs/ng-test-app');
  });
});
