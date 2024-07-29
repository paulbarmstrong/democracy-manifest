import { s } from "shape-tape"

export const dynamicWebappConfigShape = s.object({
	httpApiEndpoint: s.string()
})
