import { checkDomainDoesntExist } from './check-domain-doesnt-exist';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as domainUtils from '../utils/domain';

describe('checkDomainDoesntExist', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should throw SchematicException when domain exists', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(true);
    expect(() =>
      checkDomainDoesntExist(application, domain, appTree)
    ).toThrowError(new Error(`${application}/${domain} already exists`));
  });
  it('should not throw SchematicException when domain does not exist', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(false);
    expect(() =>
      checkDomainDoesntExist(application, domain, appTree)
    ).not.toThrowError();
  });
});
