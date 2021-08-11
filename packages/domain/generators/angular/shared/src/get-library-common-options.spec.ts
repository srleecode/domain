import { Tree } from '@nrwl/devkit';
import { getLibraryCommonOptions } from './get-library-common-options';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { CreateLibrarySchema } from './model/create-library-schema.model';
import { LibraryCommonOptions } from './model/library-common-options.model';

describe('getLibraryCommonOptions', () => {
  let tree: Tree;
  const defaultOptions: CreateLibrarySchema = {
    buildable: false,
    strict: false,
    enableIvy: false,
    publishable: false,
  };
  let libraryCommonOptions: LibraryCommonOptions;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    libraryCommonOptions = getLibraryCommonOptions(
      tree,
      '',
      'data-access',
      'libs/test-app/test-domain',
      defaultOptions
    );
  });

  it('should return name as type when name is not provided', () => {
    expect(libraryCommonOptions.name).toBe('data-access');
  });

  it('should return name as type-name when name is provided', () => {
    expect(
      getLibraryCommonOptions(
        tree,
        'test-example',
        'feature',
        'libs/test-app/test-domain',
        defaultOptions
      ).name
    ).toBe('feature-test-example');
  });

  it('should return import path using npm scope, domain path and library name', () => {
    expect(libraryCommonOptions.importPath).toBe(
      '@proj/test-app/test-domain/data-access'
    );
  });

  it('should return directory as grouping folder without the libs directory', () => {
    expect(libraryCommonOptions.directory).toBe('test-app/test-domain');
  });

  it('should return standaloneConfig as standaloneAsDefault from workspaceLayout', () => {
    expect(libraryCommonOptions.standaloneConfig).toBe(false);
  });

  it('should return tags as string with values for app, scope and type', () => {
    expect(libraryCommonOptions.tags).toBe(
      'app:test-app,scope:test-app-test-domain,type:data-access'
    );
  });
  it('should common library schema options', () => {
    expect(libraryCommonOptions).toEqual({
      name: expect.anything(),
      tags: expect.anything(),
      importPath: expect.anything(),
      directory: expect.anything(),
      standaloneConfig: expect.anything(),
      ...defaultOptions,
    });
  });
});
