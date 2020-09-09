import { Linter } from '@nrwl/workspace';

export interface NrwlCypressSchematicSchema {
  project: string;
  name: string;
  directory: string;
  linter: Linter;
  js?: boolean;
}
