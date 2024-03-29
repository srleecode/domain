import { Tree, convertNxGenerator, formatFiles } from '@nx/devkit';
import { CreateComponentGeneratorSchema } from './schema';
import { addComponentFiles } from './lib/add-component-files/add-component-files';
// eslint-disable-next-line @nx/enforce-module-boundaries
import createPresentationLayerGenerator from '../../presentation-layer/src/generator';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getProcessedGroupingFolder,
  validateGroupingFolder,
} from '../../../../shared/utils';

export async function createComponentGenerator(
  tree: Tree,
  options: CreateComponentGeneratorSchema,
): Promise<void> {
  let { groupingFolder } = options;
  groupingFolder = getProcessedGroupingFolder(groupingFolder);
  validateGroupingFolder(tree, groupingFolder);
  if (tree.children(`${groupingFolder}/presentation`).length === 0) {
    await createPresentationLayerGenerator(tree, options);
  }
  addComponentFiles(tree, options, groupingFolder);
  await formatFiles(tree);
}

export default createComponentGenerator;

export const createComponentSchematic = convertNxGenerator(
  createComponentGenerator,
);
