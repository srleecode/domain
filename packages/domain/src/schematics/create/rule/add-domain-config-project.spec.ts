import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { addDomainConfigProject } from './add-domain-config-project';
import { CreateNormalizedSchema } from '../model/normalized-schema.model';
import { StyleType } from '../../shared/model/style-type.enum';
import { DomainConfig } from '../../shared/model/domain-config.model';

describe('addDomainConfigProject', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'domain';
  const options: CreateNormalizedSchema = {
    application: 'test-application',
    domain: 'test-domain',
    prefix: 'test',
    style: StyleType.Scss,
    routing: true,
    buildable: true,
    enableIvy: true,
    publishable: false,
    strict: false,
    libraryDefinitions: [],
  };

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should add parent domain dependency to new child domain', async () => {
    appTree = (await testRunner
      .callRule(addDomainConfigProject(application, domain, options), appTree)
      .toPromise()) as UnitTestTree;

    const json = readJsonInTree(appTree, 'domain.config.json');
    const expected: DomainConfig = {
      [`${application}-${domain}`]: {
        buildable: true,
        enableIvy: true,
        strict: false,
        publishable: false,
      },
    };
    expect(json).toEqual(expected);
  });
});
