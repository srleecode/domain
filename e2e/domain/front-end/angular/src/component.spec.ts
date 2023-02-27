import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('component', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create shell component library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type shell --name test-example`
    );
    checkFilesExist(
      `${groupingFolder}/presentation/src/lib/shell/test-example/test-example.component.ts`
    );
  });

  it('should create feature component library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type feature --name test-example`
    );
    checkFilesExist(
      `${groupingFolder}/presentation/src/lib/feature/test-example/test-example.component.ts`
    );
  });

  it('should create ui component library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type ui --name test-example`
    );
    checkFilesExist(
      `${groupingFolder}/presentation/src/lib/ui/test-example/test-example.component.ts`
    );
  });
});
