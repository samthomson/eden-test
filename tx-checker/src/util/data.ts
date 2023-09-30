import * as Types from "../declarations"

export const deriveFeeFromTXData = (apiTXData: Types.API.TXData): number => {
	// check coinbase tx
	if (!apiTXData.vin?.[0]?.prevout?.value) {
		return 0
	}

	const inputsTotal = apiTXData.vin.reduce(
		(acc, input) => acc + (input?.prevout?.value ?? 0),
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
