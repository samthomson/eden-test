export namespace TXData {
	type Base = {
		// isBroadCast: boolean
		txId: string
		status: string
		lastStatusAt: string
	}
	export type Incomplete = Base & {
		isBroadCast: false
	}

	export type Complete = Base & {
		isBroadCast: true
		confirmations: number
		satsPerVbyte: number
	}
}
export type TransactionData = TXData.Complete | TXData.Incomplete

export namespace API {
	// minimal type, for just what we need
	// and ignoring that we could have used the - typed? - mempool.js package :)
	export type TXData = {
		txid: string
		vin: {
			prevout?: {
				value: number
			}
		}[]
		vout: {
			value: number
		}[]
		weight: number
		// we will ignore this 🙈
		fee: number
		status: {
			confirmed: boolean
			block_height: number
		}
	}
}
