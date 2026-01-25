import { z } from "zod"
import { playerClassNameZod, tabNameZod } from "./Zod"
import { ImmutableRefObject } from "../classes/ImmutableRefObject"

export type PlayerClassName = z.infer<typeof playerClassNameZod>

export type TabName = z.infer<typeof tabNameZod>

export type PolicyName = "Fiscal Policy" | "Labor Market" | "Taxation" | "Healthcare" | "Education" | "Foreign Trade" | "Immigration"

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
	playerName?: string,
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
	companies: Array<Company>,
	drawnActions: Array<number>
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
	numSpareMachines: number,
	peakWealthTier: number,
	warehouses: Array<Exclude<IndustryName, "Influence">>
}

export type ClassState = WorkingClassState | MiddleClassState | CapitalistClassState | StateClassState

export type StateClassState = CommonClassState & {
	credibility: {
		"Working Class": number,
		"Middle Class": number,
		"Capitalist Class": number
	},
	stateBenefits: {
		"Working Class": number,
		"Middle Class": number,
		"Capitalist Class": number
	}
}

export type ImportDeal = {
	foodQuantity: number,
	luxuryQuantity: number,
	cost: {
		0: number,
		1: number,
		2: number
	}
}

export type ExportDeals = Array<{
	industry: IndustryName,
	quantity: number,
	award: number
}>

export type GameState = {
	turnIndex: number,
	mainActionCompleted: boolean,
	freeActionCompleted: boolean,
	vote?: PolicyName,
	policies: {
		[K in PolicyName]: {
			state: 0 | 1 | 2,
			proposal?: {
				playerClassName: PlayerClassName,
				proposedState: 0 | 1 | 2,
			},
			vote?: {
				positions: {
					[K in PlayerClassName]?: boolean
				},
				influence: {
					[K in PlayerClassName]?: number
				},
				pressure: {
					[K in Exclude<PlayerClassName, "State">]?: number
				}
			}
		}
	},
	politicalPressure: {
		"Working Class": number,
		"Middle Class": number,
		"Capitalist Class": number
	},
	importDeals: Array<number>,
	exportDeals: number,
	classes: [WorkingClassState, MiddleClassState, CapitalistClassState, StateClassState],
	unemployedWorkers: Array<Worker>
}

export type Action = {
	name: string,
	type: "drawn" | "basic" | "free",
	description: string,
	credibilityDescription?: Array<string>,
	playerClasses: Array<PlayerClassName>,
	requiredPolicy?: {
		name: PolicyName,
		states: Array<0 | 1 | 2>
	},
	isPossible?: (gameState: GameState, playerClass: PlayerClass) => boolean,
	execute?: (args: {
		gameState: ImmutableRefObject<GameState>,
		playerClass: PlayerClass,
		setText: (text: string) => void,
		selectPolicyPosition: (predicate: (policyPosition: PolicyPosition) => boolean) => Promise<PolicyPosition>
	}) => Promise<void>
}

export type ActionExecution = {
	action: Action,
	policyPositionPredicate?: (policyPosition: PolicyPosition) => boolean,
	policyPositionCallback?: (policyPosition: PolicyPosition) => void,
	text?: string
}

export type Policy = {
	name: PolicyName,
	hue: number,
	content: Array<string>
}

export type PolicyPosition = {
	name: PolicyName,
	position: 0 | 1 | 2
}