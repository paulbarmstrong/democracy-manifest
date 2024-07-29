import { gridItemShape } from "common"
import { Table } from "optimus-ddb-client"

export const gridItemsTable = new Table({
	tableName: "GridItems",
	itemShape: gridItemShape,
	partitionKey: "id"
})
