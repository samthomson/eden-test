import * as React from "react"
import * as FireBaseApp from "firebase/app"
import * as FireBaseStore from "firebase/firestore"

// todo: put this and other types in a single declarations file
type TXData = {
	txId: string
	lastStatus: string
	lastStatusAt: string
	satsPerVbyte: number
}

type UseStoreTXDataResult = {
	storeTXData: (data: TXData) => Promise<boolean>
	isLoading: boolean
	error: string | null
}
// todo: think about how all this is hardcoded
const firebaseConfig = {
	apiKey: "AIzaSyA_XUPTK2gSD7CXR-CJpv9d-K9scnx1mEQ",
	authDomain: "eden-code-challenge.firebaseapp.com",
	projectId: "eden-code-challenge",
	storageBucket: "eden-code-challenge.appspot.com",
	messagingSenderId: "381431633150",
	appId: "1:381431633150:web:15be4197455d4a017b81af",
}
const app = FireBaseApp.initializeApp(firebaseConfig)
const db = FireBaseStore.getFirestore(app)

const useStoreTXData = (): UseStoreTXDataResult => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [error, setError] = React.useState<string | null>(null)

	const storeTXData = async (data: TXData): Promise<boolean> => {
		setIsLoading(true)
		setError(null)

		try {
			const docRef = await FireBaseStore.addDoc(
				FireBaseStore.collection(db, "transactions"),
				{
					...data,
				}
			)
			return !!docRef?.id
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "An unknown error occurred")
			return false
		} finally {
			setIsLoading(false)
		}
	}

	return { storeTXData, isLoading, error }
}

export default useStoreTXData
