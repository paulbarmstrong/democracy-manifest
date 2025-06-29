import convert from "color-convert"
import { INDUSTRIES, PLAYER_CLASSES } from "./Constants"
import { Industry, IndustryName, PlayerClass, PlayerClassName, Worker, WorkerClass } from "./Types"
import { getColor } from "./Color"

export function getIndustry(industryName: IndustryName): Industry {
	return INDUSTRIES.find(industry => industry.name === industryName)!
}

export function getPlayerClass(playerClassName: PlayerClassName): PlayerClass {
	return PLAYER_CLASSES.find(playerClass => playerClass.name === playerClassName)!
}

export function getWorkerColor(worker: Worker): string {
	if (worker.skill !== undefined) {
		return getColor(getIndustry(worker.skill).hue, 0)
	} else {
		return getColor(undefined, 0)
	}
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