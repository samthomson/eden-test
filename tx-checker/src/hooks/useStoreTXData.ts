import * as React from "react"
import * as FireBaseApp from "firebase/app"
import * as FireBaseStore from "firebase/firestore"

import * as Types from "../declarations"

type UseStoreTXDataResult = {
	storeTXData: (data: Types.TXData.Complete) => Promise<void>
	isLoading: boolean
	error: string | undefined
}

// ideally this would be outwith this component, and perhaps with env vars passed in more appropriately. outwith the scope of this grade of task.
// likewise keys/ids should be 'secured' ie whitelist certain hosts only
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
	const [error, setError] = React.useState<string | undefined>(undefined)

	const storeTXData = async (data: Types.TXData.Complete): Promise<void> => {
		setIsLoading(true)
		setError(undefined)

		try {
			// first make a reference to our tx based on its id
			const docRef = FireBaseStore.doc(db, "transactions", data.txId)

			// then create/upsert
			await FireBaseStore.setDoc(docRef, data, { merge: true })
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "An unknown error occurred")
		} finally {
			setIsLoading(false)
		}
	}

	return { storeTXData, isLoading, error }
}

export default useStoreTXData
