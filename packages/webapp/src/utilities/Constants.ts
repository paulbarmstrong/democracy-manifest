import { range, take } from "lodash"
import { Action, CompanyType, ExportDeals, GameState, ImportDeal, Industry, PlayerClass, PlayerClassName, Policy, StateClassState } from "./Types"
import { changeCredibility, changeMoney, getClassState, getImportPrice, getIndustry } from "./Game"
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
export const MAX_POLITICAL_PRESSURE_PER_CLASS = 25
export const NUM_POLITICAL_PRESSURE_PER_VOTE = 5

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
	{name: "Propose Bill",
		type: "basic",
		playerClasses: ["Working Class", "Middle Class", "Capitalist Class", "State"],
		description: "Place your Bill marker on a Policy section adjacent to a current Policy. You may spend 1 <Influence> to call for an Immediate Vote.",
		isPossible: ({gameState}) => Object.values(gameState.policies).filter(x => x.proposal !== undefined).length < 3,
		execute: async ({gameState, playerClass, setText, selectPolicyPosition}) => {
			setText("Select a policy position adjacent to that policy's existing position.")
			const policyPosition = await selectPolicyPosition(policyPosition => Math.abs(gameState.current.policies[policyPosition.name].state - policyPosition.position) === 1 && gameState.current.policies[policyPosition.name].proposal === undefined)
			gameState.current.policies[policyPosition.name].proposal = {playerClassName: playerClass.name, proposedState: policyPosition.position}
		}
	},
	{name: "Event Action", type: "basic", playerClasses: ["State"], description: "Perform the action listed on one of the available Events. Then discard the Event card."},
	{name: "Meet With A Party's MPS", type: "basic", playerClasses: ["State"], description: "Give 2 Personal <influence> to a player. Get +1 <credibility> to that class."},
	{name: "Extra Tax",
		type: "basic",
		playerClasses: ["State"],
		description: "Get $10 from each other player. Then get -1 <credibility> from the 2 classes with the lowest <credibility> scores.",
		execute: async ({gameState, classState}) => {
			gameState.current.classes.filter(otherClassState => otherClassState.className !== "State").forEach(otherClassState => {
				changeMoney(otherClassState, -10)
				changeMoney(classState, 10)
			})
			const stateClassState = classState as StateClassState
			const highestCredibilityPlayerClassName = Object.entries(stateClassState.credibility).sort((a, b) => b[1] - a[1])[0][0]
			PLAYER_CLASSES.filter(x => !["State", highestCredibilityPlayerClassName].includes(x.name)).forEach(playerClass => {
				changeCredibility(gameState.current, playerClass.name as Exclude<PlayerClassName, "State">, -1)
			})
		}
	},
	{name: "Campaign", type: "basic", playerClasses: ["State"], description: "Move up to 3 Media <influence> from the Main board to your player board."},
	{name: "Assign Workers", type: "basic", playerClasses: ["Working Class"], description: "Assign up to 3 of your Workers to Companies and/or Trade Unions"},
	{name: "Assign Workers", type: "basic", playerClasses: ["Middle Class"], description: "Assign up to 3 of your Workers to Companies."},
	{name: "Build Company", type: "basic", playerClasses: ["Capitalist Class"], description: "Choose a Company from your Market, pay its cost and build it. You may then Assign unemployed Workers to it if able."},
	{name: "Build Company", type: "basic", playerClasses: ["Middle Class"], description: "Choose a Company from your Market, pay its cost and build it, placing the required Middle Class Worker(s) on it. You may then Assign an unemployed Working Class Worker to that Company if able."},
	{name: "Sell Company", type: "basic", playerClasses: ["Middle Class", "Capitalist Class"], description: "Discard one of your Companies and get money equal to its cost. Any Workers on it become unemployed."},
	{name: "Sell To The Foreign Market", type: "basic", playerClasses: ["Capitalist Class", ], description: "Sell goods or services to the Foreign Market according to the current Export card."},
	{name: "Sell To The Foreign Market", type: "basic", playerClasses: ["Middle Class"], description: "Sell goods or services to the Foreign Market according to the current Export card. For each transaction performed, gain 1 <vp>."},
	{name: "Sell To The Foreign Market", type: "basic", playerClasses: ["State"], description: "Sell any number of <food> or <luxury> to the Foreign Market according to the current Export card."},
	{name: "Make Business Deal", type: "basic", playerClasses: ["Capitalist Class"], description: "Pay the amount listted on a Business Deal card and get the goods shown. Unless you place them all in the Free Trade Zone, pay also Tariffs to the State."},
	{name: "Lobby", type: "basic", playerClasses: ["Capitalist Class"], description: "Spend $30 from your Capital. Get 3 <Influence>."},
	{name: "Buy Goods & Services", type: "basic", playerClasses: ["Working Class", "Middle Class"], description: "Choose a good or service. You may buy an amount up to your Population from each of 2 sources."},
	{name: "Extra Shift", type: "basic", playerClasses: ["Middle Class"], description: "Choose a Company with non-comitted Worker(s) of yours. Perform a Production and commit all Workers in that Company. If you committed a Working Class Worker this way, pay Wages to the Working Class."},
	{name: "Strike", type: "basic", playerClasses: ["Working Class"], description: "Place up to 2 Strike tokens on Companies where you have non-committed workers with L1 or L2 Wages."},
	{name: "Demonstration", type: "basic", playerClasses: ["Working Class"], description: "When played then if the following remains true till the production phase then gain 1 <Influence> and other players lose VP: The number of your unemployed workers is at least 2 more than the number of unoccupied worker slots."},
	{
		name: "Apply Political Pressure",
		type: "basic",
		playerClasses: ["Working Class", "Middle Class", "Capitalist Class"],
		description: "Add 3 Voting cubes to the bag.",
		execute: async ({gameState, playerClass}) => {
			const playerClassName = playerClass.name as "Working Class" | "Middle Class" | "Capitalist Class"
			const currentClassPoliticalPressure = gameState.current.politicalPressure.filter(x => x === playerClassName).length
			const numAddedPoliticalPressure = Math.min(25 - currentClassPoliticalPressure, 3)
			gameState.current.politicalPressure.push(...range(0, numAddedPoliticalPressure).map(_ => playerClassName))
		}
	}
]

export const FREE_ACTIONS: Array<Action> = [
	{name: "Use Healthcare", type: "free", playerClasses: ["Working Class", "Middle Class"], description: "Spend <healthcare> equal to your Population. Gain a new unskilled Worker in the Unemployed Workers area, 1 <prosperity> and 2 <vp>."},
	{name: "Use Education", type: "free", playerClasses: ["Working Class", "Middle Class"], description: "Spend <education> equal to your Population. Upgrade one of your Workers and gain 1 <prosperity>."},
	{name: "Use Luxury", type: "free", playerClasses: ["Working Class", "Middle Class"], description: "Spend <luxury> equal to your Population. Gain 1 <vp>."},
	{name: "Adjust Prices", type: "free", playerClasses: ["Middle Class", "Capitalist Class"], description: "Change the selling price of any goods and services on your board."},
	{name: "Adjust Wages", type: "free", playerClasses: ["Middle Class", "Capitalist Class", "State"], description: "Change the Wages given in any of your Companies. If you raise Wages in a Company, commit the Workers in it."},
	{name: "Give Bonus", type: "free", playerClasses: ["Capitalist Class"], description: "Give 5$ to the player controlling the Workers in one of your Companies and commit those Workers."},
	{name: "Buy Storage", type: "free", playerClasses: ["Capitalist Class"], description: "Spend 20$ to build a Storage for one type of good. Place it beneath your board, corresponding to a specific resource."},
	{name: "Swap Workers", type: "free", playerClasses: ["Working Class", "Middle Class"], description: "Swap any number of employed skilled workers in unskilled slots with other unemployed Workers."},
	{
		name: "Receive Benefits",
		type: "free",
		playerClasses: ["Working Class", "Middle Class", "Capitalist Class"],
		description: "Get the items that the State has provided for you in the appropriate space.",
		isPossible: ({gameState, playerClass}) => {
			const playerClassName = playerClass.name as "Working Class" | "Middle Class" | "Capitalist Class"
			return (getClassState(gameState, "State") as StateClassState).stateBenefits[playerClassName] > 0
		},
		execute: async ({gameState, playerClass, classState}) => {
			const playerClassName = playerClass.name as "Working Class" | "Middle Class" | "Capitalist Class"
			const stateClassState: StateClassState = getClassState(gameState.current, "State") as StateClassState
			classState.cash += stateClassState.stateBenefits[playerClassName]
			stateClassState.stateBenefits[playerClassName] = 0
		}
	},
	{
		name: "Pay Off Loan",
		type: "free", playerClasses: ["Working Class", "Middle Class", "State"],
		description: "Spend 50<money> and discard your Loan.",
		isPossible: ({classState}) => {
			return classState.loans > 0 && classState.cash >= 50
		},
		execute: async ({classState}) => {
			changeMoney(classState, -50)
			classState.loans -= 1
		}
	},
	{
		name: "Pay Off Loan",
		type: "free", playerClasses: ["Capitalist Class"],
		description: "Spend $50 from your Capital and discard your Loan.",
		isPossible: ({classState}) => {
			return classState.loans > 0 && classState.cash >= 50
		},
		execute: async ({classState}) => {
			changeMoney(classState, -50)
			classState.loans -= 1
		}
	},
	{
		name: "Pass",
		type: "free",
		playerClasses: ["Working Class", "Middle Class", "Capitalist Class", "State"],
		description: "Do nothing.",
		isPossible: () => true,
		execute: async () => {}
	}
]

export const GAME_STATE: GameState = {
	turnIndex: 19,
	mainActionCompleted: false,
	freeActionCompleted: false,
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
	politicalPressure: [
		...range(0, 7).map(_ => "Working Class"),
		...range(0, 8).map(_ => "Middle Class"),
		...range(0, 3).map(_ => "Capitalist Class")
	] as Array<Exclude<PlayerClassName, "State">>,
	importDeals: [0, 1],
	exportDeals: 0,
	classes: [
		{
			className: "Working Class",
			playerName: "Andrew",
			cash: 90,
			loans: 1,
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
			playerName: "Albert",
			cash: 40,
			loans: 0,
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
			playerName: "Alex",
			cash: 60,
			loans: 1,
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
			playerName: "Paul",
			cash: 50,
			loans: 0,
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