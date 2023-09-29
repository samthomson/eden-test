import * as React from "react"

interface TransactionData {}

interface useTxAPI {
	checkTx: (txId: string) => Promise<void>
	data: TransactionData | null
	loading: boolean
	error: string | null
}

const useTxAPI = (): useTxAPI => {
	const [data, setData] = React.useState<TransactionData | null>(null)
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
