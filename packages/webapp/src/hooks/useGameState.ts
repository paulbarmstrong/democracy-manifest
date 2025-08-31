import { ImmutableRefObject } from "../classes/ImmutableRefObject"
import { GameState } from "../utilities/Types"
import { useRefState } from "./useRefState"

// The internals will be replaced with complicated network state management stuff later
export function useGameState(originalGameState: GameState): [ImmutableRefObject<GameState>, (newGameState: GameState) => void] {
	const gameState = useRefState<GameState>(originalGameState)

	function setGameState(newGameState: GameState) {
		gameState.current = newGameState
	}

	return [gameState, setGameState]
}