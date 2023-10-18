import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('domain-layer', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create domain layer library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngDomainLayer --groupingFolder ${groupingFolder}`,
      { silenceError: true }
    ).then((rsp) => console.log(rsp));
    checkFilesExist(`${groupingFolder}/domain/src/index.ts`);
  });
});
