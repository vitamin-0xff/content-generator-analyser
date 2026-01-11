import { randomUUID } from "node:crypto";

const HDFS_CONFIG = {
  protocol: "http",
  hostname: "localhost",
  port: 9000,
  user: "essid",
}
type CreateFileHdfs = {
    filePath: string;
    // if not provided, we will use filePath 
    content: string;
    hdfsUri?: string;
}
/**
 * The host system needs to have hdfs client installed and configured 
 * It's a wrapper around hdfs dfs -put command 
 * Sends a file to HDFS using the `hdfs dfs -put` command. 
 * @param createFileHdfs config of file we are going to send
 * @returns path of the file in HDFS
 */
export async function sendfileHdfs_(createFileHdfs: CreateFileHdfs): Promise<string> {
    const command = new Deno.Command("bash", {
        args: [
            `./hadoop_client.sh && append_or_create '${createFileHdfs.content}' ${createFileHdfs.filePath}`
        ]
    });
    const {stdout, stderr, code} = await command.output();
    if(code !== 0) {
        console.error(new TextDecoder().decode(stderr));
        throw new Error(`Failed to submit HDFS job for file: ${createFileHdfs.filePath}`);
    }
    if(stdout) {
        console.log(`HDFS Command Output (${createFileHdfs.filePath}):`);
        console.log(new TextDecoder().decode(stdout));
    }
    return createFileHdfs.hdfsUri ?? createFileHdfs.filePath;
}

export async function sendfileHdfs(
  createFileHdfs: CreateFileHdfs
): Promise<string> {

    await Deno.writeFile("./tmp/data.txt", (new TextEncoder()).encode(createFileHdfs.content));
    const command = new Deno.Command("hdfs", {
        args: [
            "dfs",
            "-put",
            "./tmp/data.txt",
            `/user/essid/${randomUUID()}-${new Date().toDateString().replaceAll(" ", "-").toLowerCase()}`
        ],
        stdout: "piped",
        stderr: "piped"
    });
  const process = command.spawn()
  await Deno.remove("./tmp/data.txt");
  const { code, stdout, stderr } = await process.output()
  if (code !== 0) {
    console.error(new TextDecoder().decode(stderr))
    throw new Error(
      `Failed to submit HDFS job for file: ${createFileHdfs.filePath}`
    )
  }

  if (stdout.byteLength > 0) {
    console.log(new TextDecoder().decode(stdout))
  }

  return createFileHdfs.hdfsUri ?? createFileHdfs.filePath
}

