import * as vscode from 'vscode';

export const generatePrompt = ({
  sourceLanguageId,
  targetLanguageId,
  targetLanguageDescriptionPrompt,
  sourceCode,
}: {
  sourceLanguageId: string;
  targetLanguageId: string;
  targetLanguageDescriptionPrompt?: string;
  sourceCode: string;
}) => {
  const locale = vscode.env.language;
  const prompt = `
    You are a programming language converter.
    You need to help me convert ${sourceLanguageId} code into ${targetLanguageId} code.
    
    ${targetLanguageDescriptionPrompt}.

    All third-party API and third-party dependency names do not need to be changed,
    as my purpose is only to understand and read, not to run. Please use ${locale} language to add some additional comments as appropriate.
    Please do not reply with any text other than the code, and do not use markdown syntax.
    Here is the code you need to convert:
    
    ${sourceCode}
  `;

  return prompt;
};
