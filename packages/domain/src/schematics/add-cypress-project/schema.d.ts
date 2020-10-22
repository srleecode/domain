import { CypressProject } from '../shared/model/cypress-project.enum';
import { Linter } from '@nrwl/workspace';
import { UiFrameworkType } from '../shared/model/ui-framework.type';

export interface AddCypressProjectSchematicSchema {
  application: string;
  domain: string;
  lint: Linter;
  projectType: CypressProject;
  uiFramework?: UiFrameworkType;
}
