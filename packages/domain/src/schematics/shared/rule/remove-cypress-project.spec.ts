import * as testingUtils from '../../../utils/testing';
import { removeCypressProject } from './remove-cypress-project';
import { CypressProject } from '../model/cypress-project.enum';

describe('removeCypressProject', () => {
  const application = 'test-application';
  const leafDomain = 'leaf-domain';

  beforeEach(() => {
    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove e2e project', () => {
    removeCypressProject(application, leafDomain, CypressProject.E2E);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/workspace',
      'remove',
      {
        projectName: `${CypressProject.E2E}-${application}-${leafDomain}`,
      }
    );
  });
});
