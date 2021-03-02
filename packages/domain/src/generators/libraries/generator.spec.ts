import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import { librariesGenerator } from './generator';
import { LibrariesGeneratorSchema } from './schema';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { StyleType } from '../shared/model/style-type.enum';

describe('libraries generator', () => {
  let tree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  const libraries = [DomainLibraryName.DataAccess, DomainLibraryName.Util];
  const options: LibrariesGeneratorSchema = {
    application,
    domain,
    prefix: 'test',
    libraries,
    style: StyleType.Scss,
    routing: false,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    const nxJson = {
      projects: {},
    };
    tree.write('nx.json', JSON.stringify(nxJson));
  });

  it('should add libraries', async () => {
    await librariesGenerator(tree, options);
    libraries.forEach((library) =>
      expect(
        tree.exists(`libs/${application}/${domain}/${library}/src/index.ts`)
      ).toBe(true)
    );
    expect(
      tree.exists(`libs/${application}/${domain}/util/src/testing.ts`)
    ).toBe(true);
    const jestConfig = tree
      .read(`libs/${application}/${domain}/util/jest.config.js`)
      .toString();
    expect(jestConfig.includes('reporters')).toBe(true);
    expect(jestConfig.includes('jest-junit')).toBe(true);
  });
});
