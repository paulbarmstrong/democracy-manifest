import { getPlayerColor, getShade } from "../../utilities/Color"
import { POLICIES, TOTAL_NUM_VOTING_CUBES_PER_CLASS } from "../../utilities/Constants"
import { ActionExecution, GameState, PlayerClassName } from "../../utilities/Types"
import { Details } from "../Details"
import { PolicyPanel } from "./PolicyPanel"

export function PoliticsPanel(props: {
	playerClassName: PlayerClassName
	gameState: GameState,
	setGameState: (newGameState: GameState) => void,
	actionExecution: ActionExecution | undefined
}) {

	return <div style={{backgroundColor: getShade(1), padding: 10}}>
		<Details details={[
			{name: "Policies", content: <div style={{display: "flex", flexWrap: "wrap", gap: 20}}>{
				POLICIES.map(policy => <PolicyPanel playerClassName={props.playerClassName} gameState={props.gameState} setGameState={props.setGameState} actionExecution={props.actionExecution} policy={policy}/>)
			}</div>},
			{name: "Political Pressure", content: <div style={{display: "flex", flexDirection: "column", gap: 10, backgroundColor: getShade(1)}}>
				{
					Object.entries(props.gameState.politicalPressure).map(entry => <div style={{display: "flex", justifyContent: "space-between", gap: 100, backgroundColor: getPlayerColor(entry[0] as PlayerClassName, 1), borderRadius: 4, overflow: "hidden", position: "relative"}}>
						<div style={{position: "absolute", top: 0, left: 0, height: "100%", width: `${100 * (entry[1]/TOTAL_NUM_VOTING_CUBES_PER_CLASS)}%`, backgroundColor: getPlayerColor(entry[0] as PlayerClassName, 0)}}/>
						<span style={{zIndex: 1, padding: 10}}>{entry[0]}:</span>
						<span style={{zIndex: 1, padding: 10}}>{entry[1]}/{TOTAL_NUM_VOTING_CUBES_PER_CLASS}</span>
					</div>)
				}
			</div>}
		]}/>
	</div>
}