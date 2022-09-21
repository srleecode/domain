import { AngularCreateLibrarySchema } from '@srleecode/domain/front-end/shared';

export interface CreateUtilGeneratorSchema extends AngularCreateLibrarySchema {
  groupingFolder: string;
  addJestJunitReporter?: boolean;
}
