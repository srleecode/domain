import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { StyleType } from '../shared/model/style-type.enum';

export interface LibrariesGeneratorSchema {
  application: string;
  domain: string;
  prefix: string;
  libraries?: DomainLibraryName[];
  style?: StyleType;
  routing?: boolean;
  buildable?: boolean;
  strict?: boolean;
  enableIvy?: boolean;
  routing?: boolean;
  publishable?: boolean;
}
