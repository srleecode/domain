import { DomainLibraryName } from './domain-library-name.enum';

export interface LibraryDefinition {
  projectName: string;
  tags: string[];
  directory: string;
  type: DomainLibraryName;
}
