# Open Targets Apps

This repository holds the Open Targets web applications.

## Required stack

- [NodeJS >= v14](https://nodejs.org/en/)
- [Yarn package manager](https://yarnpkg.com/)

## Running development

This project contains the [Platform](https://platform.opentargets.org/) and [Genetics](https://genetics.opentargets.org/) web applications. To run both in development mode, you can run: `yarn dev` in the root directory.

To run only Platform `yarn dev:platfrom`

To run only Genetics `yarn dev:genetics`

## Building production-ready bundle

From the root directory run: `yarn build`. This will generate on each application a production-ready bundle.

As same as development, you can run `yarn build:platform` or `yarn build:genetics` to scope the build only for one of the applications.

## Copyright 

Copyright 2014-2018 Biogen, Celgene Corporation, EMBL - European Bioinformatics Institute, GlaxoSmithKline, Takeda Pharmaceutical Company and Wellcome Sanger Institute

This software was developed as part of the Open Targets project. For more information please see: http://www.opentargets.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
