import React from "react"
import useTxAPI from "../hooks/useTxAPI"
import useStoreTXData from "../hooks/useStoreTXData"

const TXChecker: React.FC = () => {
	const { checkTx, data, loading, error } = useTxAPI()
	const { storeTXData } = useStoreTXData()

	const [txInput, setTxInput] = React.useState<string>("")

	// todo: type accordingly, synthetic react event?
	const testTx = (e: { preventDefault: () => void }) => {
		e.preventDefault()
		if (txInput === "") {
			return
		}
		checkTx(txInput)
	}

	React.useEffect(() => {
		console.log("data", data)
		if (!!data) {
			// we just got data back from the API, let's store it to fireb
			storeTXData({
				txId: data.txid,
				// todo: derive proper status
				lastStatus: "last status",
				// todo: derive this too
				lastStatusAt: 21000000,
				// todo: and this
				satsPerVbyte: 999,
			})
		}
	}, [data])

	return (
		<div>
			<h2>Check a TX</h2>
			<form onSubmit={testTx}>
				<input
					type="text"
					id="tx"
					name="tx"
					value={txInput}
					disabled={loading}
					onChange={(val) => setTxInput(val.currentTarget.value)}
				/>
				<input type="submit" value="Submit" disabled={loading} />
			</form>
			<hr />
			{!!data && (
				<>
					<h4>{data.txid}</h4>
					confirmed: {data.status.confirmed.toString()}
					{data.status.confirmed && data.status?.block_height !== undefined && (
						<>
							<br />
							blockheight?: {data.status.block_height.toLocaleString()}
						</>
					)}
				</>
			)}
		</div>
	)
}

export default TXChecker
