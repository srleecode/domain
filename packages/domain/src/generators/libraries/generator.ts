import { logger, Tree, formatFiles, convertNxGenerator } from '@nrwl/devkit';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { getParsedDomain } from '../shared/utils/domain';
import {
  getDomainLibraryDefinitions,
  getParsedLibraries,
} from '../shared/utils/libraries';
import { LibrariesNormalizedSchema } from './model/libraries-normalized-schema.model';
import { LibrariesGeneratorSchema } from './schema';
import { checkLibrariesDontExist } from './validation/check-libraries-dont-exist';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { getLibraryParameters } from './lib/get-library-parameters';
import { addStoryFileExclusions } from '../shared/lib/add-story-file-exclusions';
import { addMockFile } from './lib/add-mock-file';
import { addMockFileResolutionPath } from './lib/add-mock-file-resolution-path';
import { addJestJunitReporter } from '../shared/lib/add-jest-junit-reporter';
import { isHavingCypressProject } from '../shared/utils/cypress-project';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { addImplicitDependenciesToCypressProject } from '../shared/lib/add-implicit-dependencies-to-cypress-project';
import { updatePathInStorybookConfig } from '../shared/lib/update-path-in-storybook-config';
import { sortProjects } from '../shared/lib/sort-projects';

const normalizeOptions = (
  options: LibrariesGeneratorSchema
): LibrariesNormalizedSchema => {
  return {
    ...options,
    libraryDefinitions: getDomainLibraryDefinitions(
      options.application,
      options.domain,
      options.libraries
    ),
  };
};

export async function librariesGenerator(
  tree: Tree,
  options: LibrariesGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(options);
  const { application, domain, routing } = options;
  const libraries = getParsedLibraries(options.libraries);
  if (libraries.length === 0) {
    throw new Error('At least one library should be provided');
  }
  if (routing && !libraries.includes(DomainLibraryName.Shell)) {
    throw new Error(
      'A shell library should be included if you are using the routing option'
    );
  }
  logger.info(
    `Adding ${libraries} to ${application}-${getParsedDomain(domain)}`
  );
  checkLibrariesDontExist(application, domain, libraries, tree);
  const libraryParams = getLibraryParameters(tree, normalizedOptions);
  const libraryGenerator = wrapAngularDevkitSchematic(
    '@nrwl/angular',
    'library'
  );
  for (const params of libraryParams) {
    await libraryGenerator(tree, params).catch((e) => {
      logger.error(e.message);
      throw e;
    });
  }
  addStoryFileExclusions(tree, application, domain, libraries);
  if (libraries.includes(DomainLibraryName.Util)) {
    addMockFile(tree, application, domain);
    addMockFileResolutionPath(tree, application, domain);
  }
  libraries.forEach((libraryType) =>
    addJestJunitReporter(tree, application, domain, libraryType)
  );
  if (isHavingCypressProject(application, domain, CypressProject.E2E, tree)) {
    addImplicitDependenciesToCypressProject(
      tree,
      application,
      domain,
      libraries,
      CypressProject.E2E
    );
  }
  if (
    isHavingCypressProject(application, domain, CypressProject.Storybook, tree)
  ) {
    addImplicitDependenciesToCypressProject(
      tree,
      application,
      domain,
      libraries,
      CypressProject.Storybook
    );
    updatePathInStorybookConfig(tree, application, domain);
    addStoryFileExclusions(tree, application, domain, libraries);
  }
  sortProjects(tree);
  await formatFiles(tree).catch((e) => {
    logger.error(e.message);
    throw e;
  });
}

export default librariesGenerator;

export const librariesSchematic = convertNxGenerator(librariesGenerator);
