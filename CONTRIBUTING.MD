# Contributing to @srleecode/domain

We would love for you to contribute to @srleecode/domain! Read this document to see how to do it.

## Got a Question?

If you have general questions about this project or want to discuss issues you are facing or potential ideas to improve the project you can add messages to the [gitter chat](https://gitter.im/srleecode/domain). 

## Found an Issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by [submitting an issue](https://github.com/srleecode/domain/blob/master/CONTRIBUTING.md#submit-issue) to [our GitHub Repository](https://github.com/srleecode/domain). Even better, you can [submit a Pull Request](https://github.com/srleecode/domain/blob/master/CONTRIBUTING.md#submit-pr) with a fix.

## Project Structure

Source code and documentation are included in the top-level folders listed below.

- `e2e` - E2E tests.
- `packages` - Source code for the generators included in this project
  - component - creates a component
  - create - creates a domain
  - cypress-project - adds either an e2e or storybook cypress project to the domain
  - libraries - adds one or more of the following library types (data-access, feature, shell, ui, util) to a domain. A library can only be added if it doesn't already exist in the domain
  - move - moves a domain, i.e. updates the scope tags, renames the domains grouping folder, moves all the libraries in the domain and moves any related cypress projects
  - private-api - adds an index file (private-api.ts) so that you can import content between libraries inside a domain and not outside of it
  - remove - removes a domain, i.e. removes the domain grouping folder, all the domain libraries and any related cypress projects
  - remove-cypress-project - removes either an e2e or storybook cypress project from the domain
  - remove-libraries - removes a library from an existing domain. If this will remove the last library in the domain, the domain will be removed
  - shared - shared functionality used by multiple generators 
- `tmp` - Folder used by e2e tests. If you are a WebStorm user, make sure to mark this folder as excluded.

## Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem may already exist and has been resolved, or the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. Having a reproducible scenario gives us wealth of important information without going back and forth with you requiring additional information, such as:

- `yarn.lock` or `package-lock.json`
- and most importantly - a use-case that fails

A minimal reproduction allows us to quickly confirm a bug (or point out coding problem) as well as confirm that we are fixing the right problem.

We will be insisting on a minimal reproduction in order to save maintainers time and ultimately be able to fix more bugs. Interestingly, from our experience, users often find coding problems themselves while preparing a minimal repository. We understand that sometimes it might be hard to extract essentials bits of code from a larger code-base but we really need to isolate the problem before we can fix it.

You can file new issues by filling out our [issue form](https://github.com/nrwl/nx/issues/new).

### <a name="submit-pr"></a> Submitting a PR

Please follow the following guidelines:

- Make sure unit tests pass (`npm run test`)
- Make sure lint passes (`npm run lint`)
- Make sure the e2e tests pass (`npm run e2e`)