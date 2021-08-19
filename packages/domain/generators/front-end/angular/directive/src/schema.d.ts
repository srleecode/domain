import { CreateLibrarySchema } from '@srleecode/domain/angular/shared';

export interface CreateDirectiveGeneratorSchema extends CreateLibrarySchema {
  groupingFolder: string;
  name: string;
  mountType?: MountType;
  prefix?: string;
}
