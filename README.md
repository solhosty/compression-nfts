# compression-nfts
   *this is a devnet look into minting compressed nfts and setting up the merkle tree to do it.
# Setting up project
   * In the `.env` file insert the following variables:
      * `KEYPAIR_SRC` - Fill in wallet .json name for keypair created with Solana CLI. This will fund all transactions in this demo.
      * `HELIUS_RPC_URL` - RPC with API key you can get from https://dev.helius.xyz/dashboard/app    
      * `SOLANA_RPC` - This could be the same but is typically "https://api.devnet.solana.com" for devnet tests.
      * `COLLECTION_MINT_WALLET` - Fill in wallet .json name for collection mint wallet created with Solana CLI.
      * `COLLECTION_MINT` - Paste in the name of the COLLECTION_MINT_WALLET without the .json at the end, this represents the address.
      * `MERKLE_TREE_SRC` - Fill in wallet .json name for merkle created with Solana CLI.
      * `COLLECTION_METADATA` - Collection mint uri (typically from arweave or shadow.storage)      
      * `NFT_METADATA` - NFT mint uri (typically from arweave or shadow.storage). Make this one good. There will be a lot ;). (This upload can ofc be customized to allow different images, for sake of keeping the basic concepts, this will be one image type).
      * `COLLECTION_SIZE` - Number of NFTs you want minted. This will also be the number minted to your wallet key in this demo. 
      
   
# Step 1 - Create Merkle
 * Create **2** wallets and store in `/src/wallet/` directory using `solana-keygen`. 
    * One wallet will be used for signing and paying for transactions + acting as merkle tree and collection authority.
    * The other wallet created will be the account used for the Merkle Tree.
    * Both need to be added to the .env with only the wallet name needed to be entered if you are using the .env.example template.
 * Add Devnet sol to wallet you will be using as a signer.
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
