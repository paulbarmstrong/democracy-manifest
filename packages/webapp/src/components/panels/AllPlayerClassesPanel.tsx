import { MutableRefObject } from "react"
import { PLAYER_CLASSES } from "../../utilities/Constants"
import { GameState, TabName } from "../../utilities/Types"
import { getShade } from "../../utilities/Color"
import { PlayerClassPanel } from "./PlayerClassPanel"

export function AllPlayerClassesPanel(props: {
    selectedTab: MutableRefObject<TabName | undefined>,
    gameState: GameState
}) {
    return <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{height: 20, backgroundColor: getShade(1)}}></div>
        <div style={{display: "flex"}}>
            <PlayerClassPanel playerClass={PLAYER_CLASSES[0]} gameState={props.gameState} zoomed={false} onClickZoom={() => props.selectedTab.current = PLAYER_CLASSES[0].name}/>
            <PlayerClassPanel playerClass={PLAYER_CLASSES[1]} gameState={props.gameState} zoomed={false} onClickZoom={() => props.selectedTab.current = PLAYER_CLASSES[1].name}/>
        </div>
        <div style={{display: "flex"}}>
            <PlayerClassPanel playerClass={PLAYER_CLASSES[2]} gameState={props.gameState} zoomed={false} onClickZoom={() => props.selectedTab.current = PLAYER_CLASSES[2].name}/>
            <PlayerClassPanel playerClass={PLAYER_CLASSES[3]} gameState={props.gameState} zoomed={false} onClickZoom={() => props.selectedTab.current = PLAYER_CLASSES[3].name}/>
        </div>
    </div>
}