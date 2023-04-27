# compression-nfts

# Step 1 - Create Merkle
* Create **2** wallets and store in `/src/wallet/` directory using `solana-keygen`. 
    * One wallet will be used for signing and paying for transactions + acting as merkle tree and collection authority.
    * The other wallet created will be the account used for the Merkle Tree.
    * Both need to be added to the .env with only the wallet name needed to be entered if you are using the .env.example template.
* Add Devenet sol to wallet you will be using as a signer.
* Set the max-size of the merkle tree in the **maxDepth** in `/src/merkle.ts`. 
    * Use log2(nftAmount) calculation to determine the maxDepth.
    * For instance you can use **log2(10000)** to determine the **maxDepth** for 13.2 (which you would use **14** as that is the nearest value accepted).
    * If maxDepth and maxBufferSize do not match, your IDE will show an error of an invalid pair. 
* Run `npm run merkle` to create the account. A signature should be produced that can be used on https://explorer.solana.com/?cluster=devnet to verify the creation of the account. 

# Step 2 - Create Collection NFT
* Input collection NFT metadata and NFT metadata uri in the `.env`file under `COLLECTION_METADATA` and `NFT_METADATA`.
* Make sure that the `COLLECTION_SIZE` is properly set. This will also determine how many are minted into our wallet. 
    * *The number is kept the same in this repo to mint all cNFTs added into one wallet. You can have this number differ if you were building a UI component around this.
* Input collection metadata into `/src/collection.ts` and input the collections information. 
   * You will need: 
    * Name
    * Symbol
    * Uri
 * Run `npm run collection` to get this initial collection Mint created. 

# Commands:
* `npm run merkle` - creates merkle proof with wallet you've set. 
* `npm run collection` - creates collection NFT from **COLLECTION_METADATA** stored in .env file.
* `npm run mint` - will mint the amount of NFTs you set in for the size of collection.
