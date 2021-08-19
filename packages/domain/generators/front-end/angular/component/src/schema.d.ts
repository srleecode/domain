import { ComponentType } from './model/component-type.enum';
import { ViewEncapsulation } from './model/view-encapsulation.enum';
import { UnitTestType } from './model/unit-test-type.enum';
import { StyleType } from './model/style-type.enum';
import { MountType } from '@srleecode/domain/shared/utils';
import { CreateLibrarySchema } from '@srleecode/domain/angular/shared';

export interface CreateComponentGeneratorSchema extends CreateLibrarySchema {
  groupingFolder: string;
  name?: string;
  mountType?: MountType;
  type?: ComponentType;
  prefix?: string;
  displayBlock?: boolean;
  viewEncapsulation?: ViewEncapsulation;
  style?: StyleType;
  unitTestType?: UnitTestType;
}
