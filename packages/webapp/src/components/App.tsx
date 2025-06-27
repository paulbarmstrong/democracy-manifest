import { BACKGROUND_SHADE_T1, COMPANY_SIZE_PX, COMPANY_TYPES, GAME_STATE, PLAYER_CLASSES } from "../utilities/Constants"
import { useWindowSize } from "../hooks/useWindowSize"
import { DynamicWebappConfig } from "common"
import { useRefState } from "../hooks/useRefState"
import { PlayerClass } from "../utilities/Types"
import { getColor, getShade } from "../utilities/Color"
import { range } from "lodash"

interface Props {
	config: DynamicWebappConfig,
}

export function App(props: Props) {
	useWindowSize()
	const selectedPlayerClass = useRefState<PlayerClass>(PLAYER_CLASSES[0])
	const selectedPlayerState = GAME_STATE.players.find(player => player.className === selectedPlayerClass.current.name)!

	return <div>
		<div style={{display: "flex", justifyContent: "flex-start", gap: 4}}>
			{
				PLAYER_CLASSES.map(playerClass => {
					return <div className="clickable" onClick={() => selectedPlayerClass.current = playerClass} style={{backgroundColor: getColor(playerClass.hue, 0), borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10}}>{playerClass.name}</div>
				})
			}
		</div>
		<div style={{backgroundColor: getColor(selectedPlayerClass.current.hue, 0), display: "flex", flexWrap: "wrap", padding: 10, gap: 10}}>
			{
				range(0, selectedPlayerClass.current.maxCompanies).map(companyIndex => {
					if (companyIndex < selectedPlayerState.companies.length) {
						const company = selectedPlayerState.companies[companyIndex]
						const companyType = COMPANY_TYPES.find(companyType => companyType.name === company.name)!
						return <div style={{width: COMPANY_SIZE_PX, height: COMPANY_SIZE_PX, backgroundColor: getShade(0), display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 4, gap: 10, padding: 10, boxSizing: "border-box"}}>
							<span>{selectedPlayerState.companies[companyIndex].name}</span>
							<div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
								{
									companyType.workerSlots.map((workerSlot, workerIndex) => <div>
										<div style={{width: 50, height: 50, borderRadius: 4, borderWidth: 2, borderColor: "white", borderStyle: "solid", display: "flex", justifyContent: "center", alignItems: "center"}}>
											{
												company.workers[workerIndex] !== undefined ? (
													<span className="material-symbols-outlined" style={{fontSize: 36}}>{(() => {
														const workerClass = company.workers[workerIndex].class
														if (workerClass === "Working Class") {
															return "man_2"
														} else if (workerClass === "Middle Class") {
															return "man_4"
														} else {
															return "settings"
														}
													})()}</span>
												) : (
													undefined
												)
											}
										</div>
									</div>)
								}
							</div>
						</div>
					} else {
						return <div style={{width: COMPANY_SIZE_PX, height: COMPANY_SIZE_PX, backgroundColor: getShade(0), display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 4}}>
						</div>
					}
				})
			}
		</div>
		<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
			fontSize: Math.min(window.innerWidth, window.innerHeight)/6, color: BACKGROUND_SHADE_T1,
			opacity: 0.5, userSelect: "none"}}>Democracy Manifest</div>
	</div>
}