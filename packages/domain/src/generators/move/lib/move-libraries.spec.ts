import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { moveLibraries } from './move-libraries';
import * as domainUtils from '../../shared/utils/domain';
import * as workspaceImport from '@nrwl/workspace';
import { Project } from '../../shared/model/project.model';

describe('moveLibraries', () => {
  let appTree: Tree;
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
    appTree = createTreeWithEmptyWorkspace();
    jest
      .spyOn(workspaceImport, 'moveGenerator')
      .mockReturnValue(Promise.resolve());
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate move rules when there are multiple libraries in leaf domain', async () => {
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
    await moveLibraries(appTree, application, leafDomain, newLeafDomain);
    expect(workspaceImport.moveGenerator).toHaveBeenNthCalledWith(1, appTree, {
      destination: `${application}/${newLeafDomain}/${dataAccesslibraryType}`,
      projectName: leafDomainDataAccessProjectName,
      updateImportPath: true,
    });
    expect(workspaceImport.moveGenerator).toHaveBeenNthCalledWith(2, appTree, {
      destination: `${application}/${newLeafDomain}/${utilLibraryType}`,
      projectName: leafDomainUtilProjectName,
      updateImportPath: true,
    });
  });
  it('should generate move rules for all libraries in parent domain', async () => {
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
    await moveLibraries(
      appTree,
      application,
      `${parentDomain}/shared`,
      `${newParentDomain}/shared`
    );
    expect(workspaceImport.moveGenerator).toHaveBeenNthCalledWith(1, appTree, {
      destination: `${application}/${newParentDomain}/shared/${utilLibraryType}`,
      projectName: parentDomainUtilProjectName,
      updateImportPath: true,
    });
  });

  it('should generate move rules child domain when moving to new child domain', async () => {
    const projects: Project[] = [
      {
        name: childDomainUtilProjectName,
        secondLevelDomain: childDomain,
        type: DomainLibraryName.Util,
      },
    ];
    jest.spyOn(domainUtils, 'getProjects').mockReturnValue(projects);
    await moveLibraries(
      appTree,
      application,
      `${parentDomain}/${childDomain}`,
      `${newParentDomain}/${childDomain}`
    );
    expect(workspaceImport.moveGenerator).toHaveBeenNthCalledWith(1, appTree, {
      destination: `${application}/${newParentDomain}/${childDomain}/${utilLibraryType}`,
      projectName: childDomainUtilProjectName,
      updateImportPath: true,
    });
  });
});
