import { getParsedDomain } from './domain';
import { getDecoratorInsertChanges, getDecoratorMetadata } from './ast';
import { createSourceFile, ScriptTarget } from 'typescript';
import { StringChange, ChangeType } from '@nrwl/devkit';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { DecoratorMetadata } from '../model/decorator-metadata.model';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

describe('getDecoratorMetadata', () => {
  const application = 'application';
  const domain = 'domain';
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
  let appTree: Tree;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();

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
    appTree.write(moduleFilePath, moduleContent);
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
    const expected: StringChange = {
      type: ChangeType.Insert,
      index: 209,
      text: `${componentName},`,
    };

    expect(
      getDecoratorInsertChanges(metaData, componentName, 'declarations')
    ).toEqual(expected);
  });
  it('should get correct insert change when adding to empty items', () => {
    const serviceName = 'TestExampleService';
    const expected: StringChange = {
      type: ChangeType.Insert,
      index: 357,
      text: serviceName,
    };

    expect(
      getDecoratorInsertChanges(metaData, serviceName, 'providers')
    ).toEqual(expected);
  });
  it('should get correct insert change when adding to property that does not exist', () => {
    const componentName = 'TestExampleComponent';
    const expected: StringChange = {
      type: ChangeType.Insert,
      index: 185,
      text: `exports: [${componentName}],`,
    };
    expect(
      getDecoratorInsertChanges(metaData, componentName, 'exports')
    ).toEqual(expected);
  });
});
