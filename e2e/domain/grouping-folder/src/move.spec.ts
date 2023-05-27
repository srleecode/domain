import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
} from '@nx/plugin/testing';

describe('move', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';
  const movedDomainGroupingFolder = 'libs/ng-test-app/new-domain';

  beforeAll(async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngUtilLayer --groupingFolder ${groupingFolder}`
    );
    await runNxCommandAsync(
      `generate @srleecode/domain:mockFile --projectName ng-test-app-test-domain-util --mockFileName test-example`
    );
    await runNxCommandAsync(
      `generate @srleecode/domain:moveGroupingFolder --groupingFolder ${groupingFolder} --destination ${movedDomainGroupingFolder}`
    );
  }, 240000);

  it('should move domain grouping folder', async () => {
    checkFilesExist(`${movedDomainGroupingFolder}/util/src/index.ts`);
  });

  it('should update project references', async () => {
    const eslint = readJson('.eslintrc.json');
    const depConstraints =
      eslint.overrides[0].rules['@nx/enforce-module-boundaries'][1]
        .depConstraints;
    const depConstraint = {
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [
        'scope:ng-test-app-new-domain',
        'scope:ng-test-app-shared',
        'app:ng-shared',
      ],
      sourceTag: 'scope:ng-test-app-new-domain',
    };
    expect(depConstraints[depConstraints.length - 1]).toEqual(depConstraint);
    const tsConfig = readJson('tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths['@proj/ng-test-app/new-domain/util']
    ).toEqual(['libs/ng-test-app/new-domain/util/src/index.ts']);
    expect(
      tsConfig.compilerOptions.paths[
        '@proj/ng-test-app/new-domain/util/testing'
      ]
    ).toEqual(['libs/ng-test-app/new-domain/util/src/testing.ts']);
  });
});
