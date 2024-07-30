import { OptimusDdbClient } from "optimus-ddb-client"
import { gridItemsTable } from "../utilities/Tables"
import { HttpApiEvent } from "../utilities/Http"
import { validateDataShape } from "shape-tape"
import { listGridItemsResponseShape } from "common"

export async function listGridItems(event: HttpApiEvent, optimus: OptimusDdbClient) {
	const [gridItems] = await optimus.scanItems({
		index: gridItemsTable
	})

	return validateDataShape({
		data: { gridItems: gridItems.map(item => item.id) },
		shape: listGridItemsResponseShape
	})
}