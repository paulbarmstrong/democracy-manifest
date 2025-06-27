import { useEffect, useState } from "react"

export function useConst<T>(fnc: () => T, cleanUp: ((t: T) => void) | undefined = undefined) {
	const [t] = useState<T>(fnc)
	useEffect(() => {
		if (cleanUp !== undefined) return () => cleanUp(t)
	}, [])
	return t
}