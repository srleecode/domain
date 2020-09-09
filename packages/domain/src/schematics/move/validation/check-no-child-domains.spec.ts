import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { checkNoChildDomains } from './check-no-child-domains';

describe('domain tests with tree', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const parentDomain = 'parent-domain/shared';
  const leafDomain = 'lead-domain';
  const childDomain = `parent-domain/child-domain`;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });
  const createParentDomainFolder = (
    application: string,
    parentDomain: string
  ) =>
    appTree.create(
      `/libs/${application}/${parentDomain}/data-access/tslint.json`,
      ''
    );

  const createLeafDomainFolder = (application: string, domain: string) =>
    appTree.create(
      `/libs/${application}/${domain}/data-access/tslint.json`,
      ''
    );

  describe('checkNoChildDomains', () => {
    it('should not throw exception when parent domain does not have any child domains', () => {
      createParentDomainFolder(application, parentDomain);
      expect(() =>
        checkNoChildDomains(application, parentDomain, appTree)
      ).not.toThrowError();
    });
    it('should not throw exception when domain is a leaf domain', () => {
      createLeafDomainFolder(application, leafDomain);
      expect(() =>
        checkNoChildDomains(application, leafDomain, appTree)
      ).not.toThrowError();
    });
    it('should throw exception when parent domain has child domains', () => {
      createParentDomainFolder(application, parentDomain);
      createLeafDomainFolder(application, childDomain);
      expect(() =>
        checkNoChildDomains(application, parentDomain, appTree)
      ).toThrowError(
        new SchematicsException(
          `${application}/${parentDomain} has child domains`
        )
      );
    });
  });
});
