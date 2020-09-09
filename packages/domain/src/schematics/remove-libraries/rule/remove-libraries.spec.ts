import { removeLibrariesRules } from './remove-libraries';
import * as testingUtils from '../../../utils/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';

describe('removeLibrariesRules', () => {
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest.clearAllMocks();
  });
  it('should get remove library rules for domain and library types', () => {
    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);
    const application = 'test-application';
    const domain = 'test-domain';
    const libraryTypes = [DomainLibraryName.DataAccess];
    removeLibrariesRules(application, domain, libraryTypes);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/workspace',
      'remove',
      {
        projectName: `${application}-${domain}-${libraryTypes[0]}`,
      }
    );
  });
});
