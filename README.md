
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
- don't care about an insecure firebase setup for this project
- you're happy running yarn/npm locally (ie this code in a dev env), and don't need containers
- firebase will just be used for this one usecase (store a tx), and so making an app wide provider/hoc isn't needed
- happy storing duplicate txs (no upserting via tx id)

NOTE / TODO:
- check size calculation carefully
- confirmation count not included in api response. could make a crude estimate based on average blocktime or otherwise get the current block height and determine delta.


## test data

genesis block coinbase tx (eg blockheight 0): 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b