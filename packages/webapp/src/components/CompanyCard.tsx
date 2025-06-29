import { sum } from "lodash"
import { getColor } from "../utilities/Color"
import { COMPANY_SIZE_PX, COMPANY_TYPES, INDUSTRIES } from "../utilities/Constants"
import { Company, WorkerClass } from "../utilities/Types"
import { getWorkerColor } from "../utilities/Misc"
import { RadioSelector } from "./RadioSelector"

interface Props {
	company: Company
}

export function CompanyCard(props: Props) {
	const companyType = COMPANY_TYPES.find(companyType => companyType.name === props.company.name)!
	const industry = INDUSTRIES.find(industry => industry.name === companyType.industry)!
	const mainWorkerSlots = companyType.workerSlots.filter(workerSlot => workerSlot.productionBonus === undefined)
	const bonusWorkerSlots = companyType.workerSlots.filter(workerSlot => workerSlot.productionBonus !== undefined)
	return <div style={{position: "relative", width: COMPANY_SIZE_PX, height: COMPANY_SIZE_PX, backgroundColor: getColor(industry.hue, 0), boxSizing: "border-box"}}>
		<div style={{position: "absolute", top: 0, right: 0, borderRadius: 4, backgroundColor: getColor(industry.hue, 1), padding: 4, fontSize: "small"}}>${companyType.price}</div>
		<div style={{width: "100%", height: "100%", backgroundColor: getColor(industry.hue, 0), display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", borderRadius: 4, padding: 10, boxSizing: "border-box"}}>
			<span>{props.company.name}</span>
			<div style={{display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 5}}>
				{
					[mainWorkerSlots, bonusWorkerSlots].map(workerSlotsGroup => {
						if (workerSlotsGroup.length === 0) return undefined
						const isMainWorkerSlotGroup = workerSlotsGroup[0].productionBonus === undefined
						const workerSlotGroupActive = workerSlotsGroup.every((_, i) => {
							const workerIndex = (isMainWorkerSlotGroup ? 0 : mainWorkerSlots.length) + i
							return props.company.workers[workerIndex] !== undefined
						})
						const takesWage = !(["Machine", "Middle Class"] as Array<WorkerClass | undefined>).includes(workerSlotsGroup[0].classRequirement)
						return <div key={`${isMainWorkerSlotGroup}`} style={{display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "column", gap: 5}}>
							<div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 5}}>
							{
								workerSlotsGroup.map((workerSlot, i) => {
									const workerIndex = (isMainWorkerSlotGroup ? 0 : mainWorkerSlots.length) + i
									return <div style={{width: 60, height: 60, display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
										{
											[undefined, "Middle Class"].includes(workerSlot.classRequirement) ? (
												<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: workerSlot.classRequirement ? 60 : 50, height: workerSlot.classRequirement ? 60 : 50, backgroundColor: getColor(workerSlot.skilled ? industry.hue : undefined, -1), borderRadius: 4}}/>
											) : (
												undefined
											)
										}
										{
											[undefined, "Working Class"].includes(workerSlot.classRequirement) ? (
												<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 60, height: 60, backgroundColor: getColor(workerSlot.skilled ? industry.hue : undefined, -1), borderRadius: workerSlot.classRequirement === "Middle Class" ? 4 : "50%"}}/>
											) : (
												undefined
											)
										}
										{
											workerSlot.classRequirement === "Machine" ? (
												<span className="material-symbols-outlined" style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 60, color: props.company.workers[workerIndex] === undefined ? getColor(undefined, -1) : "white"}}>settings</span>
											) : (
												undefined
											)
										}
										{
											props.company.workers[workerIndex] !== undefined && props.company.workers[workerIndex].class !== "Machine" ? (
												<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 30, height: 30, backgroundColor: getWorkerColor(props.company.workers[workerIndex]), borderRadius: props.company.workers[workerIndex].class === "Working Class" ? "50%" : 4, borderWidth: 2, borderColor: "white", borderStyle: "solid"}}/>
											) : (
												undefined
											)
										}
										{
											props.company.workers[workerIndex] !== undefined && props.company.workers[workerIndex].committed ? (
												<span className="material-symbols-outlined" style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white"}}>handshake</span>
											) : (
												undefined
											)
										}
									</div>
								})
							}
							</div>
							<div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, opacity: workerSlotGroupActive ? undefined : 0.2}}>
								<img className="white-out" src="icons/CurlyBracket.svg" style={{width: workerSlotsGroup.length*60, height: 5}}/>
								<div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 2, width: workerSlotsGroup.length*60}}>
									<span>{isMainWorkerSlotGroup ? companyType.production : `+${sum(workerSlotsGroup.map(x => x.productionBonus))}`}</span>
									<img className="white-out" src={`icons/${industry.name}.svg`} style={{width: 24, height: 24}}/>
								</div>
								{
									takesWage ? (
										<div style={{display: "flex", alignItems: "center", justifyContent: "center", fontSize: "small", gap: 5}}>
											<span>Wages:</span>
											<RadioSelector
												choices={companyType.wageLevels.map((wageLevel, i) => ({value: i, text: `$${wageLevel}`})).reverse()}
												onChange={() => undefined}
												value={props.company.wageLevel}
												radioButtonSize={16}
											/>
										</div>
									) : (
										undefined
									)
								}
							</div>
						</div>
					})
				}
			</div>
		</div>
	</div>
}