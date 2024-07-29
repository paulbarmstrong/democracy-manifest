import { ShapeToType } from "shape-tape"
import { dynamicWebappConfigShape } from "./Shapes"

export type DynamicWebappConfig = ShapeToType<typeof dynamicWebappConfigShape>