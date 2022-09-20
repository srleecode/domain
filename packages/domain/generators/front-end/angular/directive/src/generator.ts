import { Tree, convertNxGenerator, formatFiles } from '@nrwl/devkit';
import { CreateDirectiveGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  getDasherizedFolderPath,
  getGroupingFolders,
} from '../../../../shared/utils';
import {
  camelize,
  classify,
  dasherize,
} from '@nrwl/workspace/src/utils/strings';
import { addDirectiveFiles } from './lib/add-directive-files/add-directive-files';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary, getLibraryName } from '../../../shared';
import { setIndexToDirectiveFile } from './lib/set-index-to-directive-file';

export async function createDirectiveGenerator(
  tree: Tree,
  options: CreateDirectiveGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, prefix } = options;
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    name,
    'directive',
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    false,
    options
  );
  const dasherisedGroupingFolder = `${getDasherizedFolderPath(
    tree,
    groupingFolder
  )}`;
  const libraryName = getLibraryName({
    name,
    type: 'directive',
    domainName: dasherisedGroupingFolder,
  });
  const dasherizedName = dasherize(name);
  const projectName = `${dasherisedGroupingFolder}-directive-${dasherizedName}`;
  tree.delete(
    `${groupingFolder}/${libraryName}/src/lib/${projectName}.module.ts`
  );
  const selector = prefix
    ? `${prefix}${classify(name)}`
    : camelize(projectName);
  addDirectiveFiles(
    tree,
    options,
    dasherisedGroupingFolder,
    libraryName,
    selector
  );
  setIndexToDirectiveFile(tree, groupingFolder, name);
  await formatFiles(tree);
}

export default createDirectiveGenerator;

export const createDirectiveSchematic = convertNxGenerator(
  createDirectiveGenerator
);
