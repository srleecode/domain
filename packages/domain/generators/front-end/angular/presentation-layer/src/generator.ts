import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreatePresentationLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  getGroupingFolders,
  validateGroupingFolder,
} from '../../../../shared/utils';
import { addPresentationLayerEslintConstraint } from './lib/add-presentation-eslint-constraint';
import { convertModuleToShell } from './lib/convert-module-to-shell';

export async function createPresentationLayerGenerator(
  tree: Tree,
  options: CreatePresentationLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  validateGroupingFolder(tree, groupingFolder);
  const libraryName = 'presentation';
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    '',
    libraryName,
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    false,
    options
  );
  convertModuleToShell(tree, groupingFolder, libraryName);
  addPresentationLayerEslintConstraint(tree);
}

export default createPresentationLayerGenerator;

export const createPresentationLayerSchematic = convertNxGenerator(
  createPresentationLayerGenerator
);
