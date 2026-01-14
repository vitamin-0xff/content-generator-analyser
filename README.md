
# Ethereum Content Archiver

This project is a command-line tool for generating content using Large Language Models (LLMs), publishing it to an Ethereum-compatible blockchain, and archiving it to a Hadoop HDFS cluster.

## Project Overview

The system is composed of three main parts:

1.  **Content Generator**: A CLI command to generate articles on specified subjects using either a local or a remote LLM (Gemini). The generated content is stored locally in the `data/` directory.
2.  **Blockchain Synchronizer**: A CLI command that reads the generated content from the `data/` directory, bundles it, and sends it as a transaction to an Ethereum network. This serves as a proof-of-publication.
3.  **HDFS Archiver**: A background listener that watches the blockchain for new blocks. When it finds a transaction containing content from this tool, it extracts the data and archives it permanently in a Hadoop HDFS cluster.

## Features

-   Content generation via LLMs (local or Gemini).
-   Publishing content to an Ethereum blockchain.
-   Archiving content to HDFS.
-   Uses [Deno](https://deno.land/) for the runtime environment.
-   Includes a Docker Compose setup for running local Ethereum (Ganache) and Hadoop clusters.

## Prerequisites

-   [Deno](https://deno.land/manual/getting_started/installation) (version 1.30 or higher)
-   [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
-   Hadoop client installed and configured on the host machine (if not using the provided Docker setup).

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eth-network.git
cd eth-network
```

### 2. Start the Services

The project includes a `docker-compose.yaml` file to run the necessary services (Hadoop and Ganache).

```bash
docker-compose up -d
```

This will start:
- A Hadoop cluster with a NameNode and DataNode.
- A local Ethereum blockchain instance using Ganache.

### 3. Run the Application

The main application has two primary modes: `write` to generate content and `sync` to publish it. The `listener.ts` script runs separately to handle archiving.

It's recommended to run the listener in a separate terminal to continuously monitor the blockchain.

**Terminal 1: Run the Blockchain Listener**

```bash
deno run -A listener.ts
```

**Terminal 2: Use the CLI**

**To generate content:**

Provide a comma-separated list of subjects. By default, this uses a remote LLM (Gemini).

```bash
deno run -A main.ts write "The history of AI, The future of space exploration"
```

To use a local LLM, add the `--local` flag:

```bash
deno run -A main.ts write --local "Quantum Computing"
```

This will create files in the `./data/` directory.

**To sync content to the blockchain:**

```bash
deno run -A main.ts sync
```

This will read all files from `./data/`, send their content in a single transaction, and then move the local files to the `./archive/` directory. The listener in Terminal 1 should detect this transaction and save the content to HDFS.

## Project Structure

```
.
├── docker-compose.yaml     # Defines the Hadoop and Ganache services
├── main.ts                 # Main CLI entry point (write and sync commands)
├── listener.ts             # Listens to the blockchain and archives to HDFS
├── sync.ts                 # Handles sending transactions to the Ethereum network
├── utils/
│   ├── content-generator.ts# Logic for generating content with LLMs
│   └── hdfs-client.ts      # Wrapper for the HDFS command-line client
├── data/                   # Staging directory for newly generated content
├── archive/                # Local archive for files after they are synced
├── deno.json               # Deno configuration file
├── deno.lock               # Deno lock file
└── ...
```

## How It Works

1.  `deno run -A main.ts write "subject"` calls the `generateStory` or `generateStoryWithGemini` function to create a text file in `./data`.
2.  `deno run -A main.ts sync` reads files from `./data`, bundles them, and uses the `ethers` library to call `simulateTransaction`. This sends the bundled content in the `data` field of a transaction to the Ganache network.
3.  The `listener.ts` script, which is connected to the Ganache provider, detects the new transaction in a block.
4.  It decodes the transaction data to retrieve the original content.
5.  It then calls `sendfileHdfs`, which uses a `Deno.Command` to execute `hdfs dfs -put`, writing the content into the HDFS cluster.
