import { take } from "lodash"
import { Action, CompanyType, ExportDeals, GameState, ImportDeal, Industry, PlayerClass, Policy, StateClassState } from "./Types"
import { getClassState, getImportPrice, getIndustry } from "./Game"
import { isAre, s } from "./Misc"

export const COMPANY_SIZE_PX = 220
export const ACTION_SIZE_PX = 500
export const SIDEBAR_WIDTH_PX = 250
export const MENU_WIDTH: string = "max(35vw, min(500px, 100%))"

export const BACKGROUND_SHADE_T0 = "#374247"
export const BACKGROUND_SHADE_T1 = "#2b3438"
export const ACCENT_COLOR_SATURATION = 25
export const ACCENT_COLOR_LIGHTNESS = 45

export const MATERIAL_ICON_NAME_MAPPINGS = {
	"tax-multiplier": "receipt_long",
	"vote": "gavel",
	"infinity": "all_inclusive",
	"produces": "arrow_right_alt",
	"credibility": "thumb_up",
	"prosperity": "sentiment_satisfied",
	"vp": "award_star",
	"drawn": "casino"
}

export const PLAYER_CLASS_CREDIBILITY_ICON_CLASS_MAPPINGS = {
	"working-class-credibility": "Working Class",
	"middle-class-credibility": "Middle Class",
	"capitalist-class-credibility": "Capitalist Class"
}

export const MAX_CREDIBILITY_PER_CLASS = 10
export const TOTAL_NUM_VOTING_CUBES_PER_CLASS = 25

export const BASE_FOOD_IMPORT_PRICE = 10
export const BASE_LUXURY_IMPORT_PRICE = 6

export const INDUSTRIES: Array<Industry> = [
	{name: "Food", hue: 120},
	{name: "Luxury", hue: 210},
	{name: "Healthcare", hue: 0},
	{name: "Education", hue: 30},
	{name: "Influence", hue: 260}
]

export const WAREHOUSE_CAPACITIES = {
	Food: 8,
	Luxury: 12,
	Healthcare: 12,
	Education: 8,
	Influence: 0
}

export const WEALTH_TIER_THRESHOLDS = [10, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500]

export const PLAYER_CLASSES: Array<PlayerClass> = [
	{
		name: "Working Class",
		hue: 300,
		maxCompanies: 2,
		baseStorages: {
			Food: 0,
			Luxury: 0,
			Education: 0,
			Healthcare: 0,
			Influence: 0
		},
		storagePriceOptions: {
			Food: [],
			Luxury: [],
			Education: [],
			Healthcare: [],
			Influence: []
		}
	}, {
		name: "Middle Class",
		hue: 60,
		maxCompanies: 8,
		baseStorages: {
			Food: 8,
			Luxury: 8,
			Education: 8,
			Healthcare: 8,
			Influence: 0
		},
		storagePriceOptions: {
			Food: [9, 12, 15],
			Luxury: [5, 8, 10],
			Education: [5, 8, 10],
			Healthcare: [5, 8, 10],
			Influence: []
		}
	}, {
		name: "Capitalist Class",
		hue: 180,
		maxCompanies: 12,
		baseStorages: {
			Food: 8,
			Luxury: 12,
			Education: 12,
			Healthcare: 12,
			Influence: 0
		},
		storagePriceOptions: {
			Food: [9, 12, 15],
			Luxury: [5, 8, 10],
			Education: [5, 8, 10],
			Healthcare: [5, 8, 10],
			Influence: []
		}
	}, {
		name: "State",
		maxCompanies: 9,
		baseStorages: {
			Food: 6,
			Luxury: 6,
			Education: 6,
			Healthcare: 6,
			Influence: 6
		},
		storagePriceOptions: {
			Food: [12],
			Luxury: [8],
			Education: [0, 5, 10],
			Healthcare: [0, 5, 10],
			Influence: [10]
		}
	}
]

export const IMPORT_DEALS: Array<ImportDeal> = [
	{
		foodQuantity: 7,
		luxuryQuantity: 5,
		cost: {
			0: 84,
			1: 82,
			2: 70
		}
	},
	{
		foodQuantity: 0,
		luxuryQuantity: 8,
		cost: {
			0: 46,
			1: 38,
			2: 30
		}
	}
]

export const EXPORT_DEALS: Array<ExportDeals> = [
	[
		{quantity: 3, industry: "Food", award: 25},
		{quantity: 6, industry: "Food", award: 50},
		{quantity: 3, industry: "Luxury", award: 20},
		{quantity: 7, industry: "Luxury", award: 50},
		{quantity: 3, industry: "Healthcare", award: 20},
		{quantity: 7, industry: "Healthcare", award: 40},
		{quantity: 2, industry: "Education", award: 15},
		{quantity: 7, industry: "Education", award: 55}
	]
]

export const COMPANY_TYPES: Array<CompanyType> = [
	{
		name: "Clinic",
		industry: "Healthcare",
		production: 6,
		price: 16,
		wageLevels: [10, 20, 30],
		workerSlots: [
			{skilled: false},
			{skilled: false},
			{skilled: false, classRequirement: "Machine", productionBonus: 2}
		]
	},
	{
		name: "Shopping Mall",
		industry: "Luxury",
		production: 6,
		price: 16,
		wageLevels: [15, 20, 25],
		workerSlots: [
			{skilled: true},
			{skilled: false},
			{skilled: false, classRequirement: "Machine", productionBonus: 2}
		]
	},
	{
		name: "Convenience Store",
		industry: "Food",
		production: 2,
		price: 14,
		wageLevels: [6, 8, 10],
		workerSlots: [
			{skilled: true, classRequirement: "Middle Class"},
			{skilled: false, classRequirement: "Working Class", productionBonus: 1}
		]
	},
	{
		name: "University",
		industry: "Education",
		production: 6,
		price: 30,
		wageLevels: [25, 30, 35],
		workerSlots: [
			{skilled: true},
			{skilled: false},
			{skilled: false}
		]
	},
	{
		name: "NPR",
		industry: "Influence",
		production: 4,
		price: 30,
		wageLevels: [25, 30, 35],
		workerSlots: [
			{skilled: true},
			{skilled: false},
			{skilled: false}
		]
	}
]

export const POLICIES: Array<Policy> = [
	{name: "Fiscal Policy", hue: 210, content: [0, 1, 2].map(level => `State may have ${3*(3-level)} companies, but ${level === 2 ? "one" : "two"} unpaid loan${level === 2 ? "" : "s"} triggers IMF`)},
	{name: "Labor Market", hue: 260, content: ["High minimum wage", "Medium minimum wage", "Low minimum wage"]},
	{name: "Taxation", hue: 280, content: [0, 1, 2].map(level => `+${3-level} <tax-multiplier>, and the Healthcare and Education policies' <tax-multiplier> are ${2-level}x`)},
	{name: "Healthcare", hue: getIndustry("Healthcare").hue, content: [0, 1, 2].map(level => `+${2-level} <tax-multiplier>, and public <Healthcare> costs ${level * 5}`)},
	{name: "Education", hue: getIndustry("Education").hue, content: [0, 1, 2].map(level => `+${2-level} <tax-multiplier>, and public <Education> costs ${level * 5}`)},
	{name: "Foreign Trade", hue: 90, content: [0, 1, 2].map(level => `${50 * (2-level)}% tariffs cause imports of <Food> to cost ${getImportPrice("Food", level)}, imports of <Luxury> to cost ${getImportPrice("Luxury", level)}, and ${level} trade deal${s(level)} ${isAre(level)} drawn`)},
	{name: "Immigration", hue: 135, content: [0, 1, 2].map(level => `+${level} middle class and working class workers per round`)}
]

export const DRAWN_ACTIONS: Array<Action> = [
	{name: "Need for change", type: "drawn", playerClasses: ["Working Class", "Middle Class", "Capitalist Class", "State"], description: "Pay $25 to propose 2 bills."},
	{name: "Public opinion polling", type: "drawn", playerClasses: ["Working Class", "Middle Class", "Capitalist Class", "State"], description: "Propose a bill and reveal a political pressure result. You may call for an immediate vote on it without using <Influence>, and using that political pressure result."},
	{name: "State scholarship", type: "drawn", playerClasses: ["Working Class", "Middle Class"], description: "Buy <Education> from the State, up to half of your population. Pay half price (rounded up).", requiredPolicy: {name: "Education", states: [1,2]}, credibilityDescription: ["+1 <middle-class-credibility>"]},
	{name: "Workplace accident", type: "drawn", playerClasses: ["Working Class"], description: "Choose an industry. Get $8 from another player for each of their companies of that industry with your workers."},
	{name: "Push political agenda", type: "drawn", playerClasses: ["Capitalist Class"], description: "Pay $25 to propose 2 bills."},
	{name: "Extra shift", type: "drawn", playerClasses: ["Capitalist Class"], description: "Choose one of your non-automated companies. Pay wages and produce."},
	{name: "Bid rigging", type: "drawn", playerClasses: ["Capitalist Class"], description: "Sell up to 6 <Luxury> to the state for $10 each. Get 1 <Influnce>", credibilityDescription: ["+1 <capitalist-class-credibility> per 3 <Luxury>"]},
	{name: "Cooperative farm", type: "drawn", playerClasses: ["Working Class"], description: "If you have at least 3 unemployed workers, build a Cooperative Farm and assign three workers there."},
	{name: "Health crisis", type: "drawn", playerClasses: ["Capitalist Class"], description: "Sell up to 9 <Healthcare> to the State for $10 each.", credibilityDescription: ["+1 <capitalist-class-credibility> per 3 <Healthcare>"]},
	{name: "Higher education program", type: "drawn", playerClasses: ["Capitalist Class"], description: "Sell up to 9 <Education> to the State for $10 each.", credibilityDescription: ["+1 <capitalist-class-credibility> per 3 <Education>"]},
	{name: "Healthcare benefits", type: "drawn", playerClasses: ["Working Class"], description: "Buy <Healthcare> from the State, up to your population, for half the cost (rounded up).", requiredPolicy: {name: "Healthcare", states: [1,2]}},
	{name: "Immediate response", type: "drawn", playerClasses: ["State"], description: "Perform an event's action twice."},
	{name: "Foreign partner", type: "drawn", playerClasses: ["Capitalist Class"], description: "Make an import deal. You may then make export deals.", requiredPolicy: {name: "Foreign Trade", states: [1,2]}},
	{name: "Construction boom", type: "drawn", playerClasses: ["State"], description: "State, Working Class, and Capitalist Class each get $15.", credibilityDescription: ["+1 <working-class-credibility>", "+1 <capitalist-class-credibility>"]}
]

export const BASIC_ACTIONS: Array<Action> = [
	{name: "Propose bill",
		type: "basic",
		playerClasses: ["Working Class", "Middle Class", "Capitalist Class", "State"],
		description: "Select a policy and a position adjacent to its existing position. The vote will take place in the election phase, or may triggered immediately vote using 1 <Influence>.",
		isPossible: (gameState: GameState, _) => Object.values(gameState.policies).filter(x => x.proposal !== undefined).length < 3,
		execute: async (gameState, setGameState, playerClass, setText, selectPolicyPosition) => {
			setText("Select a policy position adjacent to that policy's existing position.")
			const policyPosition = await selectPolicyPosition(policyPosition => Math.abs(gameState.current.policies[policyPosition.name].state - policyPosition.position) === 1 && gameState.current.policies[policyPosition.name].proposal === undefined)
			gameState.current.policies[policyPosition.name].proposal = {playerClassName: playerClass.name, proposedState: policyPosition.position}
			setGameState(gameState.current)
		}
	},
	{name: "Address event", type: "basic", playerClasses: ["State"], description: "Address one of the State events."},
	{name: "Show support", type: "basic", playerClasses: ["State"], description: "Give 2 of your <Influence> to another class for +1 <credibility> with that class."},
	{name: "Collect extra tax", type: "basic", playerClasses: ["State"], description: "Get $10 from each class and -1 <credibility> from the 2 classes with the lowest <credibility>."},
	{name: "Campaign", type: "basic", playerClasses: ["State"], description: "Convert up to 3 stored <Influence> to consumable <Influence>."},
	{name: "Assign workers", type: "basic", playerClasses: ["Working Class", "Middle Class"], description: "Choose up to 3 of your Workers on the board and place them on the corresponding slots of available Companies."},
	{name: "Purchase company", type: "basic", playerClasses: ["Middle Class", "Capitalist Class"], description: "Purchase a company from your company market for its listed price."},
	{name: "Sell company", type: "basic", playerClasses: ["Middle Class", "Capitalist Class"], description: "Remove one of your companies and gain its listed price."},
	{name: "Make export deals", type: "basic", playerClasses: ["Middle Class", "Capitalist Class", "State"], description: "Complete any number of export deals a maximum of 1 time."},
	{name: "Make import deal", type: "basic", playerClasses: ["Capitalist Class"], description: "Perform an import deal once."},
	{name: "Lobby", type: "basic", playerClasses: ["Capitalist Class"], description: "Spend $30 from capital to gain 3 Influence"},
	{name: "Buy goods", type: "basic", playerClasses: ["Working Class", "Middle Class"], description: "Buy a single type of good from up to two sellers. The number of goods must be less than or equal to your population."},
	{name: "Work extra shift", type: "basic", playerClasses: ["Middle Class"], description: "Choose one of your companies with non-committed Middle Class workers. Pay wages and produce."},
	{name: "Strike", type: "basic", playerClasses: ["Working Class"], description: "Choose 2 companies where your workers work, with no committed workers, and without the maximum wage level. Those companies will not not function if they have not increased to thew maximum wage level by the production phase."},
	{name: "Demonstrate", type: "basic", playerClasses: ["Working Class"], description: "When played then if the following remains true till the production phase then gain 1 <Influence> and other players lose VP: The number of your unemployed workers is at least 2 more than the number of unoccupied worker slots."},
	{
		name: "Apply political pressure",
		type: "basic",
		playerClasses: ["Working Class", "Middle Class", "Capitalist Class"],
		description: "Add 3 political pressure.",
		execute: async (gameState, setGameState, playerClass, setText) => {
			const playerClassName = playerClass.name as "Working Class" | "Middle Class" | "Capitalist Class"
			gameState.current.politicalPressure[playerClassName] = Math.min(gameState.current.politicalPressure[playerClassName] + 3, 25)
			setGameState(gameState.current)
		},
		isPossible: (gameState, playerClass) => {
			const playerClassName = playerClass.name as "Working Class" | "Middle Class" | "Capitalist Class"
			return gameState.politicalPressure[playerClassName] < 25
		}
	}
]

export const FREE_ACTIONS: Array<Action> = [
	{name: "Consume healthcare", type: "free", playerClasses: ["Working Class", "Middle Class"], description: "Consume healthcare equal to your population to gain 1 <prosperity>, 2 <vp>, and a new unskilled worker."},
	{name: "Consume education", type: "free", playerClasses: ["Working Class", "Middle Class"], description: "Consume education equal to your population to gain 1 <prosperity> and educate one of your unskilled workers."},
	{name: "Consume luxury", type: "free", playerClasses: ["Working Class", "Middle Class"], description: "Consume luxury equal to your population to gain 1 <vp>."},
	{name: "Adjust prices", type: "free", playerClasses: ["Middle Class", "Capitalist Class"], description: "Change the sell prices of the goods in your storages."},
	{name: "Adjust wages", type: "free", playerClasses: ["Middle Class", "Capitalist Class", "State"], description: "Change the wage levels of your companies."},
	{name: "Give bonus", type: "free", playerClasses: ["Capitalist Class"], description: "Pay the class of the workers in one of your companies $5 in order to commit them."},
	{name: "Buy warehouse", type: "free", playerClasses: ["Capitalist Class"], description: "Pay $20 to gain a warehouse to store more of one type of good."},
	{name: "Swap workers", type: "free", playerClasses: ["Working Class", "Middle Class"], description: "Swap any number of workers in unskilled slots with unemployed workers."},
	{
		name: "Claim state benefits",
		type: "free",
		playerClasses: ["Working Class", "Middle Class", "Capitalist Class"],
		description: "Claim whatever is in the State benefits section for your class. +1 <vp> to the State.",
		isPossible: (gameState, playerClass) => {
			const playerClassName = playerClass.name as "Working Class" | "Middle Class" | "Capitalist Class"
			return (getClassState(gameState, "State") as StateClassState).stateBenefits[playerClassName] > 0
		},
		execute: async (gameState, setGameState, playerClass, setText, selectPolicyPosition) => {
			const playerClassName = playerClass.name as "Working Class" | "Middle Class" | "Capitalist Class"
			const stateClassState: StateClassState = getClassState(gameState.current, "State") as StateClassState
			getClassState(gameState.current, playerClassName).cash += stateClassState.stateBenefits[playerClassName]
			stateClassState.stateBenefits[playerClassName] = 0
			setGameState(gameState.current)
		}
	},
	{name: "Pay off loan", type: "free", playerClasses: ["Working Class", "Middle Class", "Capitalist Class", "State"], description: "Spend $50 to remove a loan."}
]

export const GAME_STATE: GameState = {
	policies: {
		"Fiscal Policy": {
			state: 0
		},
		"Labor Market": {
			state: 0
		},
		"Taxation": {
			state: 1,
			proposal: {
				playerClassName: "Working Class",
				proposedState: 2
			}
		},
		"Healthcare": {
			state: 2
		},
		"Education": {
			state: 2
		},
		"Foreign Trade": {
			state: 2
		},
		"Immigration": {
			state: 2
		}
	},
	politicalPressure: {
		"Working Class": 7,
		"Middle Class": 8,
		"Capitalist Class": 3
	},
	importDeals: [0, 1],
	exportDeals: 0,
	classes: [
		{
			className: "Working Class",
			cash: 20,
			drawnActions: take(DRAWN_ACTIONS.filter(x => x.playerClasses.includes("Working Class")), 4).map(x => DRAWN_ACTIONS.indexOf(x)),
			storedGoods: {
				Food: {quantity: 0, price: 0},
				Luxury: {quantity: 0, price: 0},
				Healthcare: {quantity: 0, price: 0},
				Education: {quantity: 0, price: 0},
				Influence: {quantity: 0, price: 0}
			},
			consumableGoods: {
				Food: 0,
				Luxury: 2,
				Healthcare: 0,
				Education: 0,
				Influence: 0
			},
			companies: [],
			prosperity: 0,
			unionLeaders: {
				Food: {class: "Working Class", skill: "Food", committed: false}
			}
		},
		{
			className: "Middle Class",
			cash: 40,
			drawnActions: take(DRAWN_ACTIONS.filter(x => x.playerClasses.includes("Middle Class")), 4).map(x => DRAWN_ACTIONS.indexOf(x)),
			storedGoods: {
				Food: {quantity: 2, price: 12},
				Luxury: {quantity: 0, price: 8},
				Healthcare: {quantity: 0, price: 8},
				Education: {quantity: 0, price: 8},
				Influence: {quantity: 0, price: 0}
			},
			consumableGoods: {
				Food: 0,
				Luxury: 0,
				Healthcare: 3,
				Education: 3,
				Influence: 0
			},
			warehouses: [],
			companies: [
				{
					name: "Convenience Store",
					wageLevel: 0,
					workers: [
						{class: "Middle Class", skill: "Food", committed: false},
						{class: "Working Class", committed: false}
					]
				}
			],
			prosperity: 0
		},
		{
			className: "Capitalist Class",
			cash: 60,
			drawnActions: take(DRAWN_ACTIONS.filter(x => x.playerClasses.includes("Capitalist Class")), 4).map(x => DRAWN_ACTIONS.indexOf(x)),
			storedGoods: {
				Food: {quantity: 2, price: 12},
				Luxury: {quantity: 25, price: 8},
				Healthcare: {quantity: 0, price: 8},
				Education: {quantity: 0, price: 8},
				Influence: {quantity: 0, price: 0}
			},
			consumableGoods: {
				Food: 0,
				Luxury: 0,
				Healthcare: 0,
				Education: 0,
				Influence: 5
			},
			warehouses: ["Luxury", "Luxury"],
			companies: [
				{
					name: "Clinic",
					wageLevel: 1,
					workers: [
						{class: "Middle Class", committed: true},
						{class: "Middle Class", skill: "Influence", committed: true}
					]
				},
				{
					name: "Shopping Mall",
					wageLevel: 1,
					workers: [
						{class: "Working Class", skill: "Luxury", committed: false},
						{class: "Working Class", skill: "Healthcare", committed: false},
						{class: "Machine", committed: false}
					]
				}
			],
			capital: 62,
			numSpareMachines: 2,
			peakWealthTier: 7
		},
		{
			className: "State",
			cash: 50,
			drawnActions: take(DRAWN_ACTIONS.filter(x => x.playerClasses.includes("State")), 4).map(x => DRAWN_ACTIONS.indexOf(x)),
			storedGoods: {
				Food: {quantity: 0, price: 12},
				Luxury: {quantity: 0, price: 8},
				Healthcare: {quantity: 0, price: 5},
				Education: {quantity: 6, price: 5},
				Influence: {quantity: 0, price: 10}
			},
			consumableGoods: {
				Food: 0,
				Luxury: 0,
				Healthcare: 0,
				Education: 0,
				Influence: 0
			},
			companies: [
				{
					name: "University",
					wageLevel: 1,
					workers: [
						{class: "Middle Class", skill: "Education", committed: false},
						{class: "Middle Class", committed: false},
						{class: "Middle Class", committed: false}
					]
				},
				{
					name: "NPR",
					wageLevel: 0,
					workers: []
				}
			],
			credibility: {
				"Working Class": 3,
				"Middle Class": 2,
				"Capitalist Class": 1
			},
			stateBenefits: {
				"Working Class": 0,
				"Middle Class": 10,
				"Capitalist Class": 0
			}
		}
	],
	unemployedWorkers: [
		{class: "Middle Class", skill: "Education", committed: false},
		{class: "Middle Class", skill: "Influence", committed: false},
		{class: "Middle Class", committed: false},
		{class: "Working Class", skill: "Luxury", committed: false},
		{class: "Working Class", committed: false},
		{class: "Working Class", committed: false}
	]
}