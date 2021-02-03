import { Linter } from './linter.enum';
import { StyleType } from './style-type.enum';

export interface NxLibraryParamters {
  name: string;
  directory: string;
  tags: string;
  linter: Linter.EsLint;
  style: StyleType;
  prefix: string;
  routing?: boolean;
  lazy?: boolean;
  buildable?: boolean;
  strict?: boolean;
  enableIvy?: boolean;
  publishable?: boolean;
  importPath?: string;
}
