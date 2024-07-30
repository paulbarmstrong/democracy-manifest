import { OptimusDdbClient } from "optimus-ddb-client"
import { validateDataShape } from "shape-tape"
import { ClientError, HttpApiEvent } from "../utilities/Http"
import { GridItem, gridItemShape } from "common"
import { gridItemsTable } from "../utilities/Tables"

export async function deleteGridItem(event: HttpApiEvent, optimus: OptimusDdbClient) {
	const body = validateDataShape({
		data: event.body,
		shape: gridItemShape,
		shapeValidationErrorOverride: e => new ClientError(e.message)
	})

	const gridItem: GridItem | undefined = await optimus.getItem({
		table: gridItemsTable,
		key: { id: body.id },
		itemNotFoundErrorOverride: _ => undefined
	})

	// if the item already didn't exist that's fine
	if (gridItem !== undefined) {
		optimus.markItemForDeletion({ item: gridItem })
		await optimus.commitItems({ items: [gridItem] })
	}

	return {}
}