/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WorkspaceJson {
  version?: number;
  projects: {
    [key: string]: any;
  };
  cli?: {
    [key: string]: any;
  };
  generators?: {
    [key: string]: any;
  };
  defaultProject?: string;
}
