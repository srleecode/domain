import { Tree, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { NxJson } from '@nrwl/workspace';
import { addProjectConfiguration } from '../../shared/utils/project-configuration';
import { renameDomainInNxJson } from './rename-domain-in-nx-json';

describe('renameDomainInNxJson', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'domain';
  const newDomain = 'new-domain';
  const featureProjectName = `${application}-${newDomain}-feature`;
  const utilProjectName = `${application}-${newDomain}-util`;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(appTree, featureProjectName, {
      targets: {},
      root: ``,
      tags: ['app:bank-application', `scope:${application}-${domain}`],
    });
    addProjectConfiguration(appTree, utilProjectName, {
      targets: {},
      root: ``,
      tags: ['app:bank-application', `scope:${application}-${domain}`],
    });
  });

  it('should update domain in nx json to new domain', () => {
    renameDomainInNxJson(appTree, application, domain, newDomain);
    const nxJson: NxJson = readJson(appTree, 'nx.json');
    expect(nxJson.projects[featureProjectName].tags[1]).toBe(
      `scope:${application}-${newDomain}`
    );
    expect(nxJson.projects[utilProjectName].tags[1]).toBe(
      `scope:${application}-${newDomain}`
    );
  });
});
