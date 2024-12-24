import { useEffect, useState } from "react"
import { App } from "./App"
import { http } from "../utilities/Http"
import { DynamicWebappConfig, dynamicWebappConfigZod, listGridItemsResponseZod, zodValidate } from "common"

export function AppBeforeLoad() {
	const [config, setConfig] = useState<DynamicWebappConfig | undefined>(undefined)
	const [gridItems, setGridItems] = useState<Set<string> | undefined>(undefined)
	useEffect(() => {
		(async () => {
			setConfig(zodValidate({
				data: await http("/config.json"),
				schema: dynamicWebappConfigZod
			}))
		})()
	}, [])
	useEffect(() => {
		if (config !== undefined) {
			(async () => {
				const res = zodValidate({
					data: await http(`${config.httpApiEndpoint}/list-grid-items`),
					schema: listGridItemsResponseZod
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