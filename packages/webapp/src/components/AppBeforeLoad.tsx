import { useEffect, useState } from "react"
import { App } from "./App"
import { http } from "../utilities/Http"
import { DynamicWebappConfig, dynamicWebappConfigShape, listGridItemsResponseShape } from "common"
import { validateDataShape } from "shape-tape"

export function AppBeforeLoad() {
	const [config, setConfig] = useState<DynamicWebappConfig | undefined>(undefined)
	const [gridItems, setGridItems] = useState<Set<string> | undefined>(undefined)
	useEffect(() => {
		(async () => {
			setConfig(validateDataShape({
				data: await http("/config.json"),
				shape: dynamicWebappConfigShape
			}))
		})()
	}, [])
	useEffect(() => {
		if (config !== undefined) {
			(async () => {
				const res = validateDataShape({
					data: await http(`${config.httpApiEndpoint}/list-grid-items`),
					shape: listGridItemsResponseShape
				})
				setGridItems(new Set(res.gridItems))
			})()
		}
	}, [config])

	if (config !== undefined && gridItems !== undefined) {
		return <App config={config} initialGridItems={gridItems}/>
	} else {
		return null
	}
}