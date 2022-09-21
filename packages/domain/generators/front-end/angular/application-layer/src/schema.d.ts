import { AngularCreateLibrarySchema } from '../../../shared';

export interface CreateApplicationLayerGeneratorSchema
  extends AngularCreateLibrarySchema {
  groupingFolder: string;
  addJestJunitReporter?: boolean;
}
