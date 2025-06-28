import convert from "color-convert"
import { INDUSTRIES, PLAYER_CLASSES } from "./Constants"
import { Industry, IndustryName, PlayerClass, PlayerClassName, Worker, WorkerClass } from "./Types"

export function getIndustry(industryName: IndustryName): Industry {
	return INDUSTRIES.find(industry => industry.name === industryName)!
}

export function getPlayerClass(playerClassName: PlayerClassName): PlayerClass {
	return PLAYER_CLASSES.find(playerClass => playerClass.name === playerClassName)!
}

export function getWorkerColor(worker: Worker): string {
	if (worker.skill !== undefined) {
		const industry = getIndustry(worker.skill)
		return "#"+convert.hsl.hex([industry.hue ?? 0, 60, 70])
	} else {
		return "#"+convert.hsl.hex([0, 0, 65])
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