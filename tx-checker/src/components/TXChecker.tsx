import React from "react"
import useTxAPI from "../hooks/useTxAPI"

const TXChecker: React.FC = () => {
	const { checkTx, data, loading, error } = useTxAPI()

	return <div>...coming soon</div>
}

export default TXChecker
