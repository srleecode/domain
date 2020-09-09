import { CreateSchematicSchema } from '../schema';
import { LibraryDefinition } from '../../shared/model/library-definition.model';

export interface NormalizedSchema extends CreateSchematicSchema {
  libraryDefinitions: LibraryDefinition[];
}
