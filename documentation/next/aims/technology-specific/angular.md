# Angular aims

## Allow easy component testing

Component testing is a fundamental part of being able to do outside-in tdd. Component testing has high fidelity which is how closely the tests resemble a user’s experience with the application. As well as high precision, which is how well a test can target a specific edge case without executing (or re-executing) unrelated code. Component tests allow functional or feature tests to be written in such a way that they do not overwhelms a projects velocity due to their run time. E2E tests while useful can quickly become quite burdensome due to how long they take to run.

To make component testing easy the generators will also make it easy to setup the following:
 - SCAMs - SCAM stands for Single Component Angular Module. SCAMs are used because they enable easier component testing. SCAMs means that all feature and UI libraries get their own library. For further information, see https://marmicode.io/blog/your-angular-module-is-a-scam
 - Component test harnesses - A component harness is a class that lets a test interact with a component via a supported API. Each harness's API interacts with a component the same way a user would. By using the harness API, a test insulates itself against updates to the internals of a component, such as changing its DOM structure. By utilising component testing and pairing it with component test harnesses. The more expensive E2E tests will be able to use component test harnesses tested in the component tests. This means it is unlikely for the E2E tests to be breaking due to selector issues.

Resources for further reading:
 - [Nx 8.8: Now You Can Write UI Tests with Storybook and Cypress](https://blog.nrwl.io/ui-testing-with-storybook-and-nx-4b86975224c)
 - For Angular, the best way to do component testing currently seems to be [jscutlery/test-utils](https://github.com/jscutlery/test-utils)

## Allow the E2E testing files to be created inside the domains grouping folder

Nx has schematics for cypress and storybook projects. However, the schematics operate at the level of libraries. The domain schematics allow you to add and remove cypress projects at the domain level. The schematics also move the cypress projects into the domain folder instead of the apps folder which is the default.

## Allow mocks to be exposed in a way that they won't be included in your build files

The naive approach of using mock files in your tests involves exporting them in the index.ts. This will cause the mock files to be included in the build output. As mock files are only used in the tests, this makes the build output larger than neccessary. Creating a seperate tsconfig path for the mock files allows them to be included in the tests and not included in the build output

## Allow libraries to be created for the domain

Seperate libraries are created for each of the following. For example, when you create a new feature component that would be a new library.

 - feature: implements a use case with smart components
 - ui: provides use case-agnostic and thus reusable components (dumb components)
 - directive: provides directive for adding behavior to an existing DOM element.
 - pipe: provides pipe for transforming values in a template expression. 

The rest of the libraries can contain multiple things:
 - shell: provides the parent or wrapper feature component in a domain. It also contains the routing and guards for the domain.
 - application: provides facades for use cases and handles state management 
 - data-access: infrasturcture layer that implements data accesses, e.g. via HTTP or WebSockets
domain
 - domain: domain logic like calculating additional expenses and validations. It also contains the domain models (classes, interfaces, types) that are used by the domain 
 - util: provides helper functions

Libraries are created when they are needed one by one, so not all of the above libraries will be used in each domain. For the sake of simplicity, it may also be common to use data-access as a single subdivided library. This means that application, domain and data-access would all be in the one library and their content seperated into different folders. 

Library restrictions:

 - { "sourceTag": "type:domain", "onlyDependOnLibsWithTags": ["type:domain", "type:util"] },
-  { "sourceTag": "type:application", "onlyDependOnLibsWithTags": [ "type:application", "type:data-access", "type:util"] },
 - { "sourceTag": "type:data-access", "onlyDependOnLibsWithTags": [ "type:data-access", "type:domain", "type:util"] },
 - { "sourceTag": "type:shell", "onlyDependOnLibsWithTags": ["type:data-access", "type:feature", "type:ui", "type:directive", "type:pipe", "type:util"] },
 - { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:data-access", "type:feature", "type:ui", "type:directive", "type:pipe", "type:util"] }
 - { "sourceTag": "type:ui", "onlyDependOnLibsWithTags": [ "type:ui", "type:directive", "type:pipe", "type:util"] },
 - { "sourceTag": "type:directive", "onlyDependOnLibsWithTags": ["type:data-access", "type:util"] },
 - { "sourceTag": "type:pipe", "onlyDependOnLibsWithTags": ["type:data-access", "type:util"] },
 - { "sourceTag": "type:util", "onlyDependOnLibsWithTags": ["type:util"] }
