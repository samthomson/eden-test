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
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
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
