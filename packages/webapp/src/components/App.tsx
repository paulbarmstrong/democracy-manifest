import { BACKGROUND_SHADE_T1 } from "../utilities/Constants"
import { useWindowSize } from "../hooks/useWindowSize"

export function App() {
	useWindowSize()

	return <div>
		<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
			fontSize: Math.min(window.innerWidth, window.innerHeight)/6, color: BACKGROUND_SHADE_T1,
			opacity: 0.5, userSelect: "none"}}>Webgemony</div>
	</div>
}