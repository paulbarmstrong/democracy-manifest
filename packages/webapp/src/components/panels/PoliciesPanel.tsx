import { getColor, getPlayerColor, getShade } from "../../utilities/Color"
import { POLICIES } from "../../utilities/Constants"
import { ActionExecution, GameState, PolicyPosition } from "../../utilities/Types"
import { Details } from "../Details"
import { Icon } from "../Icon"
import { IconedText } from "../IconedText"
import { RadioSelector } from "../RadioSelector"

export function PoliciesPanel(props: {
    gameState: GameState,
    actionExecution: ActionExecution | undefined
}) {

    function onClickPolicyPosition(policyPosition: PolicyPosition) {
        if (props.actionExecution?.policyPositionPredicate !== undefined && props.actionExecution!.policyPositionPredicate(policyPosition)) {
            props.actionExecution.policyPositionCallback!(policyPosition)
        }
    }

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
                value: index as 0 | 1 | 2,
                allowed: props.actionExecution?.policyPositionPredicate !== undefined && props.actionExecution!.policyPositionPredicate({name: policy.name, position: index as 0 | 1 | 2})
            }))} value={props.gameState.policies[policy.name].state} onChange={index => onClickPolicyPosition({name: policy.name, position: index})}/>
        }))}/>
    </div>
}