import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('util', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create util library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngUtilLayer --groupingFolder ${groupingFolder}`
    );
    checkFilesExist(`${groupingFolder}/util-layer/src/index.ts`);
  });
});
