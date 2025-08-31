import { MATERIAL_ICON_NAME_MAPPINGS } from "../utilities/Constants"
import { Icon } from "./Icon"

export function IconedText(props: {text: string}) {
	const icons = (props.text.match(/<[\w-]+>/g) ?? []).map(tag => {
		const name = tag.replaceAll(/[<>]/g, "")
		const gap = Object.keys(MATERIAL_ICON_NAME_MAPPINGS).includes(name) ? undefined : 3
		return <Icon name={name as any} gap={gap} size={20}/>
	})
	const textPieces = props.text.split(/<[\w-]+>/g)
	const textAndIconPieces = []
	for (let i = 0; i < textPieces.length; i++) {
		textAndIconPieces.push(textPieces[i])
		if (i < textPieces.length-1)
			textAndIconPieces.push(icons[i])
	}
	return <span>{textAndIconPieces}</span>
}