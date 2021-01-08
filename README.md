# Domain schematics

## Why you should use the domain schematics

### Nrwl nx already implicitly uses domains

[Nrwl nx](https://github.com/nrwl/nx) recommends splitting libraries into [four different types](https://nx.dev/latest/angular/workspace/structure/library-types):
 - feature: libraries that contain smart (with access to data sources) UI components for specific business use cases or pages in an application
 - ui: libraries that contain only presentational components (also called "dumb" components)
 - data-access: libraries that contain code for interacting with a back-end system. It also includes all the code related to state management.
 - utility: libraries that contain low-level utilities used by many libraries and applications.

Nx also recommends [grouping](https://nx.dev/latest/angular/workspace/structure/grouping-libraries) libraries by scope. A library's scope is either the application to which it belongs or (for larger applications) a section within that application. The group of these libraries can be reffered to as a domain. Therefore, nx already recommends using domains it just doesn't have tooling at this level.

### The need for domain schematics

Even though nx recommends using domains, by default all operations must happen at the level of libraries. For example, you cannot rename a domain. You need to instead rename all the libraries inside a domain which is cumbersome. The domain schematics allows you to perform operations at the domain level. 

## What is a domain

A domain is a folder that contains up to five libraries of which there are none or at most one of the following types:
 - feature: for smart components (containers)
 - ui: for dumb components
 - data-access: for state management and services
 - util: for model files, constants, validators, pipes and any other miscellaneous items, e.g. shared functions.
 - shell: for wrapping different libraries and exposing them as a single import.

When the domain libraries are created, the following tags are automatically added:
 - app which is for the application the library is for
 - scope which is for the domain that the library is in. 
 - type which is for the type of content in the library. For example, ui

### Grouping folders 

The folders in which a domain and its libraries are in are called grouping folders. Application grouping folders are at the highest level. Parent domains or just domains are at the second level and child domains are on the third level. In the below example, "application" and "shared" are application grouping folders. "cash-account" is a parent domain grouping folder. "shared", "transaction-history" and "account-details" are child domain grouping folders. "table" is just called a domain grouping folder.

   - application/cash-account/shared
   - application/cash-account/transaction-history
   - application/cash-account/account-details
   - shared/table

The scope tag for a domain contains all of the grouping folders. For example if the domain is application/cash-account/transaction-history, then the scope would be application-cash-account-transaction-history

### What if something needs to be reused in multiple libraries?

As applications get more complicated it becomes apparent that there are relationships between the domains. While the libraries inside a domain can be imported by any other domain libraries, there are specific domains that are meant to get imported into many more different domains than normal domains. These domains are not meant to expose meaningful functionality in and of themselves, but are meant to provide common or core functionality that is used by other domains. These domains are referred to as shared domains. There are three types of shared domains based on the level at which they apply. These levels are:
  - shared - this is for content that can be used across any application. An example would be the domain "shared/table" which is for the libraries related to a table component that can be used in any application.
  - application/shared - this is for content that belongs to a single application and cannot easily be given a domain or for which a domain would be too small, e.g. one or two files, and would therefore cause overhead if it was split out. As with all libraries, care should be taken that their content is split out appropriately into the right domains. Extra care should be taken with these shared domains as it is likely that are used by many different domains which means a large number of libraries will be affected when they are updated.
  - application/domain/shared - a domain with a shared domain in it is called a parent domain and it can contain other domains. These type of shared folders setup a parent and child relationships between domains. Parent and child domains exist when there is a group of domains that all share particular functionality that is not used anywhere else in the application. For example, a cash account in a bank application might have domains for transaction history, account details, etc. these domains could all have the same header components or utility files. The common code would belong in a shared domain and the full set of domains would look something like this:
      - application/cash-account/shared
      - application/cash-account/transaction-history
      - application/cash-account/account-details

### Cypress projects

Nx has tooling for cypress and storybook projects. However, they are also by default at the level of libraries. The domain schematics includes schematics to add these cypress projects at the domain level. It is also in the domain folder instead of the apps folder which is the default. For example, if you add a storybook project to the shared/table domain it would create two folder under the folder shared/table. These folders are:
 - .cypress - holds the cypress specifc config including test specs.
 - .storybook - holds the storybook specific config

Adding a storybook project for the domain shared/table would create a project storybook-shared-table which would have the following tasks:
 - storybook -  this would run the storybook instance
 - storybook-e2e - this would run the storybook instance and then the cypress tests

Adding a e2e project for the domain shared/table would create a project e2e-shared-table which would have the default e2e task.

## What schematics are available

 - create - creates a domain, i.e. at least one of the following libraries and at most one of each type: data-access, feature, shell, ui, util
 - move - moves a domain, i.e. updates the scope tags and moves all the libraries
 - remove - removes a domain, i.e. removes all the domain libraries and any related cypress projects
 - addLibraries - adds one or more of the following library types (data-access, feature, shell, ui, util) to a domain. A library can only be added if it doesn't already exist in the domain
 - removeLibraries
 - addCypressProject - add either an e2e or storybook cypress project to the domain
 - removeCypressProject - removes either an e2e or storybook cypress project from the domain

## Installation and required schematic libraries

```
yarn add -D @srleecode/domain @nrwl/cypress @nrwl/storybook @nrwl/workspace @nrwl/angular

# or 
 
npm install -D @srleecode/domain @nrwl/cypress @nrwl/storybook @nrwl/workspace @nrwl/angular
```

The following schematics are used internally by this schematic library.

@nrwl/cypress 
 - cypress-project - used for creating cypress project
@nrwl/storybook 
 - configuration - used for creating storybook project
@nrwl/workspace 
 - move - used for moving cypress projects and moving domain libraries
 - remove - used for removing cypress projects and removing domain libraries
@nrwl/angular
 - lib - used for adding domain libraries