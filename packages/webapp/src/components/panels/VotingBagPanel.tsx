import { getPlayerColor, getShade } from "../../utilities/Color"
import { TOTAL_NUM_VOTING_CUBES_PER_CLASS } from "../../utilities/Constants"
import { GameState, PlayerClassName } from "../../utilities/Types"

export function VotingBagPanel(props: {
    gameState: GameState
}) {
	return <div style={{display: "flex", flexDirection: "column", padding: 20, gap: 20, backgroundColor: getShade(1)}}>
		{
			Object.entries(props.gameState.votingBag).map(entry => <div style={{display: "flex", justifyContent: "space-between", gap: 100, backgroundColor: getPlayerColor(entry[0] as PlayerClassName, 1), borderRadius: 4, overflow: "hidden", position: "relative"}}>
				<div style={{position: "absolute", top: 0, left: 0, height: "100%", width: `${100 * (entry[1]/TOTAL_NUM_VOTING_CUBES_PER_CLASS)}%`, backgroundColor: getPlayerColor(entry[0] as PlayerClassName, 0)}}/>
				<span style={{zIndex: 1, padding: 10}}>{entry[0]}:</span>
				<span style={{zIndex: 1, padding: 10}}>{entry[1]}/{TOTAL_NUM_VOTING_CUBES_PER_CLASS}</span>
			</div>)
		}
	</div>
}