import { MountType } from '@srleecode/domain/shared/utils';

export interface SetupComponentTestGeneratorSchema {
  projectName: string;
  name: string;
  selector: string;
  type: ElementType;
  mountType?: MountType;
}
