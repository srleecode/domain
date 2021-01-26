import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { StyleType } from '../shared/model/style-type.enum';

export interface AddLibrariesSchematicSchema {
  application: string;
  domain: string;
  prefix: string;
  libraries?: DomainLibraryName[];
  style?: StyleType;
  tsConfigPath?: string;
  addJestJunitReporter?: boolean;
  routing?: boolean;
}
