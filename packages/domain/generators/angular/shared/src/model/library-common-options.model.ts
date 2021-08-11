export interface LibraryCommonOptions {
  name: string;
  importPath: string;
  directory: string;
  standaloneConfig: boolean;
  tags: string;
  buildable: boolean;
  strict: boolean;
  enableIvy: boolean;
  publishable: boolean;
}
