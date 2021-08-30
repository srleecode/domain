import { ComponentType } from './model/component-type.enum';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MountType, UnitTestType } from '../../../../shared/utils';
import { ViewEncapsulation } from './model/view-encapsulation.enum';
import { CreateComponentGeneratorSchema } from './schema';
import { StyleType } from './model/style-type.enum';

export const defaultOptions: CreateComponentGeneratorSchema = {
  groupingFolder: 'libs/test-app/test-domain',
  type: ComponentType.Feature,
  mountType: MountType.Component,
  prefix: 'srlee',
  name: 'TestExample',
  displayBlock: false,
  viewEncapsulation: ViewEncapsulation.Emulated,
  style: StyleType.Scss,
  unitTestType: UnitTestType.NoTestBed,
  buildable: true,
  strict: false,
  enableIvy: true,
  publishable: false,
};

export const LIB_PATH = `${defaultOptions.groupingFolder}/feature-test-example/src/lib`;
