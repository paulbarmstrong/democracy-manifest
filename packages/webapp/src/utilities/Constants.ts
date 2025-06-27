import { CompanyType, GameState, PlayerClass } from "./Types"

export const COMPANY_SIZE_PX = 250

export const MENU_WIDTH: string = "max(35vw, min(500px, 100%))"

export const BACKGROUND_SHADE_T0 = "#374247"
export const BACKGROUND_SHADE_T1 = "#2b3438"
export const ACCENT_COLOR_SATURATION = 20
export const ACCENT_COLOR_LIGHTNESS = 40

export const PLAYER_CLASSES: Array<PlayerClass> = [
	{
		name: "Working Class",
		colorT0: "#ab4343",
		hue: 4,
		maxCompanies: 3
	}, {
		name: "Middle Class",
		colorT0: "#ab8f43",
		hue: 44,
		maxCompanies: 8
	}, {
		name: "Capitalist Class",
		colorT0: "#434dab",
		hue: 234,
		maxCompanies: 12
	}, {
		name: "State",
		colorT0: "#787878",
		hue: 108,
		maxCompanies: 9
	}
]

export const COMPANY_TYPES: Array<CompanyType> = [
	{
		name: "Shopping Mall",
		industry: "Luxury",
		production: 6,
		wageLevels: {
			low: 15,
			medium: 20,
			high: 25
		},
		workerSlots: [
			{
				skilled: true
			},
			{
				skilled: false
			},
			{
				skilled: false,
				classRequirement: "Machine",
				productionBonus: 2
			}
		]
	},
	{
		name: "Convenience Store",
		industry: "Food",
		production: 2,
		wageLevels: {
			low: 6,
			medium: 8,
			high: 10
		},
		workerSlots: [
			{
				skilled: true,
				classRequirement: "Middle Class",
			},
			{
				skilled: false,
				classRequirement: "Working Class",
				productionBonus: 1
			}
		]
	},
	{
		name: "University",
		industry: "Education",
		production: 6,
		wageLevels: {
			low: 25,
			medium: 30,
			high: 35
		},
		workerSlots: [
			{
				skilled: true
			},
			{
				skilled: false
			},
			{
				skilled: false
			}
		]
	}
]

export const GAME_STATE: GameState = {
	players: [
		{
			className: "Working Class",
			companies: []
		},
		{
			className: "Middle Class",
			companies: [
				{
					name: "Convenience Store",
					wageLevel: "low",
					workers: [
						{
							class: "Middle Class",
							skill: "Food"
						},
						{
							class: "Working Class"
						}
					]
				}
			]
		},
		{
			className: "Capitalist Class",
			companies: [
				{
					name: "Shopping Mall",
					wageLevel: "medium",
					workers: [
						{
							class: "Working Class",
							skill: "Luxury"
						},
						{
							class: "Working Class"
						}
					]
				}
			]
		},
		{
			className: "State",
			companies: [
				{
					name: "University",
					wageLevel: "medium",
					workers: []
				}
			]
		}
	]
}