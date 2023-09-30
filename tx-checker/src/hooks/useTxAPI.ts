import * as React from "react"
import * as Types from "../declarations"
import * as DataUtil from "../util/data"

interface useTxAPI {
	checkTx: (txId: string) => Promise<void>
	txData: Types.TransactionData | undefined
	loading: boolean
	error?: string
}

/**
 * This hook is responsible for getting relevant tx and blockchain data,
 * and putting it together into a format we'll use in the app.
 * For simplicity, there is just one method, although breaking it up into
 * functions for fetching each data point (tx, blockheight), and
 * parsing/assembling the data we need would be better (more maintainable,
 * extensible, readable, and testable)
 */

const useTxAPI = (): useTxAPI => {
	const [data, setData] = React.useState<Types.TransactionData | undefined>(
		undefined
	)
	const [loading, setLoading] = React.useState<boolean>(false)
	// this is ultimately redundant, as we won't be doing any ui/ux for errors
	const [error, setError] = React.useState<string | undefined>(undefined)

	const checkTx = async (txId: string): Promise<void> => {
		setLoading(true)
		setError(undefined)

		try {
			const lastStatusAt = new Date().toISOString()

			// First, let's get all the data we'll need

			// look up both tx data, and current block height - to polyfill the confirmation count
			const txDataResponse = await fetch(`https://mempool.space/api/tx/${txId}`)

			// handle 400 error from api accordingly
			if (txDataResponse.status === 400 || txDataResponse.status === 404) {
				setData({
					isBroadCast: false,
					txId,
					status: "Transaction not found.",
					lastStatusAt,
				} as Types.TXData.Incomplete)
				return
			}

			const txData: Types.API.TXData = await txDataResponse.json()

			const confirmationCount = await (async () => {
				const blockHeightResponse = await fetch(
					`https://mempool.space/api/blocks/tip/height`
				)

				if (!blockHeightResponse?.ok) {
					setError("Failed to fetch block tip data")
					return null
				}

				const currentBlockHeight: number = await blockHeightResponse.json()
				return currentBlockHeight - txData.status.block_height
			})()

			// fail fast if response is malformed at all
			if (!txDataResponse?.ok || confirmationCount === null) {
				setError("Failed to fetch transaction or blockheight data")
				return
			}

			// Second, now that we have the data we need, let's put it together in a meaningful way

			const {
				fee: ignoreThisFee,
				weight,
				status: { confirmed: isConfirmed },
			} = txData

			const fee = DataUtil.deriveFeeFromTXData(txData)
			const satsPerVbyte = DataUtil.getVSatsPerByte(fee, weight)

			const data: Types.TXData.Complete = {
				isBroadCast: true,
				txId,
				status: isConfirmed
					? `The transaction has ${confirmationCount.toLocaleString()} confirmations`
					: "Transaction is currently in the mempool and has 0 block-confirmations",
				confirmations: confirmationCount,
				lastStatusAt,
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
