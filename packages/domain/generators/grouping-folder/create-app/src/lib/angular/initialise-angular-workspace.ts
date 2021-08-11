import {
  GeneratorCallback,
  readJson,
  readWorkspaceConfiguration,
  Tree,
} from '@nrwl/devkit';
import { addDependencies } from './add-dependencies';
import { addEslintLayerConstraints } from './add-eslint-layer-constraints';
import { addGlobalComponentTestingOptions } from './add-global-component-testing-options/add-global-component-testing-options';

export const initialiseAngularWorkspace = (tree: Tree): GeneratorCallback => {
  checkNrwlAngularIsAdded(tree);
  checkNrwlCypressIsAdded(tree);
  addEslintLayerConstraints(tree);
  if (!tree.exists(`.component-testing/global-mount-options.constant.ts`)) {
    addGlobalComponentTestingOptions(tree);
  }
  return addDependencies(tree);
};

const checkNrwlAngularIsAdded = (tree: Tree): void => {
  const workspace = readWorkspaceConfiguration(tree);
  if (!workspace?.generators?.['@nrwl/angular:component']) {
    throw new Error(
      'Before creating an Angular application grouping folder. Please make sure you have run npx ng add @nrwl/angular @nrwl/cypress'
    );
  }
};

const checkNrwlCypressIsAdded = (tree: Tree): void => {
  const packageJson = readJson(tree, 'package.json');
  if (!packageJson?.devDependencices?.['@nrwl/cypress']) {
    throw new Error(
      'Before creating an Angular application grouping folder. Please make sure you have run npx ng add @nrwl/angular @nrwl/cypress'
    );
  }
};
