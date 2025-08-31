interface Detail {
	name: string,
	content: any,
	backgroundColor?: string
}

interface Props {
	details: Array<Detail>
}

export function Details(props: Props) {
	return <div style={{display: "flex", gap: 20, flexWrap: "wrap"}}>
		{
			props.details
				.filter(detail => detail.content !== undefined)
				.map(detail => {
					return <div key={detail.name} style={{display: "flex", flexDirection: "column", padding: 10, gap: 10, backgroundColor: detail.backgroundColor, borderRadius: 4}}>
						<div><b>{detail.name}:</b></div>
						{["string", "number"].includes(typeof detail.content) ? (
							<span style={{fontSize: "xxx-large"}}>{detail.content}</span>
						) : (
							detail.content
						)}
					</div>
				})
		}
	</div>
}