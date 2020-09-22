import { Linter } from '@nrwl/workspace';
import { CypressProject } from '../shared/model/cypress-project.enum';

export interface AddCypressProjectSchematicSchema {
  application: string;
  domain: string;
  linter: Linter;
  projectType: CypressProject;
}
