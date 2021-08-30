import { Tree, convertNxGenerator, logger, formatFiles } from '@nrwl/devkit';
import { CreateDirectiveGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  ElementType,
  getDasherizedFolderPath,
} from '../../../../shared/utils';
import {
  camelize,
  classify,
  dasherize,
} from '@nrwl/workspace/src/utils/strings';
import { addDirectiveFiles } from './lib/add-directive-files/add-directive-files';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { setupComponentTestGenerator } from '../../../../cypress/component-test/angular/src/generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary, getLibraryName } from '../../../shared';

export async function createDirectiveGenerator(
  tree: Tree,
  options: CreateDirectiveGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, prefix, mountType } = options;
  await addDomainLibrary(
    tree,
    name,
    'directive',
    groupingFolder,
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
    domainName: dasherisedGroupingFolder
  });
  const projectName = `${dasherisedGroupingFolder}-directive-${dasherize(name)}`;
  tree.delete(
    `${groupingFolder}/${libraryName}/src/lib/${projectName}.module.ts`
  );
  const selector = prefix
    ? `${prefix}${classify(projectName)}`
    : `${camelize(projectName)}`;
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
    selector,
    type: ElementType.Directive,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  await formatFiles(tree);
}

export default createDirectiveGenerator;

export const createDirectiveSchematic = convertNxGenerator(
  createDirectiveGenerator
);
