import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateUtilGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';

export async function createUtilGenerator(
  tree: Tree,
  options: CreateUtilGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    '',
    'util',
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    options
  );
}

export default createUtilGenerator;

export const createUtilSchematic = convertNxGenerator(createUtilGenerator);
