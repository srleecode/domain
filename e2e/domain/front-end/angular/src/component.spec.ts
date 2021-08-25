import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('component', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create shell component library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type shell`
    );
    checkFilesExist(`${groupingFolder}/shell/src/index.ts`);
  });

  it('should create feature component library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type feature`
    );
    checkFilesExist(`${groupingFolder}/feature/src/index.ts`);
  });

  it('should create ui component library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type ui`
    );
    checkFilesExist(`${groupingFolder}/ui/src/index.ts`);
  });

  it('should create ui component library with name', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type ui --name test-example`
    );
    checkFilesExist(`${groupingFolder}/ui-test-example/src/index.ts`);
  });
});
