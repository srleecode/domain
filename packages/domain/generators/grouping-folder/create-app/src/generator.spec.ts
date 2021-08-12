import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createAppGroupingFolderGenerator } from './generator';
import { FrontendFramework } from './lib/model/framework.enum';
import * as initialiseFeAppWorkspaceMock from './lib/fe-app/initialise-fe-app-workspace';
import * as addSharedApplicationEslintRuleMock from './lib/shared/add-shared-application-eslint-rule';

describe('createAppGroupingFolderGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(
      addSharedApplicationEslintRuleMock,
      'addSharedApplicationEslintRule'
    );
  });

  it('should create directory with language prefixed to name', async () => {
    await createAppGroupingFolderGenerator(tree, {
      baseFolder: 'libs',
      name: 'test',
      framework: FrontendFramework.Angular,
    });
    const fileChanges = tree.listChanges();
    expect(fileChanges[fileChanges.length - 1].path).toBe('libs/ng-test');
  });
  it('should create directory with just name when no language provided', async () => {
    await createAppGroupingFolderGenerator(tree, {
      baseFolder: 'libs',
      name: 'test',
    });
    const fileChanges = tree.listChanges();
    expect(fileChanges[fileChanges.length - 1].path).toBe('libs/test');
  });
  it('should add shared application eslint rules when given name is shared', async () => {
    await createAppGroupingFolderGenerator(tree, {
      baseFolder: 'libs',
      name: 'shared',
    });
    expect(
      addSharedApplicationEslintRuleMock.addSharedApplicationEslintRule
    ).toHaveBeenCalled();
  });

  describe('initialiseFeAppWorkspace', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(initialiseFeAppWorkspaceMock, 'initialiseFeAppWorkspace');
    });
    it('should initialise angular workspace when language is angular and there is no existing angular app', async () => {
      await createAppGroupingFolderGenerator(tree, {
        baseFolder: 'libs',
        name: 'test',
        framework: FrontendFramework.Angular,
      });
      expect(
        initialiseFeAppWorkspaceMock.initialiseFeAppWorkspace
      ).toHaveBeenCalled();
    });
    it('should not initialise angular workspace when language is angular and there is an existing angular app', async () => {
      tree.write(`libs/${FrontendFramework.Angular}-app`, '');
      await createAppGroupingFolderGenerator(tree, {
        baseFolder: 'libs',
        name: 'test',
        framework: FrontendFramework.Angular,
      });
      expect(
        initialiseFeAppWorkspaceMock.initialiseFeAppWorkspace
      ).not.toHaveBeenCalled();
    });
  });
});
