import { RemoveLibrariesGeneratorSchema } from '../schema';

export interface NormalizedSchema extends RemoveLibrariesGeneratorSchema {
  projectNames: string[];
}
