import { useEffect, useState } from "react"
import { App } from "./App"
import { http } from "../utilities/Http"
import { DynamicWebappConfig, dynamicWebappConfigZod, zodValidate } from "common"

export function AppBeforeLoad() {
	const [config, setConfig] = useState<DynamicWebappConfig | undefined>(undefined)
	useEffect(() => {
		(async () => {
			setConfig(zodValidate({
				data: await http("/config.json"),
				schema: dynamicWebappConfigZod
			}))
		})()
	}, [])

	if (config !== undefined) {
		return <App config={config}/>
	} else {
		return null
	}
}