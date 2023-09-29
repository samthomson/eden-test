import * as React from "react"
import * as Types from "../declarations"
import * as DataUtil from "../util/data"

interface useTxAPI {
	checkTx: (txId: string) => Promise<void>
	txData: Types.TransactionData | undefined
	loading: boolean
	error: string | null
}
// todo: add some docs about responsibility

const useTxAPI = (): useTxAPI => {
	// todo: use undefined over null where it makes sense
	const [data, setData] = React.useState<Types.TransactionData | undefined>(
		undefined
	)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [error, setError] = React.useState<string | null>(null)

	const checkTx = async (txId: string): Promise<void> => {
		setLoading(true)
		setError(null)

		try {
			// look up both tx data, and current block height - to polyfill the confirmation count
			// todo: type responses?
			const txDataResponse = await fetch(`https://mempool.space/api/tx/${txId}`)

			if (txDataResponse.status === 400) {
				setData({
					isBroadCast: false,
					txId,
					status: "Transaction not found.",
					// todo: duplication here with below, write something more elegant
					lastStatusAt: new Date().toISOString(),
				} as Types.TXData.Incomplete)
				return
			}

			if (!txDataResponse?.ok) {
				setError("Failed to fetch transaction data")
			}
			const txData: Types.API.TXData = await txDataResponse.json()

			const blockHeightResponse = await fetch(
				`https://mempool.space/api/blocks/tip/height`
			)
			const currentBlockHeight = await blockHeightResponse.json()

			if (!txDataResponse?.ok) {
				console.log("response not ok?", txDataResponse)
				setError("Failed to fetch block tip data")
			}

			console.log(txData)
			console.log(currentBlockHeight)

			const isConfirmed = txData.status.confirmed
			const confirmationCount = currentBlockHeight - txData.status.block_height

			const { fee: ignoreThisFee, weight } = txData

			const fee = DataUtil.deriveFeeFromTXData(txData)
			const satsPerVbyte = DataUtil.getVSatsPerByte(fee, weight)

			const data: Types.TXData.Complete = {
				isBroadCast: true,
				// todo: standardise this prop
				txId,
				status: isConfirmed
					? `The transaction has ${confirmationCount} confirmations`
					: "Transaction is currently in the mempool and has 0 block-confirmations",
				confirmations: confirmationCount,
				lastStatusAt: new Date().toISOString(),
				satsPerVbyte,
			}

			setData(data)
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message)
			} else {
				setError("unexpected error type occured checking tx")
			}
		} finally {
			setLoading(false)
		}
	}

	return { checkTx, txData: data, loading, error }
}

export default useTxAPI
