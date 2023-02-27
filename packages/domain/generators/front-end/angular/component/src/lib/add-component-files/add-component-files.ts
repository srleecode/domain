import { names, Tree, generateFiles } from '@nrwl/devkit';
import { dasherize, classify } from '@nrwl/workspace/src/utils/strings';
import { join, normalize } from 'path';
import { ChangeDetection } from '../../model/change-detection-type.enum';
import { ComponentType } from '../../model/component-type.enum';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  UnitTestType,
  getDasherizedFolderPath,
} from '../../../../../../shared/utils';
import { ViewEncapsulation } from '../../model/view-encapsulation.enum';
import { CreateComponentGeneratorSchema } from '../../schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getLibraryName } from '../../../../../shared';

export const addComponentFiles = (
  tree: Tree,
  options: CreateComponentGeneratorSchema
): void => {
  const { groupingFolder, name, type, prefix } = options;
  const dasherisedGroupingFolder = `${getDasherizedFolderPath(
    tree,
    groupingFolder
  )}`;
  const dasherizedName = dasherize(name);
  const projectName = dasherize(`${dasherisedGroupingFolder}-${type}-${name}`);
  const selector = prefix ? `${prefix}-${dasherizedName}` : projectName;
  const libraryName = getLibraryName({
    name,
    type,
  });

  const target = normalize(
    `${groupingFolder}/presentation/src/lib/${type}/${dasherizedName}`
  );
  const templateOptions = {
    ...options,
    ...names(name),
    fileName: dasherize(name),
    selector,
    componentName: classify(`${type}-${name}Component`),
    moduleName: classify(`${dasherisedGroupingFolder}-${libraryName}Module`),
    isUsingNonDefaultViewEncapsulation:
      options.viewEncapsulation !== ViewEncapsulation.Emulated,
    isTestUsingTestBed: options.unitTestType === UnitTestType.TestBed,
    storybookTitle: getStorybookTitle(`${groupingFolder}/${libraryName}`),
    changeDetection:
      options.type === ComponentType.Ui
        ? ChangeDetection.OnPush
        : ChangeDetection.Default,
    tmpl: '',
  };
  generateFiles(tree, join(__dirname, './files'), target, templateOptions);
  if (options.unitTestType === UnitTestType.NoTests) {
    tree.delete(join(target, `${dasherize(name)}.component.spec.ts`));
  }
};

const getStorybookTitle = (libraryPath: string): string =>
  libraryPath
    .replace('libs/', '')
    .split('/')
    .map((folder) => classify(folder))
    .join('/');
