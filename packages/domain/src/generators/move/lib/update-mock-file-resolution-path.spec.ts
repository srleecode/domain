import { Tree, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as domainUtils from '../../shared/utils/domain';
import * as nxJsonUtils from '../../shared/utils/nx-json';
import { addProjectConfiguration } from '../../shared/utils/project-configuration';
import { getTsConfigPath } from '../../shared/utils/tsconfig';
import { updateMockFileResolutionPath } from './update-mock-file-resolution-path';

describe('updateMockFileResolutionPath', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'domain';
  const newDomain = 'new-domain';
  const project = 'project';
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(project);
    const tsConfig = {
      compilerOptions: {
        paths: {
          [`@project-${application}/${domain}/testing`]: `libs/${application}/${domain}/util/src/testing.ts`,
        },
      },
    };
    addProjectConfiguration(appTree, `${application}-${newDomain}-util`, {
      targets: {},
      root: '',
    });
    appTree.write(getTsConfigPath(appTree), JSON.stringify(tsConfig));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update mock file resolution path to new domain', () => {
    updateMockFileResolutionPath(appTree, application, domain, newDomain);
    const tsConfig = readJson(appTree, getTsConfigPath(appTree));
    expect(tsConfig.compilerOptions.paths).toEqual({
      '@project-test-application/new-domain/testing': [
        'libs/test-application/new-domain/util/src/testing.ts',
      ],
    });
  });
});
