import { Tree, convertNxGenerator, formatFiles } from '@nrwl/devkit';
import { CreateComponentGeneratorSchema } from './schema';
import { addComponentFiles } from './lib/add-component-files/add-component-files';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import createPresentationLayerGenerator from '../../presentation-layer/src/generator';

export async function createComponentGenerator(
  tree: Tree,
  options: CreateComponentGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  if (tree.children(`${groupingFolder}/presentation`).length === 0) {
    await createPresentationLayerGenerator(tree, options);
  }
  addComponentFiles(tree, options);
  await formatFiles(tree);
}

export default createComponentGenerator;

export const createComponentSchematic = convertNxGenerator(
  createComponentGenerator
);
