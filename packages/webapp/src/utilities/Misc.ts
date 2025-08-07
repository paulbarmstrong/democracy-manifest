export function s(quantity: number) {
	return Math.abs(quantity) === 1 ? "" :  "s"
}

export function isAre(quantity: number) {
	return Math.abs(quantity) === 1 ? "is" :  "are"
}