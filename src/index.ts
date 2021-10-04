import Web3 from "web3";
import { mint, mintGasFeeEstimate } from "./bot-echibi";
import { unstakeEden } from "./bot-eden";
import { getWeb3js, rpcUrl } from "./utils";
import { collectETH, createWallets } from "./wallet-manager";

mint()
mintGasFeeEstimate()