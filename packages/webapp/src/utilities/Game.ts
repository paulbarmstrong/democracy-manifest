import { INDUSTRIES, PLAYER_CLASSES, WAREHOUSE_CAPACITIES } from "./Constants"
import { CapitalistClassState, ClassState, Industry, IndustryName, MiddleClassState, PlayerClass, PlayerClassName, WorkerClass } from "./Types"

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