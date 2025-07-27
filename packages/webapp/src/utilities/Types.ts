export type PlayerClassName = "Working Class" | "Middle Class" | "Capitalist Class" | "State"

export type PlayerClass = {
	name: PlayerClassName,
	hue?: number,
	maxCompanies: number,
	baseStorages: {
		Food: number,
		Luxury: number,
		Healthcare: number,
		Education: number,
		Influence: number
	},
	storagePriceOptions: {
		Food: Array<number>,
		Luxury: Array<number>,
		Healthcare: Array<number>,
		Education: Array<number>,
		Influence: Array<number>
	}
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

export type IndustryName = "Food" | "Luxury" | "Healthcare" | "Education" | "Influence"

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

type CommonClassState = {
	className: PlayerClassName,
	cash: number,
	storedGoods: {
		Food: {quantity: number, price: number},
		Luxury: {quantity: number, price: number},
		Healthcare: {quantity: number, price: number},
		Education: {quantity: number, price: number},
		Influence: {quantity: number, price: number}
	},
	consumableGoods: {
		Food: number,
		Luxury: number,
		Healthcare: number,
		Education: number,
		Influence: number
	}
	companies: Array<Company>
}

export type WorkingClassState = CommonClassState & {
	prosperity: number,
	unionLeaders: {
		Food?: Worker,
		Luxury?: Worker,
		Healthcare?: Worker,
		Education?: Worker,
		Influence?: Worker
	}
}

export type MiddleClassState = CommonClassState & {
	prosperity: number,
	warehouses: Array<Exclude<IndustryName, "Influence">>
}

export type CapitalistClassState = CommonClassState & {
	capital: number,
	machines: number,
	peakWealthTier: number,
	warehouses: Array<Exclude<IndustryName, "Influence">>
}

export type ClassState = WorkingClassState | MiddleClassState | CapitalistClassState | StateClassState

export type StateClassState = CommonClassState & {
	credibility: {
		"Working Class": number,
		"Middle Class": number,
		"Capitalist Class": number
	}
}

export type GameState = {
	classes: [WorkingClassState, MiddleClassState, CapitalistClassState, StateClassState],
	unemployedWorkers: Array<Worker>
}