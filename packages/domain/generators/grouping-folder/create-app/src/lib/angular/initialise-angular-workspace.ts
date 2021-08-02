import { GeneratorCallback, Tree } from '@nrwl/devkit';
import { addDependencies } from './add-dependencies';
import { addEslintLayerConstraints } from './add-eslint-layer-constraints';

export const initialiseAngularWorkspace = (tree: Tree): GeneratorCallback => {
  addEslintLayerConstraints(tree);
  return addDependencies(tree);
};
