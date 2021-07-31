import {
  checkFilesExist,
  readFile,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  describe('component', () => {
    it('should create component with all options', async () => {
      const application = 'test-application';
      const domain = 'storybook-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:component --application ${application} --domain ${domain} --prefix srlee --name TestExample --displayBlock true --viewEncapsulation ShadowDom --changeDetection OnPush --style scss --testType testBed --isExported true`
      );
      const expectedFileTypes = ['ts', 'spec.ts', 'scss', 'html'];
      const dasherizedName = 'test-example';
      const basePath = `libs/${application}/${domain}/ui/src/lib/${dasherizedName}`;

      const componentFile = readFile(
        `${basePath}/${dasherizedName}.component.ts`
      );
      const componentSpecFile = readFile(
        `${basePath}/${dasherizedName}.component.spec.ts`
      );
      const componentStyleFile = readFile(
        `${basePath}/${dasherizedName}.component.scss`
      );
      const moduleFile = readFile(
        `libs/${application}/${domain}/ui/src/lib/${application}-${domain}-ui.module.ts`
      );
      expectedFileTypes.forEach((fileType) => {
        expect(() =>
          checkFilesExist(`${basePath}/${dasherizedName}.component.${fileType}`)
        ).not.toThrow();
      });
      expect(componentFile).toMatch(
        /changeDetection: ChangeDetectionStrategy.OnPush/
      );
      expect(componentFile).toMatch(
        /encapsulation: ViewEncapsulation.ShadowDom/
      );
      expect(componentFile).toMatch(/selector: 'srlee-test-example'/);
      expect(componentStyleFile).toMatch(/:host {\r?\n  display: block;\r?\n}/);
      expect(componentFile).toMatch(
        /styleUrls: \['.\/test-example.component.scss/
      );
      expect(componentSpecFile).toMatch(/TestBed/);
      expect(moduleFile).toMatch(
        /import { TestExampleComponent } from '.\/test-example\/test-example.component';/
      );
      expect(moduleFile).toMatch(/declarations: \[TestExampleComponent\]/);
      expect(moduleFile).toMatch(/exports: \[TestExampleComponent\]/);
    }, 120000);
    it('should create component with minimal options', async () => {
      const application = 'test-application';
      const domain = 'storybook-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:component --application ${application} --domain ${domain} --name TestExample --prefix srlee`
      );
      const expectedFileTypes = ['ts', 'scss', 'spec.ts', 'html'];
      const dasherizedName = 'test-example';
      const basePath = `libs/${application}/${domain}/feature/src/lib/${dasherizedName}`;

      const componentFile = readFile(
        `${basePath}/${dasherizedName}.component.ts`
      );
      const componentStyleFile = readFile(
        `${basePath}/${dasherizedName}.component.scss`
      );
      expectedFileTypes.forEach((fileType) => {
        expect(() =>
          checkFilesExist(`${basePath}/${dasherizedName}.component.${fileType}`)
        ).not.toThrow();
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
    }, 120000);
  });

  // no viewEnacpation ulation when not passed
});
