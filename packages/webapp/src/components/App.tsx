import { COMPANY_SIZE_PX, GAME_STATE, PLAYER_CLASSES } from "../utilities/Constants"
import { useWindowSize } from "../hooks/useWindowSize"
import { DynamicWebappConfig } from "common"
import { useRefState } from "../hooks/useRefState"
import { PlayerClass } from "../utilities/Types"
import { getColor } from "../utilities/Color"
import { range } from "lodash"
import { CompanyCard } from "./CompanyCard"

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
		{navItems.map((item) => (
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
		))}
		</aside>
	);
}

export function App(props: Props) {
	useWindowSize()
	const selectedPlayerClass = useRefState<PlayerClass>(PLAYER_CLASSES[0])
	const selectedPlayerState = GAME_STATE.players.find(player => player.className === selectedPlayerClass.current.name)!

	return (
		<div style={{ display: "flex" , fontWeight: "bold"}}>
			<Sidebar />
			<div style={{ marginLeft: "250px", width: "100%" }}>
				<div style={{display: "flex", justifyContent: "flex-start", gap: 4}}>
					{
						PLAYER_CLASSES.map(playerClass => {
							return <div key={playerClass.name} className="clickable" onClick={() => selectedPlayerClass.current = playerClass} style={{backgroundColor: getColor(playerClass.hue, 0), borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10}}>{playerClass.name}</div>
						})
					}
				</div>
				<div style={{backgroundColor: getColor(selectedPlayerClass.current.hue, 0), display: "flex", flexWrap: "wrap", padding: 10, gap: 10}}>
					{
						range(0, selectedPlayerClass.current.maxCompanies).map(companyIndex => {
							if (companyIndex < selectedPlayerState.companies.length) {
								return <CompanyCard key={companyIndex} company={selectedPlayerState.companies[companyIndex]}/>
							} else {
								return <div style={{width: COMPANY_SIZE_PX, height: COMPANY_SIZE_PX, backgroundColor: getColor(selectedPlayerClass.current.hue, 1), borderRadius: 4}}/>
							}
						})
					}
				</div>
			</div>
		</div>
  	);
}