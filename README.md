# compression-nfts

# Step 1 - 
* Create **2** wallets and store in `/src/wallet/` directory using `solana-keygen`. 
    * One wallet will be used for signing and paying for transactions + acting as merkle tree and collection authority.
    * The other wallet created will be the account used for the Merkle Tree.
    * Both need to be added to the .env with only the wallet name needed to be entered if you are using the .env.example template.
* Add Devenet sol to wallet you will be using as a signer.
* Set the max-size of the merkle tree in the **maxDepth** in `merkle.ts`. 
    * Use log2(nftAmount) calculation to determine the maxDepth.
    * For instance you can use **log2(10000)** to determine the **maxDepth** for 13.2 (which you would use **14** as that is the nearest value accepted).
# Commands:
* `npm run merkle` - creates merkle proof with wallet you've set. 
* `npm run collection` - creates collection NFT from **COLLECTION_METADATA** stored in .env file.
* `npm run mint` - will mint the amount of NFTs you set in for the size of collection.
