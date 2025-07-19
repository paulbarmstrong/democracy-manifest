import { range } from "lodash"
import { getColor } from "../utilities/Color"
import { GameState, PlayerClass } from "../utilities/Types"
import { COMPANY_SIZE_PX } from "../utilities/Constants"
import { CompanyCard } from "./CompanyCard"

interface Props {
	playerClass: PlayerClass,
	gameState: GameState
}

export function ClassView(props: Props) {
	const classState = props.gameState.classes.find(clazz => clazz.className === props.playerClass.name)!

	return <div style={{backgroundColor: getColor(props.playerClass.hue, 0), display: "flex", flexWrap: "wrap", padding: 10, gap: 10}}>
		{
			range(0, props.playerClass.maxCompanies).map(companyIndex => {
				if (companyIndex < classState.companies.length) {
					return <CompanyCard key={companyIndex} company={classState.companies[companyIndex]}/>
				} else {
					return <div style={{width: COMPANY_SIZE_PX, height: COMPANY_SIZE_PX, backgroundColor: getColor(props.playerClass.hue, 1), borderRadius: 4}}/>
				}
			})
		}
	</div>
}