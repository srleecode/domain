import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { getNxJson } from '../../../utils/nx-json';
import { getParsedDomain } from '../../../utils/domain';
import { removeCypressProjectImplicitDependencies } from './remove-cypress-project-implicit-dependencies';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../model/cypress-project.enum';

describe('removeCypressProjectImplicitDependencies', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  const libraryTypes = [
    DomainLibraryName.DataAccess,
    DomainLibraryName.Feature,
    DomainLibraryName.Shell,
    DomainLibraryName.Ui,
    DomainLibraryName.Util,
  ];
  const projectName = getCypressProjectName(
    application,
    domain,
    CypressProject.E2E
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    const nxJson = {
      projects: {
        [projectName]: {
          tags: [],
          implicitDependencies: [
            `${application}-${getParsedDomain(domain)}-${
              DomainLibraryName.DataAccess
            }`,
            `${application}-${getParsedDomain(domain)}-${
              DomainLibraryName.Feature
            }`,
            `${application}-${getParsedDomain(domain)}-${
              DomainLibraryName.Shell
            }`,
            `${application}-${getParsedDomain(domain)}-${DomainLibraryName.Ui}`,
            `${application}-${getParsedDomain(domain)}-${
              DomainLibraryName.Util
            }`,
          ],
        },
      },
    };
    appTree.overwrite('nx.json', JSON.stringify(nxJson));
  });

  it('should remove given domain libraries as implicit dependencies', async () => {
    appTree = (await testRunner
      .callRule(
        removeCypressProjectImplicitDependencies(
          application,
          domain,
          libraryTypes,
          CypressProject.E2E
        ),
        appTree
      )
      .toPromise()) as UnitTestTree;

    const nxJson = getNxJson(appTree);
    expect(nxJson.projects).toEqual({
      [projectName]: {
        implicitDependencies: [],
        tags: [],
      },
    });
  });
});
