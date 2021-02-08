import {
  isChildDomain,
  getTopLevelDomain,
  getParsedDomain,
  isParentDomain,
  isDomainExisting,
  isDomainHavingLibraryType,
  getProjects,
  isDomainEmptyAfterLibraryRemoval,
  isTwoLevelDomain,
  getSecondLevelDomain,
} from './domain';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { NxJson } from '@nrwl/workspace';
import * as nxJsonUtils from './nx-json';
import * as tsConfigUtils from './tsconfig';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { Project } from '../model/project.model';

describe('isChildDomain', () => {
  it('should return true when child domain', () => {
    expect(isChildDomain('parent-domain/child-domain')).toBe(true);
  });
  it('should return false when not child domain', () => {
    expect(isChildDomain('domain')).toBe(false);
  });
  it('should return false when parent domain', () => {
    expect(isChildDomain('domain/shared')).toBe(false);
  });
});

describe('getTopLevelDomain', () => {
  it('should get top level domain when given child domain', () => {
    expect(getTopLevelDomain('parent-domain/child-domain')).toBe(
      'parent-domain'
    );
  });
});
describe('geSecondLevelDomain', () => {
  it('should return child second level domain when given child domain', () => {
    expect(getSecondLevelDomain('parent-domain/child-domain')).toBe(
      'child-domain'
    );
  });
  it('should return shared when given parent domain', () => {
    expect(getSecondLevelDomain('parent-domain/shared')).toBe('shared');
  });
  it('should return undefined when given leaf domain', () => {
    expect(getSecondLevelDomain('leaf-domain')).toBeUndefined();
  });
});
describe('getParsedDomain', () => {
  it('should get child domain with / replaced with -', () => {
    expect(getParsedDomain('parent-domain/child-domain')).toBe(
      'parent-domain-child-domain'
    );
  });
  it('should get parsed parent domain', () => {
    expect(getParsedDomain('parent-domain/shared')).toBe(
      'parent-domain-shared'
    );
  });
});

describe('isParentDomain', () => {
  it('should return true when domain is a parent domain', () => {
    expect(isParentDomain('parent-domain/shared')).toBe(true);
  });
  it('should return false when domain is a child domain', () => {
    expect(isParentDomain('leaf-domain')).toBe(false);
  });
});

describe('domain tests with tree', () => {
  let appTree: Tree;
  const application = 'test-application';
  const parentDomain = 'parent-domain/shared';
  const leafDomain = 'leaf-domain';
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });
  const createParentDomainFolder = (
    application: string,
    parentDomain: string
  ) =>
    appTree.write(
      `/libs/${application}/${parentDomain}/data-access/src/index.ts`,
      ''
    );

  const createLeafDomainFolder = (application: string, domain: string) =>
    appTree.write(
      `/libs/${application}/${domain}/data-access/src/index.ts`,
      ''
    );

  describe('isDomainExisting', () => {
    it('should return true when domain is a parent domain and domain exists', () => {
      createParentDomainFolder(application, parentDomain);
      expect(isDomainExisting(application, parentDomain, appTree)).toBe(true);
    });
    it('should return true when domain is a leaf domain and domain exists', () => {
      createLeafDomainFolder(application, leafDomain);
      expect(isDomainExisting(application, leafDomain, appTree)).toBe(true);
    });
    it('should return false when domain is a leaf domain and parent domain with same name exists', () => {
      createParentDomainFolder(application, parentDomain);
      expect(isDomainExisting(application, 'parent-domain', appTree)).toBe(
        false
      );
    });
  });

  describe('isDomainHavingLibraryType', () => {
    const mockNxJson: NxJson = {
      npmScope: 'project',
      projects: {
        [`${application}-${getParsedDomain(parentDomain)}-${
          DomainLibraryName.DataAccess
        }`]: {},
        [`${application}-${leafDomain}-with-util-${DomainLibraryName.Util}`]: {},
        [`${application}-${leafDomain}-${DomainLibraryName.DataAccess}`]: {},
      },
    };

    beforeEach(() => {
      appTree.write('nx.json', JSON.stringify(mockNxJson));
    });
    it('should return true when domain has given library', () => {
      expect(
        isDomainHavingLibraryType(
          application,
          `${leafDomain}-with-util`,
          appTree,
          DomainLibraryName.Util
        )
      ).toBe(true);
    });
    it('should return false when domain does not have given library', () => {
      expect(
        isDomainHavingLibraryType(
          application,
          parentDomain,
          appTree,
          DomainLibraryName.Util
        )
      ).toBe(false);
    });
    it('should return false when domain with same prefix has given library but given domain doesnt', () => {
      expect(
        isDomainHavingLibraryType(
          application,
          leafDomain,
          appTree,
          DomainLibraryName.Util
        )
      ).toBe(false);
    });
  });

  describe('isDomainEmptyAfterLibraryRemoval', () => {
    const mockNxJson: NxJson = {
      npmScope: 'project',
      projects: {
        [`${application}-${leafDomain}-${DomainLibraryName.DataAccess}`]: {},
      },
    };

    beforeEach(() => {
      appTree.write('nx.json', JSON.stringify(mockNxJson));
    });
    it('should return true when domain has no library projects', () => {
      expect(
        isDomainEmptyAfterLibraryRemoval(application, 'test', [], appTree)
      ).toBe(true);
    });
    it('should return true when domain has a library project and it is being removed', () => {
      expect(
        isDomainEmptyAfterLibraryRemoval(
          application,
          leafDomain,
          [DomainLibraryName.DataAccess],
          appTree
        )
      ).toBe(true);
    });
    it('should return false when domain has at least one library project', () => {
      expect(
        isDomainEmptyAfterLibraryRemoval(application, leafDomain, [], appTree)
      ).toBe(false);
    });
  });

  describe('getProjects', () => {
    const leafDomain = 'leaf-domain';
    const leafExtraWordDomain = 'leaf-domain-extra-word';
    const parentDomain = 'parent-domain';
    const childDomain = 'child-domain';
    const dataAccesslibraryType = DomainLibraryName.DataAccess;
    const utilLibraryType = DomainLibraryName.Util;
    const leafDomainDataAccessProjectName = `${application}-${leafDomain}-${dataAccesslibraryType}`;
    const leafDomainUtilProjectName = `${application}-${leafDomain}-${utilLibraryType}`;
    const parentDomainUtilProjectName = `${application}-${parentDomain}-shared-${utilLibraryType}`;
    const childDomainUtilProjectName = `${application}-${parentDomain}-${childDomain}-${utilLibraryType}`;
    const mockNxJson: NxJson = {
      npmScope: 'project',
      projects: {
        [leafDomainDataAccessProjectName]: {},
        [leafDomainUtilProjectName]: {},
        [parentDomainUtilProjectName]: {},
        [childDomainUtilProjectName]: {},
      },
    };
    const tsConfigPrefix = `${mockNxJson.npmScope}/${application}`;
    const tsConfig = {
      compilerOptions: {
        paths: {
          [`${tsConfigPrefix}/${leafDomain}/${dataAccesslibraryType}`]: [''],
          [`${tsConfigPrefix}/${leafDomain}/${utilLibraryType}`]: [''],
          [`${tsConfigPrefix}/${leafExtraWordDomain}/${dataAccesslibraryType}`]: [
            '',
          ],
          [`${tsConfigPrefix}/${parentDomain}/shared/${utilLibraryType}`]: [''],
          [`${tsConfigPrefix}/${parentDomain}/${childDomain}/${utilLibraryType}`]: [
            '',
          ],
        },
      },
    };
    beforeEach(() => {
      jest.spyOn(nxJsonUtils, 'getNxJson').mockReturnValue(mockNxJson);
      jest.spyOn(tsConfigUtils, 'getTsConfig').mockReturnValue(tsConfig);
    });

    it('should return parent domain library projects when given parent domain', () => {
      const expected: Project[] = [
        {
          secondLevelDomain: 'shared',
          name: `${application}-${parentDomain}-shared-${DomainLibraryName.Util}`,
          type: DomainLibraryName.Util,
        },
      ];
      expect(
        getProjects(application, `${parentDomain}/shared`, appTree)
      ).toEqual(expected);
    });
    it('should return child domain library projects when given child domain', () => {
      const expected: Project[] = [
        {
          secondLevelDomain: '',
          name: `${application}-${parentDomain}-${childDomain}-${DomainLibraryName.Util}`,
          type: DomainLibraryName.Util,
        },
      ];
      expect(
        getProjects(application, `${parentDomain}/${childDomain}`, appTree)
      ).toEqual(expected);
    });
    it('should return leaf domain library projects when given leaf domain', () => {
      const expected: Project[] = [
        {
          secondLevelDomain: '',
          name: `${application}-${leafDomain}-${DomainLibraryName.DataAccess}`,
          type: DomainLibraryName.DataAccess,
        },
        {
          secondLevelDomain: '',
          name: `${application}-${leafDomain}-${DomainLibraryName.Util}`,
          type: DomainLibraryName.Util,
        },
      ];
      expect(getProjects(application, leafDomain, appTree)).toEqual(expected);
    });
  });
});

describe('isTwoLevelDomain', () => {
  it('should return true when child domain', () => {
    const domain = 'parent-domain/child-domain';
    expect(isTwoLevelDomain(domain)).toBe(true);
  });
  it('should return true when parent domain', () => {
    const domain = 'parent-domain/shared';
    expect(isTwoLevelDomain(domain)).toBe(true);
  });
  it('should return false when leaf domain', () => {
    const domain = 'leaf-domain';
    expect(isTwoLevelDomain(domain)).toBe(false);
  });
});
