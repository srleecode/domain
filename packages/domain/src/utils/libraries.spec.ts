import {
  getDomainLibraryDefinitions,
  getParsedLibraries,
  isLibraryExisting,
} from './libraries';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { StyleType } from '../schematics/shared/model/style-type.enum';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { getParsedDomain } from './domain';

describe('libraries', () => {
  const application = 'test-application';
  const domain = 'domain';
  const parentDomain = 'domain/shared';
  describe('getDomainLibraryDefinitions', () => {
    const prefix = 'test';
    const style = StyleType.Scss;
    const applicationTag = `app:${application}`;

    it('should generate library definitions for leaf domain', () => {
      const directory = `${application}/${domain}`;
      const scopeTag = `scope:${application}-${domain}`;
      const libraryDefinitions = getDomainLibraryDefinitions(
        application,
        domain,
        prefix,
        [
          DomainLibraryName.DataAccess,
          DomainLibraryName.Feature,
          DomainLibraryName.Ui,
          DomainLibraryName.Util,
        ],
        StyleType.Scss
      );
      expect(libraryDefinitions).toEqual([
        {
          directory,
          prefix,
          projectName: DomainLibraryName.DataAccess,
          style,
          tags: [
            applicationTag,
            scopeTag,
            `type:${DomainLibraryName.DataAccess}`,
          ],
        },
        {
          directory,
          prefix,
          projectName: DomainLibraryName.Feature,
          style,
          tags: [applicationTag, scopeTag, `type:${DomainLibraryName.Feature}`],
        },
        {
          directory,
          prefix,
          projectName: DomainLibraryName.Ui,
          style,
          tags: [applicationTag, scopeTag, `type:${DomainLibraryName.Ui}`],
        },
        {
          directory,
          prefix,
          projectName: DomainLibraryName.Util,
          style,
          tags: [applicationTag, scopeTag, `type:${DomainLibraryName.Util}`],
        },
      ]);
    });
    it('should generate library definitions in shared for parent domain', () => {
      const directory = `${application}/${parentDomain}`;
      const scopeTag = `scope:${application}-${getParsedDomain(parentDomain)}`;
      const libraryDefinitions = getDomainLibraryDefinitions(
        application,
        parentDomain,
        prefix,
        [DomainLibraryName.DataAccess],
        StyleType.Scss
      );
      expect(libraryDefinitions).toEqual([
        {
          directory,
          prefix,
          projectName: DomainLibraryName.DataAccess,
          style,
          tags: [
            applicationTag,
            scopeTag,
            `type:${DomainLibraryName.DataAccess}`,
          ],
        },
      ]);
    });
    it('should generate library definitions under parent domain for child domain', () => {
      const parentChildDomain = 'parent-domain/child-domain';
      const directory = `${application}/${parentChildDomain}`;
      const scopeTag = `scope:${application}-${getParsedDomain(
        parentChildDomain
      )}`;
      const libraryDefinitions = getDomainLibraryDefinitions(
        application,
        parentChildDomain,
        prefix,
        [DomainLibraryName.DataAccess],
        StyleType.Scss
      );
      expect(libraryDefinitions).toEqual([
        {
          directory,
          prefix,
          projectName: DomainLibraryName.DataAccess,
          style,
          tags: [
            applicationTag,
            scopeTag,
            `type:${DomainLibraryName.DataAccess}`,
          ],
        },
      ]);
    });
  });

  describe('isLibraryExisting', () => {
    let appTree: UnitTestTree;
    const parentDomain = 'parent-domain/shared';
    const libraryType = DomainLibraryName.DataAccess;
    beforeEach(() => {
      appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    });
    const createParentDomainLibraryFolder = () =>
      appTree.create(
        `/libs/${application}/${parentDomain}/${libraryType}/src/index.ts`,
        ''
      );
    const createChildDomainLibraryFolder = () =>
      appTree.create(
        `/libs/${application}/${domain}/${libraryType}/src/index.ts`,
        ''
      );
    it('should return true when leaf domain library exists', () => {
      createChildDomainLibraryFolder();
      expect(isLibraryExisting(application, domain, libraryType, appTree)).toBe(
        true
      );
    });
    it('should return true when parent domain library exists', () => {
      createParentDomainLibraryFolder();
      expect(
        isLibraryExisting(application, parentDomain, libraryType, appTree)
      ).toBe(true);
    });
    it('should return false when library does not exist', () => {
      expect(isLibraryExisting(application, domain, libraryType, appTree)).toBe(
        false
      );
    });
  });
  describe('getParsedLibraries', () => {
    it('should get DomainLibraryNames from libraries string', () => {
      expect(getParsedLibraries('data-access, ui, util')).toEqual([
        DomainLibraryName.DataAccess,
        DomainLibraryName.Ui,
        DomainLibraryName.Util,
      ]);
    });
  });
});
