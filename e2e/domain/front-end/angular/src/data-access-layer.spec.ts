import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('data-access-layer', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create data access layer library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngDataAccessLayer --groupingFolder ${groupingFolder}`,
      { silenceError: true }
    ).then((rsp) => console.log(rsp));
    checkFilesExist(`${groupingFolder}/data-access/src/index.ts`);
  });
});
