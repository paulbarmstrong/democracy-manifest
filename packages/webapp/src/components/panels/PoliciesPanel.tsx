import { getColor, getShade } from "../../utilities/Color"
import { getIndustry } from "../../utilities/Game"
import { isAre, s } from "../../utilities/Misc"
import { GameState, PolicyName } from "../../utilities/Types"
import { Details } from "../Details"
import { Icon } from "../Icon"
import { RadioSelector } from "../RadioSelector"

type Policy = {
    name: PolicyName,
    hue: number,
    content: Array<any>
}

const POLICIES: Array<Policy> = [
	{name: "Fiscal Policy", hue: 210, content: [0, 1, 2].map(level => `State may have ${3*(3-level)} companies, but ${level === 2 ? "one" : "two"} unpaid loan${level === 2 ? "" : "s"} triggers IMF`)},
	{name: "Labor Market", hue: 260, content: ["High minimum wage", "Medium minimum wage", "Low minimum wage"]},
	{name: "Taxation", hue: 305, content: [0, 1, 2].map(level => <span style={{display: "flex", alignItems: "center"}}>
        +{3-level} <Icon name="tax-multiplier" gap={3}/>, and the Healthcare and Education policies' <Icon name="tax-multiplier" gap={3}/> are {2-level}x
    </span>)},
	{name: "Healthcare", hue: getIndustry("Healthcare").hue, content: [0, 1, 2].map(level => <span style={{display: "flex", alignItems: "center"}}>
        +{2-level} <Icon name="tax-multiplier" gap={3}/>, and public <Icon name="Healthcare" gap={3}/> costs ${level * 5}
    </span>)},
	{name: "Education", hue: getIndustry("Education").hue, content: [0, 1, 2].map(level => <span style={{display: "flex", alignItems: "center"}}>
        +{2-level} <Icon name="tax-multiplier" gap={3}/>, and public <Icon name="Education" gap={3}/> costs ${level * 5}
    </span>)},
	{name: "Foreign Trade", hue: 90, content: [0, 1, 2].map(level => <span style={{display: "flex", alignItems: "center"}}>
        Imports of <Icon name="Food" gap={3}/> cost ${10 + 5*(2-level)}, imports of <Icon name="Luxury" gap={3}/> cost ${6 + 3*(2-level)}, and {level} trade deal{s(level)} {isAre(level)} drawn
    </span>)},
	{name: "Immigration", hue: 135, content: [0, 1, 2].map(level => `+${level} middle class and working class workers per round`)}
]

export function PoliciesPanel(props: {
    gameState: GameState
}) {
    return <div style={{backgroundColor: getShade(1), display: "flex", flexDirection: "column", padding: 10, gap: 10}}>
        <Details details={POLICIES.map(policy => ({
            name: policy.name,
            backgroundColor: getColor(policy.hue, 0),
            content: <RadioSelector choices={policy.content.map((content, index) => ({
                content: <div style={{display: "flex", alignItems: "center", gap: 5}}>
                    <span>{String.fromCharCode(65 + index)}</span>
                    <span>|</span>
                    {content}
                </div>,
                value: index
            }))} value={props.gameState.policies[policy.name]} onChange={() => undefined} active={false}/>
        }))}/>
    </div>
}