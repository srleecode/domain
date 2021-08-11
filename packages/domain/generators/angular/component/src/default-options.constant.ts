import { ComponentType } from './model/component-type.enum';
import { MountType } from './model/mount-type.enum';
import { StyleType } from './model/style-type.enum';
import { UnitTestType } from './model/unit-test-type.enum';
import { ViewEncapsulation } from './model/view-encapsulation.enum';
import { CreateComponentGeneratorSchema } from './schema';

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
