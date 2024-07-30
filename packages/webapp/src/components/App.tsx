import { MouseEvent, useState } from "react"
import { BACKGROUND_SHADE_T1, GRID_ITEM_SIZE_PX } from "../utilities/Constants"
import { DynamicWebappConfig } from "common"
import { http } from "../utilities/Http"

interface Props {
	config: DynamicWebappConfig,
	initialGridItems: Set<string>
}

export function App(props: Props) {
	const numRows = Math.floor(window.innerHeight / GRID_ITEM_SIZE_PX)
	const numColumns = Math.floor(window.innerWidth / GRID_ITEM_SIZE_PX)
	const [gridItems, setGridItems] = useState<Set<string>>(props.initialGridItems)

	function onGridMouseDown(event: MouseEvent<HTMLDivElement>) {
		const actualGridItemWidth = window.innerWidth / numColumns
		const actualGridItemHeight = window.innerHeight / numRows

		const x = Math.ceil(event.clientX / actualGridItemWidth)
		const y = Math.ceil(event.clientY / actualGridItemHeight)
		const newGridItems = new Set(gridItems)
		if (!gridItems.has(`${x},${y}`)) {
			newGridItems.add(`${x},${y}`)
			http(`${props.config.httpApiEndpoint}/create-grid-item`, {
				method: "POST",
				body: JSON.stringify({ id: `${x},${y}` })
			})
		} else {
			newGridItems.delete(`${x},${y}`)
			http(`${props.config.httpApiEndpoint}/delete-grid-item`, {
				method: "POST",
				body: JSON.stringify({ id: `${x},${y}` })
			})
		}
		setGridItems(newGridItems)
	}

	return <div>
		<div style={{position: "absolute", display: "grid", width: "100%", height: "100%", zIndex: 1,
			gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
			gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`
		}} onMouseDown={onGridMouseDown} onContextMenu={e => e.preventDefault()}>
			{
				Array.from(gridItems).map(gridItem => {
					const [x, y] = gridItem.split(",")
					return <div key={gridItem} style={{gridColumn: x, gridRow: y, backgroundColor: BACKGROUND_SHADE_T1, borderRadius: 4}}></div>
				})
			}
		</div>
		<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 500,
			color: BACKGROUND_SHADE_T1, opacity: 0.5, userSelect: "none"}}>GRID</div>
	</div>
}