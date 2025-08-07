import { range } from "lodash"
import { getColor, getPlayerColor } from "../../utilities/Color"
import { CapitalistClassState, GameState, PlayerClass, PlayerClassName, StateClassState, Worker, WorkingClassState } from "../../utilities/Types"
import { COMPANY_SIZE_PX, INDUSTRIES, WEALTH_TIER_THRESHOLDS } from "../../utilities/Constants"
import { CompanyCard } from "../CompanyCard"
import { capitalToWealthTier, getMaxStorage } from "../../utilities/Game"
import { RadioSelector } from "../RadioSelector"
import { Details } from "../Details"
import { WorkerView } from "../WorkerView"
import { Icon } from "../Icon"

interface Props {
	playerClass: PlayerClass,
	gameState: GameState,
	zoomed: boolean,
	onClickZoom: () => void
}

export function PlayerClassPanel(props: Props) {
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

	return <div style={{backgroundColor: getColor(props.playerClass.hue, 0), display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 10, gap: 10, position: "relative"}}>
		<span className="clickable material-symbols-outlined" onClick={props.onClickZoom} style={{position: "absolute", top: 20, right: 20, color: "white", fontSize: 36}}>{props.zoomed ? "zoom_in_map" : "zoom_out_map"}</span>
		<div style={{padding: 10, fontSize: "xx-large"}}>{props.playerClass.name}</div>
		<Details details={[
			{name: "Cash", content: `$${classState.cash}`},
			{name: "Number of workers", content: numberOfWorkers},
			{name: "Population Level", content: populationLevel},
			{name: "Stored goods", content: INDUSTRIES.filter(industry => getMaxStorage(classState, industry) > 0).length > 0 ? (
				<div style={{display: "flex", gap: 5, borderColor: "white", borderWidth: 2, borderRadius: 4}}>
					{
						INDUSTRIES.filter(industry => getMaxStorage(classState, industry) > 0).map(industry => <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: getColor(industry.hue, 0), padding: 10, gap: 10, borderRadius: 4}}>
							<Icon name={industry.name}/>
							<span>{classState.storedGoods[industry.name].quantity}/{getMaxStorage(classState, industry)}</span>
							<RadioSelector
								choices={props.playerClass.storagePriceOptions[industry.name].map(price => ({value: price, content: `$${price}`})).reverse()}
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
							<Icon name={industry.name}/>
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
							<Icon name={industry.name}/>
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
			{name: "Capital", content: (classState as CapitalistClassState).capital !== undefined ? `$${(classState as CapitalistClassState).capital}` : undefined},
			{name: "Wealth", content: (classState as CapitalistClassState).capital !== undefined ? (
				<div style={{display: "flex", flexDirection: "column", gap: 5}}>
					<div style={{display: "flex", gap: 2, borderRadius: 4, overflow: "hidden"}}>
						{
							WEALTH_TIER_THRESHOLDS.map((capitalThreshold, wealthTier) => <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: 5, paddingTop: 10, paddingBottom: 10, position: "relative", width: 24, gap: 5, backgroundColor: getPlayerColor("Capitalist Class", 2)}}>
								<span>{wealthTier+1}</span>
								<span style={{fontSize: "small"}}>{`$${capitalThreshold}`}</span>
							</div>)
						}
					</div>
					<div style={{width: "100%", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: getPlayerColor("Capitalist Class", 2), borderRadius: 4, overflow: "hidden"}}>
						<div style={{position: "absolute", top: 0, left: 0, height: "100%", width: `${100 * (capitalToWealthTier((classState as CapitalistClassState).capital)/WEALTH_TIER_THRESHOLDS.length)}%`, backgroundColor: getPlayerColor("Capitalist Class", 1)}}/>
						<span style={{zIndex: 1, padding: 10}}>Current:</span>
						<span style={{zIndex: 1, padding: 10}}>{capitalToWealthTier((classState as CapitalistClassState).capital)}/{WEALTH_TIER_THRESHOLDS.length}</span>
					</div>
					<div style={{width: "100%", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: getPlayerColor("Capitalist Class", 2), borderRadius: 4, overflow: "hidden"}}>
						<div style={{position: "absolute", top: 0, left: 0, height: "100%", width: `${100 * ((classState as CapitalistClassState).peakWealthTier/WEALTH_TIER_THRESHOLDS.length)}%`, backgroundColor: getPlayerColor("Capitalist Class", 1)}}/>
						<span style={{zIndex: 1, padding: 10}}>Peak:</span>
						<span style={{zIndex: 1, padding: 10}}>{(classState as CapitalistClassState).peakWealthTier}/{WEALTH_TIER_THRESHOLDS.length}</span>
					</div>
				</div>
			) : (
				undefined
			)},
			{name: "Spare Machines", content: (classState as CapitalistClassState).numSpareMachines > 0? (
				<div style={{display: "flex", gap: 10}}>
					{
						range(0, (classState as CapitalistClassState).numSpareMachines).map(_ => <span className="material-symbols-outlined" style={{fontSize: 60, color: "white"}}>settings</span>)
					}
				</div>
			) : (
				undefined
			)},
			{name: "Credibility", content: (classState as StateClassState).credibility !== undefined ? (
				<div style={{display: "flex", flexDirection: "column", gap: 5}}>
					{
						Object.entries((classState as StateClassState).credibility).map(credEntry => <div style={{display: "flex", justifyContent: "space-between", gap: 100, backgroundColor: getPlayerColor(credEntry[0] as PlayerClassName, 1), borderRadius: 4, overflow: "hidden", position: "relative"}}>
							<div style={{position: "absolute", top: 0, left: 0, height: "100%", width: `${100 * (credEntry[1]/10)}%`, backgroundColor: getPlayerColor(credEntry[0] as PlayerClassName, 0)}}/>
							<span style={{zIndex: 1, padding: 10}}>{credEntry[0]}:</span>
							<span style={{zIndex: 1, padding: 10}}>{credEntry[1]}/10</span>
						</div>)
					}
				</div>
			) : (
				undefined
			)},
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