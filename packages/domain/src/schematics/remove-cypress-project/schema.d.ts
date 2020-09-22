import { CypressProject } from '../shared/model/cypress-project.enum';

export interface RemoveCypressProjectSchematicSchema {
  application: string;
  domain: string;
  projectType: CypressProject;
}
