export interface DomainConfig {
  [projectName: string]: DomainConfigProject;
}

export interface DomainConfigProject {
  buildable: boolean;
  strict: boolean;
  enableIvy: boolean;
  publishable: boolean;
}
