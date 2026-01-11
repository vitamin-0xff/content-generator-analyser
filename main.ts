import { generateStory, generateStoryWithGemini } from "./utils/content-generator.ts";
import { listAccounts, simulateTransaction } from "./sync.ts";
import { randomUUID } from "node:crypto";

const writeSubjects = async (subjectsCommaSeparated: string, isLocal=false) => {
  const subjects = subjectsCommaSeparated.split(",").map(it => it.trim()).filter(it => it.length > 0);
  if(subjects.length === 0) {
    console.warn("No subjects specified");
    return;
  }
  /**
   * this operation is too heavy
   */
  if(isLocal) {
    await Promise.all(subjects.map(it => generateStory(it)));
    return;
  }
  await Promise.all(subjects.map(it => generateStoryWithGemini(it)));
}

if (import.meta.main) {
  // await listAccounts();
  const args = Deno.args;
  const message = `
    Usage: script sync|write
    Usage: script sync : submit the content in the blockchain network
    Usage: script write [--local | -l] 'sub1, sub2, sub3 ...' 
    --local, -l : Write the subjects using local LLM
    sub : Article around a subject, like 'Tunisia, 'Cristiano Renaldo', ...
    **Note:** subjects qutted 
    `;
  if(args.length === 0)  {
    console.log(message);
    Deno.exit(1);
  }
  const command = args.shift();
  if (command == undefined) {
    console.error("Commend not specified");
    Deno.exit(-1);
  }
  if(!["write", "sync"].includes(command)) {
    console.error("Commend not supported");
    Deno.exit(-1);
  }
  const commanDataIndicator = `data-${randomUUID()}.txt`;
  if(command == 'sync') {
    // sync with the blockchain
    await listAccounts();
    console.log("Synching with the blockchain");
    const listOfContentFiles = Deno.readDir("./data");
    const filesContainContent: string[] = [];
    for await (const filePathObject of listOfContentFiles) {
      if(filePathObject.isFile) {
        filesContainContent.push(`./data/${filePathObject.name}`);
      }
    }
    let allContent = '';
    const textEncoder = new TextDecoder();
    for (const fileName of filesContainContent) {
      const indicator = `file: ${commanDataIndicator} ___\n`
      const storyName = "Story: " + fileName.split("/").at(-1)?.split(".").at(0) + "\r\n\r\n";
      const content = await Deno.readFile(fileName);
      const allStory = indicator + storyName + textEncoder.decode(content);
      allContent += allStory;
      // permission dependent
      await (new Deno.Command("mv", {
        args: [fileName, "./archive/" + (fileName.match(/data\/([\w\.]+)/)?.at(1) ?? randomUUID()+'.data')]
      })).output();
    }
    simulateTransaction(allContent);
  }else {
  const isLocal = args.includes("--local") || args.includes("-l");
  if(isLocal) {
    const subjects = args.at(1);
    console.log(subjects);
    if(!subjects) {
      console.log(message);
      Deno.exit(-1);
    }
    await writeSubjects(subjects, true);
  }else {
    const subjects = args.at(0);
    if (!subjects) {
      console.log(message);
      Deno.exit(-1);
    }
    writeSubjects(subjects);
  }
  }
  
}
