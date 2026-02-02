import { clone, shuffle, sum } from "lodash"
import { ImmutableRefObject } from "../classes/ImmutableRefObject"
import { GameState, PolicyName } from "../utilities/Types"
import { useRefState } from "./useRefState"
import { getTurn } from "../utilities/Game"
import { NUM_POLITICAL_PRESSURE_PER_VOTE, PLAYER_CLASSES } from "../utilities/Constants"

// The internals will be replaced with complicated network state management stuff later
export function useGameState(originalGameState: GameState, options?: {sideEffect?: (newGameState: GameState) => void}): [ImmutableRefObject<GameState>, () => void] {
	const gameState = useRefState<GameState>(originalGameState, {sideEffect: options?.sideEffect})

	function updateGameState() {
		const turn = getTurn(gameState.current)
		
		if (gameState.current.freeActionCompleted && gameState.current.mainActionCompleted) {
			if (!(turn.turnNumber === 5 && turn.turnPlayerClassName === "State")) {
				gameState.current.turnIndex += 1
				gameState.current.mainActionCompleted = false
				gameState.current.freeActionCompleted = false
			} else {
				// Check for evaluating vote outcome
				if (gameState.current.vote !== undefined && Object.values(gameState.current.vote!.positions).length === 4
					&& Object.values(gameState.current.vote!.influence).length === 4 && gameState.current.vote.politicalPressure === undefined) {
					const policy = gameState.current.policies[gameState.current.vote!.policyName]

					const shuffledPoliticalPressure = shuffle(gameState.current.politicalPressure)
					const pulledPoliticalPressure = shuffledPoliticalPressure.slice(0, NUM_POLITICAL_PRESSURE_PER_VOTE)
					gameState.current.politicalPressure = shuffledPoliticalPressure.slice(NUM_POLITICAL_PRESSURE_PER_VOTE)
					gameState.current.vote!.politicalPressure = pulledPoliticalPressure

					const [yesTotal, noTotal] = [true, false].map(position => sum(
						PLAYER_CLASSES
							.filter(playerClass => gameState.current.vote!.positions[playerClass.name] === position)
							.map(playerClass => gameState.current.vote!.influence[playerClass.name]!
								+ gameState.current.vote!.politicalPressure!.filter(x => x === playerClass.name).length)
					))
					if (yesTotal >= noTotal) {
						policy.state = policy.proposal!.proposedState
					}
					policy.proposal = undefined
				}

				// Check for starting vote
				const nextPolicyWithProposal = Object.entries(gameState.current.policies).find(policy => policy[1].proposal !== undefined)
				if (gameState.current.vote === undefined && nextPolicyWithProposal !== undefined) {
					gameState.current.vote = {
						policyName: nextPolicyWithProposal[0] as PolicyName,
						positions: {[nextPolicyWithProposal[1].proposal!.playerClassName]: true},
						influence: {}
					}
				}

				// Check for ending the round
				if (Object.entries(gameState.current.policies).find(policy => policy[1].proposal !== undefined) === undefined) {
					gameState.current.turnIndex += 1
					gameState.current.mainActionCompleted = false
					gameState.current.freeActionCompleted = false
				}
			}
		}

		gameState.current = clone(gameState.current)
	}

	return [gameState, updateGameState]
}