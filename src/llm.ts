import OpenAI from 'openai';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { generatePrompt } from "./prompt";
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export async function convertCodeUsingAPI(code: string): Promise<string> {
    const openai = new OpenAI({
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        apiKey: process.env.OPENAI_API_KEY
    });

    try {
        const response = await openai.chat.completions.create({
            model: "qwen1.5-72b-chat",
            messages: [
                { role: "system", content: generatePrompt("go-zero") },
                { role: "user", content: `Please convert the following code:\n\n${code}` }
            ],
            temperature: 0,
        });

        if (response.choices && response.choices.length > 0) {
            return response.choices[0].message.content || "No conversion result";
        } else {
            throw new Error("No response from OpenAI");
        }
    } catch (error: any) {
        console.error("Error calling OpenAI API:", error);
        throw new Error(`Failed to convert code: ${error.message}`);
    }
}