import { LibrariesGeneratorSchema } from '../schema';
import { LibraryDefinition } from '../../shared/model/library-definition.model';

export interface LibrariesNormalizedSchema extends LibrariesGeneratorSchema {
  libraryDefinitions: LibraryDefinition[];
}
