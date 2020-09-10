import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { RemoveSchematicSchema } from './schema';
import { removeDomain } from './rule/remove-domain';
import { isDomainHavingLibraryType } from '../../utils/domain';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { removeMockFileResolutionPath } from '../shared/rule/remove-mock-file-resolution-path';
import { isHavingE2ECypressProject } from '../../utils/e2e-project';
import { removeE2EProject } from '../shared/rule/remove-e2e-project';
import { checkDomainExists } from '../shared/validation/check-domain-exists';

export default function (options: RemoveSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain } = options;
    checkDomainExists(application, domain, tree);
    let rules: Rule[] = [];
    if (isHavingE2ECypressProject(application, domain, tree)) {
      rules = rules.concat(removeE2EProject(application, domain));
    }
    rules = rules.concat(removeDomain(application, domain, tree));
    if (
      isDomainHavingLibraryType(
        application,
        domain,
        tree,
        DomainLibraryName.Util
      )
    ) {
      rules.push(removeMockFileResolutionPath(application, domain));
    }

    return chain(rules);
  };
}
