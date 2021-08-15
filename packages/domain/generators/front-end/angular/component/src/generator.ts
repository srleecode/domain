import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { CreateComponentGeneratorSchema } from './schema';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';
import { setupComponentTestGenerator } from '@srleecode/domain/cypress/component-test/angular';
import { getDasherizedFolderPath } from '@srleecode/domain/shared/utils';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { addComponentFiles } from './lib/add-component-files/add-component-files';

export async function createComponentGenerator(
  tree: Tree,
  options: CreateComponentGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, type, prefix, mountType } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    name,
    type,
    groupingFolder,
    options
  );
  const dasherisedGroupingFolder = `${getDasherizedFolderPath(
    tree,
    groupingFolder
  )}`;
  const libraryName = name ? `${type}-${dasherize(name)}` : type;
  const projectName = `${dasherisedGroupingFolder}-${libraryName}`;
  const selector = prefix ? `${prefix}-${projectName}` : `${projectName}`;

  await libraryGenerator(tree, {
    prefix: prefix,
    ...libraryCommonOptions,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  addComponentFiles(
    tree,
    options,
    dasherisedGroupingFolder,
    libraryName,
    selector
  );
  await setupComponentTestGenerator(tree, {
    projectName,
    componentName: name,
    mountType,
    selector,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
}

export default createComponentGenerator;

export const removeSchematic = convertNxGenerator(createComponentGenerator);
