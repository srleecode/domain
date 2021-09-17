import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { ngAddGenerator } from './generator';

describe('ngAddGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add dependencies into `package.json` file', async () => {
    await ngAddGenerator(tree);
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@nrwl/cypress']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/angular']).toBeDefined();
    expect(packageJson.devDependencies['@jscutlery/cypress-angular']).toBeDefined();
    expect(packageJson.devDependencies['@jscutlery/cypress-harness']).toBeDefined();
    expect(packageJson.devDependencies['@angular/cdk']).toBeDefined();
    expect(packageJson.devDependencies['cypress-pipe']).toBeDefined();
  });
});
