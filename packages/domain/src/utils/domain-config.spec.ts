import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { getDomainProjectConfig } from './domain-config';
import { DomainConfigProject } from '../schematics/shared/model/domain-config.model';

describe('Domain config', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'domain';
  const domainConfigProject: DomainConfigProject = {
    buildable: true,
    enableIvy: true,
    strict: false,
  };
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    const json = {
      [`${application}-${domain}`]: domainConfigProject,
    };
    appTree.create('domain.config.json', JSON.stringify(json));
  });
  describe('getDomainProjectConfig', () => {
    it('should return application and domains project config', () => {
      expect(getDomainProjectConfig(appTree, application, domain)).toEqual(
        domainConfigProject
      );
    });
  });
});
