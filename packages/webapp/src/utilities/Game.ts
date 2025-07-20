import { INDUSTRIES, PLAYER_CLASSES, WAREHOUSE_CAPACITIES } from "./Constants"
import { ClassState, Industry, IndustryName, PlayerClass, PlayerClassName, WorkerClass } from "./Types"

export function getIndustry(industryName: IndustryName): Industry {
	return INDUSTRIES.find(industry => industry.name === industryName)!
}

export function getPlayerClass(playerClassName: PlayerClassName): PlayerClass {
	return PLAYER_CLASSES.find(playerClass => playerClass.name === playerClassName)!
}

export function getWorkerIconName(workerClass: WorkerClass): string {
	if (workerClass === "Working Class") {
		return "man_2"
	} else if (workerClass === "Middle Class") {
		return "man_4"
	} else {
		return "settings"
	}
}

export function getMaxStorage(classState: ClassState, industry: Industry): number {
	const playerClass: PlayerClass = getPlayerClass(classState.className)
	const baseStorage: number = playerClass.baseStorages[industry.name]
	const warehouseStorage: number = classState.warehouses
		.filter(warehouse => warehouse === industry.name).length * WAREHOUSE_CAPACITIES[industry.name]
	return baseStorage + warehouseStorage
}