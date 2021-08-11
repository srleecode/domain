import { names, Tree, generateFiles, getWorkspaceLayout } from '@nrwl/devkit';
import { dasherize, classify } from '@nrwl/workspace/src/utils/strings';
import { join, normalize } from 'path';
import { ChangeDetection } from '../../model/change-detection-type.enum';
import { ComponentType } from '../../model/component-type.enum';
import { UnitTestType } from '../../model/unit-test-type.enum';
import { ViewEncapsulation } from '../../model/view-encapsulation.enum';
import { CreateComponentGeneratorSchema } from '../../schema';
import { getDasherizedGroupingFolder } from '@srleecode/domain/shared/utils';
import { MountType } from '../../model/mount-type.enum';

export const addComponentFiles = (
  tree: Tree,
  options: CreateComponentGeneratorSchema
): void => {
  const { groupingFolder, name, type, prefix, mountType } = options;
  const target = normalize(groupingFolder);
  const libraryName = name ? `${type}-${dasherize(name)}` : type;
  const dasherisedGroupingFolder = getDasherizedGroupingFolder(
    tree,
    options.groupingFolder
  );
  const selector = prefix
    ? `${prefix}-${dasherisedGroupingFolder}-${libraryName}`
    : `${dasherisedGroupingFolder}-${libraryName}`;
  const templateOptions = {
    ...options,
    ...names(options.name),
    selector,
    groupingFolderClass: classify(dasherisedGroupingFolder),
    componentName: classify(`${name}Component`),
    moduleName: classify(`${dasherisedGroupingFolder}-${libraryName}Module`),
    harnessName: classify(`${dasherisedGroupingFolder}-${libraryName}Harness`),
    storybookTitle: getStorybookTitle(tree, groupingFolder, libraryName),
    isUsingNonDefaultViewEncapsulation:
      options.viewEncapsulation !== ViewEncapsulation.Emulated,
    isTestUsingTestBed: options.unitTestType === UnitTestType.TestBed,
    isUsingComponentMountType: mountType === MountType.Component,
    changeDetection:
      options.type === ComponentType.Ui
        ? ChangeDetection.OnPush
        : ChangeDetection.Default,
    tmpl: '',
  };
  generateFiles(tree, join(__dirname, './files'), target, templateOptions);
  if (options.unitTestType === UnitTestType.NoTests) {
    tree.delete(join(target, `${dasherize(name)}.spec.ts`));
  }
  if (options.mountType === MountType.Component) {
    tree.delete(join(target, `${dasherize(name)}.stories.ts`));
  }
};

const getStorybookTitle = (
  tree: Tree,
  groupingFolder: string,
  libraryName: string
): string => {
  const { libsDir } = getWorkspaceLayout(tree);
  const domainPath = groupingFolder.replace(`${libsDir}/`, '');
  return `${domainPath}/${libraryName}`
    .split('/')
    .map((folder) => classify(folder))
    .join('/');
};
