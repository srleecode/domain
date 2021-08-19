import { names, Tree, generateFiles } from '@nrwl/devkit';
import { classify } from '@nrwl/workspace/src/utils/strings';
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
  const target = `${normalize(groupingFolder)}/${libraryName}/src/lib`;
  const templateOptions = {
    ...options,
    ...names(options.name),
    selector,
    directiveName: classify(`${name}Directive`),
    moduleName: classify(`${dasherisedGroupingFolder}-${libraryName}Module`),
    tmpl: '',
  };
  generateFiles(tree, join(__dirname, './files'), target, templateOptions);
};
