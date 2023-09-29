import * as Types from "../declarations"

export const deriveFeeFromTXData = (apiTXData: Types.API.TXData): number => {
	const inputsTotal = apiTXData.vin.reduce(
		(acc, input) => acc + input.prevout.value,
		0
	)
	const outputsTotal = apiTXData.vout.reduce(
		(acc, output) => acc + output.value,
		0
	)

	return inputsTotal - outputsTotal
}

export const getVSatsPerByte = (fee: number, weight: number): number =>
	fee / (weight / 4)
