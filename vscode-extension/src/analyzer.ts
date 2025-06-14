/**
 * Security Intent Analyzer
 * Author: Suneet Dungrani
 */

import * as vscode from 'vscode';
import axios from 'axios';

interface SecurityIntent {
    lineNumber: number;
    intent: string;
    functionCode: string;
    startLine: number;
    endLine: number;
}

interface AnalysisResult {
    isSecure: boolean;
    issues: string[];
    suggestions: string[];
    severity: 'error' | 'warning' | 'info';
}

export class SecurityIntentAnalyzer {
    private diagnosticCollection: vscode.DiagnosticCollection | undefined;
    private readonly INTENT_PATTERN = /\/\/\s*SECURITY\s*INTENT\s*:\s*(.+)/i;

    setDiagnosticCollection(collection: vscode.DiagnosticCollection) {
        this.diagnosticCollection = collection;
    }

    async analyzeDocument(document: vscode.TextDocument): Promise<void> {
        const intents = this.findSecurityIntents(document);
        const diagnostics: vscode.Diagnostic[] = [];

        for (const intent of intents) {
            try {
                const result = await this.analyzeIntent(intent);
                const diagnostic = this.createDiagnostic(intent, result, document);
                if (diagnostic) {
                    diagnostics.push(diagnostic);
                }
            } catch (error) {
                console.error('Analysis error:', error);
            }
        }

        this.diagnosticCollection?.set(document.uri, diagnostics);
    }

    async analyzeAtPosition(document: vscode.TextDocument, position: vscode.Position): Promise<void> {
        const intents = this.findSecurityIntents(document);
        const relevantIntent = intents.find(intent => 
            position.line >= intent.startLine && position.line <= intent.endLine
        );

        if (!relevantIntent) {
            vscode.window.showInformationMessage('No security intent found at cursor position');
            return;
        }

        try {
            const result = await this.analyzeIntent(relevantIntent);
            this.showAnalysisResult(relevantIntent, result);
        } catch (error) {
            vscode.window.showErrorMessage(`Analysis failed: ${error}`);
        }
    }

    private findSecurityIntents(document: vscode.TextDocument): SecurityIntent[] {
        const intents: SecurityIntent[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(this.INTENT_PATTERN);
            if (match) {
                const intent = match[1].trim();
                const functionInfo = this.extractFunctionAfterIntent(lines, i);
                
                if (functionInfo) {
                    intents.push({
                        lineNumber: i,
                        intent: intent,
                        functionCode: functionInfo.code,
                        startLine: functionInfo.startLine,
                        endLine: functionInfo.endLine
                    });
                }
            }
        }

        return intents;
    }

    private extractFunctionAfterIntent(lines: string[], intentLine: number): { code: string; startLine: number; endLine: number } | null {
        let startLine = intentLine + 1;
        
        while (startLine < lines.length && lines[startLine].trim() === '') {
            startLine++;
        }

        if (startLine >= lines.length) {
            return null;
        }

        let braceCount = 0;
        let endLine = startLine;
        let foundFunction = false;
        let code = '';

        for (let i = startLine; i < lines.length; i++) {
            const line = lines[i];
            code += line + '\n';

            if (line.includes('{')) {
                foundFunction = true;
                braceCount += (line.match(/\{/g) || []).length;
            }
            
            if (line.includes('}')) {
                braceCount -= (line.match(/\}/g) || []).length;
            }

            if (foundFunction && braceCount === 0) {
                endLine = i;
                break;
            }

            if (i - startLine > 100) {
                endLine = i;
                break;
            }
        }

        return {
            code: code.trim(),
            startLine: startLine,
            endLine: endLine
        };
    }

    private async analyzeIntent(intent: SecurityIntent): Promise<AnalysisResult> {
        const config = vscode.workspace.getConfiguration('securityIntent');
        const backendUrl = config.get<string>('backendUrl', 'http://localhost:5000');

        try {
            const response = await axios.post(`${backendUrl}/analyze`, {
                intent: intent.intent,
                code: intent.functionCode,
                language: vscode.window.activeTextEditor?.document.languageId || 'unknown'
            }, {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Backend analysis error:', error);
            throw new Error('Failed to analyze security intent');
        }
    }

    private createDiagnostic(intent: SecurityIntent, result: AnalysisResult, document: vscode.TextDocument): vscode.Diagnostic | null {
        if (result.isSecure && result.issues.length === 0) {
            return null;
        }

        const range = new vscode.Range(
            new vscode.Position(intent.startLine, 0),
            new vscode.Position(intent.endLine, document.lineAt(intent.endLine).text.length)
        );

        const severity = result.severity === 'error' ? vscode.DiagnosticSeverity.Error :
                        result.severity === 'warning' ? vscode.DiagnosticSeverity.Warning :
                        vscode.DiagnosticSeverity.Information;

        const message = `Security Intent Violation:\\n${result.issues.join('\\n')}`;
        const diagnostic = new vscode.Diagnostic(range, message, severity);
        diagnostic.source = 'Security Intent Co-Pilot';
        diagnostic.code = 'SEC_INTENT';

        return diagnostic;
    }

    private showAnalysisResult(intent: SecurityIntent, result: AnalysisResult) {
        if (result.isSecure && result.issues.length === 0) {
            vscode.window.showInformationMessage('✅ Code matches security intent!');
            return;
        }

        const message = result.issues.join('\\n');
        const suggestions = result.suggestions.length > 0 ? 
            `\\n\\nSuggestions:\\n${result.suggestions.join('\\n')}` : '';

        if (result.severity === 'error') {
            vscode.window.showErrorMessage(`❌ Security violations found:\\n${message}${suggestions}`);
        } else {
            vscode.window.showWarningMessage(`⚠️ Security concerns:\\n${message}${suggestions}`);
        }
    }
}