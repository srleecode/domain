import { RemoveLibrariesSchematicSchema } from '../schema';
import { LibraryDefinition } from '../../shared/model/library-definition.model';

export interface NormalizedSchema extends RemoveLibrariesSchematicSchema {
  projectNames: string[];
}
