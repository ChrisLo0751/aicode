import OpenAI from 'openai';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { client } from "./langchain";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export async function convertCodeUsingAPI(sourceCode: string, onChunk: (message: string, status: boolean) => void) {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `
            You are a programming language converter.
            You need to help me convert {sourceLanguageId} code into {targetLanguageId} code.
            
            {targetLanguageDescriptionPrompt}.

            All third-party API and third-party dependency names do not need to be changed,
            as my purpose is only to understand and read, not to run. Please use {locale} language to add some additional comments as appropriate.
            Please do not reply with any text other than the code, and do not use markdown syntax.
            User will provide the code to convert.
        `],
        ["user", "{sourceCode}"],
    ]);


    const parser = new StringOutputParser();
    const chain = prompt.pipe(client).pipe(parser);
    const stream = await chain.stream({
        sourceLanguageId: "erlang",
        targetLanguageId: "go",
        targetLanguageDescriptionPrompt: "Please convert the following code to Go.",
        sourceCode,
        locale: "en",
    });

    let chunks = "";
    for await (const chunk of stream) {
        console.log(`${chunk}|`);
        chunks += chunk;
        onChunk(chunks, false);
    }
}