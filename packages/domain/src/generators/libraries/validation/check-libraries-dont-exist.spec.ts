import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import * as libraries from '../../shared/utils/libraries';
import { checkLibrariesDontExist } from './check-libraries-dont-exist';

describe('checkLibrariesDontExist', () => {
  const application = 'application';
  const domain = 'domain';
  const libraryTypes = [DomainLibraryName.DataAccess, DomainLibraryName.Util];
  let appTree: Tree;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should throw exception when libraries already exist', () => {
    jest.spyOn(libraries, 'isLibraryExisting').mockReturnValue(true);
    expect(() =>
      checkLibrariesDontExist(application, domain, libraryTypes, appTree)
    ).toThrowError(
      new Error(`Libraries already exist: ${libraryTypes.join(',')}`)
    );
  });
  it('should not throw exception when libraries do not exist', () => {
    jest.spyOn(libraries, 'isLibraryExisting').mockReturnValue(false);
    expect(() =>
      checkLibrariesDontExist(application, domain, libraryTypes, appTree)
    ).not.toThrowError();
  });
});
