import { Tree, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { getNpmScope } from '../shared/utils/nx-json';
import { getTsConfigPath } from '../shared/utils/tsconfig';
import { privateApiGenerator } from './generator';
import { PrivateApiGeneratorSchema } from './schema';

describe('generator:private-api', () => {
  let tree: Tree;
  const application = 'test-application';
  const domain = 'domain';
  const library = DomainLibraryName.DataAccess;
  const defaultOptions: PrivateApiGeneratorSchema = {
    application,
    domain,
    library,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('privateApiGenerator', () => {
    it('should generate private api files', async () => {
      await privateApiGenerator(tree, defaultOptions).catch((e) => {
        throw e;
      });
      expect(
        tree.exists(
          `libs/${application}/${domain}/${library}/src/private-api.ts`
        )
      ).toBe(true);
      const tsConfig = readJson(tree, getTsConfigPath(tree));
      expect(
        tsConfig.compilerOptions.paths[
          `@${getNpmScope(tree)}-${application}/${domain}/private/${library}`
        ]
      ).toEqual([
        `libs/${application}/${domain}/${library}/src/private-api.ts`,
      ]);
    });
  });
});
