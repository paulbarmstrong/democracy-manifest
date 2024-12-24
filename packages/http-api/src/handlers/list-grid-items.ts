import { OptimusDdbClient } from "optimus-ddb-client"
import { gridItemsTable } from "../utilities/Tables"
import { HttpApiEvent } from "../utilities/Http"
import { listGridItemsResponseZod, zodValidate } from "common"

export async function listGridItems(event: HttpApiEvent, optimus: OptimusDdbClient) {
	const [gridItems] = await optimus.scanItems({
		index: gridItemsTable
	})

	return zodValidate({
		data: { gridItems: gridItems.map(item => item.id) },
		schema: listGridItemsResponseZod
	})
}