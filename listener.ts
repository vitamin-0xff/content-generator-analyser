import { randomUUID } from "node:crypto";
import { provider } from "./provider.ts";
import { ethers } from "npm:ethers";
import { sendfileHdfs } from "./utils/hdfs-client.ts";

provider.on("block", async (blockNumber) => {
    console.log("New block:", blockNumber);
    const block = await provider.getBlock(blockNumber);
    const blockTxs = block?.transactions;

    for (const txHash of blockTxs ?? []) {
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
            console.log("Transaction details not found.");
            return;
        }
        const bytes = ethers.getBytes(tx.data);
        const message = ethers.toUtf8String(bytes);
        const fileNameMatch = message.match(/file\s?:\s?([\w\.-]+)\s_+/i);
        let fileName = fileNameMatch?.at(1);
        if (!fileName) {
            fileName = randomUUID() + '.data'
        }
        await sendfileHdfs({
            filePath: fileName,
            content: message
        });
    }

});