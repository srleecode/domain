import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('infrastructure-layer', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create infrastructure layer library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngInfrastructureLayer --groupingFolder ${groupingFolder}`
    );
    checkFilesExist(`${groupingFolder}/infrastructure/src/index.ts`);
  });
});
