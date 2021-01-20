import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { getParsedDomain } from './domain';
import { getDecoratorInsertChanges, getDecoratorMetadata } from './ast';
import { createSourceFile, ScriptTarget } from 'typescript';
import { addComponentToModule } from '../schematics/add-component/rule/add-component-to-module';
import { testRunner } from './testing';
import { readInTree } from './tree';
import { DecoratorMetadata } from '../schematics/shared/model/decorator-metadata.model';
import { InsertChange } from '@nrwl/workspace';

describe('getDecoratorMetadata', () => {
  const application = 'application';
  const domain = 'domain';
  const componentName = 'test-example';
  const libraryType = DomainLibraryName.Ui;
  const moduleFilePath = `libs/${application}/${domain}/${libraryType}/src/lib/${application}-${getParsedDomain(
    domain
  )}-${libraryType}.module.ts`;
  const metaData: DecoratorMetadata = {
    name: 'NgModule',
    properties: [
      {
        name: 'declarations',
        insertStartPosition: 209,
        value: ['AppComponent'],
      },
      {
        name: 'imports',
        insertStartPosition: 262,
        value: ['BrowserModule'],
      },
      {
        name: 'id',
        insertStartPosition: 310,
        value: "'test'",
      },
      {
        name: 'jit',
        insertStartPosition: 331,
        value: 'true',
      },
      {
        name: 'providers',
        insertStartPosition: 357,
        value: undefined,
      },
      {
        name: 'bootstrap',
        insertStartPosition: 380,
        value: ['AppComponent'],
      },
    ],
    propertiesStart: 185,
  };
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;

    const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';
      import { AppComponent } from './app.component';
      @NgModule({
        declarations: [
          AppComponent
        ],
        imports: [
          BrowserModule
        ],
        id: 'test',
        jit: true,
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
    appTree.create(moduleFilePath, moduleContent);
  });

  it('should generate metadata from ast tree', async () => {
    const moduleFile = appTree.read(moduleFilePath);
    const source = createSourceFile(
      moduleFilePath,
      moduleFile.toString('utf-8'),
      ScriptTarget.Latest,
      true
    );

    expect(getDecoratorMetadata(source)).toEqual(metaData);
  });
  it('should get correct insert change when adding to existing items', () => {
    const componentName = 'TestExampleComponent';
    const expected = new InsertChange(moduleFilePath, 209, `${componentName},`);
    expect(
      getDecoratorInsertChanges(
        metaData,
        moduleFilePath,
        componentName,
        'declarations'
      )
    ).toEqual(expected);
  });
  it('should get correct insert change when adding to empty items', () => {
    const serviceName = 'TestExampleService';
    const expected = new InsertChange(moduleFilePath, 357, serviceName);
    expect(
      getDecoratorInsertChanges(
        metaData,
        moduleFilePath,
        serviceName,
        'providers'
      )
    ).toEqual(expected);
  });
  it('should get correct insert change when adding to property that does not exist', () => {
    const componentName = 'TestExampleComponent';
    const expected = new InsertChange(
      moduleFilePath,
      185,
      `exports: [${componentName}],`
    );
    expect(
      getDecoratorInsertChanges(
        metaData,
        moduleFilePath,
        componentName,
        'exports'
      )
    ).toEqual(expected);
  });
});
