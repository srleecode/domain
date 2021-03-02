import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  readJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { addProjectConfiguration } from './project-configuration';

describe('addProjectConfiguration', () => {
  let tree: Tree;
  const projectName = 'test';
  const projectConfig: ProjectConfiguration & NxJsonProjectConfiguration = {
    targets: {},
    root: '',
  };
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('addProjectConfiguration', () => {
    it('should update nx.json', () => {
      addProjectConfiguration(tree, projectName, projectConfig);
      const nxJson = readJson(tree, 'nx.json');
      expect(nxJson.projects[projectName]).toBeDefined();
    });
    it('should update workspace.json', () => {
      addProjectConfiguration(tree, projectName, projectConfig);
      const nxJson = readJson(tree, 'workspace.json');
      expect(nxJson.projects[projectName]).toBeDefined();
    });
  });
});
