import { AngularCreateLibrarySchema } from '@srleecode/domain/front-end/shared';

export interface CreateApplicationLayerGeneratorSchema
  extends AngularCreateLibrarySchema {
  groupingFolder: string;
}
