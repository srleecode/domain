import { Tree, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { removeMockFileResolutionPath } from './remove-mock-file-resolution-path';
import * as nxJsonUtils from '../../shared/utils/nx-json';
import { getTsConfigPath } from '../utils/tsconfig';

describe('removeMockFileResolutionPath', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  const npmScope = 'project';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(npmScope);
  });

  it('should remove mock file resolution path', () => {
    const mockTsConfig = {
      compilerOptions: {
        paths: {
          [`@${npmScope}-${application}/${domain}/testing`]: '',
        },
      },
    };
    const tsConfigPath = getTsConfigPath(appTree);
    appTree.write(tsConfigPath, JSON.stringify(mockTsConfig));
    removeMockFileResolutionPath(appTree, application, domain);

    const tsConfig = readJson(appTree, tsConfigPath);
    expect(
      tsConfig.compilerOptions.paths[
        `@${npmScope}-${application}/${domain}/testing`
      ]
    ).toBeUndefined();
  });
});
