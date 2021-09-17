import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { LibraryNameOptions } from './model/library-name-options.model';

export const getLibraryName = (options: LibraryNameOptions): string =>
  options.name ? `${options.type}-${dasherize(options.name)}` : options.type;
