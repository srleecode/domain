import { DomainLibraryName } from '../shared/model/domain-library-name.enum';

export interface PrivateApiGeneratorSchema {
  application: string;
  domain: string;
  library: DomainLibraryName;
}
