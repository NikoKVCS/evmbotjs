import web3 from "web3";
import JSBI from "jsbi";
import fs from "fs";
import {sendTx, toWei, rpcUrl, TxDetails, getWeb3js, toEther} from "./utils";
import abiXavaStaking from "./abis/xavaAllocationStaking.json"
import { AbiItem } from "web3-utils";

const addrXavaStaking = `0xA6A01f4b494243d84cf8030d982D7EeB2AeCd329`;

export async function exportData() {
    const web3js = getWeb3js(rpcUrl.avax);
    const contractXavaStaking = new web3js.eth.Contract(abiXavaStaking as AbiItem[], addrXavaStaking);
    
    const options = {
        fromBlock: 9558875,
        toBlock: 'latest'
    };
    const events = await contractXavaStaking.getPastEvents("Deposit", options);

    for (let i = 0; i<events.length; i++) {
        try {
            const event = events[i];
            const values = event.returnValues;
            const xavaWei = values["2"];
            const xava = toEther(xavaWei);
            console.log(xava);
        } catch(err) {
            console.error(err);
        }
    }
    
}