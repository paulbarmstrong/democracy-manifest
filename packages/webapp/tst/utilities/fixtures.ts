import "../../src/utilities/Constants"

import {
	CapitalistClassState, GameState, MiddleClassState, PolicyName, StateClassState, WorkingClassState
} from "../../src/utilities/Types"

function freshStoredGoods() {
	return {
		Food: {quantity: 0, price: 0},
		Luxury: {quantity: 0, price: 0},
		Healthcare: {quantity: 0, price: 0},
		Education: {quantity: 0, price: 0},
		Influence: {quantity: 0, price: 0}
	}
}

function freshConsumableGoods() {
	return {Food: 0, Luxury: 0, Healthcare: 0, Education: 0, Influence: 0}
}

export function makeWorkingClassState(overrides: Partial<WorkingClassState> = {}): WorkingClassState {
	return {
		className: "Working Class",
		cash: 0,
		loans: 0,
		storedGoods: freshStoredGoods(),
		consumableGoods: freshConsumableGoods(),
		companies: [],
		drawnActions: [],
		vp: 0,
		prosperity: 0,
		unionLeaders: {},
		...overrides
	}
}

export function makeMiddleClassState(overrides: Partial<MiddleClassState> = {}): MiddleClassState {
	return {
		className: "Middle Class",
		cash: 0,
		loans: 0,
		storedGoods: freshStoredGoods(),
		consumableGoods: freshConsumableGoods(),
		companies: [],
		drawnActions: [],
		vp: 0,
		prosperity: 0,
		warehouses: [],
		...overrides
	}
}

export function makeCapitalistClassState(overrides: Partial<CapitalistClassState> = {}): CapitalistClassState {
	return {
		className: "Capitalist Class",
		cash: 0,
		loans: 0,
		storedGoods: freshStoredGoods(),
		consumableGoods: freshConsumableGoods(),
		companies: [],
		drawnActions: [],
		vp: 0,
		capital: 0,
		numSpareMachines: 0,
		peakWealthTier: 0,
		warehouses: [],
		exportOnlyGoods: {Food: 0, Luxury: 0},
		...overrides
	}
}

export function makeStateClassState(overrides: Partial<StateClassState> = {}): StateClassState {
	return {
		className: "State",
		cash: 0,
		loans: 0,
		storedGoods: freshStoredGoods(),
		consumableGoods: freshConsumableGoods(),
		companies: [],
		drawnActions: [],
		vp: 0,
		credibility: {"Working Class": 1, "Middle Class": 1, "Capitalist Class": 1},
		stateBenefits: {"Working Class": 0, "Middle Class": 0, "Capitalist Class": 0},
		...overrides
	}
}

const POLICY_NAMES: Array<PolicyName> = [
	"Fiscal Policy", "Labor Market", "Taxation", "Healthcare", "Education", "Foreign Trade", "Immigration"
]

function makePolicies(): GameState["policies"] {
	return Object.fromEntries(
		POLICY_NAMES.map(name => [name, {state: 0}])
	) as GameState["policies"]
}

export function makeGameState(overrides: Partial<GameState> = {}): GameState {
	return {
		turnIndex: 0,
		mainActionCompleted: false,
		freeActionCompleted: false,
		policies: makePolicies(),
		politicalPressure: [],
		importDeals: [],
		exportDeals: 0,
		classes: [
			makeWorkingClassState(),
			makeMiddleClassState(),
			makeCapitalistClassState(),
			makeStateClassState()
		],
		unemployedWorkers: [],
		...overrides
	}
}
