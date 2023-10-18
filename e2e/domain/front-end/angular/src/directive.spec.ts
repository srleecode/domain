import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('directive', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';

  it('should create directive library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngDirective --groupingFolder ${groupingFolder} --name test-example`,
      { silenceError: true }
    ).then((rsp) => console.log(rsp));
    checkFilesExist(
      `${groupingFolder}/presentation/src/lib/directive/test-example/test-example.directive.ts`
    );
  });
});
