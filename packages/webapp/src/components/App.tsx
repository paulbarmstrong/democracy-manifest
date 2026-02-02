import { GAME_STATE, PLAYER_CLASSES } from "../utilities/Constants"
import { useWindowSize } from "../hooks/useWindowSize"
import { DynamicWebappConfig } from "common"
import { useRefState } from "../hooks/useRefState"
import { Action, ActionExecution, PlayerClassName, PolicyPosition, TabName } from "../utilities/Types"
import { playerClassNameZod, tabNameZod } from "../utilities/Zod"
import { getClassState, getPlayerClass } from "../utilities/Game"
import { getPlayerColor, getShade } from "../utilities/Color"
import { PlayerClassPanel } from "./panels/PlayerClassPanel"
import { AllPlayerClassesPanel } from "./panels/AllPlayerClassesPanel"
import { PoliticsPanel } from "./panels/PoliticsPanel"
import { MarketplacePanel } from "./panels/MarketplacePanel"
import { ActionsPanel } from "./panels/ActionsPanel"
import { RadioSelector } from "./RadioSelector"
import { useGameState } from "../hooks/useGameState"
import { Banner } from "./Banner"

interface Props {
	config: DynamicWebappConfig,
}

export function App(props: Props) {
	useWindowSize()
	const observingAsPlayerClassName = useRefState<PlayerClassName>(playerClassNameZod.options[0])
	const observingAsPlayerClass = getPlayerClass(observingAsPlayerClassName.current)
	const selectedTab = useRefState<TabName>(tabNameZod.options[0])
	const actionExecution = useRefState<ActionExecution | undefined>(undefined)
	const [gameState, updateGameState] = useGameState(GAME_STATE)
	
	async function onClickAction(action: Action) {
		actionExecution.current = {action}
		if (action.execute !== undefined) await action.execute({
			gameState,
			playerClass: observingAsPlayerClass,
			classState: getClassState(gameState.current, observingAsPlayerClass.name),
			setText: text => actionExecution.current = {...actionExecution.current!, text}, selectPolicyPosition
		})
		if (action.type === "free") {
			gameState.current.freeActionCompleted = true
		} else {
			gameState.current.mainActionCompleted = true
		}
		updateGameState()
		actionExecution.current = undefined
	}

	async function selectPolicyPosition(predicate: (policyPosition: PolicyPosition) => boolean): Promise<PolicyPosition> {
		selectedTab.current = "Politics"
		return new Promise<PolicyPosition>((resolve, _) => {
			actionExecution.current = {...actionExecution.current!, policyPositionPredicate: predicate, policyPositionCallback: resolve}
		})
	}

	return (
		<div style={{display: "flex"}}>
			<div style={{ width: "100%" }}>
				<div style={{display: "flex", alignItems: "center", gap: 10, padding: 5, fontSize: 16}}>
					<div>Observing as:</div>
					<RadioSelector choices={PLAYER_CLASSES.map(playerClass => ({value: playerClass.name, content: playerClass.name}))} value={observingAsPlayerClassName.current} onChange={newClassName => observingAsPlayerClassName.current = newClassName as PlayerClassName} radioButtonSize={16}/>
				</div>
				<Banner gameState={gameState.current}/>
				<div style={{display: "flex", justifyContent: "flex-start", gap: 4}}>
					{
						tabNameZod.options.map(tabName => {
							const color = tabName === "My Class" ? (
								getPlayerColor(observingAsPlayerClassName.current, 0)
							) : (
								getShade(1)
							)
							return <div key={tabName} className="clickable" onClick={() => selectedTab.current = tabName} style={{backgroundColor: selectedTab.current === tabName ? color : undefined, fontWeight: "bold", borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10}}>{tabName}</div>
						})
					}
				</div>
				{
					(() => {
						if (selectedTab.current === "All Classes") {
							return <AllPlayerClassesPanel gameState={gameState.current}/>
						} else if (selectedTab.current === "My Class") {
							return <PlayerClassPanel playerClass={getPlayerClass(observingAsPlayerClassName.current)} gameState={gameState.current} zoomed={true}/>
						} else if (selectedTab.current === "Politics") {
							return <PoliticsPanel playerClassName={observingAsPlayerClassName.current} updateGameState={updateGameState} gameState={gameState.current} actionExecution={actionExecution.current}/>
						} else if (selectedTab.current === "Marketplace") {
							return <MarketplacePanel gameState={gameState.current}/>
						} else if (selectedTab.current === "Actions") {
							return <ActionsPanel gameState={gameState.current} playerClass={observingAsPlayerClass} onClickAction={onClickAction}/>
						}
					})()
				}
				{
					actionExecution.current !== undefined ? (
						<div style={{position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20, padding: 20, backgroundColor: getShade(2)}}>
							<span style={{fontSize: "x-large", fontWeight: "bold"}}>{actionExecution.current.action.name}</span>
							{actionExecution.current.text}
						</div>
					) : (
						undefined
					)
				}
			</div>
		</div>
  	);
}