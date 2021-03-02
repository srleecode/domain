import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';
import { addMockFileResolutionPath } from './add-mock-file-resolution-path';
import * as nxJsonUtils from '../../shared/utils/nx-json';

describe('addMockFileResolutionPath', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  const npmScope = 'project';
  jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(npmScope);

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should add mock index resolution path', () => {
    addMockFileResolutionPath(appTree, application, domain);
    const tsConfig = readJson(appTree, 'tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths[
        `@${npmScope}-${application}/${domain}/testing`
      ]
    ).toEqual([`libs/${application}/${domain}/util/src/testing.ts`]);
  });
});
