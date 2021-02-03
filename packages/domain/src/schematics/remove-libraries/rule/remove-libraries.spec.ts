import { removeLibrariesRules } from './remove-libraries';
import * as testingUtils from '../../../utils/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import * as workspaceImport from '@nrwl/workspace/src/generators/remove/remove';

describe('removeLibrariesRules', () => {
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest.clearAllMocks();
  });
  it('should get remove library rules for domain and library types', () => {
    jest
      .spyOn(workspaceImport, 'removeSchematic')
      .mockReturnValue(testingUtils.emptyRule as any);
    const application = 'test-application';
    const domain = 'test-domain';
    const libraryTypes = [DomainLibraryName.DataAccess];
    removeLibrariesRules(application, domain, libraryTypes);
    expect(workspaceImport.removeSchematic).toHaveBeenCalledWith({
      projectName: `${application}-${domain}-${libraryTypes[0]}`,
      skipFormat: false,
      forceRemove: false,
    });
  });
});
