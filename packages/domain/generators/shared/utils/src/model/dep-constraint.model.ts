export interface DepConstraint {
  sourceTag: string;
  onlyDependOnLibsWithTags?: string[];
  notDependOnLibsWithTags?: string[];
  bannedExternalImports?: string[];
}
