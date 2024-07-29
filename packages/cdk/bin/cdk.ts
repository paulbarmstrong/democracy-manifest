#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { GridStack } from "../lib/stacks/GridStack"

const app = new cdk.App()

new GridStack(app, "Grid")
