import { GAME_STATE, PLAYER_CLASSES } from "../utilities/Constants"
import { useWindowSize } from "../hooks/useWindowSize"
import { DynamicWebappConfig } from "common"
import { useRefState } from "../hooks/useRefState"
import { PlayerClassName, TabName } from "../utilities/Types"
import { playerClassNameZod, tabNameZod } from "../utilities/Zod"
import { getPlayerClass } from "../utilities/Game"
import { getPlayerColor, getShade } from "../utilities/Color"
import { PlayerClassPanel } from "./panels/PlayerClassPanel"
import { AllPlayerClassesPanel } from "./panels/AllPlayerClassesPanel"
import { PoliciesPanel } from "./panels/PoliciesPanel"
import { VotingBagPanel } from "./panels/VotingBagPanel"
import { MarketplacePanel } from "./panels/MarketplacePanel"
import { ActionsPanel } from "./panels/ActionsPanel"
import { RadioSelector } from "./RadioSelector"

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
			width: "250px",
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
	const selectedTab = useRefState<TabName>(tabNameZod.options[0])
	const gameState = GAME_STATE

	return (
		<div style={{ display: "flex"}}>
			<Sidebar />
			<div style={{ marginLeft: "250px", width: "100%" }}>
				<div style={{display: "flex", alignItems: "center", gap: 10, padding: 5, fontSize: 16}}>
					<div>Observing as:</div>
					<RadioSelector choices={PLAYER_CLASSES.map(playerClass => ({value: playerClass.name, content: playerClass.name}))} value={observingAsPlayerClassName.current} onChange={newClassName => observingAsPlayerClassName.current = newClassName as PlayerClassName} radioButtonSize={16}/>
				</div>
				<div style={{display: "flex", justifyContent: "flex-start", gap: 4}}>
					{
						tabNameZod.options.map(tabName => {
							const color = playerClassNameZod.options.includes(tabName as PlayerClassName) ? (
								getPlayerColor(tabName as PlayerClassName, 0)
							) : (
								getShade(1)
							)
							return <div key={tabName} className="clickable" onClick={() => selectedTab.current = tabName} style={{backgroundColor: selectedTab.current === tabName ? color : undefined, fontWeight: "bold", borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10}}>{tabName}</div>
						})
					}
				</div>
				{
					(() => {
						if (selectedTab.current === "All classes") {
							return <AllPlayerClassesPanel selectedTab={selectedTab} gameState={gameState}/>
						}
						if (playerClassNameZod.options.includes(selectedTab.current as PlayerClassName)) {
							return <PlayerClassPanel playerClass={getPlayerClass(selectedTab.current as PlayerClassName)} gameState={gameState} zoomed={true} onClickZoom={() => selectedTab.current = "All classes"}/>
						} else if (selectedTab.current === "Policies") {
							return <PoliciesPanel gameState={gameState}/>
						} else if (selectedTab.current === "Voting Bag") {
							return <VotingBagPanel gameState={gameState}/>
						} else if (selectedTab.current === "Marketplace") {
							return <MarketplacePanel gameState={gameState}/>
						} else if (selectedTab.current === "Actions") {
							return <ActionsPanel gameState={gameState} playerClass={getPlayerClass(observingAsPlayerClassName.current)}/>
						}
					})()
				}
			</div>
		</div>
  	);
}