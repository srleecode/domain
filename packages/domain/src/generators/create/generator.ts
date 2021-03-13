import { logger, Tree, convertNxGenerator } from '@nrwl/devkit';
import { librariesGenerator } from '../libraries/generator';
import { sortProjects } from '../shared/lib/sort-projects';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import {
  getParsedDomain,
  getTopLevelDomain,
  isChildDomain,
} from '../shared/utils/domain';
import { getParsedLibraries } from '../shared/utils/libraries';
import { addParentDomainDependency } from './lib/add-parent-domain-dependency';
import { getLibrariesGneratorSchema } from './lib/get-libraries-generator-options';
import { CreateGeneratorSchema } from './schema';
import { checkDomainFolderIsEmpty } from './validation/check-domain-folder-is-empty';
import { checkDomainLevels } from './validation/check-domain-levels';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createGenerator(
  host: Tree,
  options: CreateGeneratorSchema
) {
  checkDomainLevels(options.domain);
  const libraries = getParsedLibraries(options.libraries);
  const { application, domain, routing, enableIvy, publishable } = options;
  if (libraries.length === 0) {
    throw new Error('At least one library should be provided');
  }
  if (routing && !libraries.includes(DomainLibraryName.Shell)) {
    throw new Error(
      'A shell library should be included if you are using the routing option'
    );
  }
  if (enableIvy && publishable) {
    logger.warn(
      'It is not recommended to make libraries publishable when ivy is enabled'
    );
  }
  logger.info(`Creating domain ${application}-${getParsedDomain(domain)}`);
  if (isChildDomain(options.domain)) {
    addParentDomainDependency(host, application, options.domain);
  } else {
    checkDomainFolderIsEmpty(host, application, domain);
  }
  await librariesGenerator(host, getLibrariesGneratorSchema(options));
  sortProjects(host);
}

export default createGenerator;

export const createSchematic = convertNxGenerator(createGenerator);
