import { provider } from "./provider.ts";
import { ethers } from "npm:ethers";

provider.on("block", async (blockNumber) => {
    console.log("New block:", blockNumber);
    const block = await provider.getBlock(blockNumber);
    const blockTxs = block?.transactions;

    blockTxs?.forEach(async (txHash) => {
        console.log(`  Tx Hash: ${txHash}`);
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
            console.log("    Transaction details not found.");
            return;
        }
        const bytes = ethers.getBytes(tx.data);
        const message = ethers.toUtf8String(bytes);
        console.log(`    From: ${tx.from}`);
        console.log(`    To: ${tx.to}`);
        console.log(`    Value: ${ethers.formatEther(tx.value)} ETH`);
        console.log(`    Gas Price: ${ethers.formatUnits(tx.gasPrice || 0, "gwei")} Gwei`);
        console.log(`    Data: ${message}`);
    });

});