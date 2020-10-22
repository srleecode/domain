import { StyleType } from '../shared/model/style-type.enum';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { Linter } from '@nrwl/workspace';
import { UiFrameworkType } from '../shared/model/ui-framework.type';

export interface CreateSchematicSchema {
  application: string;
  domain: string;
  prefix: string;
  libraries?: DomainLibraryName[];
  lint: Linter;
  style?: StyleType;
  tsConfigPath?: string;
  addJestJunitReporter?: boolean;
  addE2EProject?: boolean;
  addStorybookProject?: boolean;
  uiFramework?: UiFrameworkType;
}
