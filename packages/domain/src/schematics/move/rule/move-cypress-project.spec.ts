import * as testingUtils from '../../../utils/testing';
import { moveCypressProject } from './move-cypress-project';
import { getParsedDomain } from '../../../utils/domain';

describe('moveCypressProject', () => {
  const application = 'test-application';

  beforeEach(() => {
    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate move rules for cypress project when given leaf domain', () => {
    const leafDomain = 'leaf-domain';
    const newLeafDomain = 'new-leaf-domain';
    moveCypressProject(application, leafDomain, newLeafDomain);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/workspace',
      'move',
      {
        destination: `e2e/${application}/${newLeafDomain}`,
        projectName: `e2e-${application}-${leafDomain}`,
      }
    );
  });
  it('should generate move rules for cypress project when given parent domain', () => {
    const parentDomain = 'parent-domain/shared';
    const newParentDomain = 'new-parent-domain/shared';
    moveCypressProject(application, parentDomain, newParentDomain);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/workspace',
      'move',
      {
        destination: `e2e/${application}/${newParentDomain}`,
        projectName: `e2e-${application}-${getParsedDomain(parentDomain)}`,
      }
    );
  });
});
