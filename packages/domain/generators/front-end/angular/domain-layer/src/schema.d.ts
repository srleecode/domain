import { AngularCreateLibrarySchema } from '@srleecode/domain/front-end/shared';

export interface CreateDomainLayerGeneratorSchema
  extends AngularCreateLibrarySchema {
  groupingFolder: string;
  addJestJunitReporter?: boolean;
}
