import { Linter } from '@nrwl/workspace';

export interface AddCypressProjectSchematicSchema {
  application: string;
  domain: string;
  linter: Linter;
}
