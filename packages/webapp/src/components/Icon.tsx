import { getPlayerColor } from "../utilities/Color"
import { MATERIAL_ICON_NAME_MAPPINGS, PLAYER_CLASS_CREDIBILITY_ICON_CLASS_MAPPINGS } from "../utilities/Constants"
import { IndustryName, PlayerClassName } from "../utilities/Types"

export function Icon(props: {
    name: IndustryName | (keyof typeof MATERIAL_ICON_NAME_MAPPINGS) | (keyof typeof PLAYER_CLASS_CREDIBILITY_ICON_CLASS_MAPPINGS)
    size?: number,
    gap?: number
}) {
	const effectiveSize: number = props.size ?? 24
    if (Object.keys(MATERIAL_ICON_NAME_MAPPINGS).includes(props.name)) {
        return <span className="material-symbols-outlined" style={{fontSize: effectiveSize, paddingLeft: props.gap, paddingRight: props.gap, fontVariationSettings: "'FILL' 1", verticalAlign: "-0.2em"}}>{(MATERIAL_ICON_NAME_MAPPINGS as any)[props.name]}</span>
    } else if (Object.keys(PLAYER_CLASS_CREDIBILITY_ICON_CLASS_MAPPINGS).includes(props.name)) {
        const playerClassName = (PLAYER_CLASS_CREDIBILITY_ICON_CLASS_MAPPINGS as Record<string, PlayerClassName>)[props.name as string]
        return <span style={{color: getPlayerColor(playerClassName, 1)}}><Icon name="credibility" size={props.size} gap={props.gap}/></span>
    } else {
        return <img className="white-out" src={`icons/${props.name}.svg`} style={{width: effectiveSize, height: effectiveSize, paddingLeft: props.gap, paddingRight: props.gap, verticalAlign: `${-2-effectiveSize/10}px`}}/>
    }
}