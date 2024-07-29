import { s } from "shape-tape"

export const gridItemIdShape = s.string({ pattern: /^[0-9]+,[0-9]+$/ })

export const gridItemShape = s.object({
	id: gridItemIdShape
})

export const listGridItemsBodyShape = s.object({
	nextToken: s.optional(s.string())
})

export const listGridItemsResponseShape = s.object({
	gridItems: s.array(gridItemIdShape)
})

export const dynamicWebappConfigShape = s.object({
	httpApiEndpoint: s.string()
})
