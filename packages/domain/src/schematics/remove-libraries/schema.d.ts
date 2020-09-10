import { DomainLibraryName } from '../shared/model/domain-library-name.enum';

export interface RemoveLibrariesSchematicSchema {
  application: string;
  domain: string;
  libraries?: DomainLibraryName[];
}
