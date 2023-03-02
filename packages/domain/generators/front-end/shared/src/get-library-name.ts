import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { LibraryNameOptions } from './model/library-name-options.model';

export const getLibraryName = (options: LibraryNameOptions): string => {
  return [options.type || '', dasherize(options.name)]
    .filter((v) => !!v)
    .join('-');
};
