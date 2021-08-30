import { Tree, convertNxGenerator, logger, formatFiles } from '@nrwl/devkit';
import { CreateComponentGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { setupComponentTestGenerator } from '../../../../cypress/component-test/angular/src/generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  ElementType,
  ApplicationType,
} from '../../../../shared/utils';
import { addComponentFiles } from './lib/add-component-files/add-component-files';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary, getLibraryName } from '../../../shared';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

export async function createComponentGenerator(
  tree: Tree,
  options: CreateComponentGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, type, prefix, mountType } = options;
  const dasherisedGroupingFolder = `${getDasherizedFolderPath(
    tree,
    groupingFolder
  )}`;
  const libraryName = getLibraryName({
    name,
    type,
    domainName: dasherisedGroupingFolder
  });
  const typedName = name ? `${type}-${dasherize(name)}` : type;
  const projectName = `${dasherisedGroupingFolder}-${typedName}`;
  const selector = prefix ? `${prefix}-${projectName}` : `${projectName}`;
  await addDomainLibrary(
    tree,
    name,
    type,
    groupingFolder,
    ApplicationType.Angular,
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
  await formatFiles(tree);
}

export default createComponentGenerator;

export const createComponentSchematic = convertNxGenerator(
  createComponentGenerator
);
