import Web3 from "web3";
import { unstakeEden } from "./bot-eden";
import { getWeb3js, rpcUrl } from "./utils";
import { collectETH, createWallets } from "./wallet-manager";

console.log("gas",Web3.utils.hexToNumber("0x588040"))
console.log("gasPrice",Web3.utils.hexToNumber("0xe5dc5a54f"))
unstakeEden();