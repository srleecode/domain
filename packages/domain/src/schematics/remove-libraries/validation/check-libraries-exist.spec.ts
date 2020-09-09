import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import * as libraries from '../../../utils/libraries';
import { checkLibrariesExist } from './check-libraries-exist';

describe('checkLibrariesExist', () => {
  const application = 'application';
  const domain = 'domain';
  const libraryTypes = [DomainLibraryName.DataAccess, DomainLibraryName.Util];
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should throw exception when libraries dont already exist', () => {
    jest.spyOn(libraries, 'isLibraryExisting').mockReturnValue(false);
    expect(() =>
      checkLibrariesExist(application, domain, libraryTypes, appTree)
    ).toThrowError(
      new SchematicsException(
        `Trying to perform an operation on libraries that don't exist: ${libraryTypes.join(
          ','
        )}`
      )
    );
  });
  it('should not throw exception when libraries exist', () => {
    jest.spyOn(libraries, 'isLibraryExisting').mockReturnValue(true);
    expect(() =>
      checkLibrariesExist(application, domain, libraryTypes, appTree)
    ).not.toThrowError();
  });
});
