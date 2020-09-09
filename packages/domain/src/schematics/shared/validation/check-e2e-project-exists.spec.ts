import { SchematicsException } from '@angular-devkit/schematics';
import { checkE2EProjectExists } from './check-e2e-project-exists';
import { NxJson } from '@nrwl/workspace';

describe('checkE2EProjectExists', () => {
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  const mockNxJson: NxJson = {
    npmScope: 'project',
    projects: {
      [`e2e-${application}-${leafDomain}`]: {},
    },
  };
  it('show throw schematic exception when domain does not have a E2E project', () => {
    expect(() =>
      checkE2EProjectExists(application, 'test', mockNxJson)
    ).toThrowError(
      new SchematicsException(`Project does not exist e2e-${application}-test`)
    );
  });
  it('show not throw schematic exception when domain does have a E2E projects', async () => {
    expect(() =>
      checkE2EProjectExists(application, leafDomain, mockNxJson)
    ).not.toThrowError();
  });
});
