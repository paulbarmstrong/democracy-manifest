## starter-ts-fullstack-app

### About

This is a minimal example of a fully self-contained TypeScript fullstack app. It an NPM workspaces monorepo that
contains the following NPM packages:

* **cdk** - A TypeScript AWS CDK app that defines all the infrastructure for the fullstack app
* **common** - A TypeScript library package that contains code used by the other packages in the app
* **http-api** - A TypeScript AWS API gateway lambda event handler which uses DynamoDB to implement some minimal APIs
* **webapp** - A TypeScript React app defining a minimal webapp that interacts with the HTTP API

Please feel free to fork this repo and turn it into whatever you want. This repo uses the Unlicense license which means
it is released into the public domain.

### Usage

#### Prerequisites

1. AWS credentials present in your development environment
2. Node and NPM installed

#### Installation

1. `npm install -g cdk`
2. `cdk bootstrap aws://<account-id>/<region>` (replace `<account-id>` and `<region>` with your AWS account and desired
region)
3. `npm install --workspaces`

#### Build & Deployment

1. `npm run build -w common` (only necessary on first build or when editing common package)
2. `npm run start -w cdk` (this will create a CloudFormation stack in your AWS account called "Grid" containing all the
app's infrastructure)
3. The app is hosted at the `Grid.WebsiteUrl` from the output of the previous command

#### Building webapp locally

1. Add `packages/webapp/public/config.json` containing this, where `<Grid.HttpApiEndpoint>` is the `Grid.HttpApiEndpoint` output from the previous command:

```
{ "httpApiEndpoint": "<Grid.HttpApiEndpoint>" }
```
2. `npm run start -w webapp`
