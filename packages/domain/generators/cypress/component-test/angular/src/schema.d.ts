import { MountType } from '@srleecode/domain/shared/utils';

export interface SetupComponentTestGeneratorSchema {
  projectName: string;
  name: string;
  selector: string;
  prefix: string;
  type: ElementType;
  componentType?: ComponentType;
  mountType?: MountType;
}
