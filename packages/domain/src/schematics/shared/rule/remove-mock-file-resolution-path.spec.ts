import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { testRunner } from '../../../utils/testing';
import * as nxJsonUtils from '../../../utils/nx-json';
import { getTsConfigPath } from '../../..//utils/tsconfig';
import { removeMockFileResolutionPath } from './remove-mock-file-resolution-path';

describe('removeMockFileResolutionPath', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';
  const npmScope = 'project';

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(npmScope);
  });

  it('should remove mock file resolution path', async () => {
    const mockTsConfig = {
      compilerOptions: {
        paths: {
          [`@${npmScope}-${application}/${domain}/testing`]: '',
        },
      },
    };
    const tsConfigPath = getTsConfigPath(appTree);
    appTree.overwrite(tsConfigPath, JSON.stringify(mockTsConfig));
    appTree = (await testRunner
      .callRule(removeMockFileResolutionPath(application, domain), appTree)
      .toPromise()) as UnitTestTree;

    const tsConfig = readJsonInTree(appTree, tsConfigPath);
    expect(
      tsConfig.compilerOptions.paths[
        `@${npmScope}-${application}/${domain}/testing`
      ]
    ).toBeUndefined();
  });
});
