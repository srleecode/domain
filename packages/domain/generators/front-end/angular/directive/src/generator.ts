import { Tree, convertNxGenerator, formatFiles } from '@nrwl/devkit';
import { CreateDirectiveGeneratorSchema } from './schema';
import { addDirectiveFiles } from './lib/add-directive-files/add-directive-files';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import createPresentationLayerGenerator from '../../presentation-layer/src/generator';

export async function createDirectiveGenerator(
  tree: Tree,
  options: CreateDirectiveGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  if (tree.children(`${groupingFolder}/presentation`).length === 0) {
    await createPresentationLayerGenerator(tree, options);
  }
  addDirectiveFiles(tree, options);
  await formatFiles(tree);
}

export default createDirectiveGenerator;

export const createDirectiveSchematic = convertNxGenerator(
  createDirectiveGenerator
);
