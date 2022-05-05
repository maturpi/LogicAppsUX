import { promises as fs } from 'fs';
import { join } from 'path';
import type { ExtensionContext } from 'vscode';
import { commands, window, ViewColumn, Uri } from 'vscode';

export function activate(context: ExtensionContext) {
  // Register command "start"
  commands.registerCommand('dataMapperExtension.start', async () => {
    const panel = window.createWebviewPanel(
      'webview', // Key used to reference the panel
      'webview', // Title display in the tab
      ViewColumn.Active, // Editor column to show the new webview panel in.
      { enableScripts: true }
    );

    const indexPath = join(context.extensionPath, 'webview/index.html');
    const html = await fs.readFile(indexPath, 'utf-8');
    // 1. Get all link prefixed by href or src
    const matchLinks = /(href|src)="([^"]*)"/g;
    // 2. Transform the result of the regex into a vscode's URI format
    const toUri = (_, prefix: 'href' | 'src', link: string) => {
      // For
      if (link === '#') {
        return `${prefix}="${link}"`;
      }
      // For scripts & links
      const path = join(context.extensionPath, 'webview', link);
      const uri = Uri.file(path);
      return `${prefix}="${panel.webview.asWebviewUri(uri)}"`;
    };
    panel.webview.html = html.replace(matchLinks, toUri);

    context.subscriptions.push(panel);
  });
}