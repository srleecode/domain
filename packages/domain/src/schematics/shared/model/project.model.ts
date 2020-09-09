import { DomainLibraryName } from './domain-library-name.enum';

export interface Project {
  name: string;
  secondLevelDomain?: string;
  type: DomainLibraryName;
}
