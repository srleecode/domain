import { AddLibrariesSchematicSchema } from '../schema';
import { LibraryDefinition } from '../../shared/model/library-definition.model';

export interface NormalizedSchema extends AddLibrariesSchematicSchema {
  libraryDefinitions: LibraryDefinition[];
}
