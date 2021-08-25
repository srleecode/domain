import {
  checkFilesExist,
  newNxProject,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';

describe('application-layer', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';
  beforeAll(async () => {
    newNxProject('@srleecode/domain', 'dist/packages/domain');
    await runNxCommandAsync(
      `generate @srleecode/domain:appGroupingFolder --name test-app --applicationType ng`
    );
    await runNxCommandAsync(
      `generate @srleecode/domain:domainGroupingFolder --name test-domain --baseFolder libs/ng-test-app`
    );
  });

  it('should create application layer library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngApplicationLayer --groupingFolder ${groupingFolder}`
    );
    checkFilesExist(`${groupingFolder}/application-layer/src/index.ts`);
  });
});
