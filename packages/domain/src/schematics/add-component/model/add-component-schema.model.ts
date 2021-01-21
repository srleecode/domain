import { StyleType } from '../../shared/model/style-type.enum';
import { ChangeDetection } from './change-detection-type.enum';
import { TestType } from './test-type.enum';
import { ViewEncapsulation } from './view-encapsulation.enum';

export interface AddComponentSchema {
  application: string;
  domain: string;
  name: string;
  displayBlock: boolean;
  inlineStyle: boolean;
  inlineTemplate: boolean;
  viewEncapsulation: ViewEncapsulation;
  changeDetection: ChangeDetection;
  prefix: string;
  style: StyleType;
  testType: TestType;
  isExported: boolean;
}
