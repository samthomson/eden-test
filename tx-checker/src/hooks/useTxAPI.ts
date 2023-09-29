import * as React from "react"

// just typing a minimal set, for what we'll need
interface TransactionData {
	txid: string
	status: string
	confirmations?: number
	// todo: lastStatusAt
	// todo: satsPerVbyte
}

interface useTxAPI {
	checkTx: (txId: string) => Promise<void>
	txData: TransactionData | undefined
	loading: boolean
	error: string | null
}
// todo: add some docs about responsibility

const useTxAPI = (): useTxAPI => {
	// todo: use undefined over null where it makes sense
	const [data, setData] = React.useState<TransactionData | undefined>(undefined)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [error, setError] = React.useState<string | null>(null)

	const checkTx = async (txId: string) => {
		setLoading(true)
		setError(null)

		try {
			// look up both tx data, and current block height - to polyfill the confirmation count
			const txDataResponse = await fetch(`https://mempool.space/api/tx/${txId}`)

			if (txDataResponse.status === 400) {
				setData({
					txid: txId,
					status: "Transaction not found.",
				})
				return
			}

			if (!txDataResponse?.ok) {
				setError("Failed to fetch transaction data")
			}
			const txData = await txDataResponse.json()

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

			const data: TransactionData = {
				// todo: standardise this prop
				txid: txId,
				status: isConfirmed
					? `The transaction has ${confirmationCount} confirmations`
					: "Transaction is currently in the mempool and has 0 block-confirmations",
				confirmations: confirmationCount,
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
