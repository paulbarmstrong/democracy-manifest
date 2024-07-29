import { ShapeToType } from "shape-tape"
import { dynamicWebappConfigShape, gridItemShape } from "./Shapes"

export type Json = undefined | null | string | number | boolean | Array<Json> | JsonObject

export type JsonObject = {
	[name: string]: Json
}

export type GridItem = ShapeToType<typeof gridItemShape>

export type DynamicWebappConfig = ShapeToType<typeof dynamicWebappConfigShape>