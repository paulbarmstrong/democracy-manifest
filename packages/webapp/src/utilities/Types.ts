export type PlayerClassName = "Working Class" | "Middle Class" | "Capitalist Class" | "State"

export type PlayerClass = {
	name: PlayerClassName,
	hue?: number,
	maxCompanies: number
}

export type CompanyType = {
	name: string,
	industry: IndustryName,
	production: number,
	price: number,
	wageLevels: [number, number, number],
	workerSlots: Array<{
		classRequirement?: WorkerClass,
		skilled: boolean,
		productionBonus?: number
	}>
}

export type WorkerClass = "Middle Class" | "Working Class" | "Machine"

export type IndustryName = "Food" | "Luxury" | "Healthcare" | "Education" | "Media"

export type Industry = {
	name: IndustryName,
	hue: number
}

export type Worker = {
	class: WorkerClass
	skill?: IndustryName,
	committed: boolean
}

export type Company = {
	name: string,
	wageLevel: number,
	workers: Array<Worker>
}

export type ClassState = {
	className: PlayerClassName,
	companies: Array<Company>
}

export type GameState = {
	classes: Array<ClassState>
}