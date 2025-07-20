import { range } from "lodash"
import { getColor } from "../utilities/Color"
import { GameState, PlayerClass } from "../utilities/Types"
import { COMPANY_SIZE_PX, INDUSTRIES, WAREHOUSE_CAPACITIES } from "../utilities/Constants"
import { CompanyCard } from "./CompanyCard"
import { IndustryIcon } from "./IndustryIcon"
import { getMaxStorage } from "../utilities/Game"
import { RadioSelector } from "./RadioSelector"

interface Props {
	playerClass: PlayerClass,
	gameState: GameState
}

export function ClassView(props: Props) {
	const classState = props.gameState.classes.find(clazz => clazz.className === props.playerClass.name)!

	return <div style={{backgroundColor: getColor(props.playerClass.hue, 0), display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 10, gap: 10}}>
		{
			INDUSTRIES.filter(industry => getMaxStorage(classState, industry) > 0).length > 0 ? (
				<div style={{display: "flex", flexDirection: "column", padding: 10, gap: 10, borderStyle: "solid", borderColor: "white", borderWidth: 2, borderRadius: 4}}>
					<span>Storage</span>
					<div style={{display: "flex", gap: 30}}>
						{
							INDUSTRIES.filter(industry => getMaxStorage(classState, industry) > 0).map(industry => <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: 10}}>
								<IndustryIcon industryName={industry.name}/>
								<span>{classState.storedResources[industry.name].quantity}/{getMaxStorage(classState, industry)}</span>
								<RadioSelector
									choices={props.playerClass.storagePriceOptions[industry.name].map(price => ({value: price, text: `$${price}`})).reverse()}
									onChange={() => undefined}
									value={classState.storedResources[industry.name].price}
									radioButtonSize={16}
									fontSize="small"
									active={false}
								/>
							</div>)
						}
					</div>
				</div>
			) : (
				undefined
			)
		}

		<div style={{display: "flex", flexWrap: "wrap", gap: 10}}>
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
	</div>
}