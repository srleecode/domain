import { AddLibrariesSchematicSchema } from '../schema';
import { LibraryDefinition } from '../../shared/model/library-definition.model';

export interface AddLibrariesNormalizedSchema
  extends AddLibrariesSchematicSchema {
  libraryDefinitions: LibraryDefinition[];
}
