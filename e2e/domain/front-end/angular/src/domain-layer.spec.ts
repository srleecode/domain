import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('domain-layer', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create domain layer library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngDomainLayer --groupingFolder ${groupingFolder}`
    );
    checkFilesExist(`${groupingFolder}/domain/src/index.ts`);
  });
});
