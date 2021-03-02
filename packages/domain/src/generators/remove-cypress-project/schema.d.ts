import { CypressProject } from '../shared/model/cypress-project.enum';

export interface RemoveCypressProjectGeneratorSchema {
  application: string;
  domain: string;
  projectType: CypressProject;
}
