import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as libraryUtils from '../utils/libraries';
import { checkLibraryExists } from './check-library-exists';
import { DomainLibraryName } from '../model/domain-library-name.enum';

describe('checkLibraryExists', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
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
      new Error(
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
