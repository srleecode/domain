import { CypressProject } from '../shared/model/cypress-project.enum';
import { UiFrameworkType } from '../shared/model/ui-framework.type';

export interface AddCypressProjectSchematicSchema {
  application: string;
  domain: string;
  projectType: CypressProject;
  uiFramework?: UiFrameworkType;
  addComponentCommand: boolean;
}
