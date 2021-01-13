# Domain schematics

[![Join the chat at https://gitter.im/srleecode/domain](https://badges.gitter.im/srleecode/domain.svg)](https://gitter.im/srleecode/domain?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Why you should use the domain schematics

### Nrwl nx already implicitly uses domains

[Nrwl nx](https://github.com/nrwl/nx) recommends splitting libraries into [four different types](https://nx.dev/latest/angular/workspace/structure/library-types):
 - feature: libraries that contain smart (with access to data sources) UI components for specific business use cases or pages in an application
 - ui: libraries that contain only presentational components (also called "dumb" components)
 - data-access: libraries that contain code for interacting with a back-end system. It also includes all the code related to state management.
 - utility: libraries that contain low-level utilities used by many libraries and applications.

Nx also recommends [grouping](https://nx.dev/latest/angular/workspace/structure/grouping-libraries) libraries by scope. A library's scope is either the application to which it belongs or (for larger applications) a section within that application. In this context, a group of these libraries with a scope are going to be referred to as a domain. Therefore, it can be said that nx already recommends using domains.

### The need for domain schematics

Even though nx recommends using domains, by default all operations must happen at the level of libraries. For example, you cannot rename a domain. You need to instead rename all the libraries inside a domain. This is cumbersome. The domain schematics allow you to perform operations at the domain level. 

## Installation and required schematic libraries

```
yarn add -D @srleecode/domain @nrwl/cypress @nrwl/storybook @nrwl/workspace @nrwl/angular jest-junit

# or 
 
npm install -D @srleecode/domain @nrwl/cypress @nrwl/storybook @nrwl/workspace @nrwl/angular jest-junit
```

jest-junit is required when the option addJestJunitReporter is true when creating domains.

To more easily use these schematics install the vscode extension domain shematics: https://marketplace.visualstudio.com/items?itemName=srleecode.domain-schematics

This extension launches the nx console and adds appropriate default values based on the command trigger context.
  
## What is a domain

A domain is a folder that contains up to five libraries of which there are none or at most one of the following types:
 - feature: for smart components (containers)
 - ui: for dumb components
 - data-access: for state management and services
 - util: for model files, constants, validators, pipes and any other miscellaneous items, e.g. shared functions.
 - shell: for wrapping different libraries and exposing them all together so that they can be imported as a single import. Nx doesn't explicitly mention this type of library, but it does allow [other library types](https://nx.dev/latest/angular/workspace/structure/library-types#other-types) as long as you keep the number of library types low and clearly document what each type of library means. Shell libraries are useful for consuming domains in other domains.

When the domain libraries are created, the following tags are automatically added:
 - app - the application the library is for
 - scope - the domain that the library is in
 - type - the type of content in the library, e.g. ui

For example, if you add a new ui library inside the domain shared/table the following tags would be added to that library:
 - app - shared
 - scope - shared-table
 - type - ui

### Grouping folders 

The folders in which a domain and its libraries are in are called grouping folders. There are four main types of grouping folders:
 - application - these are at the highest level. 
 - parent domain - these are at the second level and have child domains inside of them
 - child domain - these are at the third level and are inside of a parent domain grouping folder
 - domain without any parent-child relationship - these are at the second level

In the below example, the first level folders "application" and "shared" are application grouping folders. "cash-account" is a parent domain grouping folder. "shared", "transaction-history" and "account-details" are child domain grouping folders. "table" is just a domain grouping folder without any parent-child relationship.

   - application/cash-account/shared
   - application/cash-account/transaction-history
   - application/cash-account/account-details
   - shared/table

The scope tag for a domain contains all of the grouping folders. For example if the domain is application/cash-account/transaction-history, then the scope would be application-cash-account-transaction-history

### What if something needs to be reused in multiple libraries?

As applications get more complicated, it becomes apparent that there are relationships between the domains. While the libraries inside a domain can be imported by any other domain libraries, there are specific domains that are meant to get imported into many more different domains than normal domains. These domains are not meant to expose meaningful functionality in and of themselves, but are meant to provide common or core functionality that is used by other domains. These domains are referred to as shared domains. There are three types of shared domains based on the level at which they apply. These levels are:
  - application - the name of the folder for this would be: "shared". It is for content that can be used across any application. An example would be the domain "shared/table" which is for the libraries related to a table component that can be used in any application
  - domain without any parent child relationship - the name of the folder for this would be something like: "application/shared". It is for content that belongs to a single application and cannot easily be given a domain or for which a domain would be too small, e.g. one or two files, and would therefore cause overhead if it was split out. As with all libraries, care should be taken that their content is split out appropriately into the right domains. Extra care should be taken with these shared domains as it is likely that they are used by many different domains which means a large number of libraries will be affected when they are updated
  - child domain - the name of the folder for this would be something like: "application/parent-domain/shared". These types of shared folders setup a parent and child relationship between domains. Parent and child domains exist when there is a group of domains that all share particular functionality that is not used anywhere else in the application. For example, a cash account in a bank application might have domains for transaction history, account details, etc. these domains could all have the same header components or utility files. The common code would belong in a shared domain and the full set of domains would look something like this:
      - application/cash-account/shared
      - application/cash-account/transaction-history
      - application/cash-account/account-details

### Cypress projects

Nx has schematics for cypress and storybook projects. However, the schematics operate at the level of libraries. The domain schematics allow you to add and remove cypress projects at the domain level. The schematics also move the cypress projects into the domain folder instead of the apps folder which is the default. For example, if you add a storybook project to the shared/table domain it will create two folders which are:
 - .cypress - this holds the cypress specifc config including test specs.
 - .storybook - this holds the storybook specific config

Adding a storybook project for the domain shared/table would create a project called: storybook-shared-table which would have the following tasks:
 - storybook -  this would run the storybook instance
 - storybook-e2e - this would run the storybook instance and then the cypress tests

Adding a e2e project for the domain shared/table would create a project called: e2e-shared-table which would have the default e2e task.

## What schematics are available

 - create - creates a domain
 - move - moves a domain, i.e. updates the scope tags, renames the domains grouping folder, moves all the libraries in the domain and moves any related cypress projects
 - remove - removes a domain, i.e. removes the domain grouping folder, all the domain libraries and any related cypress projects
 - addLibraries - adds one or more of the following library types (data-access, feature, shell, ui, util) to a domain. A library can only be added if it doesn't already exist in the domain
 - removeLibraries
 - addCypressProject - adds either an e2e or storybook cypress project to the domain
 - removeCypressProject - removes either an e2e or storybook cypress project from the domain

## Other things the schematics do

 - tsconfig paths for mock files in the library - by default when you create a domain with a util library or add a util lirbary to a domain it will create a mock file and a tsconfig path for that mock file. The naive approach of using mock files in your tests involves exporting them in the index.ts. This will cause the mock files to be included in the build output. As mock files are only used in the tests, this makes the build output larger than neccessary.
 - component command generation - if you select the addComponentCommand option when generating a cypress project it will generate a component command for you, see https://github.com/srlee309/component-command-utils for information on component commands
 - jest-junit reporter config - if you select the addJestJunitReporter when you create a domain or add a library to a domain it will add the jest junit reporter config to the libraries jest file

## Internally used schematics

The following schematics are used internally by this schematics library.

@nrwl/cypress 

 - cypress-project - used for creating cypress projects

@nrwl/storybook 
 - configuration - used for creating storybook projects

@nrwl/workspace 
 - move - used for moving cypress projects and moving domain libraries
 - remove - used for removing cypress projects and removing domain libraries

@nrwl/angular
 - lib - used for adding domain libraries

## Limitations

- the schematics been built for use with Angular. Other languages have not been considered
- it is tested with the latest versions of the above internally used schematics. Some schematics might not work if you use ealier versions of the internally used schematics. 
