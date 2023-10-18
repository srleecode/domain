import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('infrastructure-layer', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create infrastructure layer library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngInfrastructureLayer --groupingFolder ${groupingFolder}`,
      { silenceError: true }
    ).then((rsp) => console.log(rsp));
    checkFilesExist(`${groupingFolder}/infrastructure/src/index.ts`);
  });
});
