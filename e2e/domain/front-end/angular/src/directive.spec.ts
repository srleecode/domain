import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('directive', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create directive library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngDirective --groupingFolder ${groupingFolder} --name test-example`
    );
    checkFilesExist(`${groupingFolder}/directive-test-example/src/index.ts`);
  });
});
