import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';
import { addResolutionPath } from './add-resolution-path';
import * as nxJsonUtils from '../../shared/utils/nx-json';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

describe('addResolutionPath', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  const library = DomainLibraryName.DataAccess;
  const npmScope = 'project';
  jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(npmScope);

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should add mock index resolution path', () => {
    addResolutionPath(application, domain, library, appTree);

    const tsConfig = readJson(appTree, 'tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths[
        `@${npmScope}-${application}/${domain}/private/${library}`
      ]
    ).toEqual([`libs/${application}/${domain}/${library}/src/private-api.ts`]);
  });
});
