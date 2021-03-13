import { removeLibraries } from './remove-libraries';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import * as workspaceImport from '@nrwl/workspace';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

describe('removeLibraries', () => {
  let appTree: Tree;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });
  it('should call remove library generator for domain and library types', () => {
    jest
      .spyOn(workspaceImport, 'removeGenerator')
      .mockReturnValue(new Promise((resolve) => resolve()));
    const application = 'test-application';
    const domain = 'test-domain';
    const libraryTypes = [DomainLibraryName.DataAccess];
    removeLibraries(appTree, application, domain, libraryTypes);
    expect(workspaceImport.removeGenerator).toHaveBeenCalledWith(
      expect.anything(),
      {
        projectName: `${application}-${domain}-${libraryTypes[0]}`,
        skipFormat: false,
        forceRemove: true,
      }
    );
  });
});
