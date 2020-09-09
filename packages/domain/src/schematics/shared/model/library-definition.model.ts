import { StyleType } from './style-type.enum';

export interface LibraryDefinition {
  projectName: string;
  tags: string[];
  directory: string;
  prefix: string;
  style: StyleType;
}
