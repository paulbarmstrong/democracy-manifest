#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { WebgemonyStack } from "../lib/stacks/WebgemonyStack"

const app = new cdk.App()

new WebgemonyStack(app, "Webgemony")
