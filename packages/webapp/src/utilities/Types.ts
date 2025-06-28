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
	skill?: IndustryName
}

export type GameState = {
	players: Array<{
		className: "Working Class" | "Middle Class" | "Capitalist Class" | "State",
		companies: Array<{
			name: string,
			wageLevel: "low" | "medium" | "high",
			workers: Array<Worker>
		}>
	}>
}