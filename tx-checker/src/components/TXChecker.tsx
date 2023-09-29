import React from "react"
import useTxAPI from "../hooks/useTxAPI"
import useStoreTXData from "../hooks/useStoreTXData"

const TXChecker: React.FC = () => {
	const { checkTx, txData, loading: isLoading, error } = useTxAPI()
	const { storeTXData } = useStoreTXData()

	const [txInput, setTxInput] = React.useState<string>("")
	const [retrievedTXData, setRetrievedTXData] = React.useState<any | undefined>(
		undefined
	)

	// todo: type accordingly, synthetic react event?
	const testTx = (e: { preventDefault: () => void }) => {
		e.preventDefault()
		if (txInput === "") {
			return
		}
		checkTx(txInput)
	}

	// if we get data back from the api - do something with it
	React.useEffect(() => {
		console.log("data", txData)
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
				<input type="submit" value="Get info" disabled={isLoading} />
			</form>
			<hr />
			{isLoading && <>loading...</>}
			{isTransactionDataFound && (
				<>
					<h4>{retrievedTXData.txid}</h4>
					Status: {retrievedTXData.status}
				</>
			)}
		</div>
	)
}

export default TXChecker
