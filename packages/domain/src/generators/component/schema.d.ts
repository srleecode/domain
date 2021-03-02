import { StyleType } from '../../shared/model/style-type.enum';
import { ChangeDetection } from './change-detection-type.enum';
import { TestType } from './test-type.enum';
import { ViewEncapsulation } from './view-encapsulation.enum';

export interface ComponentGeneratorSchema {
  application: string;
  domain: string;
  name: string;
  prefix: string;
  displayBlock: boolean;
  viewEncapsulation: ViewEncapsulation;
  changeDetection: ChangeDetection;
  style: StyleType;
  testType: TestType;
  isExported: boolean;
}
