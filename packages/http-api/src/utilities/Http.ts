import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda"
import { Json } from "common"

const headers = {
	"Access-Control-Allow-Headers" : "Content-Type",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST"
}

function messageHttpResponse(message: string, statusCode: number): APIGatewayProxyResult {
	return jsonHttpResponse({ message: message }, statusCode)
}

function jsonHttpResponse(jsonObject: Json, statusCode: number): APIGatewayProxyResult {
	return {
		statusCode: statusCode,
		body: JSON.stringify(jsonObject),
		headers: headers,
	}
}

export function translateForHttp(handleEvent: (event: HttpApiEvent) => Promise<Json>): (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResult> {
	return async (apiGwEvent: APIGatewayProxyEventV2) => {
		const body: Json = parseJsonAndSwallowError(apiGwEvent.body!)
		let response: APIGatewayProxyResult | undefined = undefined
		try {
			const httpApiEvent: HttpApiEvent = {
				requestId: apiGwEvent.requestContext.requestId,
				path: apiGwEvent.rawPath,
				body: body,
				method: (apiGwEvent as any).httpMethod,
				headers: apiGwEvent.headers
			}
			response = jsonHttpResponse(await handleEvent(httpApiEvent), 200)
		} catch (error) {
			if (error instanceof ClientError) {
				response = messageHttpResponse(error.message, error.statusCode)
			} else {
				console.error(`${apiGwEvent.requestContext.requestId} | Unhandled error: ${(error as Error).stack}`)
				response = messageHttpResponse("Internal Server Error.", 500)
			}
		}
		console.log(`${apiGwEvent.requestContext.requestId} | Request ended: ${JSON.stringify({
			path: apiGwEvent.rawPath,
			body: body,
			response: {
				body: response.body,
				statusCode: response.statusCode
			}
		})}`)
		return response
	}
}

function parseJsonAndSwallowError(jsonString: string): Json {
	try {
		return JSON.parse(jsonString)
	} catch (error) {
		return undefined
	}
}

export class ClientError extends Error {
	name = "ClientError"
	statusCode: number
	constructor(message: string, statusCode: number = 400) {
		super(message)
		this.statusCode = statusCode
	}
}

export type HttpApiEvent = {
	requestId: string,
	path: string,
	body: Json,
	method: string,
	headers: {
		[name: string]: string | undefined
	}
}