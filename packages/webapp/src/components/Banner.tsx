import { getPlayerColor, getShade } from "../utilities/Color"
import { getTurn } from "../utilities/Game"
import { GameState } from "../utilities/Types"
import { Highlight } from "./Highlight"
import { useRefState } from "../hooks/useRefState"

export function Banner(props: {
	gameState: GameState
}) {
	const turn = getTurn(props.gameState)
	const chatOpen = useRefState<boolean>(false)

	return <div style={{display: "flex", flexDirection: "column", gap: 2}}>
		<div style={{fontSize: "xx-large", textAlign: "center"}}>Democracy Manifest</div>
		<div style={{textAlign: "center"}}>Round {turn.roundNumber}, Turn {turn.turnNumber}</div>
		<div style={{display: "flex", justifyContent: "space-between", alignItems: "stretch", paddingBottom: 5}}>
			<div style={{display: "flex", alignItems: "stretch", gap: 5}}>
				{
					props.gameState.classes.filter(clazz => clazz.playerName !== undefined).map(clazz => <Highlight active={turn.turnPlayerClassName === clazz.className}>
						<div style={{display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 4, backgroundColor: getPlayerColor(clazz.className, 0)}}>
							{clazz.playerName}
						</div>
					</Highlight>)
				}
			</div>
			<span className="material-symbols-outlined" style={{
				padding: 10, fontVariationSettings: chatOpen.current ? "'FILL' 1" : undefined, backgroundColor: getShade(1), borderRadius: "50%"
			}}>chat</span>
		</div>
	</div>
}