import { StyleType } from '../shared/model/style-type.enum';
import { ChangeDetection } from './model/change-detection-type.enum';
import { TestType } from './model/test-type.enum';
import { ViewEncapsulation } from './model/view-encapsulation.enum';

export interface ComponentGeneratorSchema {
  application: string;
  domain: string;
  name: string;
  prefix: string;
  displayBlock: boolean;
  style: StyleType;
  testType: TestType;
  isExported: boolean;
}
