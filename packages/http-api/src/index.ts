import { OptimusDdbClient } from "optimus-ddb-client"
import { createGridItem } from "./handlers/create-grid-item"
import { deleteGridItem } from "./handlers/delete-grid-item"
import { ClientError, translateForHttp } from "./utilities/Http"
import { listGridItems } from "./handlers/list-grid-items"

const optimus: OptimusDdbClient = new OptimusDdbClient()

export const handler = translateForHttp(async (event) => {
	if (event.path === "/create-grid-item") return await createGridItem(event, optimus)
	if (event.path === "/delete-grid-item") return await deleteGridItem(event, optimus)
	if (event.path === "/list-grid-items") return await listGridItems(event, optimus)
	throw new ClientError("Bad request.")
})
