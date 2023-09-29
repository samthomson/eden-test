import * as React from "react"

// just typing a minimal set, for what we'll need
interface TransactionData {
	txid: string
	status: {
		confirmed: boolean
		block_height?: number
	}
}

interface useTxAPI {
	checkTx: (txId: string) => Promise<void>
	data: TransactionData | undefined
	loading: boolean
	error: string | null
}

const useTxAPI = (): useTxAPI => {
	// todo: use undefined over null where it makes sense
	const [data, setData] = React.useState<TransactionData | undefined>(undefined)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [error, setError] = React.useState<string | null>(null)

	const checkTx = async (txId: string) => {
		setLoading(true)
		setError(null)

		try {
			const response = await fetch(`https://mempool.space/api/tx/${txId}`)

			if (!response?.ok) {
				setError("Failed to fetch transaction data")
			}
			const jsonData = await response.json()
			setData(jsonData)
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

	return { checkTx, data, loading, error }
}

export default useTxAPI
