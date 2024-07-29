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

export class GridStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		const gridItemsTable = new dynamodb.Table(this, "GridItemsTable", {
			tableName: "GridItems",
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
			sortKey: { name: "id", type: dynamodb.AttributeType.STRING }
		})

		const httpApiFunction = new lambda_nodejs.NodejsFunction(this, "HttpApiFunction", {
			runtime: lambda.Runtime.NODEJS_20_X,
			entry: "../http-api/src/index.ts",
		})
		httpApiFunction.addToRolePolicy(new iam.PolicyStatement({
			actions: [
				"dynamodb:GetItem",
				"dynamodb:DeleteItem",
				"dynamodb:PutItem",
				"dynamodb:Scan",
				"dynamodb:Query",
				"dynamodb:UpdateItem",
				"dynamodb:BatchWriteItem",
				"dynamodb:BatchGetItem",
				"dynamodb:DescribeTable",
				"dynamodb:ConditionCheckItem"
			],
			resources: [gridItemsTable.tableArn, `${gridItemsTable.tableArn}/*`]
		}))

		const httpApi = new apigw.HttpApi(this, "HttpApi", {
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
				exec(`rm ${outputDir}/config.json`)
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
	}
}