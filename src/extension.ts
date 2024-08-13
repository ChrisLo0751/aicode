import * as vscode from 'vscode';
import * as path from 'path';
import { convertCodeUsingAPI } from './llm';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('code-generate.helloWorld', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const originalCode = document.getText();

			const loadingMessage = vscode.window.setStatusBarMessage('代码正在转换中，请耐心等待...');
		
			convertCodeUsingAPI(originalCode, async (message, status) => {
				// 获取当前文件的后缀
				const ext = path.extname(document.uri.fsPath);
				const newFilePath = document.uri.fsPath.replace(ext, `_converted${ext}`);
				const newFileUri = vscode.Uri.file(newFilePath);

				try {
					// 检查文件是否存在
					try {
						await vscode.workspace.fs.stat(newFileUri);
						// 文件存在，更新内容
						await vscode.workspace.fs.writeFile(newFileUri, Buffer.from(message, 'utf8'));
						vscode.window.showInformationMessage(`Updated existing file: ${newFilePath}`);
					} catch {
						// 文件不存在，创建新文件
						await vscode.workspace.fs.writeFile(newFileUri, Buffer.from(message, 'utf8'));
						vscode.window.showInformationMessage(`Created new file: ${newFilePath}`);
					}

					// 打开新文件或更新后的文件
					const document = await vscode.workspace.openTextDocument(newFileUri);
					await vscode.window.showTextDocument(document);

				} catch (error: any) {
					vscode.window.showErrorMessage(`Failed to process file: ${error.message}`);
				}
				loadingMessage.dispose();
			});
		} else {
			vscode.window.showInformationMessage('No active editor found');
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
