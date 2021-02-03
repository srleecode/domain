import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { addMockFileResolutionPath } from './add-mock-file-resolution-path';
import { readJsonInTree } from '@nrwl/workspace';
import { testRunner } from '../../../utils/testing';
import * as nxJsonUtils from '../../../utils/nx-json';

describe('addMockFileResolutionPath', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';
  const npmScope = 'project';
  jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(npmScope);

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should add mock index resolution path', async () => {
    appTree = (await testRunner
      .callRule(addMockFileResolutionPath(application, domain), appTree)
      .toPromise()) as UnitTestTree;

    const tsConfig = readJsonInTree(appTree, 'tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths[
        `@${npmScope}-${application}/${domain}/testing`
      ]
    ).toEqual([`libs/${application}/${domain}/util/src/testing.ts`]);
  });
});
