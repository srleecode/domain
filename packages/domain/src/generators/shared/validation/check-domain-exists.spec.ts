import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as domainUtils from '../utils/domain';
import { checkDomainExists } from './check-domain-exists';

describe('checkDomainExists', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should throw SchematicException when domain does not exist', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(false);
    expect(() => checkDomainExists(application, domain, appTree)).toThrowError(
      new Error(`${application}/${domain} does not exist`)
    );
  });
  it('should not throw SchematicException when domain exists', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(true);
    expect(() =>
      checkDomainExists(application, domain, appTree)
    ).not.toThrowError();
  });
});
