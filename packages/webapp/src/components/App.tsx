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

export function App(props: Props) {
	useWindowSize()
	const selectedPlayerClass = useRefState<PlayerClass>(PLAYER_CLASSES[0])
	const selectedPlayerState = GAME_STATE.players.find(player => player.className === selectedPlayerClass.current.name)!

	return <div style={{fontWeight: "bold"}}>
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
}