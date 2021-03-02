import { Linter } from '../../shared/model/linter.enum';

export interface NrwlCypressSchematicSchema {
  project: string;
  name: string;
  directory: string;
  linter: Linter;
  js?: boolean;
}
