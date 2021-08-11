import { CreateLibrarySchema } from '@srleecode/domain/angular/shared';

export interface CreateDomainGeneratorSchema extends CreateLibrarySchema {
  groupingFolder: string;
}
