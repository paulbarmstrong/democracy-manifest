import { GAME_STATE, PLAYER_CLASSES } from "../utilities/Constants"
import { useWindowSize } from "../hooks/useWindowSize"
import { DynamicWebappConfig } from "common"
import { useRefState } from "../hooks/useRefState"
import { PlayerClass } from "../utilities/Types"
import { ClassView } from "./ClassView"

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
	const selectedPlayerClass = useRefState<PlayerClass | undefined>(undefined)

	return (
		<div style={{ display: "flex" , fontWeight: "bold"}}>
			<Sidebar />
			<div style={{ marginLeft: "250px", width: "100%" }}>
				{
					selectedPlayerClass.current !== undefined ? (
						<ClassView playerClass={selectedPlayerClass.current} gameState={GAME_STATE} zoomed={true} onClickZoom={() => selectedPlayerClass.current = undefined}/>
					) : (
						<div style={{display: "flex", flexDirection: "column"}}>
							<div style={{display: "flex"}}>
								<ClassView playerClass={PLAYER_CLASSES[0]} gameState={GAME_STATE} zoomed={false} onClickZoom={() => selectedPlayerClass.current = PLAYER_CLASSES[0]}/>
								<ClassView playerClass={PLAYER_CLASSES[1]} gameState={GAME_STATE} zoomed={false} onClickZoom={() => selectedPlayerClass.current = PLAYER_CLASSES[1]}/>
							</div>
							<div style={{display: "flex"}}>
								<ClassView playerClass={PLAYER_CLASSES[2]} gameState={GAME_STATE} zoomed={false} onClickZoom={() => selectedPlayerClass.current = PLAYER_CLASSES[2]}/>
								<ClassView playerClass={PLAYER_CLASSES[3]} gameState={GAME_STATE} zoomed={false} onClickZoom={() => selectedPlayerClass.current = PLAYER_CLASSES[3]}/>
							</div>
						</div>
					)
				}
			</div>
		</div>
  	);
}