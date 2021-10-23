import web3 from "web3";
import JSBI from "jsbi";
import fs from "fs";
import {sendTx, toWei, toEther, rpcUrl, TxDetails, getWeb3js} from "./utils";
import abiDirtyBirds from "./abis/dirtybirdsflight.json";
import { AbiItem } from "web3-utils";

const addrDirtyBirds = "0xa45Ef87f51b84DBD0d5b003d288b16D3d044fe6F";
const address = "0xexample";
const privateKey = "0xexample";

function mintGasEstimation(amount: number): number {
    const increment = 116238;
    const base = 31484;
    const gas = base + amount*increment;
    return gas;
}

// TODO 定时循环查询 saleIsActive 一旦为true 自动执行
// 自动estimate gas 然后确认要下单多少个nft，从而钱包足够支付nft和gas
export async function mint() {
    const web3js = getWeb3js(rpcUrl.mainnetLinkPool);
    const contractDirtyBirdNFT = new web3js.eth.Contract(abiDirtyBirds as AbiItem[], addrDirtyBirds);
    
    const buyAmount = 5;
    const buyPrice = 0.06;
    const value = toWei(buyAmount*buyPrice);

    const gasPrice = 700*1e9;
    const gas = mintGasEstimation(buyAmount) * 1;
    
    const gasPriceBi = JSBI.BigInt(gasPrice);
    const gasBi = JSBI.BigInt(gas);
    const gasFeeBi = JSBI.multiply(gasPriceBi, gasBi);
    const gasFee = JSBI.toNumber(gasFeeBi);
    console.log("Gas will be used ", toEther(gasFee), " ETH");

    const fnMint = contractDirtyBirdNFT.methods.mint(buyAmount);
    console.log(value)
    const txHeader: TxDetails = {
        gas: 580000,
        from: address,
        to: addrDirtyBirds,
        gasPrice: gasPrice,
        value: value,
    };
    console.log(txHeader)
    //await sendTx(web3js, privateKey, txHeader, fnMint);
}