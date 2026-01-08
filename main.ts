import { ethers } from "npm:ethers";
import { provider } from "./provider.ts";


async function listAccounts() {
  const accounts = await provider.listAccounts();
  for (const addr of accounts) {
    const balance = await provider.getBalance(addr);
    JSON.stringify(addr);
    console.log(`${JSON.stringify(addr)} : ${ethers.formatEther(balance)} ETH`);
  }
}

// send money from one account to another
const simulateTransaction = async () => {
  const message = ethers.hexlify(ethers.toUtf8Bytes("Hello Ganache!"));
  const from = "0x9F85c703ADee4f0F19c1e3FcDCb80c52D7340718";
  const to = "0x397CC9957e139B19ed3A228BBCD4aDc425C6218C";
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
provider



// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await listAccounts();
  await simulateTransaction();
}
