import { getWeb3js, rpcUrl } from "./utils";
import { collectETH, createWallets } from "./wallet-manager";

const web3js = getWeb3js(rpcUrl.optimism);
//createWallets(web3js, "optimism", 3);