import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import * as libraries from '../../../utils/libraries';
import { checkLibrariesDontExist } from './check-libraries-dont-exist';

describe('checkLibrariesDontExist', () => {
  const application = 'application';
  const domain = 'domain';
  const libraryTypes = [DomainLibraryName.DataAccess, DomainLibraryName.Util];
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should throw exception when libraries already exist', () => {
    jest.spyOn(libraries, 'isLibraryExisting').mockReturnValue(true);
    expect(() =>
      checkLibrariesDontExist(application, domain, libraryTypes, appTree)
    ).toThrowError(
      new SchematicsException(
        `Libraries already exist: ${libraryTypes.join(',')}`
      )
    );
  });
  it('should not throw exception when libraries do not exist', () => {
    jest.spyOn(libraries, 'isLibraryExisting').mockReturnValue(false);
    expect(() =>
      checkLibrariesDontExist(application, domain, libraryTypes, appTree)
    ).not.toThrowError();
  });
});
