import { GAME_STATE, PLAYER_CLASSES, SIDEBAR_WIDTH_PX } from "../utilities/Constants"
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

// Sidebar component
function Sidebar() {
	const navItems = [
		{ name: "Voting area", icon: "/icons/ballot.jpg", href: "#" },
		{ name: "Policies area", icon: "/icons/Luxury.svg", href: "#" },
		{ name: "Open Market", icon: "/icons/Food.svg", href: "#" },
		{ name: "Bussiness deals", icon: "/icons/Luxury.svg", href: "#" },
		{ name: "Unemployed workers", icon: "/icons/Luxury.svg", href: "#" }
	];

	return (
		<aside
		style={{
			width: SIDEBAR_WIDTH_PX,
			height: "100vh",
			backgroundColor: "#1f2937", // Tailwind gray-800
			color: "white",
			padding: "20px",
			boxSizing: "border-box",
			position: "fixed",
			top: 0,
			left: 0,
			zIndex: 1000
		}}
		>
		<h1 style={{ marginBottom: 20 }}>Manifest</h1>
		{
			navItems.map((item) => (
				<a
					key={item.name}
					href={item.href}
					style={{
					display: "flex",
					alignItems: "center",
					gap: "10px",
					marginBottom: "16px",
					color: "white",
					textDecoration: "none"
				}}>
					<img src={item.icon} alt={item.name} style={{ width: 24, height: 24 }} />
					<span>{item.name}</span>
				</a>
			))
		}
		</aside>
	);
}

export function App(props: Props) {
	useWindowSize()
	const observingAsPlayerClassName = useRefState<PlayerClassName>(playerClassNameZod.options[0])
	const observingAsPlayerClass = getPlayerClass(observingAsPlayerClassName.current)
	const selectedTab = useRefState<TabName>(tabNameZod.options[0])
	const [gameState, setGameState] = useGameState(GAME_STATE)
	const actionExecution = useRefState<ActionExecution | undefined>(undefined)
	
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
		if (gameState.current.freeActionCompleted && gameState.current.mainActionCompleted) {
			gameState.current.turnIndex += 1
			gameState.current.mainActionCompleted = false
			gameState.current.freeActionCompleted = false
		}
		setGameState(gameState.current)
		actionExecution.current = undefined
	}

	async function selectPolicyPosition(predicate: (policyPosition: PolicyPosition) => boolean): Promise<PolicyPosition> {
		selectedTab.current = "Politics"
		return new Promise<PolicyPosition>((resolve, _) => {
			actionExecution.current = {...actionExecution.current!, policyPositionPredicate: predicate, policyPositionCallback: resolve}
		})
	}

	return (
		<div style={{display: "flex", userSelect: "none"}}>
			<Sidebar />
			<div style={{ marginLeft: "250px", width: "100%" }}>
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
							return <PoliticsPanel playerClassName={observingAsPlayerClassName.current} setGameState={setGameState} gameState={gameState.current} actionExecution={actionExecution.current}/>
						} else if (selectedTab.current === "Marketplace") {
							return <MarketplacePanel gameState={gameState.current}/>
						} else if (selectedTab.current === "Actions") {
							return <ActionsPanel gameState={gameState.current} playerClass={observingAsPlayerClass} onClickAction={onClickAction}/>
						}
					})()
				}
				{
					actionExecution.current !== undefined ? (
						<div style={{position: "fixed", bottom: 0, left: SIDEBAR_WIDTH_PX, right: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20, padding: 20, backgroundColor: getShade(2)}}>
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