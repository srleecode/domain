import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import { createGenerator } from './generator';
import { CreateGeneratorSchema } from './schema';
import { StyleType } from '../shared/model/style-type.enum';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';

describe('create generator', () => {
  let tree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  const libraries = [DomainLibraryName.Shell, DomainLibraryName.Feature];
  const options: CreateGeneratorSchema = {
    application,
    domain,
    prefix: 'test',
    libraries,
    style: StyleType.Scss,
    routing: true,
    buildable: true,
    enableIvy: true,
    publishable: false,
    strict: false,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await createGenerator(tree, options);
    libraries.forEach((library) =>
      expect(
        tree.exists(`libs/${application}/${domain}/${library}/src/index.ts`)
      ).toBe(true)
    );
  });
});
