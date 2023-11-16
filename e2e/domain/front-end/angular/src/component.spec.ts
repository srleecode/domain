import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('component', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create feature component library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type feature --name test-example`,
      { silenceError: true }
    ).then((rsp) => console.log(rsp));
    checkFilesExist(
      `${groupingFolder}/presentation/src/lib/feature/test-example/test-example.component.ts`
    );
  });

  it('should create ui component library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngComponent --groupingFolder ${groupingFolder} --type ui --name test-example`,
      { silenceError: true }
    ).then((rsp) => console.log(rsp));
    checkFilesExist(
      `${groupingFolder}/presentation/src/lib/ui/test-example/test-example.component.ts`
    );
  });
});
