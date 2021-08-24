import {
  GeneratorCallback,
  readJson,
  readWorkspaceConfiguration,
  Tree,
} from '@nrwl/devkit';
import { addGlobalComponentTestingOptions } from './add-global-component-testing-options/add-global-component-testing-options';
import { cypressInitGenerator } from '@nrwl/cypress';
import { ngAddGenerator } from '@jscutlery/cypress-angular/src/generators/ng-add/ng-add';

export const initialiseAngularWorkspace = async (tree: Tree): Promise<void> => {
  if (!isNrwlAngularAdded(tree)) {
    // TODO: call angular init generator here
  }
  if (!isNrwlCypressAdded(tree)) {
    await cypressInitGenerator(tree);
  }
  if (!tree.exists(`.component-testing/global-mount-options.constant.ts`)) {
    addGlobalComponentTestingOptions(tree);
  }
  await ngAddGenerator(tree);
};

const isNrwlAngularAdded = (tree: Tree): boolean => {
  const workspace = readWorkspaceConfiguration(tree);
  return !workspace?.generators?.['@nrwl/angular:component'];
};

const isNrwlCypressAdded = (tree: Tree): boolean => {
  const packageJson = readJson(tree, 'package.json');
  return !packageJson?.devDependencices?.['@nrwl/cypress'];
};
