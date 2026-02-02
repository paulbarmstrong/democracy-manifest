import { PropsWithChildren } from "react"

const BORDER_WIDTH = 2

export function Highlight(props: PropsWithChildren<{active: boolean, padding?: number, flex?: number}>) {
	const activeStyle = {borderStyle: "solid", borderColor: "white", borderWidth: BORDER_WIDTH, borderRadius: 4}
	return <div style={{display: "flex", padding: (props.padding ?? 0) - (props.active ? BORDER_WIDTH : 0), ...(props.active ? activeStyle : {}), flex: props.flex}}>
		{props.children}
	</div>
}