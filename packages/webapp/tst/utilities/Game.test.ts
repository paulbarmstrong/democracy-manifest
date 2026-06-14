// fixtures imports Constants first to satisfy the Game <-> Constants circular
// dependency under Vitest (see the comment in fixtures.ts). Keep it above the
// Game import.
import {
	makeCapitalistClassState, makeGameState, makeMiddleClassState, makeStateClassState, makeWorkingClassState
} from "./fixtures"

import { describe, expect, test } from "vitest"
import {
	capitalToWealthTier, changeCredibility, changeMoney, changeStoredGoods, doEndOfRoundScoringChanges, getClassState,
	getCompanyType, getImportDealPrice, getImportDealTariff, getImportPrice, getImportTariff, getIndustry,
	getMaxStorage, getPlayerClass, getTurn, increaseProsperity, isCompanyOperational, isStrikeTarget, produceForCompany
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
		const companyType = getCompanyType({name: "Clinic", wageLevel: 0, workers: [], onStrike: false})
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
			workers: [{class: "Working Class", committed: true}, {class: "Working Class", committed: true}],
			onStrike: false
		}
		expect(isCompanyOperational(company)).toBe(true)
	})

	test("is false when too few workers are present", () => {
		const company: Company = {
			name: "Clinic",
			wageLevel: 0,
			workers: [{class: "Working Class", committed: true}],
			onStrike: false
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
			workers: [{class: "Working Class", committed: true}, {class: "Working Class", committed: true}],
			onStrike: false
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
		workingClass.companies = [{name: "Clinic", wageLevel: 0, workers: [], onStrike: false}]
		const gameState = makeGameState({
			classes: [workingClass, makeMiddleClassState(), makeCapitalistClassState(), makeStateClassState()]
		})

		produceForCompany(gameState, workingClass, workingClass.companies[0])

		expect(workingClass.consumableGoods.Healthcare).toBe(6)
	})
})

describe("isStrikeTarget", () => {
	// "Shopping Mall" has a Working-Class worker slot and wage levels [15, 20, 25],
	// so its maximum wage level is 2.
	function shoppingMall(overrides: Partial<Company> = {}): Company {
		return {
			name: "Shopping Mall",
			wageLevel: 0,
			workers: [{class: "Working Class", committed: false}],
			onStrike: false,
			...overrides
		}
	}

	test("is a target when the Working Class has uncommitted workers and wages are below max", () => {
		expect(isStrikeTarget(shoppingMall())).toBe(true)
	})

	test("is not a target when already at the maximum wage level", () => {
		expect(isStrikeTarget(shoppingMall({wageLevel: 2}))).toBe(false)
	})

	test("is not a target when any worker is committed", () => {
		expect(isStrikeTarget(shoppingMall({workers: [{class: "Working Class", committed: true}]}))).toBe(false)
	})

	test("is not a target without a Working Class worker", () => {
		expect(isStrikeTarget(shoppingMall({workers: [{class: "Middle Class", committed: false}]}))).toBe(false)
	})

	test("is not a target when already on strike", () => {
		expect(isStrikeTarget(shoppingMall({onStrike: true}))).toBe(false)
	})
})

describe("increaseProsperity", () => {
	test("raises prosperity by 1 and grants VP equal to the new prosperity value", () => {
		const workingClass = makeWorkingClassState({prosperity: 2, vp: 5})
		increaseProsperity(workingClass)
		expect(workingClass.prosperity).toBe(3)
		expect(workingClass.vp).toBe(5 + 3)
	})

	test("grants 1 VP when rising from the first prosperity space", () => {
		const middleClass = makeMiddleClassState({prosperity: 0, vp: 0})
		increaseProsperity(middleClass)
		expect(middleClass.prosperity).toBe(1)
		expect(middleClass.vp).toBe(1)
	})
})

describe("doEndOfRoundScoringChanges", () => {
	// A Clinic has 3 worker slots, so it is fully operational with 3 workers.
	function fullyOperationalClinic(): Company {
		return {
			name: "Clinic",
			wageLevel: 0,
			workers: [
				{class: "Working Class", committed: false},
				{class: "Working Class", committed: false},
				{class: "Machine", committed: false}
			],
			onStrike: false
		}
	}

	describe("Working Class", () => {
		test("gains 2 VP per trade union (union leader)", () => {
			const workingClass = makeWorkingClassState({
				vp: 5,
				unionLeaders: {
					Food: {class: "Working Class", committed: false},
					Luxury: {class: "Working Class", committed: false}
				}
			})
			const gameState = makeGameState({
				classes: [workingClass, makeMiddleClassState(), makeCapitalistClassState(), makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(workingClass.vp).toBe(5 + 2 * 2)
		})

		test("gains no VP with no trade unions", () => {
			const workingClass = makeWorkingClassState({vp: 5})
			const gameState = makeGameState({
				classes: [workingClass, makeMiddleClassState(), makeCapitalistClassState(), makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(workingClass.vp).toBe(5)
		})
	})

	describe("Middle Class", () => {
		test("gains 1 prosperity and VP equal to the new prosperity when below the company count", () => {
			const middleClass = makeMiddleClassState({prosperity: 0, vp: 0, companies: [fullyOperationalClinic()]})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), middleClass, makeCapitalistClassState(), makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(middleClass.prosperity).toBe(1)
			expect(middleClass.vp).toBe(1)
		})

		test("the VP gained equals the new prosperity value, not a flat 1", () => {
			// Prosperity rises from 2 to 3 (3 fully operational companies), so 3 VP are gained.
			const middleClass = makeMiddleClassState({
				prosperity: 2,
				vp: 0,
				companies: [fullyOperationalClinic(), fullyOperationalClinic(), fullyOperationalClinic()]
			})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), middleClass, makeCapitalistClassState(), makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(middleClass.prosperity).toBe(3)
			expect(middleClass.vp).toBe(3)
		})

		test("does not gain prosperity or VP when it already meets the fully operational company count", () => {
			const middleClass = makeMiddleClassState({prosperity: 1, vp: 0, companies: [fullyOperationalClinic()]})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), middleClass, makeCapitalistClassState(), makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(middleClass.prosperity).toBe(1)
			expect(middleClass.vp).toBe(0)
		})

		test("ignores companies that are not fully operational", () => {
			// A Clinic with only 2 of its 3 worker slots filled is not fully operational.
			const partialClinic: Company = {
				name: "Clinic",
				wageLevel: 0,
				workers: [{class: "Working Class", committed: false}, {class: "Working Class", committed: false}],
				onStrike: false
			}
			const middleClass = makeMiddleClassState({prosperity: 0, companies: [partialClinic]})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), middleClass, makeCapitalistClassState(), makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(middleClass.prosperity).toBe(0)
		})
	})

	describe("Capitalist Class", () => {
		test("folds cash into capital", () => {
			const capitalist = makeCapitalistClassState({cash: 60, capital: 0})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), makeMiddleClassState(), capitalist, makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(capitalist.capital).toBe(60)
			expect(capitalist.cash).toBe(0)
		})

		test("scores wealth-tier VP plus a 3 VP per-space bonus for moving the peak", () => {
			// 60 capital exceeds thresholds 10, 25, 50 -> tier index 2, scoring tier + 1 = 3 VP.
			// (Matches the rulebook example where 57 capital scores 3 VP.) The peak moves from
			// tier 0 to tier 2, awarding 3 VP for each of the 2 spaces moved (6 VP).
			const capitalist = makeCapitalistClassState({cash: 60, capital: 0, peakWealthTier: 0, vp: 0})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), makeMiddleClassState(), capitalist, makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(capitalist.peakWealthTier).toBe(2)
			expect(capitalist.vp).toBe(3 + 3 * 2)
		})

		test("scores from the current tier and keeps the peak when capital falls", () => {
			// Capital only reaches tier 1 (25 < 30 < 50) this round, so base VP is 1 + 1 = 2.
			// The peak stays at 3 and no move bonus is awarded.
			const capitalist = makeCapitalistClassState({cash: 30, capital: 0, peakWealthTier: 3, vp: 0})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), makeMiddleClassState(), capitalist, makeStateClassState()]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(capitalist.peakWealthTier).toBe(3)
			expect(capitalist.vp).toBe(2)
		})
	})

	describe("State", () => {
		test("gains VP equal to its lowest credibility and halves each credibility", () => {
			const state = makeStateClassState({
				vp: 0,
				credibility: {"Working Class": 4, "Middle Class": 2, "Capitalist Class": 6}
			})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), makeMiddleClassState(), makeCapitalistClassState(), state]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(state.vp).toBe(2)
			expect(state.credibility).toEqual({"Working Class": 2, "Middle Class": 1, "Capitalist Class": 3})
		})

		test("adds credibility badges back after halving credibility", () => {
			// Credibility is halved first (ceil), then the badge counts are added on top:
			// Working Class ceil(4/2) + 1 = 3, Middle Class ceil(2/2) + 0 = 1, Capitalist ceil(6/2) + 2 = 5.
			const state = makeStateClassState({
				vp: 0,
				credibility: {"Working Class": 4, "Middle Class": 2, "Capitalist Class": 6},
				credibilityBadges: {"Working Class": 1, "Middle Class": 0, "Capitalist Class": 2}
			})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), makeMiddleClassState(), makeCapitalistClassState(), state]
			})

			doEndOfRoundScoringChanges(gameState)

			// VP still scores from the lowest credibility before halving (2).
			expect(state.vp).toBe(2)
			expect(state.credibility).toEqual({"Working Class": 3, "Middle Class": 1, "Capitalist Class": 5})
		})

		test("finds the numerically lowest credibility even across multi-digit values", () => {
			// A lexicographic sort would pick "10" as the lowest; the numeric minimum is 3.
			const state = makeStateClassState({
				vp: 0,
				credibility: {"Working Class": 10, "Middle Class": 3, "Capitalist Class": 20}
			})
			const gameState = makeGameState({
				classes: [makeWorkingClassState(), makeMiddleClassState(), makeCapitalistClassState(), state]
			})

			doEndOfRoundScoringChanges(gameState)

			expect(state.vp).toBe(3)
		})
	})
})