import { groupBy } from "lodash"
import { getColor, getShade } from "../../utilities/Color"
import { EXPORT_DEALS, IMPORT_DEALS, INDUSTRIES } from "../../utilities/Constants"
import { getImportPrice, getIndustry, getPlayerClass } from "../../utilities/Game"
import { GameState, IndustryName } from "../../utilities/Types"
import { Details } from "../Details"
import { Icon } from "../Icon"

export function MarketplacePanel(props: {
	gameState: GameState
}) {
	return <div style={{backgroundColor: getShade(1), padding: 10}}>
		<Details details={[
			...INDUSTRIES.map(industry => ({
				name: `${industry.name} for sale`,
				content: <table style={{backgroundColor: getColor(industry.hue, 0), borderRadius: 4}}>
					<tr>
						<th style={{textAlign: "left"}}>Seller</th>
						<th style={{textAlign: "right"}}>Unit Price</th>
						<th style={{textAlign: "right"}}>Quantity</th>
					</tr>
					{
						(() => {
							const rows = [
								...["Middle Class", "Capitalist Class", "State"].map(playerClassName => {
									const playerClassState = props.gameState.classes.find(clazz => clazz.className === playerClassName)!
									if (playerClassState.storedGoods[industry.name].price > 0) {
										return <tr>
											<td style={{textAlign: "left"}}>{playerClassName}</td>
											<td style={{textAlign: "right"}}>${playerClassState.storedGoods[industry.name].price}</td>
											<td style={{textAlign: "right"}}>{playerClassState.storedGoods[industry.name].quantity}</td>
										</tr>
									} else {
										return undefined
									}
								}),
								industry.name === "Food" || industry.name === "Luxury" ? (
									<tr>
										<td style={{textAlign: "left"}}>Foreign Market</td>
										<td style={{textAlign: "right"}}>${getImportPrice(industry.name, props.gameState.policies["Foreign Trade"].state)}</td>
										<td style={{textAlign: "right", paddingTop: 0, paddingBottom: 0}}><Icon name="infinity"/></td>
									</tr>
								) : (
									undefined
								)
							].filter(x => x !== undefined)
							if (rows.length === 0) {
								rows.push(
									<tr style={{textAlign: "center"}}>
										<td style={{textAlign: "left"}}>-</td>
										<td style={{textAlign: "right"}}>-</td>
										<td style={{textAlign: "right"}}>-</td>
									</tr>
								)
							}
							return rows
						})()
					}
				</table>
			})),
			{name: "Import deals", content:
				<div style={{display: "flex", flexDirection: "column", gap: 10}}>
					{
						props.gameState.importDeals.map(i => IMPORT_DEALS[i]).map(importDeal => <span style={{display: "flex", alignItems: "center", gap: 3}}>
							Capitalist may purchase <span style={{display: "flex", alignItems: "center", backgroundColor: getColor(getIndustry("Food").hue, 0), borderRadius: 4, padding: 10}}>{importDeal.foodQuantity} <Icon name="Food" gap={3}/></span> + <span style={{display: "flex", alignItems: "center", backgroundColor: getColor(getIndustry("Luxury").hue, 0), borderRadius: 4, padding: 10}}>{importDeal.luxuryQuantity} <Icon name="Luxury" gap={3}/></span> for ${importDeal.cost[props.gameState.policies["Foreign Trade"].state]}
						</span>)
					}
				</div>
			},
			{name: "Export deals", content:
				<div style={{display: "flex", gap: 10}}>
					{
						Object.entries(groupBy(EXPORT_DEALS[props.gameState.exportDeals], x => x.industry))
							.map(exportDealGroup => <div style={{display: "flex", flexDirection: "column", gap: 10}}>
								{
									exportDealGroup[1].map(exportDeal => <span style={{display: "flex", alignItems: "center", padding: 10, backgroundColor: getColor(getIndustry(exportDealGroup[0] as IndustryName).hue, 0), borderRadius: 4}}>
										{exportDeal.quantity} <Icon name={exportDeal.industry} gap={3}/> <Icon name={"produces"} gap={3}/> ${exportDeal.award}
									</span>)
								}
							</div>)
					}
				</div>
			}
		]}/>
	</div>
}