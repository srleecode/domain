import { Tree, convertNxGenerator, logger, formatFiles } from '@nrwl/devkit';
import { CreateDirectiveGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  ElementType,
  getDasherizedFolderPath,
  getGroupingFolders,
} from '../../../../shared/utils';
import { camelize, dasherize } from '@nrwl/workspace/src/utils/strings';
import { addDirectiveFiles } from './lib/add-directive-files/add-directive-files';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { setupComponentTestGenerator } from '../../../../cypress/component-test/angular/src/generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary, getLibraryName } from '../../../shared';
import { setIndexToDirectiveFile } from './lib/set-index-to-directive-file';

export async function createDirectiveGenerator(
  tree: Tree,
  options: CreateDirectiveGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, mountType } = options;
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    name,
    'directive',
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
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
  const projectName = `${dasherisedGroupingFolder}-directive-${dasherize(
    name
  )}`;
  tree.delete(
    `${groupingFolder}/${libraryName}/src/lib/${projectName}.module.ts`
  );
  const selector = camelize(projectName);
  addDirectiveFiles(
    tree,
    options,
    dasherisedGroupingFolder,
    libraryName,
    selector
  );
  await setupComponentTestGenerator(tree, {
    projectName,
    name,
    mountType,
    prefix: groupingFolders.app,
    selector,
    type: ElementType.Directive,
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  setIndexToDirectiveFile(tree, groupingFolder, name);
  await formatFiles(tree);
}

export default createDirectiveGenerator;

export const createDirectiveSchematic = convertNxGenerator(
  createDirectiveGenerator
);
