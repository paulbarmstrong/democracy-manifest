import { gridItemZod } from "common"
import { Table } from "optimus-ddb-client"

export const gridItemsTable = new Table({
	tableName: "GridItems",
	itemSchema: gridItemZod,
	partitionKey: "id"
})
