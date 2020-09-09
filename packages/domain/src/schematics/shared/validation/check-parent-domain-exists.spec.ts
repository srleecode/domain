import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { checkParentDomainExists } from './check-parent-domain-exists';
import * as domainUtils from '../../../utils/domain';

describe('checkParentDomain', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const parentDomain = 'parent-domain';
  const errorMessage = `Configure domain (${parentDomain}) as parent before adding child domains to it`;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('show throw schematic exception when parentDomain does not exist', () => {
    expect(() =>
      checkParentDomainExists(application, parentDomain, appTree)
    ).toThrowError(new SchematicsException(errorMessage));
  });
  it('should throw schematic exception when parentDomain exists but is not a parent domain', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(false);
    expect(() =>
      checkParentDomainExists(application, parentDomain, appTree)
    ).toThrowError(new SchematicsException(errorMessage));
  });
  it('show not throw schematic exception when parentDomain exists', async () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(true);
    expect(() =>
      checkParentDomainExists(application, parentDomain, appTree)
    ).not.toThrowError();
  });
});
