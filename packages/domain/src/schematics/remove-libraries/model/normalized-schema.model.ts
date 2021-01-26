import { RemoveLibrariesSchematicSchema } from '../schema';

export interface NormalizedSchema extends RemoveLibrariesSchematicSchema {
  projectNames: string[];
}
