import { getPlayerColor, getShade } from "../../utilities/Color"
import { MAX_POLITICAL_PRESSURE_PER_CLASS, PLAYER_CLASSES, POLICIES } from "../../utilities/Constants"
import { ActionExecution, GameState, PlayerClassName } from "../../utilities/Types"
import { Details } from "../Details"
import { PolicyPanel } from "./PolicyPanel"

export function PoliticsPanel(props: {
	playerClassName: PlayerClassName
	gameState: GameState,
	updateGameState: () => void,
	actionExecution: ActionExecution | undefined
}) {

	return <div style={{backgroundColor: getShade(1), padding: 10}}>
		<Details details={[
			{name: "Policies", content: <div style={{display: "flex", flexWrap: "wrap", gap: 20}}>{
				POLICIES.map(policy => <PolicyPanel playerClassName={props.playerClassName} gameState={props.gameState} updateGameState={props.updateGameState} actionExecution={props.actionExecution} policy={policy}/>)
			}</div>},
			{name: "Political Pressure", content: <div style={{display: "flex", flexDirection: "column", gap: 10, backgroundColor: getShade(1)}}>
				{
					PLAYER_CLASSES.filter(playerClass => playerClass.name !== "State").map(playerClass => {
						const numPoliticalPressure = props.gameState.politicalPressure.filter(x => x === playerClass.name).length
						return <div style={{display: "flex", justifyContent: "space-between", gap: 100, backgroundColor: getPlayerColor(playerClass.name, 1), borderRadius: 4, overflow: "hidden", position: "relative"}}>
							<div style={{position: "absolute", top: 0, left: 0, height: "100%", width: `${100 * (numPoliticalPressure/MAX_POLITICAL_PRESSURE_PER_CLASS)}%`, backgroundColor: getPlayerColor(playerClass.name, 0)}}/>
							<span style={{zIndex: 1, padding: 10}}>{playerClass.name}:</span>
							<span style={{zIndex: 1, padding: 10}}>{numPoliticalPressure}/{MAX_POLITICAL_PRESSURE_PER_CLASS}</span>
						</div>
					})
				}
			</div>}
		]}/>
	</div>
}