import web3 from "web3";
import JSBI from "jsbi";
import fs from "fs";
import {sendTx, toEther,getBalance, TxDetails} from "./utils";

export async function createWallets(web3js: web3, fileName: string, num: number) {
  let json: any[] = [];
    
  for (let i = 0; i < num; i++) {
    const wallet = await web3js.eth.accounts.create();
    const item = {address: wallet.address, privateKey: wallet.privateKey};
    console.log(item);
    json.push(item);
  }
  fs.writeFileSync(`src/data/${fileName}.json`, JSON.stringify(json, null, 2));
}


export async function collectETH(web3js: web3, fileName: string, targetAddr: string) {
  const gasPrice = await web3js.eth.getGasPrice();

  // TODO 未来可以加gasPrice过高中止交易的校验

  const json = JSON.parse(fs.readFileSync(`src/data/${fileName}.json`) as any);
  let totalLeft = 0;

  for (let i = 0; i < json.length; i++) {
    const { address, privateKey } = json[i];
    console.log(address)
    const balance = await getBalance(web3js, address);
    totalLeft += Number(balance);

    const gas = await web3js.eth.estimateGas({from:address, to:targetAddr, value:balance});
    console.log("gas", gas);

    const gasBi = JSBI.BigInt(gas);
    const gasPriceBi = JSBI.BigInt(gasPrice);
    const gasFeeBi = JSBI.multiply(gasBi, gasPriceBi);
    const gasFee = JSBI.toNumber(gasFeeBi);

    let txHeader: TxDetails = {
      "from": address,
      "gas": 20060000,
      "gasPrice": gasPrice,
      "value": Number(balance)-2*Number(gasFee),
      "to": targetAddr
    }
    console.log("balance", toEther(balance));
    console.log("value",toEther(txHeader.value ? txHeader.value: 0));
    
    console.log("eth", toEther(gasFee));
    console.log("usd",  Number(toEther(gasFee))*3200);
    
    try {
      //await sendTx(web3js, privateKey, txHeader);
    } catch (err) {
      console.log(err);
    }
  }
  console.log("totalLeft", toEther(totalLeft))
}
