type Choice<T> = {
	value: T,
	content: any,
	allowed?: boolean
}

interface Props<T> {
	choices: Array<Choice<T>>,
	onChange: (value: T) => void,
	value: T,
	radioButtonSize?: number,
	fontSize?: number | string
}

export function RadioSelector<T extends string | number>(props: Props<T>) {
	return <div style={{display: "flex", flexDirection: "column", fontSize: props.fontSize}}>
		{
			props.choices.map(choice => {
				const effectiveAllowed = choice.allowed !== false
				return <div className={effectiveAllowed ? "clickable" : undefined} key={choice.value} onClick={() => props.onChange(choice.value)} style={{display: "flex", alignItems: "center", gap: 5}}>
					<span className="material-symbols-outlined" style={{fontSize: props.radioButtonSize}}>
						{choice.value === props.value ? "radio_button_checked" : "radio_button_unchecked"}
					</span>
					{choice.content}
				</div>
			})
		}
	</div>
}