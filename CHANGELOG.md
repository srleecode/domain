# Changelog

## [13.10.10]

## Changed

- added addStory to schemato allow skipping the generation of the stories file

## [13.10.9]

## Changed

- updated component and directive generators to write to the presentation layer library instead of creating a seperate library for each component/directive

## [13.4.1](https://github.com/srleecode/domain/compare/13.3.4...13.4.1) (2021-12-27)

## [13.3.4](https://github.com/srleecode/domain/compare/13.2.4...13.3.4) (2021-12-15)

## [13.2.4](https://github.com/srleecode/domain/compare/13.2.3...13.2.4) (2021-12-09)

# [13.2.3](https://github.com/srleecode/domain/compare/13.1.3...13.2.3) (2021-11-28)

### Bug Fixes

- allow Yarn v3 to do Nx e2e ([42cdbb8](https://github.com/srleecode/domain/commit/42cdbb8345980fee8bb5c8a52603acec3db5f42f))
- respect Angular v13 exports in package.json ([fb8307a](https://github.com/srleecode/domain/commit/fb8307a44d0f2b7eb5b2f5d79d1237d2fe9d3905))
- sort packages ([4760906](https://github.com/srleecode/domain/commit/47609067644001d01647f66492f37bf3a7844f96))
- update package.json e2e definitions ([6285278](https://github.com/srleecode/domain/commit/6285278d00e874297ae62e9c399dcdc1378ba9e9))
- work in progress with getting Yarn v3 e2e to work ([5573c2a](https://github.com/srleecode/domain/commit/5573c2ac4263a3246449ae25d99e34a435285f19))

### Features

- implement @nrwl/nx-cloud ([f7db497](https://github.com/srleecode/domain/commit/f7db497bdfa787cdaf76e3e808e882546e783a4e))
- introduce @jscutlery/semver and git hooks ([b4ac41a](https://github.com/srleecode/domain/commit/b4ac41a08ddb8b20d69553532d0a71fd13cc5619))
- nx 13.2.2 without Yarn v3 ([3a9e47d](https://github.com/srleecode/domain/commit/3a9e47d638d343e427a79a4a9954a3b910b59d18))
- switch to Yarn v3 as the package manager default ([0e9edde](https://github.com/srleecode/domain/commit/0e9edde9faea485d5702f2a64fbf426c58679221))
- upgrade to Nx 13.2.3 ([90cd620](https://github.com/srleecode/domain/commit/90cd620a6db416a190775fd6df51842f893e47ef))

## [13.1.3]

## Changed

- updated to 13.1.3 nrwl dependencies

## [13.1.1]

## Changed

- updated to 13.1.1 nrwl dependencies

## [12.9.1]

## Changed

- Added HttpMockModule to angular app grouping folder init

## [12.9.0]

### Changed

- updated to 12.9.0 nrwl dependencies
- Major rewrite to:
  - implement tooling for cypress component testing using https://github.com/jscutlery/test-utils
  - seperate the generators into different libraries to allow the affected commands to work. This opens up the option of adding generators for other types of languages other than Angular
  - simplify and improve the generators

## [12.6.3]

### Changed

- updated to 12.6.3 nrwl dependencies
- moved to project json format to allow affected commands for each generator

## [12.6.2]

### Changed

- updated to 12.6.2 nrwl dependencies

## [12.5.1]

### Changed

- updated to 12.5.1 nrwl dependencies

## [12.3.0]

### Changed

- updated to 12.3 nrwl dependencies

## [11.5.2]

### Fixed

- removed scope tag from implicitDependencies

## [11.5.1]

### Fixed

- issue with storybook project target updates not being applied
- issue with E2E project not being removed

## [11.5.0]

### Changed

- [#15 - Add reference updates when moving domains](https://github.com/srleecode/domain/issues/15)

## [11.4.0]

### Changed

- Rewrite of whole library for @nx/devkit, i.e. rewriting schematics as generators
- Removed domain-config.json. Default library options will be run from extension preferences instead of saving the options when domain is created.
- Removed the add e2e and add storybook options from create generator as there was an issue in devkit where the project configuration updates weren't available when the cypress project generator was internally called in create domain.
