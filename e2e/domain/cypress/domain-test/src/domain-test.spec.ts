import {
  checkFilesExist,
  newNxProject,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';

describe('domainTest e2e', () => {
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

  it('should create e2e project for domain', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:domainTest --groupingFolder ${groupingFolder}`
    );
    checkFilesExist(`${groupingFolder}/.e2e/cypress.json`);
  });
});
