import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { CreateComponentGeneratorSchema } from './schema';
import { setupCtGenerator } from '@jscutlery/cypress-angular/src/generators/setup-ct/setup-ct';
import { getDasherizedFolderPath } from '@srleecode/domain/shared/utils';
import { addComponentTestingTarget } from './lib/add-component-testing-target';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';

export async function createComponentGenerator(
  tree: Tree,
  options: CreateComponentGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, type, prefix } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    name,
    type,
    groupingFolder,
    options
  );

  await libraryGenerator(tree, {
    prefix: prefix,
    ...libraryCommonOptions,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  const domain = `${getDasherizedFolderPath(tree, groupingFolder)}`;
  const libraryName = libraryCommonOptions.name;
  const projectName = `${domain}-${libraryName}`;
  await setupCtGenerator(tree, {
    project: projectName,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  addComponentTestingTarget(tree, projectName, groupingFolder, libraryName);
}

export default createComponentGenerator;

export const removeSchematic = convertNxGenerator(createComponentGenerator);
