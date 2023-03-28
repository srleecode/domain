import {
  names,
  Tree,
  generateFiles,
  StringChange,
  ChangeType,
  applyChangesToString,
} from '@nrwl/devkit';
import { dasherize, classify } from '@nrwl/workspace/src/utils/strings';
import { join, normalize } from 'path';
import { ChangeDetection } from '../../model/change-detection-type.enum';
import { ComponentType } from '../../model/component-type.enum';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  UnitTestType,
  getDasherizedFolderPath,
  getTsSourceFile,
  spacify,
} from '../../../../../../shared/utils';
import { ViewEncapsulation } from '../../model/view-encapsulation.enum';
import { CreateComponentGeneratorSchema } from '../../schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getLibraryName } from '../../../../../shared';
import { SyntaxKind } from 'typescript';
import { findNodes } from '@nrwl/workspace';

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
    type === ComponentType.Shell
      ? `${groupingFolder}/presentation/src/lib`
      : `${groupingFolder}/presentation/src/lib/${type}/${dasherizedName}`
  );
  const templateOptions = {
    ...options,
    ...names(name),
    fileName: dasherize(name),
    selector,
    componentName: classify(`${name}Component`),
    moduleName: classify(`${dasherisedGroupingFolder}-${libraryName}Module`),
    isUsingNonDefaultViewEncapsulation:
      options.viewEncapsulation !== ViewEncapsulation.Emulated,
    isTestUsingTestBed: options.unitTestType === UnitTestType.TestBed,
    storybookTitle: getStorybookTitle(groupingFolder, libraryName),
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
  if (options.addStory === false) {
    tree.delete(join(target, `${dasherize(name)}.stories.ts`));
  }
  addComponentToIndex(
    tree,
    `${groupingFolder}/presentation`,
    type,
    dasherizedName
  );
};

const getStorybookTitle = (groupingFolder: string, libraryName): string =>
  `${groupingFolder}/${libraryName}`
    .replace('libs/', '')
    .split('/')
    .map((folder) => spacify(folder))
    .join('/');

const addComponentToIndex = (
  tree: Tree,
  libraryPath: string,
  type: ComponentType,
  dasherizedName: string
): void => {
  const indexPath = `${libraryPath}/src/index.ts`;
  const source = getTsSourceFile(tree, indexPath);
  const allExports = findNodes(source, SyntaxKind.ExportDeclaration);
  const exportIndex =
    allExports.length > 0 ? allExports[allExports.length - 1].end + 1 : 0;
  const componentPath =
    type === ComponentType.Shell
      ? `./lib/${dasherizedName}.component`
      : `./lib/${type}/${dasherizedName}/${dasherizedName}.component`;
  const changes: StringChange[] = [
    {
      type: ChangeType.Insert,
      index: exportIndex,
      text: `export * from '${componentPath}';\n`,
    },
  ];
  const newFile = applyChangesToString(
    tree.read(indexPath).toString(),
    changes
  );
  tree.write(indexPath, newFile);
};
