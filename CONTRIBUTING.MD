# Contributing to @srleecode/domain

We would love for you to contribute to @srleecode/domain! Read this document to see how to do it.

## Got a Question?

If you have general questions about this project or want to discuss issues you are facing or potential ideas to improve the project you can add messages to the [gitter chat](https://gitter.im/srleecode/domain). 

## Found an Issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by [submitting an issue](https://github.com/srleecode/domain/blob/master/CONTRIBUTING.md#submit-issue) to [our GitHub Repository](https://github.com/srleecode/domain). Even better, you can [submit a Pull Request](https://github.com/srleecode/domain/blob/master/CONTRIBUTING.md#submit-pr) with a fix.

## Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem may already exist and has been resolved, or the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. Having a reproducible scenario gives us wealth of important information without going back and forth with you requiring additional information, such as:

- `yarn.lock` or `package-lock.json`
- and most importantly - a use-case that fails

A minimal reproduction allows us to quickly confirm a bug (or point out coding problem) as well as confirm that we are fixing the right problem.

We will be insisting on a minimal reproduction in order to save maintainers time and ultimately be able to fix more bugs. Interestingly, from our experience, users often find coding problems themselves while preparing a minimal repository. We understand that sometimes it might be hard to extract essentials bits of code from a larger code-base but we really need to isolate the problem before we can fix it.

You can file new issues by filling out our [issue form](https://github.com/srleecode/domain/issues/new).

### <a name="submit-pr"></a> Submitting a PR

```sh
npm install

# Make sure that the below are passing
npm run affected:test
npm run  affected:lint
npm run  e2e
```

#### Commit Message Guidelines

The commit message should follow the following format:

```
type(scope): subject
BLANK LINE
body
```

##### Type

The type must be one of the following:

- feat - New or improved behavior being introduced (e.g. Updating to new versions of React or Jest which bring in new features)
- fix - Fixes the current unexpected behavior to match expected behavior (e.g. Fixing the library generator to create the proper named project)
- cleanup - Code Style changes that have little to no effect on the user (e.g. Refactoring some functions into a different file)
- docs - Changes to the documentation (e.g. Adding more details into the getting started guide)
- chore - Changes that have absolutely no effect on users (e.g. Updating the version of Nx used to build the repo)

##### Scope

The scope must be one of the following:

- cypress - anything related to the cypress generators
- front-end - anything related to the front-end generators
- grouping-folder - anything related to the grouping-folder generators
- init - anything related to the init generators
- mock-file - anything related to the mock-file generators
- shared - anything related to the utlities used across all the types of generators
- repo - anything related to managing the repo itself
- misc - misc stuff

##### Subject and Body

The subject must contain a description of the change, and the body of the message contains any additional details to provide more context about the change.

Including the issue number that the PR relates to also helps with tracking.

#### Example

```
feat(front-end): add an option to generate lazy-loadable modules

Updates the generateed libraries to allow the option to include --lazy `nx generate lib mylib --lazy`

Closes #157
```