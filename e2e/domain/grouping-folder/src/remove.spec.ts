import {
  checkFilesExist,
  fileExists,
  readJson,
  runNxCommandAsync,
} from '@nx/plugin/testing';

describe('remove', () => {
  const groupingFolder = 'libs/ng-test-app/new-domain';

  it('should remove domain grouping folder and project references', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:removeGroupingFolder --groupingFolder ${groupingFolder}`,
      { silenceError: true },
    ).then((rsp) => console.log(rsp));

    expect(fileExists(`${groupingFolder}/util/src/index.ts`)).toBe(false);
  });
});
