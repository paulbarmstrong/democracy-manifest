import _, { sum } from "lodash"
import { BASE_FOOD_IMPORT_PRICE, BASE_LUXURY_IMPORT_PRICE, COMPANY_TYPES, INDUSTRIES, PLAYER_CLASSES, WAREHOUSE_CAPACITIES, WEALTH_TIER_THRESHOLDS } from "./Constants"
import { CapitalistClassState, ClassState, Company, CompanyType, GameState, Industry, IndustryName, MiddleClassState, PlayerClass, PlayerClassName, WorkerClass } from "./Types"

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

export function getMaxStorage(classState: ClassState, industryName: IndustryName): number {
	const playerClass: PlayerClass = getPlayerClass(classState.className)
	const baseStorage: number = playerClass.baseStorages[industryName]
	const warehouseStorage: number = ((classState as MiddleClassState | CapitalistClassState).warehouses ?? [])
		.filter(warehouse => warehouse === industryName).length * WAREHOUSE_CAPACITIES[industryName]
	return baseStorage + warehouseStorage
}

export function capitalToWealthTier(capital: number): number {
	for (let i = WEALTH_TIER_THRESHOLDS.length-1; i--; i >= 0) {
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

export function isCompanyOperational(company: Company) {
	const companyType = getCompanyType(company)
	return company.workers.length >= companyType.workerSlots.filter(slot => slot.productionBonus === undefined).length
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
			classState.cash += 50

			const loanPaid = Math.min(50, remainingDue)
			classState.cash -= loanPaid
			remainingDue -= loanPaid
		}
	}
}

export function changeCredibility(gameState: GameState, playerClassName: Exclude<PlayerClassName, "State">, delta: number) {
	gameState.classes[3].credibility[playerClassName] = Math.max(1, gameState.classes[3].credibility[playerClassName] + delta)
}

export function changeStoredGoods(classState: ClassState, industryName: IndustryName, delta: number) {
	classState.storedGoods[industryName].quantity =
		Math.min(classState.storedGoods[industryName].quantity + delta, getMaxStorage(classState, industryName))
	if (classState.storedGoods[industryName].quantity < 0)
		throw new Error(`${classState.className}'s ${industryName} has gone to ${classState.storedGoods[industryName].quantity}`)
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
		changeStoredGoods(classState, companyType.industry, production)
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