import { names, Tree, generateFiles } from '@nrwl/devkit';
import { dasherize, classify } from '@nrwl/workspace/src/utils/strings';
import { join, normalize } from 'path';
import { ChangeDetection } from '../../model/change-detection-type.enum';
import { ComponentType } from '../../model/component-type.enum';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UnitTestType } from '../../../../../../shared/utils';
import { ViewEncapsulation } from '../../model/view-encapsulation.enum';
import { CreateComponentGeneratorSchema } from '../../schema';

export const addComponentFiles = (
  tree: Tree,
  options: CreateComponentGeneratorSchema,
  dasherisedGroupingFolder: string,
  libraryName: string,
  selector: string
): void => {
  const { groupingFolder, name, type } = options;
  const target = normalize(`${groupingFolder}/${libraryName}/src/lib`);
  const templateOptions = {
    ...options,
    ...names(libraryName),
    fileName: dasherize(name) || type,
    selector,
    componentName: classify(`${libraryName}Component`),
    moduleName: classify(`${dasherisedGroupingFolder}-${libraryName}Module`),
    isUsingNonDefaultViewEncapsulation:
      options.viewEncapsulation !== ViewEncapsulation.Emulated,
    isTestUsingTestBed: options.unitTestType === UnitTestType.TestBed,
    changeDetection:
      options.type === ComponentType.Ui
        ? ChangeDetection.OnPush
        : ChangeDetection.Default,
    tmpl: '',
  };
  generateFiles(tree, join(__dirname, './files'), target, templateOptions);
  if (options.unitTestType === UnitTestType.NoTests) {
    tree.delete(join(target, `${dasherize(name) || type}.component.spec.ts`));
  }
};
