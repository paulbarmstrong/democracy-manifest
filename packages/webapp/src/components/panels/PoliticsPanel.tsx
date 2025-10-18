import { getColor, getPlayerColor, getShade } from "../../utilities/Color"
import { POLICIES, TOTAL_NUM_VOTING_CUBES_PER_CLASS } from "../../utilities/Constants"
import { ActionExecution, GameState, PlayerClassName, PolicyPosition } from "../../utilities/Types"
import { Details } from "../Details"
import { Icon } from "../Icon"
import { IconedText } from "../IconedText"
import { RadioSelector } from "../RadioSelector"

export function PoliticsPanel(props: {
	gameState: GameState,
	actionExecution: ActionExecution | undefined
}) {

	function onClickPolicyPosition(policyPosition: PolicyPosition) {
		if (props.actionExecution?.policyPositionPredicate !== undefined && props.actionExecution!.policyPositionPredicate(policyPosition)) {
			props.actionExecution.policyPositionCallback!(policyPosition)
		}
	}

	return <div style={{backgroundColor: getShade(1), padding: 20}}>
		<Details details={[
			{name: "Policies", content: <div style={{display: "flex", flexWrap: "wrap", gap: 20}}>{
				POLICIES.map(policy => <div style={{backgroundColor: getColor(policy.hue, 0), borderRadius: 4, padding: 10, display: "flex", flexDirection: "column", gap: 10}}>
					<div><b>{policy.name}:</b></div>
					<RadioSelector choices={policy.content.map((text, index) => ({
						content: <div style={{display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap"}}>
							<span>{String.fromCharCode(65 + index)}</span>
							<span>|</span>
							<IconedText text={text}/>
							{
								(props.gameState.policies[policy.name].proposal?.proposedState === index) ? (
									<div style={{backgroundColor: getPlayerColor(props.gameState.policies[policy.name].proposal!.playerClassName, 0), borderRadius: "50%", height: 20, width: 20, borderStyle: "solid", borderWidth: 2, display: "flex", justifyContent: "center", alignItems: "center"}}>
										<Icon name="vote" size={16}/>
									</div>
								) : (
									undefined
								)
							}
						</div>,
						value: index as 0 | 1 | 2,
						allowed: props.actionExecution?.policyPositionPredicate !== undefined && props.actionExecution!.policyPositionPredicate({name: policy.name, position: index as 0 | 1 | 2})
					}))} value={props.gameState.policies[policy.name].state} onChange={index => onClickPolicyPosition({name: policy.name, position: index})}/>
				</div>)
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