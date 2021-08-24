import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateDomainLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary, removeTestTarget } from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  getDasherizedFolderPath,
} from '../../../../shared/utils';

export async function createDomainLayerGenerator(
  tree: Tree,
  options: CreateDomainLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const libraryName = 'domain-layer';
  await addDomainLibrary(
    tree,
    '',
    libraryName,
    groupingFolder,
    ApplicationType.Angular,
    options
  );
  const domain = getDasherizedFolderPath(tree, groupingFolder);
  removeTestTarget(tree, `${domain}-${libraryName}`);
}

export default createDomainLayerGenerator;

export const createDomainLayerSchematic = convertNxGenerator(
  createDomainLayerGenerator
);
