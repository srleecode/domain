import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { getNxJson } from '../../../utils/nx-json';
import { getParsedDomain } from '../../../utils/domain';
import { addE2EImplicitDependencies } from './add-e2e-implicit-dependencies';

describe('addE2EImplicitDependencies', () => {
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
  const projectName = `e2e-${application}-${getParsedDomain(domain)}`;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    const nxJson = {
      projects: {
        [projectName]: {
          tags: [],
        },
      },
    };
    appTree.overwrite('nx.json', JSON.stringify(nxJson));
  });

  it('should add domain libraries as implicit dependencies', async () => {
    appTree = (await testRunner
      .callRule(
        addE2EImplicitDependencies(application, domain, libraryTypes),
        appTree
      )
      .toPromise()) as UnitTestTree;

    const nxJson = getNxJson(appTree);
    expect(nxJson.projects).toEqual({
      [projectName]: {
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
          `${application}-${getParsedDomain(domain)}-${DomainLibraryName.Util}`,
        ],
        tags: [],
      },
    });
  });
});
