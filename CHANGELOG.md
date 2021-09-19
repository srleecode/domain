# Change Log

All notable changes to the "domain" project will be documented in this file.
Major and minor versions follow the nrwl dependency versions. 
Updates to this library will increment the patch version/

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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
- Rewrite of whole library for @nrwl/devkit, i.e. rewriting schematics as generators
- Removed domain-config.json. Default library options will be run from extension preferences instead of saving the options when domain is created.
- Removed the add e2e and add storybook options from create generator as there was an issue in devkit where the project configuration updates weren't available when the cypress project generator was internally called in create domain. 