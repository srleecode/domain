import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('data-access-layer', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create data access layer library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngDataAccessLayer --groupingFolder ${groupingFolder}`
    );
    checkFilesExist(`${groupingFolder}/data-access/src/index.ts`);
  });
});
