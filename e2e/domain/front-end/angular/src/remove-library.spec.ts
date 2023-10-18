import { fileExists, runNxCommandAsync } from '@nx/plugin/testing';

describe('remove-library', () => {
  const libraryFolder = 'libs/ng-test-app/test-domain/presentation';

  it('should remove domain library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngRemoveLibrary --libraryFolder ${libraryFolder}`,
      { silenceError: true }
    ).then((rsp) => console.log(rsp));
    expect(fileExists(`${libraryFolder}/src/index.ts`)).toBe(false);
  });
});
