import web3 from "web3";
import JSBI from "jsbi";
import fs from "fs";
import {sendTx, toWei, rpcUrl, TxDetails, getWeb3js, toEther} from "./utils";
import abiEchibi from "./abis/echibi.json"
import { AbiItem } from "web3-utils";

const addrEchibi = "0xbf67a43922F1c36692A6E8f82e9b9881BE43E8e7";
const address = "0xexample";
const privateKey = "0xexample";

export async function mint() {
    const web3js = getWeb3js(rpcUrl.mainnetLinkPool);
    const contractEchibi = new web3js.eth.Contract(abiEchibi as AbiItem[], addrEchibi);
    const gas = await contractEchibi.methods.mintChibi(10).estimateGas({from: address, gas: 58000000, value: toWei(0.3)});
    const gasPrice = 60*1e9;

    const gasBi = JSBI.BigInt(gas);
    const gasPriceBi = JSBI.BigInt(gasPrice);
    const gasFeeBi = JSBI.multiply(gasBi, gasPriceBi);
    const gasFee = JSBI.toNumber(gasFeeBi);

    console.log("gas", gas)
    console.log("gasPrice", gasPrice)
    console.log("gasFee", gasFee)
    console.log("gasFee", toEther(gasFee))
}

export function mintGasFeeEstimate() {

    // svs mint gasfee analysis:
    //const gasFee = toWei("0.025450809320261744");
    //const gasPrice = toWei("0.000000138262507444");

    // echibi mint gasfee analysis:
    const gasFee = toWei("0.329737325297552847");
    const gasPrice = toWei("0.000000665398023803");

    const gasPriceBi = JSBI.BigInt(gasPrice);
    const gasFeeBi = JSBI.BigInt(gasFee);

    const gasBi = JSBI.divide(gasFeeBi, gasPriceBi);
    const gas = JSBI.toNumber(gasBi);

    //console.log("gasFee", gasFee);
    //console.log("gasPrice", gasPrice);
    console.log("gas", gas);

    const gasPriceHighBi = JSBI.BigInt(400*1e9);
    const gasHighBi = JSBI.multiply(gasBi, gasPriceHighBi);
    //console.log("gasHigh", toEther(JSBI.toNumber(gasHighBi)))

    const a = 1193864;// mint 10 gas used
    const b = 728912; // mint 6 gas used
    const increment = (a - b) / 4;
    const base = a - 10*increment;
    //console.log("increment", increment); // 
    //console.log("base",base)
    //console.log("predicted mint 5 gas used:", base+5*increment);

}
