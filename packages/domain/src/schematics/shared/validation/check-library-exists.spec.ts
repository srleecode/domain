import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as libraryUtils from '../../../utils/libraries';
import { checkLibraryExists } from './check-library-exists';
import { DomainLibraryName } from '../model/domain-library-name.enum';

describe('checkLibraryExists', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should throw SchematicException when domain does not exist', () => {
    jest.spyOn(libraryUtils, 'isLibraryExisting').mockReturnValue(false);
    expect(() =>
      checkLibraryExists(
        application,
        domain,
        DomainLibraryName.DataAccess,
        appTree
      )
    ).toThrowError(
      new SchematicsException(
        `${application}/${domain}/${DomainLibraryName.DataAccess} does not exist`
      )
    );
  });
  it('should not throw SchematicException when domain exists', () => {
    jest.spyOn(libraryUtils, 'isLibraryExisting').mockReturnValue(true);
    expect(() =>
      checkLibraryExists(
        application,
        domain,
        DomainLibraryName.DataAccess,
        appTree
      )
    ).not.toThrowError();
  });
});
