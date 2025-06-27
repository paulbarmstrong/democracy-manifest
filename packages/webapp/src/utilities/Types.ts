

export type PlayerClass = {
	name: string,
	colorT0: string,
	hue: number,
	maxCompanies: number
}

export type CompanyType = {
	name: string,
	industry: Industry,
	production: number,
	wageLevels: {
		low: number,
		medium: number,
		high: number
	},
	workerSlots: Array<{
		classRequirement?: WorkerClass,
		skilled: boolean,
		productionBonus?: number
	}>
}

export type WorkerClass = "Middle Class" | "Working Class" | "Machine"

export type Industry = "Food" | "Luxury" | "Healthcare" | "Education" | "Media"

export type Worker = {
	class: WorkerClass
	skill?: Industry
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