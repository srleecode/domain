import { CreateSchematicSchema } from '../schema';
import { LibraryDefinition } from '../../shared/model/library-definition.model';

export interface CreateNormalizedSchema extends CreateSchematicSchema {
  libraryDefinitions: LibraryDefinition[];
}
