import { checkCypressProjectExists } from './check-cypress-project-exists';
import { CypressProject } from '../model/cypress-project.enum';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { addProjectConfiguration } from '../utils/project-configuration';

describe('checkCypressProjectExists', () => {
  let appTree: Tree;
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(
      appTree,
      `${CypressProject.E2E}-${application}-${leafDomain}`,
      {
        targets: {},
        root: '',
      }
    );
  });
  it('show throw schematic exception when domain does not have a E2E project', () => {
    expect(() =>
      checkCypressProjectExists(
        appTree,
        application,
        'test',
        CypressProject.E2E
      )
    ).toThrowError(
      new Error(
        `Project does not exist ${CypressProject.E2E}-${application}-test`
      )
    );
  });
  it('show not throw schematic exception when domain does have a E2E projects', () => {
    expect(() =>
      checkCypressProjectExists(
        appTree,
        application,
        leafDomain,
        CypressProject.E2E
      )
    ).not.toThrowError();
  });
});
