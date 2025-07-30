type Value = string | number

type Choice = {
	value: Value,
	text: string
}

interface Props {
	choices: Array<Choice>,
	onChange: (value: Value) => void,
	value: Value,
	radioButtonSize?: number,
	fontSize?: number | string,
	active?: boolean
}

export function RadioSelector(props: Props) {
	return <div style={{display: "flex", flexDirection: "column", fontSize: props.fontSize}}>
		{
			props.choices.map(choice => {
				return <div className={props.active !== false ? "clickable" : undefined} key={choice.value} onClick={() => props.onChange(choice.value)} style={{display: "flex", alignItems: "center", gap: 5}}>
					<span className="material-symbols-outlined" style={{fontSize: props.radioButtonSize}}>
						{choice.value === props.value ? "radio_button_checked" : "radio_button_unchecked"}
					</span>
					{choice.text}
				</div>
			})
		}
	</div>
}