import { Construct } from "constructs"
import * as cdk from "aws-cdk-lib"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs"
import * as iam from "aws-cdk-lib/aws-iam"
import * as apigw from "aws-cdk-lib/aws-apigatewayv2"
import * as apigwinteg from "aws-cdk-lib/aws-apigatewayv2-integrations"
import { AssetWithBuild, StaticWebsite } from "@paulbarmstrong/cdk-static-website-from-asset"
import { DynamicWebappConfig } from "common"

export class WebgemonyStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		const httpApiFunction = new lambda_nodejs.NodejsFunction(this, "HttpApiFunction", {
			runtime: lambda.Runtime.NODEJS_20_X,
			entry: "../http-api/src/index.ts",
		})

		const httpApi = new apigw.HttpApi(this, "HttpApi", {
			apiName: "WebgemonyHttpApi",
			corsPreflight: {
				allowHeaders: [
					"Content-Type",
					"X-Amz-Date",
					"Authorization",
					"X-Api-Key",
					"X-Amz-Security-Token"
				],
				allowMethods: [
					apigw.CorsHttpMethod.GET,
					apigw.CorsHttpMethod.POST,
					apigw.CorsHttpMethod.OPTIONS
				],
				allowOrigins: ["*"]
			}
		})
		
		httpApi.addRoutes({
			path: "/{api}",
			methods: [apigw.HttpMethod.GET, apigw.HttpMethod.POST],
			integration: new apigwinteg.HttpLambdaIntegration("HttpLambdaIntegration", httpApiFunction)
		})
		
		const websiteAsset = new AssetWithBuild(this, "WebsiteAsset", {
			path: "../webapp",
			build: (exec, outputDir) => {
				exec("npx react-scripts build --color=always", {
					env: { BUILD_PATH: outputDir },
				})
				exec(`rm -f ${outputDir}/config.json`)
			},
			deployTime: true
		})
		
		const website = new StaticWebsite(this, "Website", {
			asset: websiteAsset
		})
		const dynamicWebappConfig: DynamicWebappConfig = {
			httpApiEndpoint: httpApi.apiEndpoint
		}
		website.addObject({
			key: "config.json",
			body: JSON.stringify(dynamicWebappConfig)
		})

		new cdk.CfnOutput(this, "HttpApiEndpoint", {
			value: httpApi.apiEndpoint
		})

		new cdk.CfnOutput(this, "WebsiteUrl", {
			value: `https://${website.distribution.domainName}`
		})
	}
}