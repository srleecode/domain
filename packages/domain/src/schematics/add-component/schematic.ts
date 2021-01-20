/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { strings } from '@angular-devkit/core';
import {
  SchematicContext,
  Rule,
  Tree,
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  url,
  SchematicsException,
} from '@angular-devkit/schematics';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { normalize } from 'path';
import { getParsedDomain } from '../../utils/domain';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { checkLibraryExists } from '../shared/validation/check-library-exists';
import { AddComponentSchema } from './model/add-component-schema.model';
import { ChangeDetection } from './model/change-detection-type.enum';
import { addComponentToModule } from './rule/add-component-to-module';
import { formatFiles } from '@nrwl/workspace';
import { TestType } from './model/test-type.enum';

export default function (options: AddComponentSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const {
      application,
      domain,
      name,
      changeDetection,
      export: isExported,
    } = options;
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
      throw new SchematicsException('component name is required');
    }
    _context.logger.info(
      `Adding component for ${name} to ${application}-${getParsedDomain(
        domain
      )}`
    );
    const templateSource = apply(url('./files'), [
      options.testType === TestType.noTests
        ? filter((path) => !path.endsWith('.spec.ts.template'))
        : noop(),
      applyTemplates({
        ...strings,
        ...options,
        isTestUsingTestBed: options.testType === TestType.testBed,
      }),
      move(
        normalize(
          `libs/${application}/${domain}/${library}/src/lib/${dasherize(name)}`
        )
      ),
    ]);

    return chain([
      addComponentToModule(application, domain, name, library, isExported),
      mergeWith(templateSource),
      formatFiles(),
    ]);
  };
}
