import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { ChangeDetection } from './model/change-detection-type.enum';
import { StyleType } from '../shared/model/style-type.enum';
import { TestType } from './model/test-type.enum';
import { componentGenerator } from './generator';
import { getModuleFilePath } from '../shared/utils/tree';
import { ComponentGeneratorSchema } from './schema';
import { addProjectConfiguration } from '../shared/utils/project-configuration';

describe('generator:component', () => {
  let tree: Tree;
  const application = 'test-application';
  const domain = 'domain';
  const defaultOptions: ComponentGeneratorSchema = {
    application,
    domain,
    prefix: 'srlee',
    name: 'TestExample',
    changeDetection: ChangeDetection.Default,
    displayBlock: false,
    style: StyleType.Scss,
    testType: TestType.Enzyme,
    isExported: false,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    const moduleFile = `import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
})
export class TestApplicationMultipleLibraryDomainFeatureModule {}`;
    tree.write(
      getModuleFilePath(application, domain, DomainLibraryName.Feature),
      moduleFile
    );
    tree.write(
      getModuleFilePath(application, domain, DomainLibraryName.Ui),
      moduleFile
    );
  });

  it('should create component with all options', async () => {
    addProjectConfiguration(tree, `${application}-${domain}-ui`, {
      targets: {},
      root: '',
    });
    await componentGenerator(tree, {
      ...defaultOptions,
      application,
      domain,
      prefix: 'srlee',
      name: 'TestExample',
      displayBlock: true,
      changeDetection: ChangeDetection.OnPush,
      style: StyleType.Scss,
      testType: TestType.Enzyme,
      isExported: true,
    });
    const expectedFileTypes = ['ts', 'spec.ts', 'scss', 'html'];
    const dasherizedName = 'test-example';
    const basePath = `libs/${application}/${domain}/ui/src/lib/${dasherizedName}`;

    const componentFile = tree
      .read(`${basePath}/${dasherizedName}.component.ts`)
      .toString();
    const componentSpecFile = tree
      .read(`${basePath}/${dasherizedName}.component.spec.ts`)
      .toString();
    const componentStyleFile = tree
      .read(`${basePath}/${dasherizedName}.component.scss`)
      .toString();
    const moduleFile = tree
      .read(
        `libs/${application}/${domain}/ui/src/lib/${application}-${domain}-ui.module.ts`
      )
      .toString();
    expectedFileTypes.forEach((fileType) => {
      expect(
        tree.exists(`${basePath}/${dasherizedName}.component.${fileType}`)
      ).toBe(true);
    });
    expect(componentFile).toMatch(
      /changeDetection: ChangeDetectionStrategy.OnPush/
    );
    expect(componentFile).toMatch(/encapsulation: ViewEncapsulation.ShadowDom/);
    expect(componentFile).toMatch(/selector: 'srlee-test-example'/);

    expect(componentStyleFile).toMatch(/:host {\r?\n {2}display: block;\r?\n}/);
    expect(componentFile).toMatch(
      /styleUrls: \['.\/test-example.component.scss/
    );
    expect(componentSpecFile).toMatch(/TestBed/);
    expect(moduleFile).toMatch(
      /import { TestExampleComponent } from '.\/test-example\/test-example.component';/
    );
    expect(moduleFile).toMatch(/declarations: \[TestExampleComponent\]/);
    expect(moduleFile).toMatch(/exports: \[TestExampleComponent\]/);
  });
  it('should create component with minimal options', async () => {
    addProjectConfiguration(tree, `${application}-${domain}-feature`, {
      targets: {},
      root: '',
    });
    await componentGenerator(tree, {
      ...defaultOptions,
      application,
      domain,
      prefix: 'srlee',
      name: 'TestExample',
    });
    const expectedFileTypes = ['ts', 'scss', 'spec.ts', 'html'];
    const dasherizedName = 'test-example';
    const basePath = `libs/${application}/${domain}/feature/src/lib/${dasherizedName}`;

    const componentFile = tree
      .read(`${basePath}/${dasherizedName}.component.ts`)
      .toString();
    const componentStyleFile = tree
      .read(`${basePath}/${dasherizedName}.component.scss`)
      .toString();
    expectedFileTypes.forEach((fileType) => {
      expect(
        tree.exists(`${basePath}/${dasherizedName}.component.${fileType}`)
      ).toBe(true);
    });
    expect(componentFile).not.toMatch(
      /changeDetection: ChangeDetectionStrategy/
    );
    expect(componentFile).not.toMatch(/encapsulation: ViewEncapsulation/);
    expect(componentFile).toMatch(/selector: 'srlee-test-example'/);
    expect(componentStyleFile).toBe('');
    expect(componentFile).toMatch(
      /styleUrls: \['.\/test-example.component.scss/
    );
    expect(componentFile).not.toMatch(/TestBed/);
  });
});
