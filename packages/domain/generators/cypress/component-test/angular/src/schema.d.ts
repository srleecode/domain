import { MountType } from '@srleecode/domain/shared/utils';

export interface SetupComponentTestGeneratorSchema {
  projectName: string;
  componentName: string;
  mountType?: MountType;
  selector: string;
}
