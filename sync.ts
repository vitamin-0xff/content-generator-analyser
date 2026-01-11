import { ethers } from "npm:ethers";
import { provider } from "./provider.ts";
import { AccountsConfig } from "./accounts-config.ts";
/**
 * List accounts 
 */
export async function listAccounts() {
  const accounts = await provider.listAccounts();
  // those addresses are for Ganache local blockchain (demonstration purposes)
  const firstTwoAddress = accounts.map(it => it.address).slice(0, 2);
  // set sender and receiver in AccountsConfig
  AccountsConfig.sender = firstTwoAddress[0];
  AccountsConfig.receiver = firstTwoAddress[1];
  console.log("Semulation: ")
  console.log("Account loaded (sender) " + AccountsConfig.sender);
  console.log("Account loaded (receiver) " + AccountsConfig.receiver);
}
/**
 * Send content over the network! 
 * @param content the content
 * @param {sender, receiver} both loaded at startup time
 */
export const simulateTransaction = async (content: string, {sender, receiver} = AccountsConfig) => {
  const message = ethers.hexlify(ethers.toUtf8Bytes(content));
  const from = sender;
  const to = receiver;
  const data = message;
  const gasLimit = await provider.estimateGas({ from, to, value: 0, data });
  // This is a simulation function. Actual implementation would require private keys and signing.
  const transaction = await provider.send("eth_sendTransaction", [
    {
      from: from,
      to: to,
      value: "0x0",
      gas: ethers.toBeHex(gasLimit),
      gasPrice: "0x3B9ACA00", 
      data: message,
    },
  ]);
  console.log(transaction);
}