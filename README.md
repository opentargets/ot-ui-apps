# Open Targets Apps

This repository holds the Open Targets web applications.

Platform netlify preview

[![Netlify Status](https://api.netlify.com/api/v1/badges/0170074c-4d8d-4882-90e5-775a4222dc6c/deploy-status)](https://app.netlify.com/sites/ot-platform/deploys)

Genetics netlify preview

[![Netlify Status](https://api.netlify.com/api/v1/badges/e00eea73-d8b7-4f88-9d16-7265144b54e1/deploy-status)](https://app.netlify.com/sites/ot-genetics/deploys)

## Building and using a Docker image

A Docker image hosting either the Open Targets Platform or Open Targets Genetics web application can be built using the following command:

```sh
docker build --tag {name:tag} --build-arg app={platform,genetics}
```

The `app` variable can be set to either `platform` or `genetics`, depending on which application should be built.

Once the image is built, the application can be hosted as such:

```sh
docker run -it --rm -p 80:80 {name:tag}
```

The application is then locally accessible in the browser at: <http://localhost:80>

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
