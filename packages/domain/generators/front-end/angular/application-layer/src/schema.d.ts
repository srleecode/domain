import { CreateLibrarySchema } from '@srleecode/domain/angular/shared';

export interface CreateApplicationLayerGeneratorSchema
  extends CreateLibrarySchema {
  groupingFolder: string;
}
