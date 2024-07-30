import { OptimisticLockError, OptimusDdbClient } from "optimus-ddb-client"
import { validateDataShape } from "shape-tape"
import { ClientError, HttpApiEvent } from "../utilities/Http"
import { GridItem, gridItemShape } from "common"
import { gridItemsTable } from "../utilities/Tables"

export async function createGridItem(event: HttpApiEvent, optimus: OptimusDdbClient) {
	const body = validateDataShape({
		data: event.body,
		shape: gridItemShape,
		shapeValidationErrorOverride: e => new ClientError(e.message)
	})

	const gridItem: GridItem = optimus.draftItem({
		table: gridItemsTable,
		item: { id: body.id }
	})

	try {
		await optimus.commitItems({ items: [gridItem] })
	} catch (error) {
		// if the item was already there that's fine
		if (!(error instanceof OptimisticLockError)) throw error
	}

	return {}
}