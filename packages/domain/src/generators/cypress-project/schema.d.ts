import { CypressProject } from '../shared/model/cypress-project.enum';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';

export interface AddCypressProjectGeneratorSchema {
  application: string;
  domain: string;
  projectType: CypressProject;
  addComponentCommand: boolean;
  domainLibraries?: DomainLibraryName[]; // if being called internally by the create generator the 
}
