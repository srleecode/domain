import { AngularCreateLibrarySchema } from '@srleecode/domain/front-end/shared';

export interface CreateDataAccessLayerGeneratorSchema
  extends AngularCreateLibrarySchema {
  groupingFolder: string;
  addJestJunitReporter?: boolean;
}
