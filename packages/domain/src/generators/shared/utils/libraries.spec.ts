import {
  getDomainLibraryDefinitions,
  getParsedLibraries,
  isLibraryExisting,
} from './libraries';
import { getParsedDomain } from './domain';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { Tree, addProjectConfiguration } from '@nrwl/devkit';

describe('libraries', () => {
  const application = 'test-application';
  const domain = 'domain';
  const parentDomain = 'domain/shared';
  describe('getDomainLibraryDefinitions', () => {
    const applicationTag = `app:${application}`;

    it('should generate library definitions for leaf domain', () => {
      const directory = `${application}/${domain}`;
      const scopeTag = `scope:${application}-${domain}`;
      const libraryDefinitions = getDomainLibraryDefinitions(
        application,
        domain,
        [
          DomainLibraryName.DataAccess,
          DomainLibraryName.Feature,
          DomainLibraryName.Ui,
          DomainLibraryName.Util,
        ]
      );
      expect(libraryDefinitions).toEqual([
        {
          directory,
          projectName: DomainLibraryName.DataAccess,
          tags: [
            applicationTag,
            scopeTag,
            `type:${DomainLibraryName.DataAccess}`,
          ],
          type: DomainLibraryName.DataAccess,
        },
        {
          directory,
          projectName: DomainLibraryName.Feature,
          tags: [applicationTag, scopeTag, `type:${DomainLibraryName.Feature}`],
          type: DomainLibraryName.Feature,
        },
        {
          directory,
          projectName: DomainLibraryName.Ui,
          tags: [applicationTag, scopeTag, `type:${DomainLibraryName.Ui}`],
          type: DomainLibraryName.Ui,
        },
        {
          directory,
          projectName: DomainLibraryName.Util,
          tags: [applicationTag, scopeTag, `type:${DomainLibraryName.Util}`],
          type: DomainLibraryName.Util,
        },
      ]);
    });
    it('should generate library definitions in shared for parent domain', () => {
      const directory = `${application}/${parentDomain}`;
      const scopeTag = `scope:${application}-${getParsedDomain(parentDomain)}`;
      const libraryDefinitions = getDomainLibraryDefinitions(
        application,
        parentDomain,
        [DomainLibraryName.DataAccess]
      );
      expect(libraryDefinitions).toEqual([
        {
          directory,
          projectName: DomainLibraryName.DataAccess,
          tags: [
            applicationTag,
            scopeTag,
            `type:${DomainLibraryName.DataAccess}`,
          ],
          type: DomainLibraryName.DataAccess,
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

        [DomainLibraryName.DataAccess]
      );
      expect(libraryDefinitions).toEqual([
        {
          directory,

          projectName: DomainLibraryName.DataAccess,

          tags: [
            applicationTag,
            scopeTag,
            `type:${DomainLibraryName.DataAccess}`,
          ],
          type: DomainLibraryName.DataAccess,
        },
      ]);
    });
  });

  describe('isLibraryExisting', () => {
    let appTree: Tree;
    const parentDomain = 'parent-domain/shared';
    const libraryType = DomainLibraryName.DataAccess;
    beforeEach(() => {
      appTree = createTreeWithEmptyWorkspace();
      addProjectConfiguration(
        appTree,
        `${application}-${getParsedDomain(
          parentDomain
        )}-${libraryType.toString()}`,
        { targets: {}, root: '' }
      );
      addProjectConfiguration(
        appTree,
        `${application}-${getParsedDomain(domain)}-${libraryType.toString()}`,
        { targets: {}, root: '' }
      );
    });

    it('should return true when leaf domain library exists', () => {
      expect(isLibraryExisting(application, domain, libraryType, appTree)).toBe(
        true
      );
    });
    it('should return true when parent domain library exists', () => {
      expect(
        isLibraryExisting(application, parentDomain, libraryType, appTree)
      ).toBe(true);
    });
    it('should return false when library does not exist', () => {
      expect(
        isLibraryExisting(
          application,
          'not-existing-domain',
          libraryType,
          appTree
        )
      ).toBe(false);
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
