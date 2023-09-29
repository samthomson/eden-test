import React from "react"
import ReactDOM from "react-dom/client"
import TXChecker from "./components/TXChecker"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
	<React.StrictMode>
		<TXChecker />
	</React.StrictMode>
)
