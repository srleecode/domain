import { FrontendFramework } from './lib/model/framework.enum';

export interface CreateAppGroupingFolderGeneratorSchema {
  framework?: FrontendFramework;
  name: string;
  baseFolder: string;
}
