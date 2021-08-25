import { fileExists, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('remove-library', () => {
  const libraryFolder = 'libs/ng-test-app/test-domain/ui-test-example';

  it('should remove domain library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngRemoveLibrary --libraryFolder ${libraryFolder}`
    );
    expect(fileExists(`${libraryFolder}/src/index.ts`)).toBe(false);
  });
});
