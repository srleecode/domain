import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { reactAddGenerator } from './generator';

describe('reactAddGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add dependencies into `package.json` file', async () => {
    await reactAddGenerator(tree);
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@nrwl/cypress']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/react']).toBeDefined();
  });
});
