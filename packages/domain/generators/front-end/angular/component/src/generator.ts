import { Tree, convertNxGenerator, formatFiles } from '@nrwl/devkit';
import { CreateComponentGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  ApplicationType,
  getGroupingFolders,
} from '../../../../shared/utils';
import { addComponentFiles } from './lib/add-component-files/add-component-files';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary, getLibraryName } from '../../../shared';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { setIndexToComponentFile } from './lib/set-index-to-component-file';

export async function createComponentGenerator(
  tree: Tree,
  options: CreateComponentGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, type, prefix } = options;
  const dasherisedGroupingFolder = `${getDasherizedFolderPath(
    tree,
    groupingFolder
  )}`;
  const libraryName = getLibraryName({
    name,
    type,
    domainName: dasherisedGroupingFolder,
  });
  const dasherizedName = dasherize(name);
  const typedName = name ? `${type}-${dasherizedName}` : type;
  const projectName = `${dasherisedGroupingFolder}-${typedName}`;
  const selector = prefix ? `${prefix}-${dasherizedName}` : projectName;
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    name,
    type,
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    false,
    options
  );
  tree.delete(
    `${groupingFolder}/${libraryName}/src/lib/${projectName}.module.ts`
  );
  addComponentFiles(
    tree,
    options,
    dasherisedGroupingFolder,
    libraryName,
    selector
  );
  setIndexToComponentFile(tree, groupingFolder, libraryName, name, type);
  await formatFiles(tree);
}

export default createComponentGenerator;

export const createComponentSchematic = convertNxGenerator(
  createComponentGenerator
);
