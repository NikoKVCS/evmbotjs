import { getWeb3js, rpcUrl } from "./utils";
import { collectETH, createWallets } from "./wallet-manager";

const web3js = getWeb3js(rpcUrl.eden);
//createWallets(web3js, "optimism", 3);
collectETH(web3js, "optimism-airdrop", "0xf9dCd7C5Cb97157F6249eE7960e9914443d88F74");