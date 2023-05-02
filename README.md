# compression-nfts

   _This is a devnet look into minting compressed nfts and setting up the merkle tree to do it. This will use Helius methods to call necessary information to interact with the compressed NFTs._ 

Compressed NFTs differ from regular NFTs in that they don’t have the token information stored on-chain, and 

This is typically accomplished in a few steps: 
Setting up the Merkle tree.
Setting up the collection.
Minting the compressed NFTs.
Transferring to another wallet. 

# Setting up the project `.env`

In the root of the example project directory you should see a `.env.example` file. If you are following along with the repository tutorial please make sure to have these values set before running **ANY** steps. If you are creating on your own, please notate where these values are tied in on the example repository, as these values are necessary in certain aspects to complete set up. 

**In the `.env` file insert the following variables:**
      * `KEYPAIR_SRC` - Fill in wallet .json name for keypair created with Solana CLI. This will fund all transactions in this demo.
      * `MERKLE_TREE_SRC` - Fill in wallet .json name for merkle created with Solana CLI.
      * `HELIUS_RPC_URL` - RPC with API key you can get from https://dev.helius.xyz/dashboard/app    
      * `SOLANA_RPC` - This could be the same but is typically "https://api.devnet.solana.com" for devnet tests. You can also use your `HELIUS_RPC` value set. 
      * `COLLECTION_MINT_WALLET` - Fill in wallet .json name for collection mint wallet created with Solana CLI.
      * `COLLECTION_MINT` - Paste in the name of the COLLECTION_MINT_WALLET without the .json at the end, this represents the address.
      * `COLLECTION_METADATA` - Collection mint uri (typically from arweave or shadow.storage)      
      * `NFT_METADATA` - NFT mint uri (typically from arweave or shadow.storage). Make this one good. There will be a lot ;). (This upload can of course be customized to allow different images, for sake of keeping the basic concepts, this will be one image type).
      * `COLLECTION_SIZE` - Number of NFTs you want minted. This will also be the number minted to your wallet key in this demo. 
      * `ASSET_ID` - This will be the asset ID produced from running `npm run id` after the collection piece is minted, and you are ready to transfer. 

# Setting up Solana Wallets

If you have Solan CLI or the Tool Suite you should be able to use the `solana-keygen` command to start the wallet creation. For this example, I made my way into the `src/wallet` folder and ran the command: 

`solana-keygen grind –starts-with W:3` 

This found 3 Wallets beginning with W for this example that I was able to use and added them to my `src/wallets` folder. You now want to go into `.env` and past the file name for this in the existing path.

Now that we have those values set, we can begin creating the Merkle tree.

Before we dive in, It is important to think of a Merkle tree in compressed NFTs as a collection of NFTs, and each “leaf” of the merkle tree is acting as an NFT. Therefore, we need to make sure that the Merkle tree is ready to handle all of the data we are ready to add to. 

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

 # Step 2 - Create Collection

 * Input collection NFT metadata and NFT metadata uri in the `.env`file under `COLLECTION_METADATA` and `NFT_METADATA`.
 * Make sure that the `COLLECTION_SIZE` is properly set. This will also determine how many are minted into our wallet and the cap of the collection. 
    * *The number is kept the same in this repo to mint all cNFTs added into one wallet. You can have this number differ if you were building a UI component around this.
 * Input collection metadata into `/src/collection.ts` and input the collections information. 
   * You will need: 
    * Name
    * Symbol
    * URI
 * Run `npm run collection` to get this initial collection Mint created. 
 * You should see a token generated that matches the wallet key you set for the collection in `.env`. Please search this using the explorer. 

# Step 2 - Mint NFTs
 We are almost at the fun part of being able to see them in wallet! Now we just need to mint the NFTs we set in the previous step. 
 A few things to note of this repo: 
   * The current repo is set to mint ALL NFTs from the collection into your wallet assigned in as the `KEYPAIR_SRC`. You can change this set up as needed, but will require a bit of customization. 
   * We are planning to add a transfer function here to move NFTs out of wallet. Please keep an eye out for an update on this _soon_.
   * Once you have your value set here, make sure you have SOL in the devnet environment wallet, and you are ready to mint! 
   * Run `npm run mint` to start the minting process. 
      * From this, you will see the transactions start to populate in your terminal, copy/paste one of the values to ensure these are a success. 
      * Check in SolFlare wallet to make sure the cNFTs were properly minted, you should start to see them properly populate. 

Now you have minted your first cNFTs! 

We are now ready to set up interactions with them, in this example, we will be transferring a compressed NFT to another wallet. 

#Step 3 - Transfer NFTs

So now that our NFTs are minted to a wallet, we can start the process of transferring them to another wallet. You can take the core concepts here of a transfer, and add your own logic to add additional addresses, etc. 

For this example, we will be using one address to transfer to.





# Project commands

* `npm run merkle` - creates merkle proof with wallet you've set. 
* `npm run collection` - creates collection NFT from **COLLECTION_METADATA** stored in .env file.
* `npm run mint` - will mint the amount of NFTs you set in for the size of collection.

