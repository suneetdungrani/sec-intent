# Installation Guide

**Author: Suneet Dungrani**

## Prerequisites

- Docker and Docker Compose
- VS Code (version 1.74.0 or higher)
- OpenRouter API key (get one at https://openrouter.ai)
- Node.js 16+ (for local development)
- Python 3.11+ (for backend development)

## Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/suneetdungrani/sec-intent.git
cd sec-intent
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Edit `.env` and add your OpenRouter API key:
```
OPENROUTER_API_KEY=your_actual_api_key_here
```

4. Start the services with Docker:
```bash
docker-compose up --build
```

The backend will be available at `http://localhost:5000`

## VS Code Extension Installation

### Option 1: Install from VSIX (Recommended)

1. Build the extension:
```bash
cd vscode-extension
npm install
npm run compile
vsce package
```

2. In VS Code:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Install from VSIX"
   - Select the generated `.vsix` file

### Option 2: Development Mode

1. Open the `vscode-extension` folder in VS Code
2. Press `F5` to launch a new VS Code window with the extension loaded
3. The extension will be active in the new window

## Configuration

### VS Code Settings

Open VS Code settings and configure:

- `securityIntent.backendUrl`: Backend server URL (default: `http://localhost:5000`)
- `securityIntent.apiKey`: Your OpenRouter API key (optional if set in backend)
- `securityIntent.model`: LLM model to use (default: `anthropic/claude-3-sonnet`)
- `securityIntent.autoAnalyze`: Enable auto-analysis on save (default: `true`)

### Backend Configuration

The backend can be configured via environment variables:

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `LLM_MODEL`: The model to use (e.g., `anthropic/claude-3-sonnet`)
- `PORT`: Server port (default: 5000)
- `DEBUG`: Enable debug mode (default: False)

## Testing the Installation

1. Open any JavaScript, TypeScript, Python, Java, or C# file
2. Add a security intent comment:
```javascript
// SECURITY INTENT: This function must validate all inputs
function processData(userInput) {
    // Your code here
}
```
3. Save the file or run "Analyze Security Intent" command
4. Check for security analysis results

## Troubleshooting

### Backend Connection Issues
- Ensure Docker containers are running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify the backend URL in VS Code settings

### Extension Not Working
- Check VS Code Output panel for "Security Intent Co-Pilot" logs
- Ensure the file type is supported
- Verify the backend is accessible

### API Key Issues
- Ensure your OpenRouter API key is valid
- Check that the key is properly set in `.env` file
- Verify you have credits in your OpenRouter account