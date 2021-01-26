import { StyleType } from '../shared/model/style-type.enum';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
export interface CreateSchematicSchema {
  application: string;
  domain: string;
  prefix: string;
  libraries?: DomainLibraryName[];
  style?: StyleType;
  tsConfigPath?: string;
  addJestJunitReporter?: boolean;
  addE2EProject?: boolean;
  addStorybookProject?: boolean;
  addComponentCommand?: boolean;
}
