import { MATERIAL_ICON_NAME_MAPPINGS } from "../utilities/Constants";
import { IndustryName } from "../utilities/Types";

export function Icon(props: {
    name: IndustryName | (keyof typeof MATERIAL_ICON_NAME_MAPPINGS)
    size?: number,
    gap?: number
}) {
	const effectiveSize: number = props.size ?? 24
    if (Object.keys(MATERIAL_ICON_NAME_MAPPINGS).includes(props.name)) {
        return <span className="material-symbols-outlined" style={{fontSize: effectiveSize, paddingLeft: props.gap, paddingRight: props.gap, fontVariationSettings: "'FILL' 1"}}>{(MATERIAL_ICON_NAME_MAPPINGS as any)[props.name]}</span>
    } else {
        return <img className="white-out" src={`icons/${props.name}.svg`} style={{width: effectiveSize, height: effectiveSize, paddingLeft: props.gap, paddingRight: props.gap}}/>
    }
}