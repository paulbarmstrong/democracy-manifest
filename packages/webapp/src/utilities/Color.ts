import convert from "color-convert"
import { ACCENT_COLOR_LIGHTNESS, ACCENT_COLOR_SATURATION, BACKGROUND_SHADE_T0, BACKGROUND_SHADE_T1 } from "./Constants"

export function getShade(darkness: number): string {
	return interpolateHexColors(BACKGROUND_SHADE_T0, BACKGROUND_SHADE_T1, darkness)
}

export function interpolateHexColors(color0Hex: string, color1Hex: string, t: number) {
	[color0Hex, color1Hex].forEach(colorHex => {
		if (colorHex === null || colorHex.length !== 7 || colorHex.charAt(0) !== "#") {
			throw new Error("colorHex must start with '#' and be 7 characters long.")
		}
	})
	const interpolatedValues: Array<number> = []
	for (let i = 0; i < 3; i++) {
		const color0Value = parseInt(color0Hex.substring(2*i+1, 2*(i)+3), 16)
		const color1Value = parseInt(color1Hex.substring(2*i+1, 2*(i)+3), 16)
		const interpolated = ((1-t)*color0Value) + (t*color1Value)
		interpolatedValues.push(Math.max(0, Math.min(Math.round(interpolated), 255)))
	}
	return `#${interpolatedValues.map(x => x.toString(16).padStart(2, "0")).reduce((a, b) => a + b)}`
}

export function getColor(hue: number, darkness: number) {
	return "#"+convert.hsl.hex([hue, ACCENT_COLOR_SATURATION, ACCENT_COLOR_LIGHTNESS - 5 * darkness])
}
