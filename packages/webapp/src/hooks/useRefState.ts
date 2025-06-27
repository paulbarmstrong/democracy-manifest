import { useState, MutableRefObject } from "react"
import { useConst } from "./useConst"

class RefStateObject<T> {
	#t: T
	#setState: (newState: T) => void
	constructor(defaultValue: T | (() => T), setState: (newState: T) => void) {
		this.#t = typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue
		this.#setState = setState
	}
	get current() {
		return this.#t
	}
	set current(t: T) {
		if (t !== this.#t) {
			this.#t = t
			this.#setState(t)
		}
	}
}

export function useRefState<T>(defaultValue: T | (() => T), options?: {
	sideEffect?: (t: T) => void
}): MutableRefObject<T> {
	const [state, setReactState] = useState<T>(defaultValue)
	const ref = useConst(() => new RefStateObject(defaultValue, (t: T) => {
		if (options?.sideEffect !== undefined) options.sideEffect(t)
		setReactState(t)
	}))
	return ref
}