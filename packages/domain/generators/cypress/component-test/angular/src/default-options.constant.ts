import { MountType } from '@srleecode/domain/shared/utils';
import { SetupComponentTestGeneratorSchema } from './schema';

export const defaultOptions: SetupComponentTestGeneratorSchema = {
  projectName: 'test-app-test-domain-feature-test-example',
  componentName: 'TestExample',
  selector: 'srlee-test-app-test-domain-feature-test-example',
  mountType: MountType.Component,
};

export const LIB_PATH = `libs/test-app/test-domain/feature-test-example/src/lib`;
