import { CypressProject } from '../shared/model/cypress-project.enum';

export interface AddCypressProjectSchematicSchema {
  application: string;
  domain: string;
  projectType: CypressProject;
}
