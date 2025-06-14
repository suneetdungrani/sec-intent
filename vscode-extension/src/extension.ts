/**
 * Security Intent Co-Pilot VS Code Extension
 * Author: Suneet Dungrani
 */

import * as vscode from 'vscode';
import { SecurityIntentAnalyzer } from './analyzer';
import { SecurityIntentProvider } from './provider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Security Intent Co-Pilot is now active!');

    const analyzer = new SecurityIntentAnalyzer();
    const provider = new SecurityIntentProvider(analyzer);

    const analyzeCommand = vscode.commands.registerCommand('securityIntent.analyze', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const position = editor.selection.active;
        await analyzer.analyzeAtPosition(editor.document, position);
    });

    const analyzeFileCommand = vscode.commands.registerCommand('securityIntent.analyzeFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        await analyzer.analyzeDocument(editor.document);
    });

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('securityIntent');
    context.subscriptions.push(diagnosticCollection);
    analyzer.setDiagnosticCollection(diagnosticCollection);

    const config = vscode.workspace.getConfiguration('securityIntent');
    if (config.get('autoAnalyze')) {
        const onSaveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
            if (isSupported(document)) {
                await analyzer.analyzeDocument(document);
            }
        });
        context.subscriptions.push(onSaveListener);
    }

    const codeActionProvider = vscode.languages.registerCodeActionsProvider(
        { scheme: 'file', language: '*' },
        provider,
        {
            providedCodeActionKinds: SecurityIntentProvider.providedCodeActionKinds
        }
    );

    context.subscriptions.push(analyzeCommand, analyzeFileCommand, codeActionProvider);
}

function isSupported(document: vscode.TextDocument): boolean {
    const supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp'];
    return supportedLanguages.includes(document.languageId);
}

export function deactivate() {}