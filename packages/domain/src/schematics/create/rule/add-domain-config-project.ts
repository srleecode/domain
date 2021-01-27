import { Rule } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { getParsedDomain } from '../../../utils/domain';
import { DomainConfig } from '../../shared/model/domain-config.model';
import { CreateNormalizedSchema } from '../model/normalized-schema.model';

export const addDomainConfigProject = (
  application: string,
  domain: string,
  options: CreateNormalizedSchema
): Rule =>
  updateJsonInTree('domain.config.json', (json) => {
    const newProject: DomainConfig = {
      [`${application}-${getParsedDomain(domain)}`]: {
        buildable: !!options.buildable,
        strict: !!options.strict,
        enableIvy: !!options.enableIvy,
        publishable: !!options.publishable,
      },
    };
    return {
      ...json,
      ...newProject,
    };
  });
