import {
  formatFiles,
  generateFiles,
  offsetFromRoot,
  Tree,
  logger,
  convertNxGenerator,
  names,
} from '@nrwl/devkit';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { strings } from '@angular-devkit/core';
import * as path from 'path';
import { join, normalize } from 'path';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { checkLibraryExists } from '../shared/validation/check-library-exists';
import { ChangeDetection } from './model/change-detection-type.enum';
import { TestType } from './model/test-type.enum';
import { ViewEncapsulation } from './model/view-encapsulation.enum';
import { ComponentGeneratorSchema } from './schema';
import { getParsedDomain } from '../shared/utils/domain';
import { addComponentToModule } from './rule/add-component-to-module';

function addFiles(
  tree: Tree,
  options: ComponentGeneratorSchema,
  library: DomainLibraryName
) {
  const { application, domain, name } = options;
  const target = normalize(
    `libs/${application}/${domain}/${library}/src/lib/${dasherize(name)}`
  );
  const templateOptions = {
    ...options,
    ...names(options.name),
    isUsingNonDefaultViewEncapsulation:
      options.viewEncapsulation !== ViewEncapsulation.Emulated,
    isTestUsingTestBed: options.testType === TestType.testBed,
    offsetFromRoot: offsetFromRoot(target),
    tmpl: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), target, templateOptions);
  if (options.testType === TestType.noTests) {
    tree.delete(join(target, `${dasherize(name)}.spec.ts`));
  }
}

export async function componentGenerator(
  tree: Tree,
  options: ComponentGeneratorSchema
): Promise<void> {
  const { application, domain, name, changeDetection, isExported } = options;
  checkDomainExists(application, domain, tree);
  let library: DomainLibraryName;
  if (changeDetection === ChangeDetection.Default) {
    library = DomainLibraryName.Feature;
    checkLibraryExists(application, domain, DomainLibraryName.Feature, tree);
  } else if (changeDetection === ChangeDetection.OnPush) {
    library = DomainLibraryName.Ui;
    checkLibraryExists(application, domain, DomainLibraryName.Ui, tree);
  }
  if (!name) {
    throw new Error('component name is required');
  }
  logger.info(
    `Adding component for ${name} to ${application}-${getParsedDomain(domain)}`
  );
  addComponentToModule(application, domain, name, library, isExported, tree);
  addFiles(tree, options, library);
  await formatFiles(tree);
}

export default componentGenerator;

export const componentSchematic = convertNxGenerator(componentGenerator);
