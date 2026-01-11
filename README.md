# Ethereum Network Content Syncer

This project is a Deno-based application that generates content using AI models (Google Gemini and Ollama), and then syncs this content with an Ethereum network. It also includes functionality to interact with Hadoop Distributed File System (HDFS).

## Features

- **Content Generation:** Generate stories and articles using Google Gemini or a local Ollama instance.
- **Ethereum Integration:** Simulate transactions on an Ethereum network with the generated content.
- **Hadoop HDFS Integration:** Save generated content to HDFS.
- **Command-line Interface:** A simple and easy-to-use CLI to run the application.
- **Archive System:** Automatically archives processed files.

## Technologies Used

- [Deno](https://deno.land/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Ethereum](https://ethereum.org/)
- [Hadoop (HDFS)](https://hadoop.apache.org/)
- [Google Gemini](https://ai.google.dev/)
- [Ollama](https://ollama.ai/)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/eth-network.git
    cd eth-network
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root directory and add the necessary environment variables. For example:
    ```
    GOOGLE_API_KEY=your_google_api_key
    ```

3.  **Install Deno:**
    Follow the official instructions to install Deno: [https://deno.land/manual/getting_started/installation](https://deno.land/manual/getting_started/installation)

4.  **Hadoop and Ethereum Setup:**
    This project assumes you have a running Hadoop cluster and an Ethereum node accessible from your environment. The configuration for these services can be found in:
    - `utils/hdfs-client.ts` for HDFS.
    - `sync.ts` and `provider.ts` for Ethereum.

5.  **Hadoop Docker Setup (`ooxwv-docker_hadoop`):**
    The `ooxwv-docker_hadoop/` directory contains a separate Docker-based Hadoop setup. This directory is not part of this repository's Git tracking (it's in `.gitignore`). You should clone it separately or ensure it's present in your working directory if you intend to use the HDFS integration.

## Usage

The main entry point of the application is `main.ts`. You can use the `deno task` command to run the application.

### `write` command

This command generates content based on the provided subjects.

-   **Using Google Gemini:**
    ```bash
    deno run --allow-all main.ts write 'subject1, subject2'
    ```

-   **Using local Ollama instance:**
    ```bash
    deno run --allow-all main.ts write --local 'subject1, subject2'
    ```

### `sync` command

This command syncs the content from the `data` directory to the Ethereum network.

```bash
deno run --allow-all main.ts sync
```

The `sync` command will:
1.  Read all files from the `data` directory.
2.  Create a single batch of content.
3.  Simulate an Ethereum transaction with the content.
4.  Move the processed files to the `archive` directory.

## Project Structure

```
.
├── .gitignore
├── accounts-config.ts      # Ethereum account configuration
├── deno.json               # Deno project configuration
├── deno.lock               # Deno lock file
├── docker-compose.yaml     # Docker services definition
├── hadoop_client.sh        # Hadoop client script
├── listener.ts             # Ethereum event listener
├── main.ts                 # Main application entry point
├── main_test.ts            # Tests for the main application
├── provider.ts             # Ethereum provider configuration
├── providers.ts
├── sync.ts                 # Ethereum synchronization logic
├── archive/                # Archived content files
├── data/                   # Data files to be processed
├── ooxwv-docker_hadoop/    # Docker setup for Hadoop
└── utils/
    ├── content-generator.ts  # Content generation logic
    └── hdfs-client.ts        # HDFS client utility
```
