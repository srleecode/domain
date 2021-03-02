import { DomainLibraryName } from '../shared/model/domain-library-name.enum';

export interface RemoveLibrariesGeneratorSchema {
  application: string;
  domain: string;
  libraries?: DomainLibraryName[];
}
