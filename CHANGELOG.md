# Change Log

All notable changes to the "domain" project will be documented in this file.
Major and minor versions follow the Angular/nrwl dependency versions. 
Updates to this library will increment the patch version/

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [11.4.0] 
### Changed
- Rewrite of whole library for @nrwl/devkit, i.e. rewriting schematics as generators
- Removed domain-config.json. Default library options will be run from extension preferences instead of saving the options when domain is created.
- Removed the add e2e and add storybook options from create generator as there was an issue in devkit where the project configuration updates weren't available when the cypress project generator was internally called in create domain. 