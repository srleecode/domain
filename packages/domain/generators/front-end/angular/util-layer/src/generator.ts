import { Tree, convertNxGenerator, formatFiles } from '@nx/devkit';
import { CreateUtilGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ApplicationType,
  getGroupingFolders,
  getProcessedGroupingFolder,
  validateGroupingFolder,
} from '../../../../shared/utils';

export async function createUtilGenerator(
  tree: Tree,
  options: CreateUtilGeneratorSchema,
): Promise<void> {
  let { groupingFolder } = options;
  groupingFolder = getProcessedGroupingFolder(groupingFolder);
  validateGroupingFolder(tree, groupingFolder);
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    '',
    'util',
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    true,
    options,
  );
  await formatFiles(tree);
}

export default createUtilGenerator;

export const createUtilSchematic = convertNxGenerator(createUtilGenerator);
