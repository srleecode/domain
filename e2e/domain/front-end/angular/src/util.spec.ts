import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('util', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create util library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngUtilLayer --groupingFolder ${groupingFolder}`,
      { silenceError: true }
    ).then((rsp) => console.log(rsp));
    checkFilesExist(`${groupingFolder}/util/src/index.ts`);
  });
});
