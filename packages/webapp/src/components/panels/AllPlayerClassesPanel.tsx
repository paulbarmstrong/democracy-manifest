import { PLAYER_CLASSES } from "../../utilities/Constants"
import { GameState } from "../../utilities/Types"
import { getShade } from "../../utilities/Color"
import { PlayerClassPanel } from "./PlayerClassPanel"

export function AllPlayerClassesPanel(props: {
    gameState: GameState
}) {
    return <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{height: 20, backgroundColor: getShade(1)}}></div>
        <div style={{display: "flex"}}>
            <PlayerClassPanel playerClass={PLAYER_CLASSES[0]} gameState={props.gameState}/>
            <PlayerClassPanel playerClass={PLAYER_CLASSES[1]} gameState={props.gameState}/>
        </div>
        <div style={{display: "flex"}}>
            <PlayerClassPanel playerClass={PLAYER_CLASSES[2]} gameState={props.gameState}/>
            <PlayerClassPanel playerClass={PLAYER_CLASSES[3]} gameState={props.gameState}/>
        </div>
    </div>
}