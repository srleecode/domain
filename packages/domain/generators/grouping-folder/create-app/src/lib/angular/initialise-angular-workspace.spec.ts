import {
  readJson,
  Tree,
  updateWorkspaceConfiguration,
  writeJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initialiseAngularWorkspace } from './initialise-angular-workspace';

describe('initialiseAngularWorkspace', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  const addNrwlAngular = () => {
    updateWorkspaceConfiguration(tree, {
      generators: {
        ['@nrwl/angular:component']: {},
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  };

  const addNrwlCypress = () => {
    const packageJson = readJson(tree, 'package.json');
    packageJson.devDependencices = {
      ...packageJson.devDependencices,
      '@nrwl/cypress': 'latest',
    };
    writeJson(tree, 'package.json', packageJson);
  };

  it('should throw error if @nrwl/angular has not been added', () => {
    addNrwlCypress();
    expect(() => initialiseAngularWorkspace(tree)).toThrow();
  });

  it('should throw error if @nrwl/cypress has not been added', () => {
    addNrwlAngular();
    expect(() => initialiseAngularWorkspace(tree)).toThrow();
  });

  it('should add relevant dependencies into `package.json` file', () => {
    addNrwlAngular();
    addNrwlCypress();
    initialiseAngularWorkspace(tree);
    const packageJson = readJson(tree, 'package.json');
    expect(
      packageJson.devDependencies['@jscutlery/cypress-angular']
    ).toBeDefined();
    expect(
      packageJson.devDependencies['@jscutlery/cypress-harness']
    ).toBeDefined();
    expect(packageJson.devDependencies['@angular/cdk']).toBeDefined();
    expect(packageJson.devDependencies['cypress-pipe']).toBeDefined();
  });

  it('should add component testing file', () => {
    addNrwlAngular();
    addNrwlCypress();
    initialiseAngularWorkspace(tree);
    expect(
      tree.exists(`.component-testing/global-mount-options.constant.ts`)
    ).toBe(true);
  });

  it('should add component testing ts config path', () => {
    addNrwlAngular();
    addNrwlCypress();
    initialiseAngularWorkspace(tree);
    const tsConfig = readJson(tree, 'tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths[`@cypress/component-testing`]
    ).toEqual([`.component-testing/global-mount-options.constant.ts`]);
  });
});
