import { BASE_FOOD_IMPORT_PRICE, BASE_LUXURY_IMPORT_PRICE, INDUSTRIES, PLAYER_CLASSES, WAREHOUSE_CAPACITIES, WEALTH_TIER_THRESHOLDS } from "./Constants"
import { CapitalistClassState, ClassState, GameState, Industry, IndustryName, MiddleClassState, PlayerClass, PlayerClassName, WorkerClass } from "./Types"

export function getIndustry(industryName: IndustryName): Industry {
	return INDUSTRIES.find(industry => industry.name === industryName)!
}

export function getPlayerClass(playerClassName: PlayerClassName): PlayerClass {
	return PLAYER_CLASSES.find(playerClass => playerClass.name === playerClassName)!
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