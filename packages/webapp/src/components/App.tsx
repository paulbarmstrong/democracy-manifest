import { BACKGROUND_SHADE_T1 } from "../utilities/Constants"
import { useWindowSize } from "../hooks/useWindowSize"
import { DynamicWebappConfig } from "common"

interface Props {
	config: DynamicWebappConfig,
}

export function App(props: Props) {
	useWindowSize()

	return <div>
		<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
			fontSize: Math.min(window.innerWidth, window.innerHeight)/6, color: BACKGROUND_SHADE_T1,
			opacity: 0.5, userSelect: "none"}}>Democracy Manifest</div>
	</div>
}