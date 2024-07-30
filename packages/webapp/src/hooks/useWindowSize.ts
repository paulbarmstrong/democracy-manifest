import { useLayoutEffect, useState } from "react"

export function useWindowSize() {
	const [size, setSize] = useState<[number, number]>([window.innerWidth, window.innerHeight])

	useLayoutEffect(() => {
		const update = () => setSize([window.innerWidth, window.innerHeight])
		window.addEventListener("resize", update)
		return () => window.removeEventListener("resize", update)
	}, [])

	return size
}