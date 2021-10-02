import web3 from "web3";
import abiErc20 from "./abis/erc20.json";
import { AbiItem } from "web3-utils";
import { TransactionConfig } from "web3-core";

export interface TxDetails extends TransactionConfig {
  from: string;
  gas?: number | string;
  gasPrice?: number | string;
  to: string;
  value?: number | string;
}

export function getWeb3js(rpc: string): web3 {
  return new web3(new web3.providers.HttpProvider(rpc));
}

export function toWei(num: number | string): string {
  return web3.utils.toWei(Number(num).toFixed(18), "ether");
}

export function toEther(num: number | string): string {
  return web3.utils.fromWei(Number(num).toString(16), "ether");
}

export function toHex(num: number | string): string {
  return web3.utils.toHex(num);
}

export async function estimateGas(web3js: web3, details: TxDetails, data: any) {
  const gas = await web3js.eth.estimateGas({
    to: details.to,
    data: data ? data.encodeABI() : '0x00',
    value: web3.utils.toHex(details.value ? details.value : 0)
  });
  return gas;
}

export async function approveErc20(web3js: web3, privateKey: string, details: TxDetails, targetAddr: string, allowance: number) {
  const erc20Contract = new web3js.eth.Contract(abiErc20 as AbiItem[], details.to);
  console.log('approveErc20 details:', details)
  let balance = 0;
  if (allowance) {
    balance = allowance;
  } else {
    balance = await erc20Contract.methods.balanceOf(details.from).call();
  }
  let data = erc20Contract.methods.approve(targetAddr, balance);
  const result = await sendTx(web3js, privateKey, details, data);
  console.log('approveErc20 result', result);
}

export async function getErc20Balance(web3js: web3, addrErc20: string, address: string) {
  const erc20Contract = new web3js.eth.Contract(abiErc20 as AbiItem[], addrErc20);
  const balance = await erc20Contract.methods.balanceOf(address).call();
  return balance;
}

export async function getBalance(web3js: web3, address: string) {
  const balance = await web3js.eth.getBalance(address);
  return balance;
}

export async function sendTx(web3js: web3, privateKey: string, details: TxDetails, data?: any) {
  try {
    if (details.gasPrice === undefined) {
      details.gasPrice = await web3js.eth.getGasPrice();
    }
    const rawTransaction: TransactionConfig = {
      "from": details.from,
      "gas": web3js.utils.toHex(details.gas? details.gas : 5800000),
      "gasPrice": web3js.utils.toHex(details.gasPrice),
      "to": details.to,
      "value": web3.utils.toHex(details.value ? details.value : 0),
      "data": data ? data.encodeABI() : '0x00',
    };
    console.log("sendTransaction rawTransaction", rawTransaction);

    //let transaction = new Tx(rawTransaction);
    //transaction.sign(privateKey as any);
    const tx = await web3js.eth.accounts.signTransaction(rawTransaction, privateKey);

    const result = await new Promise(async (resolve) => {
      if (tx.rawTransaction) {
        await web3js.eth.sendSignedTransaction(tx.rawTransaction).on('transactionHash', (result) => resolve(result));
      }
    });
    console.log("sendTransaction result", result);
    return result;
  } catch(err) {
    console.log("sendTransaction err", err)
  }
}

export const rpcUrl = {
  optimism: "https://mainnet.optimism.io",
  arbitrum: "https://arb1.arbitrum.io/rpc",
  mainnet: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  eden: "https://api.edennetwork.io/v1/rpc",
  fantom: "https://rpcapi.fantom.network",
}