import * as React from "react"

// todo: put this and other types in a single declarations file
type TXData = {
	txId: string
	lastStatus: string
	lastStatusAt: number
	satsPerVbyte: number
}

type UseStoreTXDataResult = {
	storeTXData: (data: TXData) => Promise<boolean>
	isLoading: boolean
	error: string | null
}

const useStoreTXData = (): UseStoreTXDataResult => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [error, setError] = React.useState<string | null>(null)

	const storeTXData = async (data: TXData): Promise<boolean> => {
		setIsLoading(true)
		setError(null)

		try {
			// todo: store data in fireb
			return true
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred")
			return false
		} finally {
			setIsLoading(false)
		}
	}

	return { storeTXData, isLoading, error }
}

export default useStoreTXData
