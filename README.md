
# A simple app for looking up past btc txs

- react app
- user enters a tx and clicks 'get info'
- tx state is looked up, specifically
	- if it's in the mempool
	- how many blocks have secured it
- save the tx status to firestore *
	- txid
	- lastStatusAt (datetime of last known tx state change)
	- lastStatus: string literalisation of status desc.
	- satsPerVbyte: calculate and save the sats per vbyte 

- display tx info
	- handle/display not found 'error'
	- tx state
		- mempool / mined variance
		- if mined; confirmation-count


assumptions:
- * storing tx data to firebase, not user - look up - behaviour ie if a tx is not found, then we won't store anything to the db


NOTE / TODO:
- check size calculation carefully