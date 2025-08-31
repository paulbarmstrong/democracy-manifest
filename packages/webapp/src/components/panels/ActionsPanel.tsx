import { getColor, getShade } from "../../utilities/Color"
import { ACTION_SIZE_PX, BASIC_ACTIONS, DRAWN_ACTIONS, FREE_ACTIONS, POLICIES } from "../../utilities/Constants"
import { Action, GameState, PlayerClass } from "../../utilities/Types"
import { Details } from "../Details"
import { Icon } from "../Icon"
import { IconedText } from "../IconedText"

export function ActionsPanel(props: {
	playerClass: PlayerClass,
	gameState: GameState,
	onClickAction: (action: Action) => void
}) {
	const playerState = props.gameState.classes.find(playerClassState => playerClassState.className === props.playerClass.name)!

	const playerDrawnActions = playerState.drawnActions.map(x => DRAWN_ACTIONS[x])

	const actionsGroups = [
		{
			name: "Main actions",
			actions: [...playerDrawnActions, ...BASIC_ACTIONS].filter(action => action.playerClasses.includes(props.playerClass.name))
		}, {
			name: "Free actions",
			actions: FREE_ACTIONS.filter(action => action.playerClasses.includes(props.playerClass.name))
		}
	]

	return <div style={{backgroundColor: getShade(1), padding: 10}}>
		<Details details={actionsGroups.map(group => ({name: group.name, content: <div style={{display: "flex", flexDirection: "column", gap: 10, maxWidth: ACTION_SIZE_PX}}>
			{
				group.actions.filter(action => action.playerClasses.includes(props.playerClass.name)).map(action => {
					const isPossible = action.isPossible === undefined || action.isPossible(props.gameState, props.playerClass)
					return <div className={isPossible ? "clickable" : undefined} onClick={isPossible ? () => props.onClickAction(action) : undefined} style={{padding: 10, borderRadius: 4, backgroundColor: getShade(2), display: "flex", flexDirection: "column", gap: 10, opacity: isPossible ? undefined : 0.5}}>
						<span style={{fontSize: "large", fontWeight: "bold", display: "flex", gap: 3, alignItems: "center"}}>{action.type === "drawn" ? <Icon name="drawn"/> : undefined}{action.type === "drawn" ? "\"" : ""}{action.name}{action.type === "drawn" ? "\"" : ""}</span>
						<span><IconedText text={action.description}/></span>
						{action.requiredPolicy !== undefined ? (
							<span>Requires <span style={{backgroundColor: getColor(POLICIES.find(policy => policy.name === action.requiredPolicy!.name)!.hue, 0), padding: 3, borderRadius: 4}}>{action.requiredPolicy.name} {action.requiredPolicy.states.map(state => String.fromCharCode(65 + state)).join(" or ")}</span>.</span>
						) : (
							undefined
						)}
						{action.credibilityDescription !== undefined ? (
							<span style={{display: "flex", gap: 5}}>
								{action.credibilityDescription.map(text => <IconedText text={text}/>)}
							</span>
						) : (
							undefined
						)}
					</div>
				})
			}
		</div>}))}/>
	</div>
}