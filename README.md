# Domain generators

With these generators, I am trying to develop tooling that utilises [nx](https://nx.dev/) and helps to reach the goals of [scalability](./documentation/goals/scalability.md) and [corrigibilty](./documentation/goals/corrigibility.md). The below are some areas that I think are important:
 - [domain operations](./documentation/next/stategies.md#domain-operations) - domains are a common way to group related libraries. A problem is that by default there is no way to operate at the level of domains you can only operate at the level of libraires. For example, you cannot rename a domain. You need to instead rename all the libraries inside a domain. This is cumbersome. The domain generators allow you to perform operations at the domain level. 
 - [layering](./documentation/next/stategies.md#layering) - a goal of this project is to have generators that help generate clean architecture. This means creating layers that expose stable expectations and decouple these from code that is not stable.
 - [UI tests](./documentation/next/stategies.md#ui-tests) - interaction/E2E tests are the kind of tests we want to be writing as they give us the most confidence. They have been avoided in large amounts in the past because of issues with their speed and error specificity. UI tests are a less expesnive alternative to E2E tests for UI/interaction testing. They also enable outside-in tdd which is important for TDD on the front end. A goal of this project is to have generators that enable UI testing. 
 - [component test harnesses](./documentation/next/stategies.md#component-test-harnesses) - E2E tests are normally brittle and broken easily by changes. One of the major reasons for this is that the selectors used for selecting elements are duplicated, longer than necessary and not tested. Component test harnesses allow you to expose apis for your components. These apis can then be tested using the UI tests. A goal of this project is to enable the easy generation of component test harnesses.
 - [vscode extension](https://github.com/srleecode/vscode-domain-generators-extension) to be able to trigger generators - calling generators can get annoying, e.g. always having to type out the correct project name. A vscode extension has be written to allow the generators to be called more easily. The extension will launch the nx console and add appropriate default values based on the command trigger context.

## Layer libraries and SCAM/SDAM libraries that make up domains

Layers:
 - application: provides facades for use cases and handles state management 
 - data-access: infrasturcture layer that implements data accesses, e.g. via HTTP or WebSockets
domain
 - domain: domain logic like calculating additional expenses and validations. It also contains the domain models (classes, interfaces, types) that are used by the domain 
 - util: provides helper functions

SCAM (Single Component Angular Module) enable easy UI testing. Therefore, they are used for component and directives. The idea is that each component and directive has its own library and module. Domains can have the following libraries related to this:
 - shell - contains the parent component  wrapper feature component in a domain. It also contains the routing and guards for the domain.This includes packaging the libraries in the domain and exposing them in a module that can be used for lazy loading.
 - feature - contains so-called "smart components”
 - ui - contains a presentational component (also called "dumb" component)
 - directive - contains a directive

## Testing a domain

The different layers use different testing approaches:
 - application: the tests cover use cases of the domain. HttpMockModule is used to mock out any http calls. 
 - data-access: the tests cover that external api are called correctly. This layer should should export the HttpMock[] that is going be used in the application and component tests to mock out the http calls.
 - domain: there should be no tests in the domain layer as this code isinherently unstable
 - util: Tests cover everything that is exposed. 
 - components/directives: Tests use UI tests and cover the use cases of the components/directives. HttpMockModule is used to mock out any http calls. 

## Generators

Grouping folders:
 - appGroupingFolder
   - creates an application grouping folder
   - initialises the workspace for the given type of application, e.g. Angular.
   - adds the layer rules into eslint  
 - domainGroupingFolder 
   - creates a domain grouping folder
   - sets up the eslint rules for that domain
 - moveGroupingFolder
   - moves a grouping folder to another location. It also moves all of the libraries under the grouping folder
 - removeGroupingFolder
   - removes a grouping folder. It also removes all of the libraries under the grouping folder

Angular domain libraries
 - ngApplicationLayer - creates an application library in a domain
 - ngComponent  - creates an SCAM library for a component. Based on the given type, this will create either a feature, shell or ui library in the domain
 - ngDataAccessLayer - creates a data-access library in a domain
 - ngDirective - creates a directive library in a domain
 - ngDomainLayer - creates a data-access library in a domain
 - ngRemoveLibrary - removes a library from a domain
 - ngUtilLayer - creates a util library in a domain

Other:
 - domainTest - creates a project in a grouping for E2E tests related to that grouping folder
 - mockFile - the naive approach of using mock files in your tests involves exporting them in the index.ts. This will cause the mock files to be included in the build output. As mock files are only used in the tests, this makes the build output larger than neccessary. This generator creates a seperate tsconfig path for the mock files which allows them to be imported into other libraies and not included in the build output

## tags

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

Nx has schematics for cypress and storybook projects. However, the schematics operate at the level of libraries. The domain generators allow you to add cypress projects at the domain level. The schematics also move the cypress projects into the domain folder instead of the apps folder which is the default. For example, if you add a storybook project to the shared/table domain it will create a folder .e2e. This holds the cypress specifc config including test specs.

Adding a e2e project for the domain shared/table would create a project called: e2e-shared-table which would have the default e2e task.
