import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { addResolutionPath } from './add-resolution-path';
import { readJsonInTree } from '@nrwl/workspace';
import { testRunner } from '../../../utils/testing';
import * as nxJsonUtils from '../../../utils/nx-json';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

describe('addResolutionPath', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';
  const library = DomainLibraryName.DataAccess;
  const npmScope = 'project';
  jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(npmScope);

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should add mock index resolution path', async () => {
    appTree = (await testRunner
      .callRule(addResolutionPath(application, domain, library), appTree)
      .toPromise()) as UnitTestTree;

    const tsConfig = readJsonInTree(appTree, 'tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths[
        `@${npmScope}/${application}/${domain}/private/${library}`
      ]
    ).toEqual([`libs/${application}/${domain}/${library}/src/private-api.ts`]);
  });
});
