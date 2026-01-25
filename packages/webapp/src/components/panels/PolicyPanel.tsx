import { clone, range } from "lodash"
import { getColor, getPlayerColor } from "../../utilities/Color"
import { INDUSTRIES } from "../../utilities/Constants"
import { getClassState, getIndustry, getPlayerClass } from "../../utilities/Game"
import { ActionExecution, GameState, PlayerClassName, Policy, PolicyPosition } from "../../utilities/Types"
import { Highlight } from "../Highlight"
import { Icon } from "../Icon"
import { IconedText } from "../IconedText"
import { RadioSelector } from "../RadioSelector"
import { useRefState } from "../../hooks/useRefState"

export function PolicyPanel(props: {
	playerClassName: PlayerClassName,
	gameState: GameState,
	setGameState: (newGameState: GameState) => void,
	actionExecution: ActionExecution | undefined,
	policy: Policy
}) {
	const influenceSelection = useRefState<number>(0)

	const policyState = props.gameState.policies[props.policy.name]
	const classState = getClassState(props.gameState, props.playerClassName)

	const isPendingClassPositionSelection = policyState.vote?.positions[props.playerClassName] === undefined

	function onClickPolicyPosition(policyPosition: PolicyPosition) {
		if (props.actionExecution?.policyPositionPredicate !== undefined && props.actionExecution!.policyPositionPredicate(policyPosition)) {
			props.actionExecution.policyPositionCallback!(policyPosition)
		}
	}

	function onSubmitInfluenceSelection() {
		getClassState(props.gameState, props.playerClassName).consumableGoods.Influence -= influenceSelection.current
		policyState.vote!.influence[props.playerClassName] = influenceSelection.current
		props.setGameState(clone(props.gameState))
	}

	function onClickVotingPosition(positionValue: boolean) {
		if (isPendingClassPositionSelection) {
			policyState.vote!.positions[props.playerClassName] = positionValue
			props.setGameState(clone(props.gameState))
		}
	}

	return <div style={{backgroundColor: getColor(props.policy.hue, 0), borderRadius: 4, padding: 10, display: "flex", flexDirection: "column", gap: 10}}>
		<div><b>{props.policy.name}:</b></div>
		<RadioSelector choices={props.policy.content.map((text, index) => ({
			content: <div style={{display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap"}}>
				<span>{String.fromCharCode(65 + index)}</span>
				<span>|</span>
				<IconedText text={text}/>
				{
					(policyState.proposal?.proposedState === index) ? (
						<div style={{backgroundColor: getPlayerColor(policyState.proposal!.playerClassName, 0), borderRadius: "50%", height: 20, width: 20, borderStyle: "solid", borderWidth: 2, display: "flex", justifyContent: "center", alignItems: "center"}}>
							<Icon name="vote" size={16}/>
						</div>
					) : (
						undefined
					)
				}
			</div>,
			value: index as 0 | 1 | 2,
			allowed: props.actionExecution?.policyPositionPredicate !== undefined && props.actionExecution!.policyPositionPredicate({name: props.policy.name, position: index as 0 | 1 | 2})
		}))} value={policyState.state} onChange={index => onClickPolicyPosition({name: props.policy.name, position: index})}/>
		{
			policyState.vote !== undefined ? (
				<div style={{display: "flex", flexDirection: "column", gap: 10}}>
					<span>Class Positions:</span>
					<div style={{display: "flex", justifyContent: "space-between", gap: 10}}>
						<Highlight active={isPendingClassPositionSelection} flex={1}>
							<div className={isPendingClassPositionSelection ? "clickable" : undefined}
								style={{flex: 1, borderRadius: 4, backgroundColor: getColor(props.policy.hue, 1), display: "flex", gap: 5, padding: 5}}
								onClick={() => onClickVotingPosition(true)}
								>
								{
									Object.entries(policyState.vote.positions).filter(position => position[1]).map(position => {
										return <span className="material-symbols-outlined" style={{padding: 15, backgroundColor: getColor(getPlayerClass(position[0] as PlayerClassName).hue, 0), borderRadius: 4}}>check</span>
									})
								}
							</div>
						</Highlight>
						<Highlight active={isPendingClassPositionSelection} flex={1}>
							<div className={isPendingClassPositionSelection ? "clickable" : undefined}
								style={{flex: 1, borderRadius: 4, backgroundColor: getColor(props.policy.hue, 1), display: "flex", gap: 5, padding: 5}}
								onClick={() => onClickVotingPosition(false)}
								>
								{
									Object.entries(policyState.vote.positions).filter(position => !position[1]).map(position => {
										return <span className="material-symbols-outlined" style={{padding: 15, backgroundColor: getColor(getPlayerClass(position[0] as PlayerClassName).hue, 0), borderRadius: 4}}>close</span>
									})
								}
							</div>
						</Highlight>
					</div>
					{
						policyState.vote.influence[props.playerClassName] !== undefined ? (
							<div style={{display: "flex", flexDirection: "column", gap: 10}}>
								<span>Votes:</span>
								<div style={{display: "flex", justifyContent: "space-between", gap: 10}}>
									{
										[true, false].map(positionValue => 
											<div style={{flex: 1, borderRadius: 4, backgroundColor: getColor(props.policy.hue, 1), display: "flex", gap: 5, padding: 5, flexWrap: "wrap"}}>
												{
													[
														...Object.entries(policyState.vote!.positions)
															.filter(position => position[1] === positionValue)
															.flatMap(position => {
																return range(0, policyState.vote!.influence[position[0] as PlayerClassName] ?? 0).map(() => 
																	<div style={{width: 24, height: 24, padding: 5, backgroundColor: getColor(INDUSTRIES.find(x => x.name === "Influence")?.hue, 0), borderRadius: 4}}/>
																)
															}),
														...Object.entries(policyState.vote!.positions)
															.filter(position => position[1] === positionValue)
															.flatMap(position => {
																return range(0, policyState.vote!.pressure[position[0] as Exclude<PlayerClassName, "State">] ?? 0).map(() => 
																	<div style={{width: 24, height: 24, padding: 5, backgroundColor: getColor(getPlayerClass(position[0] as PlayerClassName).hue, 0), borderRadius: 4}}/>
																)
															})
													]
												}
											</div>
										)
									}
								</div>
							</div>
						) : (
							Object.keys(policyState.vote!.positions).length === 4 ? (
								<div style={{display: "flex", flexDirection: "column", gap: 10}}>
									<div>Your influence to spend:</div>
									<div style={{display: "flex", justifyContent: "space-between", alignItems: "stretch", flexDirection: "column", gap: 5, borderRadius: 4, backgroundColor: getColor(getIndustry("Influence").hue, 0), padding: 10, textAlign: "center"}}>
										<span>{influenceSelection.current}/{classState.consumableGoods.Influence}</span>
										<div style={{paddingTop: 10, paddingBottom: 10}}>
											<input className="clickable slider" style={{width: "100%", boxSizing: "border-box"}} type="range" step={1} min={0} max={classState.consumableGoods.Influence} value={influenceSelection.current} onChange={e => influenceSelection.current = parseInt(e.target.value)}/>
										</div>
										<span className="clickable" style={{borderRadius: 4, borderStyle: "solid", borderColor: "white", borderWidth: 2, padding: 10}} onClick={onSubmitInfluenceSelection}>SUBMIT</span>
									</div>
								</div>
							) : (
								undefined
							)
						)
					}
				</div>
			) : (
				undefined
			)
		}
	</div>
}