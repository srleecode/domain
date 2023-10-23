import { names, Tree, generateFiles } from '@nx/devkit';

import { join, normalize } from 'path';
import { CreateDirectiveGeneratorSchema } from '../../schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getLibraryName } from '../../../../../shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  spacify,
} from '../../../../../../shared/utils';
import {
  dasherize,
  classify,
  camelize,
} from '@angular-devkit/core/src/utils/strings';

export const addDirectiveFiles = (
  tree: Tree,
  options: CreateDirectiveGeneratorSchema
): void => {
  const { groupingFolder, name, prefix } = options;
  const dasherisedGroupingFolder = `${getDasherizedFolderPath(
    tree,
    groupingFolder
  )}`;
  const libraryName = getLibraryName({
    name,
    type: 'directive',
  });
  const libraryPath = `${groupingFolder}/${libraryName}`;
  const target = normalize(
    `${groupingFolder}/presentation/src/lib/directive/${dasherize(name)}`
  );
  const projectName = dasherize(
    `${dasherisedGroupingFolder}-directive-${name}`
  );
  const selector = prefix
    ? `${prefix}${classify(name)}`
    : camelize(projectName);
  const templateOptions = {
    ...options,
    ...names(options.name),
    selector,
    storybookTitle: getStorybookTitle(libraryPath),
    directiveName: classify(`${name}Directive`),
    testComponentName: dasherize(`${name}DirectiveTest`),
    moduleName: classify(`${dasherisedGroupingFolder}-${libraryName}Module`),
    tmpl: '',
  };
  generateFiles(tree, join(__dirname, './files'), target, templateOptions);
  if (options.addStory === false) {
    tree.delete(join(target, `${dasherize(name)}.stories.ts`));
  }
};

const getStorybookTitle = (libraryPath: string): string =>
  libraryPath
    .replace('libs/', '')
    .split('/')
    .map((folder) => spacify(folder))
    .join('/');
