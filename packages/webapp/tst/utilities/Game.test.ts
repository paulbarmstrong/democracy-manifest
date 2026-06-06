// fixtures imports Constants first to satisfy the Game <-> Constants circular
// dependency under Vitest (see the comment in fixtures.ts). Keep it above the
// Game import.
import {
	makeCapitalistClassState, makeGameState, makeMiddleClassState, makeStateClassState, makeWorkingClassState
} from "./fixtures"

import { describe, expect, test } from "vitest"
import {
	capitalToWealthTier, changeCredibility, changeMoney, changeStoredGoods, getClassState, getCompanyType,
	getImportDealPrice, getImportDealTariff, getImportPrice, getImportTariff, getIndustry, getMaxStorage,
	getPlayerClass, getTurn, isCompanyOperational, produceForCompany
} from "../../src/utilities/Game"
import { WEALTH_TIER_THRESHOLDS } from "../../src/utilities/Constants"
import { Company, ImportDeal, StateClassState } from "../../src/utilities/Types"

describe("getIndustry", () => {
	test("returns the industry matching the name", () => {
		expect(getIndustry("Food")).toEqual({name: "Food", hue: 120})
		expect(getIndustry("Influence")).toEqual({name: "Influence", hue: 260})
	})
})

describe("getCompanyType", () => {
	test("returns the company type matching the company's name", () => {
		const companyType = getCompanyType({name: "Clinic", wageLevel: 0, workers: []})
		expect(companyType.name).toBe("Clinic")
		expect(companyType.industry).toBe("Healthcare")
		expect(companyType.production).toBe(6)
	})
})

describe("getPlayerClass", () => {
	test("returns the player class matching the name", () => {
		const playerClass = getPlayerClass("Working Class")
		expect(playerClass.name).toBe("Working Class")
		expect(playerClass.maxCompanies).toBe(2)
	})
})

describe("getClassState", () => {
	test("returns the class state with the matching className", () => {
		const capitalist = makeCapitalistClassState({cash: 42})
		const gameState = makeGameState({
			classes: [makeWorkingClassState(), makeMiddleClassState(), capitalist, makeStateClassState()]
		})
		expect(getClassState(gameState, "Capitalist Class")).toBe(capitalist)
		expect(getClassState(gameState, "State").className).toBe("State")
	})
})

describe("getMaxStorage", () => {
	test("returns the base storage when there are no warehouses", () => {
		// Middle Class base Food storage is 8.
		expect(getMaxStorage(makeMiddleClassState(), "Food")).toBe(8)
	})

	test("adds warehouse capacity for matching industries", () => {
		// Capitalist base Food storage is 8; each Food warehouse adds 8.
		const capitalist = makeCapitalistClassState({warehouses: ["Food", "Food", "Luxury"]})
		expect(getMaxStorage(capitalist, "Food")).toBe(8 + 2 * 8)
	})

	test("returns 0 for a class with no base storage and no warehouses", () => {
		expect(getMaxStorage(makeWorkingClassState(), "Food")).toBe(0)
	})
})

describe("capitalToWealthTier", () => {
	test("returns 0 when below the first threshold", () => {
		expect(capitalToWealthTier(0)).toBe(0)
		expect(capitalToWealthTier(10)).toBe(0)
	})

	test("returns the index of the highest threshold exceeded", () => {
		// WEALTH_TIER_THRESHOLDS = [10, 25, 50, 75, 100, ...]
		expect(capitalToWealthTier(26)).toBe(1)
		expect(capitalToWealthTier(100)).toBe(3)
	})

	test("reaches the top tier when capital exceeds the highest threshold", () => {
		const topThreshold = WEALTH_TIER_THRESHOLDS[WEALTH_TIER_THRESHOLDS.length - 1]
		expect(capitalToWealthTier(topThreshold + 1)).toBe(WEALTH_TIER_THRESHOLDS.length - 1)
	})
})

describe("getImportTariff", () => {
	test("scales the base price by the foreign trade level", () => {
		expect(getImportTariff("Food", 0)).toBe(10)
		expect(getImportTariff("Food", 1)).toBe(5)
		expect(getImportTariff("Food", 2)).toBe(0)
		expect(getImportTariff("Luxury", 0)).toBe(6)
	})
})

describe("getImportPrice", () => {
	test("is the base price plus the tariff", () => {
		expect(getImportPrice("Food", 0)).toBe(20)
		expect(getImportPrice("Food", 2)).toBe(10)
		expect(getImportPrice("Luxury", 0)).toBe(12)
		expect(getImportPrice("Luxury", 2)).toBe(6)
	})
})

describe("getImportDealTariff", () => {
	test("scales the per-position tariff by the foreign trade level", () => {
		const importDeal: ImportDeal = {foodQuantity: 0, luxuryQuantity: 0, baseCost: 20, tariffPerForeignTradePosition: 3}
		expect(getImportDealTariff(makeGameState(), importDeal)).toBe(6)

		const gameState = makeGameState()
		gameState.policies["Foreign Trade"].state = 2
		expect(getImportDealTariff(gameState, importDeal)).toBe(0)
	})
})

describe("getImportDealPrice", () => {
	test("is the base cost plus the deal tariff", () => {
		const importDeal: ImportDeal = {foodQuantity: 0, luxuryQuantity: 0, baseCost: 20, tariffPerForeignTradePosition: 3}
		expect(getImportDealPrice(makeGameState(), importDeal)).toBe(26)
	})
})

describe("isCompanyOperational", () => {
	// A Clinic has 3 worker slots, but only 2 are required (the third is a
	// production-bonus Machine slot).
	test("is true when the required worker slots are filled", () => {
		const company: Company = {
			name: "Clinic",
			wageLevel: 0,
			workers: [{class: "Working Class", committed: true}, {class: "Working Class", committed: true}]
		}
		expect(isCompanyOperational(company)).toBe(true)
	})

	test("is false when too few workers are present", () => {
		const company: Company = {
			name: "Clinic",
			wageLevel: 0,
			workers: [{class: "Working Class", committed: true}]
		}
		expect(isCompanyOperational(company)).toBe(false)
	})
})

describe("getTurn", () => {
	test("derives round, turn, and acting class from the turn index", () => {
		expect(getTurn(makeGameState({turnIndex: 0}))).toEqual({
			roundNumber: 1, turnNumber: 1, turnPlayerClassName: "Working Class"
		})
	})

	test("advances the turn within a round", () => {
		// turnIndex 5: still round 1, second turn, acting class index 5 % 4 = 1.
		expect(getTurn(makeGameState({turnIndex: 5}))).toEqual({
			roundNumber: 1, turnNumber: 2, turnPlayerClassName: "Middle Class"
		})
	})

	test("advances to the next round after 20 turns", () => {
		expect(getTurn(makeGameState({turnIndex: 20}))).toMatchObject({roundNumber: 2, turnNumber: 1})
	})
})

describe("changeMoney", () => {
	test("a positive delta is added to cash", () => {
		const classState = makeWorkingClassState({cash: 30})
		changeMoney(classState, 20)
		expect(classState.cash).toBe(50)
		expect(classState.loans).toBe(0)
	})

	test("a negative delta is paid out of cash", () => {
		const classState = makeWorkingClassState({cash: 30})
		changeMoney(classState, -20)
		expect(classState.cash).toBe(10)
		expect(classState.loans).toBe(0)
	})

	test("a non-capitalist takes loans into cash when cash runs out", () => {
		const classState = makeWorkingClassState({cash: 30})
		// Owes 100. Pays 30 from cash, then borrows 2 loans ($50 each) to cover the
		// remaining 70, leaving 30 in cash.
		changeMoney(classState, -100)
		expect(classState.loans).toBe(2)
		expect(classState.cash).toBe(30)
	})

	test("a capitalist pays out of cash before capital", () => {
		const classState = makeCapitalistClassState({cash: 40, capital: 100})
		changeMoney(classState, -30)
		expect(classState.cash).toBe(10)
		expect(classState.capital).toBe(100)
		expect(classState.loans).toBe(0)
	})

	test("a capitalist pays out of capital once cash is exhausted", () => {
		const classState = makeCapitalistClassState({cash: 40, capital: 100})
		changeMoney(classState, -60)
		expect(classState.cash).toBe(0)
		expect(classState.capital).toBe(80)
		expect(classState.loans).toBe(0)
	})
	
	test("a capitalist taking a loan adds the loan money to capital, not cash", () => {
		const classState = makeCapitalistClassState({cash: 10, capital: 20})
		// Owes 100. Pays 10 from cash and 20 from capital, then borrows 2 loans
		// ($50 each) to cover the remaining 70. The $30 of unspent loan money lands
		// in capital, and cash stays at 0.
		changeMoney(classState, -100)
		expect(classState.loans).toBe(2)
		expect(classState.cash).toBe(0)
		expect(classState.capital).toBe(30)
	})
})

describe("changeCredibility", () => {
	test("adds the delta to the state's credibility for the class", () => {
		const gameState = makeGameState()
		changeCredibility(gameState, "Working Class", 3)
		expect((gameState.classes[3] as StateClassState).credibility["Working Class"]).toBe(4)
	})

	test("never drops credibility below 1", () => {
		const gameState = makeGameState()
		changeCredibility(gameState, "Capitalist Class", -10)
		expect((gameState.classes[3] as StateClassState).credibility["Capitalist Class"]).toBe(1)
	})
})

describe("changeStoredGoods", () => {
	test("adds goods up to the storage limit for a regular class", () => {
		const middle = makeMiddleClassState() // Food storage limit 8
		changeStoredGoods(middle, "Food", 3, false)
		expect(middle.storedGoods.Food.quantity).toBe(3)
	})

	test("caps stored goods at the storage limit", () => {
		const middle = makeMiddleClassState()
		changeStoredGoods(middle, "Food", 100, false)
		expect(middle.storedGoods.Food.quantity).toBe(8)
	})

	test("removes goods on a negative delta", () => {
		const middle = makeMiddleClassState()
		middle.storedGoods.Food.quantity = 5
		changeStoredGoods(middle, "Food", -2, false)
		expect(middle.storedGoods.Food.quantity).toBe(3)
	})

	test("throws when stored goods would go negative", () => {
		const middle = makeMiddleClassState()
		middle.storedGoods.Food.quantity = 2
		expect(() => changeStoredGoods(middle, "Food", -5, false)).toThrow()
	})

	test("prefers export-only goods when asked and available", () => {
		const capitalist = makeCapitalistClassState()
		changeStoredGoods(capitalist, "Food", 5, true)
		expect(capitalist.exportOnlyGoods.Food).toBe(5)
		expect(capitalist.storedGoods.Food.quantity).toBe(0)
	})

	test("overflows past the storage limit into export-only goods", () => {
		const capitalist = makeCapitalistClassState() // Food storage limit 8, export-only Food limit 8
		capitalist.storedGoods.Food.quantity = 6
		changeStoredGoods(capitalist, "Food", 5, false)
		expect(capitalist.storedGoods.Food.quantity).toBe(8)
		expect(capitalist.exportOnlyGoods.Food).toBe(3)
	})
})

describe("produceForCompany", () => {
	test("adds production to a capitalist's storage and pays wages to the worker's class", () => {
		const workingClass = makeWorkingClassState({cash: 0})
		const capitalist = makeCapitalistClassState({cash: 100})
		capitalist.companies = [{
			name: "Clinic", // Healthcare, production 6, wageLevels [10, 20, 30]
			wageLevel: 0,
			workers: [{class: "Working Class", committed: true}, {class: "Working Class", committed: true}]
		}]
		const gameState = makeGameState({
			classes: [workingClass, makeMiddleClassState(), capitalist, makeStateClassState()]
		})

		produceForCompany(gameState, capitalist, capitalist.companies[0])

		expect(capitalist.storedGoods.Healthcare.quantity).toBe(6)
		// One wage of 10 (wage level 0) is paid by the capitalist to the working class.
		expect(capitalist.cash).toBe(90)
		expect(workingClass.cash).toBe(10)
	})

	test("adds production to consumable goods for the working class", () => {
		const workingClass = makeWorkingClassState()
		// No workers in the wage-bearing slots, so production happens with no wages
		// to pay, isolating the consumable-goods branch.
		workingClass.companies = [{name: "Clinic", wageLevel: 0, workers: []}]
		const gameState = makeGameState({
			classes: [workingClass, makeMiddleClassState(), makeCapitalistClassState(), makeStateClassState()]
		})

		produceForCompany(gameState, workingClass, workingClass.companies[0])

		expect(workingClass.consumableGoods.Healthcare).toBe(6)
	})
})
