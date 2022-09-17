import { names, Tree, generateFiles } from '@nrwl/devkit';
import { classify, dasherize } from '@nrwl/workspace/src/utils/strings';
import { join, normalize } from 'path';
import { CreateDirectiveGeneratorSchema } from '../../schema';

export const addDirectiveFiles = (
  tree: Tree,
  options: CreateDirectiveGeneratorSchema,
  dasherisedGroupingFolder: string,
  libraryName: string,
  selector: string
): void => {
  const { groupingFolder, name } = options;
  const libraryPath = `${groupingFolder}/${libraryName}`;
  const target = normalize(`${libraryPath}/src/lib`);
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
};

const getStorybookTitle = (libraryPath: string): string =>
  libraryPath
    .replace('libs/', '')
    .split('/')
    .map((folder) => classify(folder))
    .join('/');
