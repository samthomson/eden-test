import React from "react"
import * as Types from "../declarations"
import useTxAPI from "../hooks/useTxAPI"
import useStoreTXData from "../hooks/useStoreTXData"

const TXChecker: React.FC = () => {
	const { checkTx, txData, loading: isLoading, error } = useTxAPI()
	const { storeTXData } = useStoreTXData()

	const [txInput, setTxInput] = React.useState<string>("")
	const [retrievedTXData, setRetrievedTXData] = React.useState<
		Types.TransactionData | undefined
	>(undefined)

	// if we get data back from the api - do something with it
	React.useEffect(() => {
		// display the tx data - irrespecive of whether we found a broadcast tx or not
		setRetrievedTXData(txData)
		// if it did exist on the network, let's store it to our db
		if (txData?.isBroadCast) {
			storeTXData(txData)
		}
	}, [txData])

	// clear the ui when the user starts typing
	React.useEffect(() => {
		setRetrievedTXData(undefined)
	}, [txInput])

	const isTransactionDataFound = !!txInput && !isLoading && !!retrievedTXData

	const testTx = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (txInput === "") {
			return
		}
		checkTx(txInput)
	}

	return (
		<div>
			<h2>Check a TX</h2>
			<form onSubmit={testTx}>
				<input
					type="text"
					id="tx"
					name="tx"
					value={txInput}
					disabled={isLoading}
					onChange={(val) => setTxInput(val.currentTarget.value)}
					size={70}
				/>
				&nbsp;
				<input
					type="submit"
					value="Get info"
					disabled={isLoading || txInput === ""}
				/>
			</form>
			<hr />
			{isLoading && <>loading...</>}
			{isTransactionDataFound && (
				<>
					<h4>{retrievedTXData.txId}</h4>
					Status: {retrievedTXData.status}
				</>
			)}
		</div>
	)
}

export default TXChecker
