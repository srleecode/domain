import { SchematicsException } from '@angular-devkit/schematics';
import { checkCypressProjectExists } from './check-cypress-project-exists';
import { NxJson } from '@nrwl/workspace';
import { CypressProject } from '../model/cypress-project.enum';

describe('checkCypressProjectExists', () => {
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  const mockNxJson: NxJson = {
    npmScope: 'project',
    projects: {
      [`${CypressProject.E2E}-${application}-${leafDomain}`]: {},
    },
  };
  it('show throw schematic exception when domain does not have a E2E project', () => {
    expect(() =>
      checkCypressProjectExists(
        application,
        'test',
        CypressProject.E2E,
        mockNxJson
      )
    ).toThrowError(
      new SchematicsException(
        `Project does not exist ${CypressProject.E2E}-${application}-test`
      )
    );
  });
  it('show not throw schematic exception when domain does have a E2E projects', async () => {
    expect(() =>
      checkCypressProjectExists(
        application,
        leafDomain,
        CypressProject.E2E,
        mockNxJson
      )
    ).not.toThrowError();
  });
});
