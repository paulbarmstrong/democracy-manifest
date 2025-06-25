#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { DemocracyManifestStack } from "../lib/stacks/DemocracyManifestStack"
import * as dotenv from "dotenv"

dotenv.config()

const app = new cdk.App()

new DemocracyManifestStack(app, "DemocracyManifest")
