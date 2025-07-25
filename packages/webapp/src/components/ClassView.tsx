import { range } from "lodash"
import { getColor } from "../utilities/Color"
import { CapitalistClassState, GameState, PlayerClass, Worker, WorkerClass, WorkingClassState } from "../utilities/Types"
import { COMPANY_SIZE_PX, INDUSTRIES } from "../utilities/Constants"
import { CompanyCard } from "./CompanyCard"
import { IndustryIcon } from "./IndustryIcon"
import { getMaxStorage } from "../utilities/Game"
import { RadioSelector } from "./RadioSelector"
import { Details } from "./Details"
import { WorkerView } from "./WorkerView"

interface Props {
	playerClass: PlayerClass,
	gameState: GameState
}

export function ClassView(props: Props) {
	const classState = props.gameState.classes.find(clazz => clazz.className === props.playerClass.name)!
	const unionLeaderWorkers: Array<Worker> | undefined = (classState as WorkingClassState).unionLeaders !== undefined ? (
		Object.values((classState as WorkingClassState).unionLeaders)
	) : (
		undefined
	)
	const unemployedWorkers = props.gameState.unemployedWorkers.filter(worker => worker.class === classState.className)
	const workers: Array<Worker> = [
		...(unionLeaderWorkers ?? []),
		...unemployedWorkers,
		...props.gameState.classes.flatMap(clazz => clazz.companies.flatMap(company => company.workers))
			.filter(worker => worker.class === classState.className)
	]
	const numberOfWorkers = workers.length > 0 ? workers.length : undefined
	const populationLevel = numberOfWorkers !== undefined ? Math.floor(numberOfWorkers / 3) : undefined

	return <div style={{backgroundColor: getColor(props.playerClass.hue, 0), display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 10, gap: 10}}>
		<Details details={[
			{name: "Cash", content: `$${classState.cash}`},
			{name: "Number of workers", content: numberOfWorkers},
			{name: "Population Level", content: populationLevel},
			{name: "Stored goods", content: INDUSTRIES.filter(industry => getMaxStorage(classState, industry) > 0).length > 0 ? (
				<div style={{display: "flex", gap: 5, borderColor: "white", borderWidth: 2, borderRadius: 4}}>
					{
						INDUSTRIES.filter(industry => getMaxStorage(classState, industry) > 0).map(industry => <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: getColor(industry.hue, 0), padding: 10, gap: 10, borderRadius: 4}}>
							<IndustryIcon industryName={industry.name}/>
							<span>{classState.storedGoods[industry.name].quantity}/{getMaxStorage(classState, industry)}</span>
							<RadioSelector
								choices={props.playerClass.storagePriceOptions[industry.name].map(price => ({value: price, text: `$${price}`})).reverse()}
								onChange={() => undefined}
								value={classState.storedGoods[industry.name].price}
								radioButtonSize={16}
								fontSize="small"
								active={false}
							/>
						</div>)
					}
				</div>
			) : (
				undefined
			)},
			{name: "Consumable goods", content: INDUSTRIES.filter(industry => classState.consumableGoods[industry.name] > 0).length > 0 ? (
				<div style={{display: "flex", gap: 5, borderColor: "white", borderWidth: 2, borderRadius: 4}}>
					{
						INDUSTRIES.filter(industry => classState.consumableGoods[industry.name] > 0).map(industry => <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: getColor(industry.hue, 0), padding: 10, gap: 10, borderRadius: 4}}>
							<IndustryIcon industryName={industry.name}/>
							<span>{classState.consumableGoods[industry.name]}</span>
						</div>)
					}
				</div>
			) : (
				undefined
			)},
			{name: "Labor Unions", content: unionLeaderWorkers !== undefined ? (
				<div style={{display: "flex", gap: 5}}>
					{
						INDUSTRIES.map(industry => <div style={{display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: getColor(industry.hue, 0), borderRadius: 4, gap: 10, padding: 10}}>
							<IndustryIcon industryName={industry.name}/>
							<div style={{width: 50, height: 50, backgroundColor: getColor(industry.hue, -1), borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center"}}>
								{
									(classState as WorkingClassState).unionLeaders[industry.name] !== undefined ? (
										<WorkerView worker={(classState as WorkingClassState).unionLeaders[industry.name]!}/>
									) : (
										undefined
									)
								}
							</div>
						</div>)
					}
				</div>
			) : (
				undefined
			)},
			{name: "Unemployed workers", content: unemployedWorkers.length > 0 ? (
				<div style={{display: "flex", gap: 10}}>
					{
						props.gameState.unemployedWorkers.filter(worker => worker.class === classState.className).map(worker => <div style={{width: 30, height: 30, display: "flex", justifyContent: "center", alignItems: "center"}}><WorkerView worker={worker}/></div>)
					}
				</div>
			) : (
				undefined
			)},
			{name: "Capital", content: (classState as CapitalistClassState).capital !== undefined ? `$${(classState as CapitalistClassState).capital}` : undefined},
			{name: "Companies", content:
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
			}
		]}/>
	</div>
}