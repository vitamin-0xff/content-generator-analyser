import { Ollama } from 'ollama'
import { GoogleGenAI } from "@google/genai";
import {load} from '@std/dotenv'

await load({envPath: '.env', export: true});

const geminiClient = new GoogleGenAI({apiKey: Deno.env.get('GEMINI_API_KEY')});

const ollamaClient = new Ollama({
    host: 'http://localhost:11434'
}) 

const createOllamaClient = () => {
    return new Ollama({
    host: 'http://localhost:11434'
    });
}

export {ollamaClient, createOllamaClient, geminiClient}