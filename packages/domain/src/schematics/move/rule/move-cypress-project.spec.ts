import * as testingUtils from '../../../utils/testing';
import { moveCypressProject } from './move-cypress-project';
import { getParsedDomain } from '../../../utils/domain';
import { CypressProject } from '../../shared/model/cypress-project.enum';

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
    moveCypressProject(
      application,
      leafDomain,
      newLeafDomain,
      CypressProject.E2E
    );
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/workspace',
      'move',
      {
        destination: `${CypressProject.E2E}/${application}/${newLeafDomain}`,
        projectName: `${CypressProject.E2E}-${application}-${leafDomain}`,
      }
    );
  });
  it('should generate move rules for cypress project when given parent domain', () => {
    const parentDomain = 'parent-domain/shared';
    const newParentDomain = 'new-parent-domain/shared';
    moveCypressProject(
      application,
      parentDomain,
      newParentDomain,
      CypressProject.E2E
    );
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/workspace',
      'move',
      {
        destination: `${CypressProject.E2E}/${application}/${newParentDomain}`,
        projectName: `${CypressProject.E2E}-${application}-${getParsedDomain(
          parentDomain
        )}`,
      }
    );
  });
});
