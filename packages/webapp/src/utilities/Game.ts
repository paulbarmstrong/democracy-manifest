import { matchRoutes } from "react-router-dom"
import { BASE_FOOD_IMPORT_PRICE, BASE_LUXURY_IMPORT_PRICE, INDUSTRIES, PLAYER_CLASSES, WAREHOUSE_CAPACITIES, WEALTH_TIER_THRESHOLDS } from "./Constants"
import { CapitalistClassState, ClassState, GameState, Industry, IndustryName, MiddleClassState, PlayerClass, PlayerClassName, WorkerClass } from "./Types"

export function getIndustry(industryName: IndustryName): Industry {
	return INDUSTRIES.find(industry => industry.name === industryName)!
}

export function getPlayerClass(playerClassName: PlayerClassName): PlayerClass {
	return PLAYER_CLASSES.find(playerClass => playerClass.name === playerClassName)!
}

export function getClassState(gameState: GameState, playerClassName: PlayerClassName): ClassState {
	return gameState.classes.find(x => x.className === playerClassName)!
}

export function getMaxStorage(classState: ClassState, industry: Industry): number {
	const playerClass: PlayerClass = getPlayerClass(classState.className)
	const baseStorage: number = playerClass.baseStorages[industry.name]
	const warehouseStorage: number = ((classState as MiddleClassState | CapitalistClassState).warehouses ?? [])
		.filter(warehouse => warehouse === industry.name).length * WAREHOUSE_CAPACITIES[industry.name]
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