import {
  names,
  Tree,
  generateFiles,
  readProjectConfiguration,
} from '@nrwl/devkit';
import {
  dasherize,
  classify,
  camelize,
} from '@nrwl/workspace/src/utils/strings';
import { join } from 'path';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ElementType,
  getDomainPath,
  MountType,
} from '../../../../../shared/utils';
import { SetupComponentTestGeneratorSchema } from '../schema';

export const addTestFiles = (
  tree: Tree,
  options: SetupComponentTestGeneratorSchema
): void => {
  const { projectName, name, type, mountType, selector } = options;
  const projectConfig = readProjectConfiguration(tree, projectName);
  const libraryPath = getDomainPath(tree, projectConfig.root);
  const directiveTag = camelize(selector.replace('[', '').replace(']', ''));
  const directiveOptions = {
    directiveTag,
    prefix: directiveTag.replace(classify(projectName), ''),
    directiveName: classify(`${name}-${type}`),
    className: 'TestComponent',
  };
  let templateOptions = {
    ...names(name || ''),
    selector,
    type,
    className: classify(`${name}-${type}`),
    moduleName: classify(`${projectName}Module`),
    harnessName: classify(`${projectName}Harness`),
    storybookTitle: getStorybookTitle(libraryPath),
    isUsingComponentMountType: mountType === MountType.Component,
    isDirective: type === ElementType.Directive,
    tmpl: '',
    directiveName: '',
    directiveTag: '',
    prefix: '',
  };
  if (type === ElementType.Directive) {
    templateOptions = {
      ...templateOptions,
      ...directiveOptions,
    };
  }
  const target = `${projectConfig.sourceRoot}/lib`;
  generateFiles(tree, join(__dirname, './files'), target, templateOptions);
  if (mountType === MountType.Component) {
    tree.delete(join(target, `${dasherize(name)}.stories.ts`));
  }
  if (type === ElementType.Component) {
    tree.delete(join(target, `test.component.ts`));
  }
};

const getStorybookTitle = (libraryPath: string): string =>
  libraryPath
    .split('/')
    .map((folder) => classify(folder))
    .join('/');
