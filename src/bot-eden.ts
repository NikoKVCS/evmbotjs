import web3 from "web3";
import JSBI from "jsbi";
import fs from "fs";
import {sendTx, toEther, rpcUrl, TxDetails, getWeb3js} from "./utils";
import abiEdenNetwork from "./abis/EdenNetwork.json";
import { AbiItem } from "web3-utils";

const addrEdenNetworkProxy = "0x9E3382cA57F4404AC7Bf435475EAe37e87D1c453";
const address = "0xexample";
const privateKey = "0xexample";

export async function unstakeEden() {
    const web3js = getWeb3js(rpcUrl.mainnetLinkPool);
    const contractEdenNetwork = new web3js.eth.Contract(abiEdenNetwork as AbiItem[], addrEdenNetworkProxy);
    const balance = await contractEdenNetwork.methods.stakedBalance(address).call();
    const fnUnstake = contractEdenNetwork.methods.unstake(balance);
    const txHeader: TxDetails = {
        from: address,
        to: addrEdenNetworkProxy,
    };
    await sendTx(web3js, privateKey, txHeader, fnUnstake);
}