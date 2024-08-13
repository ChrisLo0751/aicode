import * as dotenv from 'dotenv';
import { ChatOpenAI } from "@langchain/openai";
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const client = new ChatOpenAI({
  model: process.env.MODEL_ID,
  temperature: 0,
  configuration: {
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
});

export {
  client,
}