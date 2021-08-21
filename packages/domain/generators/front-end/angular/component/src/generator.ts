import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateComponentGeneratorSchema } from './schema';
import { setupComponentTestGenerator } from '@srleecode/domain/cypress/component-test/angular';
import {
  getDasherizedFolderPath,
  ElementType,
  ApplicationType,
} from '@srleecode/domain/shared/utils';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { addComponentFiles } from './lib/add-component-files/add-component-files';
import { addDomainLibrary } from '@srleecode/domain/front-end/shared';

export async function createComponentGenerator(
  tree: Tree,
  options: CreateComponentGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, type, prefix, mountType } = options;
  const dasherisedGroupingFolder = `${getDasherizedFolderPath(
    tree,
    groupingFolder
  )}`;
  const libraryName = name ? `${type}-${dasherize(name)}` : type;
  const projectName = `${dasherisedGroupingFolder}-${libraryName}`;
  const selector = prefix ? `${prefix}-${projectName}` : `${projectName}`;
  await addDomainLibrary(
    tree,
    name,
    type,
    groupingFolder,
    ApplicationType.Angular,
    options
  );
  addComponentFiles(
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
    selector,
    type: ElementType.Component,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
}

export default createComponentGenerator;

export const createComponentSchematic = convertNxGenerator(
  createComponentGenerator
);
