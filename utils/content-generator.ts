import { createOllamaClient, geminiClient } from "../providers.ts";


const filePath = (subject: string) => `./data/${subject}.txt`;

const _writeFile = async (content: string, path: string) => {
    const encoder = new TextEncoder()
    const file = await Deno.open(path, {
        write: true,
        create: true,
        append: true,
    });

    try {
        await file.write(encoder.encode(content));
    } catch (e: unknown) {
        throw e;
    }
    finally {
        file.close();
    }
}


/**
 * @param subject content's subject 
 */
export const generateStory = async (subject: string) => {
    const newClient = createOllamaClient()
    const generatorAsync = await newClient.chat({
        model: "stablelm2",
        stream: true,
        messages: [
            { role: "system", content: "write me a story about " + subject }
        ]
    });
    // may throw error
    await _writeFile("\n\n", filePath(subject));
    for await (const chunk of generatorAsync) {
        await _writeFile(chunk.message.content, filePath(subject));
    }
    const postFix =
        `\n\n-------------------------------------------${new Date().toISOString()}-----------------------------------------\n\n\n\n`
    await _writeFile(postFix, filePath(subject));
}

export const generateStoryWithGemini = async (subject: string) => {
    const constructedFilePath = subject.toLocaleLowerCase().replaceAll(" ", "-");
    const response = await geminiClient.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: 'write me a long story about ' + subject,
    });
    await _writeFile("\n\n", filePath(constructedFilePath));
    for await (const chunk of response) {
        if (chunk.text) {
            _writeFile(chunk.text, filePath(constructedFilePath));
        }else {
            console.warn("Return type not text");
        }
    }
    const postFix =
        `\n\n-------------------------------------------${new Date().toISOString()}-----------------------------------------\n\n\n\n`
    await _writeFile(postFix, filePath(constructedFilePath));
}



if (import.meta.main) {
    console.log(Deno.args[0]);
    await generateStoryWithGemini("Cristiano renaldo");
}