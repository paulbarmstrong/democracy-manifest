import _, { keyBy, sum } from "lodash"
import { BASE_FOOD_IMPORT_PRICE, BASE_LUXURY_IMPORT_PRICE, COMPANY_TYPES, INDUSTRIES, MAX_EXPORT_ONLY_GOODS, PLAYER_CLASSES, WAREHOUSE_CAPACITIES, WEALTH_TIER_THRESHOLDS } from "./Constants"
import { CapitalistClassState, ClassState, Company, CompanyType, GameState, ImportDeal, Industry, IndustryName, MiddleClassState, PlayerClass, PlayerClassName, StateClassState, WorkerClass, WorkingClassState } from "./Types"

export function getIndustry(industryName: IndustryName): Industry {
	return INDUSTRIES.find(industry => industry.name === industryName)!
}

export function getCompanyType(company: Company): CompanyType {
	return COMPANY_TYPES.find(companyType => companyType.name === company.name)!
}

export function getPlayerClass(playerClassName: PlayerClassName): PlayerClass {
	return PLAYER_CLASSES.find(playerClass => playerClass.name === playerClassName)!
}

export function getClassState(gameState: GameState, playerClassName: PlayerClassName): ClassState {
	return gameState.classes.find(x => x.className === playerClassName)!
}

export const getWorkingClassState = (gameState: GameState) => getClassState(gameState, "Working Class") as WorkingClassState
export const getMiddleClassState = (gameState: GameState) => getClassState(gameState, "Middle Class") as MiddleClassState
export const getCapitalistClassState = (gameState: GameState) => getClassState(gameState, "Capitalist Class") as CapitalistClassState
export const getStateClassState = (gameState: GameState) => getClassState(gameState, "State") as StateClassState

export function getMaxStorage(classState: ClassState, industryName: IndustryName): number {
	const playerClass: PlayerClass = getPlayerClass(classState.className)
	const baseStorage: number = playerClass.baseStorages[industryName]
	const warehouseStorage: number = ((classState as MiddleClassState | CapitalistClassState).warehouses ?? [])
		.filter(warehouse => warehouse === industryName).length * WAREHOUSE_CAPACITIES[industryName]
	return baseStorage + warehouseStorage
}

export function capitalToWealthTier(capital: number): number {
	for (let i = WEALTH_TIER_THRESHOLDS.length-1; i >= 0; i--) {
		if (capital > WEALTH_TIER_THRESHOLDS[i]) return i
	}
	return 0
}

export function getImportTariff(industryName: "Food" | "Luxury", level: number): number {
	const basePrice = industryName === "Food" ? BASE_FOOD_IMPORT_PRICE : BASE_LUXURY_IMPORT_PRICE
	return (basePrice / 2)*(2-level)
}

export function getImportPrice(industryName: "Food" | "Luxury", level: number): number {
	const basePrice = industryName === "Food" ? BASE_FOOD_IMPORT_PRICE : BASE_LUXURY_IMPORT_PRICE
	return basePrice + getImportTariff(industryName, level)
}

export function getImportDealTariff(gameState: GameState, importDeal: ImportDeal): number {
	return importDeal.tariffPerForeignTradePosition * (2 - gameState.policies["Foreign Trade"].state)
}

export function getImportDealPrice(gameState: GameState, importDeal: ImportDeal): number {
	return importDeal.baseCost + getImportDealTariff(gameState, importDeal)
}


export function isCompanyOperational(company: Company) {
	const companyType = getCompanyType(company)
	return company.workers.length >= companyType.workerSlots.filter(slot => slot.productionBonus === undefined).length
}

export function isCompanyFullyOperational(company: Company) {
	const companyType = getCompanyType(company)
	return company.workers.length === companyType.workerSlots.length
}

export function isStrikeTarget(company: Company): boolean {
	const maxWageLevel = getCompanyType(company).wageLevels.length - 1
	return !company.onStrike
		&& company.workers.some(worker => worker.class === "Working Class")
		&& !company.workers.some(worker => worker.committed)
		&& company.wageLevel < maxWageLevel
}

export function getStrikeTargets(gameState: GameState): Array<Company> {
	return gameState.classes.flatMap(classState => classState.companies).filter(isStrikeTarget)
}

export function getTurn(gameState: GameState) {
	return {
		roundNumber: Math.floor(gameState.turnIndex / (4 * 5)) + 1,
		turnNumber: Math.floor((gameState.turnIndex % (4 * 5)) / 4) + 1,
		turnPlayerClassName: gameState.classes[gameState.turnIndex % 4].className
	}
}

export function changeMoney(classState: ClassState, delta: number) {
	if (delta > 0) {
		classState.cash += delta
	} else {
		let remainingDue = -delta

		const cashPaid = Math.min(classState.cash, remainingDue)
		classState.cash -= cashPaid
		remainingDue -= cashPaid

		if (remainingDue > 0 && classState.className === "Capitalist Class") {
			const capitalistState = classState as CapitalistClassState

			const capitalPaid = Math.min(capitalistState.capital, remainingDue)
			capitalistState.capital -= capitalPaid
			remainingDue -= capitalPaid
		}

		while (remainingDue > 0) {
			classState.loans += 1

			if (classState.className === "Capitalist Class") {
				const capitalistState = classState as CapitalistClassState

				capitalistState.capital += 50

				const loanPaid = Math.min(50, remainingDue)
				capitalistState.capital -= loanPaid
				remainingDue -= loanPaid
			} else {
				classState.cash += 50

				const loanPaid = Math.min(50, remainingDue)
				classState.cash -= loanPaid
				remainingDue -= loanPaid
			}
		}
	}
}

export function changeCredibility(gameState: GameState, playerClassName: Exclude<PlayerClassName, "State">, delta: number) {
	gameState.classes[3].credibility[playerClassName] = Math.max(1, gameState.classes[3].credibility[playerClassName] + delta)
}

export function changeStoredGoods(classState: ClassState, industryName: IndustryName, delta: number, preferExportOnlyGoods: boolean) {
	const exportOnlyGoods = (classState as CapitalistClassState).exportOnlyGoods
	const hasExportOnlyGoods = exportOnlyGoods !== undefined && industryName in exportOnlyGoods
	const exportOnlyGoodsKey = industryName as keyof CapitalistClassState["exportOnlyGoods"]
	const maxStorage: number = getMaxStorage(classState, industryName)

	if (preferExportOnlyGoods && hasExportOnlyGoods && delta > 0) {
		const maxExportOnlyGoods: number = MAX_EXPORT_ONLY_GOODS[exportOnlyGoodsKey]
		const addedToExportOnlyGoods = Math.min(delta, maxExportOnlyGoods - exportOnlyGoods[exportOnlyGoodsKey])
		exportOnlyGoods[exportOnlyGoodsKey] += addedToExportOnlyGoods
		delta -= addedToExportOnlyGoods
	}

	const newQuantityUnbounded: number = classState.storedGoods[industryName].quantity + delta
	classState.storedGoods[industryName].quantity = Math.min(newQuantityUnbounded, maxStorage)
	if (classState.storedGoods[industryName].quantity < 0)
		throw new Error(`${classState.className}'s ${industryName} has gone to ${classState.storedGoods[industryName].quantity}`)

	if (newQuantityUnbounded > maxStorage && hasExportOnlyGoods) {
		const maxExportOnlyGoods: number = MAX_EXPORT_ONLY_GOODS[exportOnlyGoodsKey]
		exportOnlyGoods[exportOnlyGoodsKey] =
			Math.min(exportOnlyGoods[exportOnlyGoodsKey] + newQuantityUnbounded - maxStorage, maxExportOnlyGoods)
	}
}

export function increaseProsperity(classState: WorkingClassState | MiddleClassState) {
	classState.prosperity += 1
	classState.vp += classState.prosperity
}

export function produceForCompany(gameState: GameState, classState: ClassState, company: Company) {
	const companyType = getCompanyType(company)
	const production = sum([
		companyType.production,
		...company.workers.map((_, index) => companyType.workerSlots[index].productionBonus ?? 0)
	])
	if (classState.className === "Working Class") {
		classState.consumableGoods[companyType.industry] += production
	} else {
		changeStoredGoods(classState, companyType.industry, production, false)
	}

	const workerSlotsWithWorker = companyType.workerSlots.map((workerSlot, index) => {
		return {
			...workerSlot,
			worker: company.workers.length > index ? company.workers[index] : undefined
		}
	})

	const mainWorkerSlots = workerSlotsWithWorker.filter(workerSlot => workerSlot.productionBonus === undefined)
	const bonusWorkerSlots = workerSlotsWithWorker.filter(workerSlot => workerSlot.productionBonus !== undefined)
	;[mainWorkerSlots, bonusWorkerSlots].filter(x => x.length > 0).forEach(workerSlotsGroup => {
		const takesWage = !(["Machine", "Middle Class"] as Array<WorkerClass | undefined>).includes(workerSlotsGroup[0].classRequirement)
			&& workerSlotsGroup[0].worker !== undefined
		if (takesWage) {
			const wageAmount: number = companyType.wageLevels[company.wageLevel]
			changeMoney(classState, -wageAmount)
			changeMoney(getClassState(gameState, workerSlotsGroup[0].worker!.class as PlayerClassName), wageAmount)
		}
	})
}

export function doEndOfRoundScoringChanges(gameState: GameState) {
	const workingClassState: WorkingClassState = getWorkingClassState(gameState)
	const numUnionLeaders: number = Object.values(workingClassState.unionLeaders).filter(worker => worker !== undefined).length
	workingClassState.vp += 2 * numUnionLeaders

	const middleClassState: MiddleClassState = getMiddleClassState(gameState)
	const numFullyOperationalCompanies: number = middleClassState.companies.filter(isCompanyFullyOperational).length
	if (middleClassState.prosperity < numFullyOperationalCompanies) increaseProsperity(middleClassState)

	const capitalistClassState: CapitalistClassState = getCapitalistClassState(gameState)
	capitalistClassState.capital += capitalistClassState.cash
	capitalistClassState.cash = 0
	const oldPeakWealthTier: number = capitalistClassState.peakWealthTier
	const currentWealthTier: number = capitalToWealthTier(capitalistClassState.capital)
	const newPeakWealthTier: number = Math.max(oldPeakWealthTier, currentWealthTier)
	capitalistClassState.vp += currentWealthTier + 1
	capitalistClassState.vp += 3 * (newPeakWealthTier - oldPeakWealthTier)
	capitalistClassState.peakWealthTier = newPeakWealthTier

	const stateClassState: StateClassState = getStateClassState(gameState)
	stateClassState.vp += sum(Object.values(stateClassState.credibility).sort((a, b) => a - b).slice(0, 1))
	stateClassState.credibility = Object.fromEntries(Object.entries(stateClassState.credibility)
		.map(([k, v]) => [k, Math.ceil(v / 2)])) as any
}