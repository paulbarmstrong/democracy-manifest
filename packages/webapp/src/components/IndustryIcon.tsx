import { IndustryName } from "../utilities/Types"

export function IndustryIcon(props: {
	industryName: IndustryName,
	size?: number
}) {
	const effectiveSize: number = props.size ?? 24
	return <img className="white-out" src={`icons/${props.industryName}.svg`} style={{width: effectiveSize, height: effectiveSize}}/>
}