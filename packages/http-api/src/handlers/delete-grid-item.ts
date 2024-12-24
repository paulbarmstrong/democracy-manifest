import { OptimusDdbClient } from "optimus-ddb-client"
import { ClientError, HttpApiEvent } from "../utilities/Http"
import { GridItem, gridItemZod, zodValidate } from "common"
import { gridItemsTable } from "../utilities/Tables"

export async function deleteGridItem(event: HttpApiEvent, optimus: OptimusDdbClient) {
	const body = zodValidate({
		data: event.body,
		schema: gridItemZod,
		errorMapping: e => new ClientError(e.message)
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