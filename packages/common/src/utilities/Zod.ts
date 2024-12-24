import * as z from "zod"

export const gridItemIdZod = z.string().regex(/^[0-9]+,[0-9]+$/)

export const gridItemZod = z.strictObject({
	id: gridItemIdZod
})

export const listGridItemsBodyZod = z.strictObject({
	nextToken: z.optional(z.string())
})

export const listGridItemsResponseZod = z.strictObject({
	gridItems: z.array(gridItemIdZod)
})

export const dynamicWebappConfigZod = z.strictObject({
	httpApiEndpoint: z.string()
})

export function zodValidate<T extends z.ZodTypeAny>(params: {
	schema: T,
	data: any,
	errorMapping?: (e: z.ZodError) => Error
}): z.infer<T> {
	try {
		params.schema.parse(params.data)
		return params.data
	} catch (error) {
		if (error instanceof z.ZodError && params.errorMapping !== undefined) {
			throw params.errorMapping(error)
		} else {
			throw error
		}
	}
}
