import { DomainLibraryName } from '../shared/model/domain-library-name.enum';

export interface AddPrivateApiSchematicSchema {
  application: string;
  domain: string;
  library: DomainLibraryName;
}
