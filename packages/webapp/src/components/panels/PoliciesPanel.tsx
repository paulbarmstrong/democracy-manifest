import { getColor, getPlayerColor, getShade } from "../../utilities/Color"
import { POLICIES } from "../../utilities/Constants"
import { getImportPrice, getImportTariff, getIndustry } from "../../utilities/Game"
import { isAre, s } from "../../utilities/Misc"
import { GameState, PolicyName } from "../../utilities/Types"
import { Details } from "../Details"
import { Icon } from "../Icon"
import { IconedText } from "../IconedText"
import { RadioSelector } from "../RadioSelector"

export function PoliciesPanel(props: {
    gameState: GameState
}) {
    return <div style={{backgroundColor: getShade(1), padding: 20}}>
        <Details details={POLICIES.map(policy => ({
            name: policy.name,
            backgroundColor: getColor(policy.hue, 0),
            content: <RadioSelector choices={policy.content.map((text, index) => ({
                content: <div style={{display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap"}}>
                    <span>{String.fromCharCode(65 + index)}</span>
                    <span>|</span>
                    <IconedText text={text}/>
                    {
                        (props.gameState.policies[policy.name].proposal?.proposedState === index) ? (
                            <div style={{backgroundColor: getPlayerColor(props.gameState.policies[policy.name].proposal!.playerClassName, 0), borderRadius: "50%", height: 20, width: 20, borderStyle: "solid", borderWidth: 2, display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <Icon name="vote" size={16}/>
                            </div>
                        ) : (
                            undefined
                        )
                    }
                </div>,
                value: index
            }))} value={props.gameState.policies[policy.name].state} onChange={() => undefined} active={false}/>
        }))}/>
    </div>
}