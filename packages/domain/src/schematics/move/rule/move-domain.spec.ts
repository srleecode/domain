import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { moveDomain } from './move-domain';
import * as testingUtils from '../../../utils/testing';
import * as domainUtils from '../../../utils/domain';
import * as workspaceImport from '@nrwl/workspace/src/generators/move/move';
import { Project } from '../../shared/model/project.model';

describe('moveDomainRules', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  const newLeafDomain = 'new-leaf-domain';
  const parentDomain = 'parent-domain';
  const newParentDomain = 'new-parent-domain';
  const childDomain = 'child-domain';
  const dataAccesslibraryType = DomainLibraryName.DataAccess;
  const utilLibraryType = DomainLibraryName.Util;
  const leafDomainDataAccessProjectName = `${application}-${leafDomain}-${dataAccesslibraryType}`;
  const leafDomainUtilProjectName = `${application}-${leafDomain}-${utilLibraryType}`;
  const parentDomainUtilProjectName = `${application}-${parentDomain}-shared-${utilLibraryType}`;
  const childDomainUtilProjectName = `${application}-${parentDomain}-${childDomain}-${utilLibraryType}`;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest
      .spyOn(workspaceImport, 'moveSchematic')
      .mockReturnValue(testingUtils.emptyRule as any);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate move rules when there are multiple libraries in leaf domain', () => {
    const projects: Project[] = [
      {
        name: leafDomainDataAccessProjectName,
        secondLevelDomain: '',
        type: DomainLibraryName.DataAccess,
      },
      {
        name: leafDomainUtilProjectName,
        secondLevelDomain: '',
        type: DomainLibraryName.Util,
      },
    ];
    jest.spyOn(domainUtils, 'getProjects').mockReturnValue(projects);
    moveDomain(application, leafDomain, newLeafDomain, appTree);
    expect(workspaceImport.moveSchematic).toHaveBeenNthCalledWith(1, {
      destination: `${application}/${newLeafDomain}/${dataAccesslibraryType}`,
      projectName: leafDomainDataAccessProjectName,
      updateImportPath: true,
    });
    expect(workspaceImport.moveSchematic).toHaveBeenNthCalledWith(2, {
      destination: `${application}/${newLeafDomain}/${utilLibraryType}`,
      projectName: leafDomainUtilProjectName,
      updateImportPath: true,
    });
  });
  it('should generate move rules for all libraries in parent domain', () => {
    const projects: Project[] = [
      {
        name: childDomainUtilProjectName,
        secondLevelDomain: childDomain,
        type: DomainLibraryName.Util,
      },
      {
        name: parentDomainUtilProjectName,
        secondLevelDomain: 'shared',
        type: DomainLibraryName.Util,
      },
    ];
    jest.spyOn(domainUtils, 'getProjects').mockReturnValue(projects);
    moveDomain(
      application,
      `${parentDomain}/shared`,
      `${newParentDomain}/shared`,
      appTree
    );
    expect(workspaceImport.moveSchematic).toHaveBeenNthCalledWith(1, {
      destination: `${application}/${newParentDomain}/shared/${utilLibraryType}`,
      projectName: parentDomainUtilProjectName,
      updateImportPath: true,
    });
  });

  it('should generate move rules child domain when moving to new child domain', () => {
    const projects: Project[] = [
      {
        name: childDomainUtilProjectName,
        secondLevelDomain: childDomain,
        type: DomainLibraryName.Util,
      },
    ];
    jest.spyOn(domainUtils, 'getProjects').mockReturnValue(projects);
    moveDomain(
      application,
      `${parentDomain}/${childDomain}`,
      `${newParentDomain}/${childDomain}`,
      appTree
    );
    expect(workspaceImport.moveSchematic).toHaveBeenNthCalledWith(1, {
      destination: `${application}/${newParentDomain}/${childDomain}/${utilLibraryType}`,
      projectName: childDomainUtilProjectName,
      updateImportPath: true,
    });
  });
});
