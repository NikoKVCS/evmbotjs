import Web3 from "web3";
import { unstakeEden } from "./bot-eden";
import { getWeb3js, rpcUrl } from "./utils";
import { collectETH, createWallets } from "./wallet-manager";
import { mint } from "./bot-dirtybird";
import { mintGasFeeEstimate } from "./bot-echibi";

//mint();
mintGasFeeEstimate()