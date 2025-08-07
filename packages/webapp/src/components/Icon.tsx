import { IndustryName } from "../utilities/Types";

export function Icon(props: {
    name: IndustryName | "tax-multiplier"
    size?: number,
    gap?: number
}) {
	const effectiveSize: number = props.size ?? 24
    if (props.name === "tax-multiplier") {
        return <span className="material-symbols-outlined" style={{paddingLeft: props.gap, paddingRight: props.gap, fontVariationSettings: "'FILL' 1"}}>receipt_long</span>
    } else {
        return <img className="white-out" src={`icons/${props.name}.svg`} style={{width: effectiveSize, height: effectiveSize, paddingLeft: props.gap, paddingRight: props.gap}}/>
    }
}