import { useEffect, useState } from "react"
import { App } from "./App"
import { DynamicWebappConfig } from "../utilities/Types"
import { http } from "../utilities/Http"

export function AppBeforeConfig() {
	const [config, setConfig] = useState<DynamicWebappConfig | undefined>()
	useEffect(() => {
		(async () => setConfig(await http("/config.json")))()
	}, [])

	if (config !== undefined) {
		return <App config={config}/>
	} else {
		return null
	}
}