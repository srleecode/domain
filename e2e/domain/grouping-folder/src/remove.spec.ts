import {
  fileExists,
  readJson,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';

describe('remove', () => {
  const groupingFolder = 'libs/ng-test-app/new-domain';
  beforeAll(async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:removeGroupingFolder --groupingFolder ${groupingFolder}`
    );
  }, 240000);

  it('should remove domain grouping folder', async () => {
    expect(fileExists(`${groupingFolder}/util/src/index.ts`)).toBe(false);
  });

  it('should remove project references', async () => {
    const eslint = readJson('.eslintrc.json');
    const depConstraints =
      eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
        .depConstraints;
    expect(JSON.stringify(depConstraints)).not.toMatch(
      'scope:ng-test-app-new-domain'
    );
    const tsConfig = readJson('tsconfig.base.json');
    const tsConfigPaths = Object.keys(tsConfig.compilerOptions.paths);
    expect(tsConfigPaths).not.toContainEqual(
      '@proj/ng-test-app/new-domain/util'
    );
    expect(tsConfigPaths).not.toContainEqual(
      '@proj/ng-test-app/new-domain/util/testing'
    );
  });
});
