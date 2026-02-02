import { Construct } from "constructs"
import * as cdk from "aws-cdk-lib"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigw from "aws-cdk-lib/aws-apigatewayv2"
import * as apigwinteg from "aws-cdk-lib/aws-apigatewayv2-integrations"
import * as route53 from "aws-cdk-lib/aws-route53"
import * as acm from "aws-cdk-lib/aws-certificatemanager"
import * as route53_targets from "aws-cdk-lib/aws-route53-targets"
import { AssetWithBuild, StaticWebsite } from "@paulbarmstrong/cdk-static-website-from-asset"
import { DynamicWebappConfig } from "common"

export class DemocracyManifestStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		const HOSTED_ZONE_ID: string | undefined = process.env.HOSTED_ZONE_ID
		const HOSTED_ZONE_NAME: string | undefined = process.env.HOSTED_ZONE_NAME
		const DEMOCRACY_MANIFEST_DOMAIN: string | undefined = process.env.DEMOCRACY_MANIFEST_DOMAIN

		const hostedZone: route53.IHostedZone | undefined = HOSTED_ZONE_ID !== undefined ? (
			route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
				hostedZoneId: HOSTED_ZONE_ID!,
				zoneName: HOSTED_ZONE_NAME!
			})
		) : (
			undefined
		)

		const httpApiFunction = new lambda_nodejs.NodejsFunction(this, "HttpApiFunction", {
			runtime: lambda.Runtime.NODEJS_24_X,
			entry: "../http-api/src/index.ts",
		})

		const httpApiCert: acm.Certificate | undefined = hostedZone !== undefined ? (
			new acm.Certificate(this, "HttpApiCert", {
				validation: acm.CertificateValidation.fromDns(hostedZone),
				domainName: `api.${DEMOCRACY_MANIFEST_DOMAIN!}`
			})
		) : (
			undefined
		)

		const httpApiDomainName: apigw.DomainName | undefined = httpApiCert !== undefined ? (
			new apigw.DomainName(this, "HttpApiDomainName", {
				domainName: `api.${DEMOCRACY_MANIFEST_DOMAIN!}`,
				certificate: httpApiCert
			})
		) : (
			undefined
		)

		const httpApi = new apigw.HttpApi(this, "HttpApi", {
			apiName: "DemocracyManifestHttpApi",
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
			},
			defaultDomainMapping: httpApiDomainName !== undefined ? { domainName: httpApiDomainName } : undefined,
		})

		if (httpApiDomainName !== undefined) {
			const httpApiARecord = new route53.ARecord(this, "HttpApiARecord", {
				zone: hostedZone!,
				recordName: `api.${DEMOCRACY_MANIFEST_DOMAIN!}`,
				target: route53.RecordTarget.fromAlias(new route53_targets.ApiGatewayv2DomainProperties(
					httpApiDomainName.regionalDomainName, httpApiDomainName.regionalHostedZoneId))
			})
		}
		
		httpApi.addRoutes({
			path: "/{api}",
			methods: [apigw.HttpMethod.GET, apigw.HttpMethod.POST],
			integration: new apigwinteg.HttpLambdaIntegration("HttpLambdaIntegration", httpApiFunction)
		})
		
		const websiteAsset = new AssetWithBuild(this, "WebsiteAsset", {
			path: "../webapp",
			build: (exec, outputDir) => {
				exec("npm run build", {
					env: { BUILD_PATH: outputDir }
				})
				exec(`rm -f ${outputDir}/config.json`)
			},
			deployTime: true
		})
		
		const website = new StaticWebsite(this, "Website", {
			asset: websiteAsset,
			domains: hostedZone !== undefined ? [{domainName: DEMOCRACY_MANIFEST_DOMAIN!, hostedZone}] : []
		})

		const httpApiEndpoint: string = hostedZone !== undefined ? `https://api.${DEMOCRACY_MANIFEST_DOMAIN}` : httpApi.apiEndpoint

		const dynamicWebappConfig: DynamicWebappConfig = {
			httpApiEndpoint
		}
		website.addObject({
			key: "config.json",
			body: JSON.stringify(dynamicWebappConfig)
		})

		new cdk.CfnOutput(this, "HttpApiEndpoint", {
			value: httpApiEndpoint
		})

		new cdk.CfnOutput(this, "WebsiteUrl", {
			value: `https://${website.distribution.domainName}`
		})
	}
}