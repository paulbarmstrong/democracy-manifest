import { OptimusDdbClient } from "optimus-ddb-client"
import { ClientError, translateForHttp } from "./utilities/Http"

const optimus: OptimusDdbClient = new OptimusDdbClient()

export const handler = translateForHttp(async (event) => {
	throw new ClientError("Bad request.")
})
