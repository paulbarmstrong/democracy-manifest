import { CompanyType, GameState, Industry, PlayerClass } from "./Types"

export const COMPANY_SIZE_PX = 220

export const MENU_WIDTH: string = "max(35vw, min(500px, 100%))"

export const BACKGROUND_SHADE_T0 = "#374247"
export const BACKGROUND_SHADE_T1 = "#2b3438"
export const ACCENT_COLOR_SATURATION = 25
export const ACCENT_COLOR_LIGHTNESS = 45

export const MATERIAL_ICON_NAME_MAPPINGS = {
	"tax-multiplier": "receipt_long",
	"vote": "gavel"
}

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

export const GAME_STATE: GameState = {
	policies: {
		"Fiscal Policy": {
			state: 0,
			proposal: {
				playerClassName: "Capitalist Class",
				proposedState: 1
			}
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
	classes: [
		{
			className: "Working Class",
			cash: 20,
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
			prosperity: 0,
		},
		{
			className: "Capitalist Class",
			cash: 60,
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