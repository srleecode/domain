import { StyleType } from '../shared/model/style-type.enum';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { Linter } from '@nrwl/workspace';

export interface CreateSchematicSchema {
  application: string;
  domain: string;
  prefix: string;
  includedLibraryTypes?: DomainLibraryName[];
  style?: StyleType;
  tsConfigPath?: string;
  addJestJunitReporter?: boolean;
  addCypressProject?: boolean;
  addStorybookProject?: boolean;
  linter: Linter;
}
