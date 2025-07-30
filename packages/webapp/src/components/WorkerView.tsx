import { getWorkerColor } from "../utilities/Color"
import { Worker } from "../utilities/Types"

export function WorkerView(props: {worker: Worker}) {
	return <div style={{position: "relative"}}>
		{
			props.worker.class !== "Machine" ? (
				<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 30, height: 30, backgroundColor: getWorkerColor(props.worker), borderRadius: props.worker.class === "Working Class" ? "50%" : 4, borderWidth: 2, borderColor: "white", borderStyle: "solid"}}/>
			) : (
				undefined
			)
		}
		{
			props.worker.committed ? (
				<span className="material-symbols-outlined" style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white"}}>handshake</span>
			) : (
				undefined
			)
		}
	</div>
}