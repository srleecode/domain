import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreatePresentationLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  getDasherizedFolderPath,
  getGroupingFolders,
} from '../../../../shared/utils';
import { addPresentationLayerEslintConstraint } from './lib/add-presentation-eslint-constraint';

export async function createPresentationLayerGenerator(
  tree: Tree,
  options: CreatePresentationLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
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
  const dasherisedGroupingFolder = getDasherizedFolderPath(
    tree,
    groupingFolder
  );
  tree.delete(
    `${groupingFolder}/${libraryName}/src/lib/${dasherisedGroupingFolder}-${libraryName}.module.ts`
  );
  addPresentationLayerEslintConstraint(tree);
}

export default createPresentationLayerGenerator;

export const createPresentationLayerSchematic = convertNxGenerator(
  createPresentationLayerGenerator
);
