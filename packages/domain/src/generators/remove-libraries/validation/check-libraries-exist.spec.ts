import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import * as libraries from '../../shared/utils/libraries';
import { checkLibrariesExist } from './check-libraries-exist';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

describe('checkLibrariesExist', () => {
  const application = 'application';
  const domain = 'domain';
  const libraryTypes = [DomainLibraryName.DataAccess, DomainLibraryName.Util];
  let appTree: Tree;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should throw exception when libraries dont already exist', () => {
    jest.spyOn(libraries, 'isLibraryExisting').mockReturnValue(false);
    expect(() =>
      checkLibrariesExist(appTree, application, domain, libraryTypes)
    ).toThrowError(
      new Error(
        `Trying to perform an operation on libraries that don't exist: ${libraryTypes.join(
          ','
        )}`
      )
    );
  });
  it('should not throw exception when libraries exist', () => {
    jest.spyOn(libraries, 'isLibraryExisting').mockReturnValue(true);
    expect(() =>
      checkLibrariesExist(appTree, application, domain, libraryTypes)
    ).not.toThrowError();
  });
});
