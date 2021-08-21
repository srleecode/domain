import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateDomainLayerGeneratorSchema } from './schema';
import {
  addDomainLibrary,
  removeTestTarget,
} from '@srleecode/domain/front-end/shared';
import {
  ApplicationType,
  getDasherizedFolderPath,
} from '@srleecode/domain/shared/utils';

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
