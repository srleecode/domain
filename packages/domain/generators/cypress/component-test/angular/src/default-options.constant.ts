import { MountType, ElementType } from '@srleecode/domain/shared/utils';
import { SetupComponentTestGeneratorSchema } from './schema';

export const defaultOptions: SetupComponentTestGeneratorSchema = {
  projectName: 'test-app-test-domain-feature-test-example',
  name: 'TestExample',
  type: ElementType.Component,
  selector: 'srlee-test-app-test-domain-feature-test-example',
  mountType: MountType.Component,
};

export const defaultDirectiveOptions: SetupComponentTestGeneratorSchema = {
  projectName: 'test-app-test-domain-directive-test-example',
  name: 'TestExample',
  type: ElementType.Directive,
  selector: 'srlee-test-app-test-domain-directive-test-example',
  mountType: MountType.Component,
};

export const LIB_PATH = `libs/test-app/test-domain/feature-test-example/src/lib`;

export const DIRECTIVES_LIB_PATH = `libs/test-app/test-domain/directive-test-example/src/lib`;
