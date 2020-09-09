import * as testingUtils from '../../../utils/testing';
import { removeE2EProject } from './remove-e2e-project';

describe('removeE2EProject', () => {
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
    removeE2EProject(application, leafDomain);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/workspace',
      'remove',
      {
        projectName: `e2e-${application}-${leafDomain}`,
      }
    );
  });
});
