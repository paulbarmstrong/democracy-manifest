#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { WebgemonyStack } from "../lib/stacks/WebgemonyStack"
import * as dotenv from "dotenv"

dotenv.config()

const app = new cdk.App()

new WebgemonyStack(app, "Webgemony")
