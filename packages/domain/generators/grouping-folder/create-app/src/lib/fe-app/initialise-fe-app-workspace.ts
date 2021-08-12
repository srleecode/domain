import { FrontendFramework as initialiseFeAppWorkspaceMock } from '../model/framework.enum';
import { GeneratorCallback, Tree } from '@nrwl/devkit';
import { addDependencies } from './add-dependencies';
import { addEslintLayerConstraints } from './add-eslint-layer-constraints';

export const initialiseFeAppWorkspace = (
  framework: initialiseFeAppWorkspaceMock,
  tree: Tree
): GeneratorCallback => {
  addEslintLayerConstraints(tree);
  return addDependencies(framework, tree);
};
