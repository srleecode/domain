import { StyleType } from '../shared/model/style-type.enum';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
export interface CreateGeneratorSchema {
  application: string;
  domain: string;
  prefix: string;
  libraries?: DomainLibraryName[];
  style?: StyleType;
  addJestJunitReporter?: boolean;
  addE2EProject?: boolean;
  addStorybookProject?: boolean;
  addComponentCommand?: boolean;
  buildable?: boolean;
  strict?: boolean;
  enableIvy?: boolean;
  routing?: boolean;
  publishable?: boolean;
}
