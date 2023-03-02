import { AngularCreateLibrarySchema } from '@srleecode/domain/front-end/shared';

export interface CreatePresentationLayerGeneratorSchema
  extends AngularCreateLibrarySchema {
  groupingFolder: string;
  prefix?: string;
}
