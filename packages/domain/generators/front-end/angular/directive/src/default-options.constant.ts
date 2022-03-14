
import { CreateDirectiveGeneratorSchema } from './schema';

export const defaultOptions: CreateDirectiveGeneratorSchema = {
  groupingFolder: 'libs/test-app/test-domain',
  name: 'TestExample',
  buildable: true,
  strict: false,
  enableIvy: true,
  publishable: false,
};

export const LIB_PATH = `${defaultOptions.groupingFolder}/directive-test-example/src/lib`;
