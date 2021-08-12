import { ApplicationType } from '@srleecode/domain/grouping-folder/shared';

export interface CreateAppGroupingFolderGeneratorSchema {
  applicationType?: ApplicationType;
  name: string;
}
