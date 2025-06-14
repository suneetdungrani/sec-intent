/**
 * Code Action Provider for Security Intent
 * Author: Suneet Dungrani
 */

import * as vscode from 'vscode';
import { SecurityIntentAnalyzer } from './analyzer';

export class SecurityIntentProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    constructor(private analyzer: SecurityIntentAnalyzer) {}

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        const actions: vscode.CodeAction[] = [];

        for (const diagnostic of context.diagnostics) {
            if (diagnostic.source === 'Security Intent Co-Pilot') {
                const action = this.createAnalyzeAction(diagnostic, document);
                actions.push(action);
            }
        }

        const analyzeHereAction = new vscode.CodeAction(
            'Analyze Security Intent Here',
            vscode.CodeActionKind.Empty
        );
        analyzeHereAction.command = {
            command: 'securityIntent.analyze',
            title: 'Analyze Security Intent',
            tooltip: 'Analyze security intent at current position'
        };
        actions.push(analyzeHereAction);

        return actions;
    }

    private createAnalyzeAction(diagnostic: vscode.Diagnostic, document: vscode.TextDocument): vscode.CodeAction {
        const action = new vscode.CodeAction(
            'Re-analyze Security Intent',
            vscode.CodeActionKind.QuickFix
        );
        
        action.command = {
            command: 'securityIntent.analyze',
            title: 'Re-analyze',
            tooltip: 'Re-analyze this security intent'
        };

        action.diagnostics = [diagnostic];
        action.isPreferred = true;

        return action;
    }
}