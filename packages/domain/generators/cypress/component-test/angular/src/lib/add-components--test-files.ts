import {
  names,
  Tree,
  generateFiles,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { dasherize, classify } from '@nrwl/workspace/src/utils/strings';
import { join } from 'path';
import { getDomainPath, MountType } from '@srleecode/domain/shared/utils';
import { SetupComponentTestGeneratorSchema } from '../schema';

export const addComponentsTestFiles = (
  tree: Tree,
  options: SetupComponentTestGeneratorSchema
): void => {
  const { projectName, componentName, mountType, selector } = options;
  const projectConfig = readProjectConfiguration(tree, projectName);
  const libraryPath = getDomainPath(tree, projectConfig.root);
  const templateOptions = {
    ...names(componentName),
    selector,
    componentName: classify(`${componentName}Component`),
    moduleName: classify(`${projectName}Module`),
    harnessName: classify(`${projectName}Harness`),
    storybookTitle: getStorybookTitle(libraryPath),
    isUsingComponentMountType: mountType === MountType.Component,
    tmpl: '',
  };
  const target = `${projectConfig.sourceRoot}/lib`;
  generateFiles(tree, join(__dirname, './files'), target, templateOptions);
  if (mountType === MountType.Component) {
    tree.delete(join(target, `${dasherize(componentName)}.stories.ts`));
  }
};

const getStorybookTitle = (libraryPath: string): string =>
  libraryPath
    .split('/')
    .map((folder) => classify(folder))
    .join('/');
