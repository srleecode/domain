import { AngularCreateLibrarySchema } from '@srleecode/domain/front-end/shared';

export interface CreateDirectiveGeneratorSchema
  extends AngularCreateLibrarySchema {
  groupingFolder: string;
  name: string;
  mountType?: MountType;
}
