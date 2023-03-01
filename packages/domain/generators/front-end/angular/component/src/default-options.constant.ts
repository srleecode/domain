import { ComponentType } from './model/component-type.enum';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UnitTestType } from '../../../../shared/utils';
import { ViewEncapsulation } from './model/view-encapsulation.enum';
import { CreateComponentGeneratorSchema } from './schema';
import { StyleType } from './model/style-type.enum';

export const defaultOptions: CreateComponentGeneratorSchema = {
  groupingFolder: 'libs/test-app/test-domain',
  type: ComponentType.Feature,
  name: 'TestExample',
  viewEncapsulation: ViewEncapsulation.Emulated,
  style: StyleType.Scss,
  unitTestType: UnitTestType.NoTestBed,
  addStory: true,
  buildable: true,
  strict: false,
  enableIvy: true,
  publishable: false,
};

export const LIB_PATH = `${defaultOptions.groupingFolder}/presentation/src/lib/feature`;
