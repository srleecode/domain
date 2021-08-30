import {
  checkFilesExist,
  newNxProject,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';

describe('mockFile e2e', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';
  beforeAll(async () => {
    newNxProject('@srleecode/domain', 'dist/packages/domain');
    await runNxCommandAsync(
      `generate @srleecode/domain:ng-add`
    );
    await runNxCommandAsync(
      `generate @srleecode/domain:appGroupingFolder --name test-app --applicationType ng`
    );
    await runNxCommandAsync(
      `generate @srleecode/domain:domainGroupingFolder --name test-domain --baseFolder libs/ng-test-app`
    );
    await runNxCommandAsync(
      `generate @srleecode/domain:ngUtil --groupingFolder ${groupingFolder}`
    );
  });

  it('should add mock file to domain library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:mockFile --projectName ng-test-app-test-domain-util --mockFileName test-example`
    );
    checkFilesExist(`${groupingFolder}/util/src/testing.ts`);
  });
});