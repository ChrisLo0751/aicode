// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('code-generate.helloWorld', async () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
					const document = editor.document;
					const originalCode = document.getText();

					// 在这里调用你的转换函数
					const convertedCode = await convertCodeUsingAPI(originalCode);

					// 获取当前文件的后缀
					const ext = path.extname(document.uri.fsPath);
					const newFilePath = document.uri.fsPath.replace(ext, `_converted${ext}`);
					const newFileUri = vscode.Uri.file(newFilePath);

					try {
							// 检查文件是否存在
							try {
									await vscode.workspace.fs.stat(newFileUri);
									// 文件存在，更新内容
									await vscode.workspace.fs.writeFile(newFileUri, Buffer.from(convertedCode, 'utf8'));
									vscode.window.showInformationMessage(`Updated existing file: ${newFilePath}`);
							} catch {
									// 文件不存在，创建新文件
									await vscode.workspace.fs.writeFile(newFileUri, Buffer.from(convertedCode, 'utf8'));
									vscode.window.showInformationMessage(`Created new file: ${newFilePath}`);
							}

							// 打开新文件或更新后的文件
							const document = await vscode.workspace.openTextDocument(newFileUri);
							await vscode.window.showTextDocument(document);

					} catch (error: any) {
							vscode.window.showErrorMessage(`Failed to process file: ${error.message}`);
					}
			} else {
					vscode.window.showInformationMessage('No active editor found');
			}
	});

	context.subscriptions.push(disposable);
}

async function convertCodeUsingAPI(code: string): Promise<string> {
	// 模拟调用API进行代码转换
	// 实际情况下，你需要调用真实的API
	return code.split('').reverse().join(''); // 示例：简单反转代码字符串
}

// This method is called when your extension is deactivated
export function deactivate() {}
