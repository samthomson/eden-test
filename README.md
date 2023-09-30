
# A simple app for looking up past btc txs

- react app
- user enters a tx and clicks 'get info'
- tx state is looked up, specifically
  - if it's in the mempool
  - how many blocks have secured it
- save the tx status to firestore (see assumption 1)
  - txid
  - lastStatusAt (datetime of last known tx state change)
  - lastStatus: string literalisation of status desc.
  - satsPerVbyte: calculate and save the sats per vbyte

- display tx info
  - handle/display not found 'error'
  - tx state
    - mempool / mined variance
    - if mined; confirmation-count

## assumptions

- storing **tx data** to firebase, *not* user - look up - behaviour ie if a tx is not found, then we won't store anything to the db
- don't care about an insecure firebase setup for this project
- you're happy running yarn/npm locally (ie this code in a dev env), and don't need containers
- firebase will just be used for this one usecase (store a tx), and so making an app wide provider/hoc isn't needed
- will not be storing duplicate txs (upserting on tx id, with latest status - no historical status)
- for lastStatusAt I'll just log when I called the mempool api, since our status derivation is quite basic and we aren't really tracking the point of status change (ie when a tx was mined, or when the number of blocks changed - this would ultimately always be the latest blocks block_time anyway), could adjust this upon clarification of the requirement.

## notes

- I called the api a second time (per tx) to calculate the confirmations, I could have made an approximation based on the block_time and current time but this is one value I thought worth ensuring
- I called mempools raw api instead of using their package which would have required some webpack polyfilling for the browser (doable but not a priority for this grade). two reqs in one place was still simple enough, albeit on the verge of justifying a refactor.
- I chose to represent the `lastStatusAt` as a string representation, since we are only using it in the db record (where iso string timestamps are more typical, compared to unix [milli]seconds)
- I calculated the satsPerVbyte via the fee as defined in the spec (sum inputs - sum outputs), even though the fee is defined in the api response. ordinarily this mightn't make sense, as if we trust the api for other tx data then we could trust the api for the fee. But without a discussion, why not ;) - for now
- simiarly I did *not* calculate the tx size from inputs/outputs as that would be more complex (I believe diff tx types affect this a bit) and prob outwith the scope of this task - but happy to go further on this if need be.
- I used weight / 4, and not size, for the tx size in calculating satsPerVbyte, which I believe is safer for segwit and legacy txs - this is an area I not 100% on and would be keen to discuss (or if in reality, research more thoroughly first)
- we're only interested in mainnet txs
- I determine coinbase txs by asserting there were no prevout inputs to a tx - this of course depends on the api tx data being complete (and not simply missing that tx's input). Another idea could be to check the whole block of the tx, to see tx position.
- UI is indeed minimal / ugly af

## setup and run

1. env vars: `cp tx-checker/.env.sample tx-checker/.env`
2. complete your env vars after creating a firestore project with database (in test mode - all open connections).
3. install deps: `cd tx-checker && yarn`
4. start the cra: `yarn run start`

## test data

Some test txs:

genesis coinbase 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b
first / legacy f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16
big / complex (pizza) a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d
text encoded / segwit e7169f3f0bb3a85b1411440e4946dedf107906d749bd2b02df3fac87f5461000
rbf / segwit b36bced99cc459506ad2b3af6990920b12f6dc84f9c7ed0dd2c3703f94a4b692
testnet (should 404) cda0deefbce0c813e4eae4567c9abd84df29dff031798850e28df8c44cd9c979

find unconfirmed (in mempool) here: https://mempool.space/mempool-block/5

Also interesting to test with could be: high/low fees, multisig, dust, OP_RETURN, CPFP, time locked.
