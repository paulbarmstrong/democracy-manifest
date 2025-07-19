import { CompanyType, GameState, Industry, PlayerClass } from "./Types"

export const COMPANY_SIZE_PX = 220

export const MENU_WIDTH: string = "max(35vw, min(500px, 100%))"

export const BACKGROUND_SHADE_T0 = "#374247"
export const BACKGROUND_SHADE_T1 = "#2b3438"
export const ACCENT_COLOR_SATURATION = 25
export const ACCENT_COLOR_LIGHTNESS = 45

export const INDUSTRIES: Array<Industry> = [
	{name: "Food", hue: 120},
	{name: "Luxury", hue: 210},
	{name: "Healthcare", hue: 0},
	{name: "Education", hue: 30},
	{name: "Media", hue: 260}
]

export const PLAYER_CLASSES: Array<PlayerClass> = [
	{
		name: "Working Class",
		hue: 300,
		maxCompanies: 2
	}, {
		name: "Middle Class",
		hue: 60,
		maxCompanies: 8
	}, {
		name: "Capitalist Class",
		hue: 180,
		maxCompanies: 12
	}, {
		name: "State",
		maxCompanies: 9
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
		industry: "Media",
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
	classes: [
		{
			className: "Working Class",
			companies: []
		},
		{
			className: "Middle Class",
			companies: [
				{
					name: "Convenience Store",
					wageLevel: 0,
					workers: [
						{class: "Middle Class", skill: "Food", committed: false},
						{class: "Working Class", committed: false}
					]
				}
			]
		},
		{
			className: "Capitalist Class",
			companies: [
				{
					name: "Clinic",
					wageLevel: 1,
					workers: [
						{class: "Middle Class", committed: true},
						{class: "Middle Class", skill: "Media", committed: true}
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
			]
		},
		{
			className: "State",
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
			]
		}
	]
}