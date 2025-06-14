# Architecture Overview

**Author: Suneet Dungrani**

## System Architecture

Security Intent Co-Pilot consists of three main components:

### 1. VS Code Extension (Frontend)
- **Language**: TypeScript
- **Framework**: VS Code Extension API
- **Responsibilities**:
  - Detect security intent comments in code
  - Extract relevant code blocks
  - Communicate with backend API
  - Display analysis results in the editor

### 2. Backend API Server
- **Language**: Python
- **Framework**: Flask
- **Responsibilities**:
  - Receive code and intent from extension
  - Format prompts for LLM
  - Query OpenRouter API
  - Parse and return analysis results

### 3. LLM Integration
- **Service**: OpenRouter
- **Models**: Claude, GPT-4, etc.
- **Responsibilities**:
  - Analyze code against security intents
  - Identify security violations
  - Provide actionable suggestions

## Data Flow

```
1. Developer writes code with security intent comment
   ↓
2. VS Code extension detects intent and extracts code
   ↓
3. Extension sends {intent, code, language} to backend
   ↓
4. Backend creates security-focused prompt
   ↓
5. Backend queries LLM via OpenRouter
   ↓
6. LLM analyzes code and returns findings
   ↓
7. Backend parses response and sends to extension
   ↓
8. Extension displays results in editor
```

## Key Design Decisions

### 1. Separation of Concerns
- Extension handles UI/UX only
- Backend manages LLM communication
- Clear API boundaries

### 2. Security First
- API keys stored securely
- No sensitive data logged
- Secure communication protocols

### 3. Extensibility
- Support for multiple languages
- Pluggable LLM providers
- Configurable analysis rules

### 4. Performance
- Asynchronous analysis
- Caching of results
- Efficient code extraction

## API Specification

### POST /analyze
Analyzes code against security intent.

**Request**:
```json
{
  "intent": "string - the security requirement",
  "code": "string - the code to analyze",
  "language": "string - programming language"
}
```

**Response**:
```json
{
  "isSecure": "boolean",
  "issues": ["array of security violations"],
  "suggestions": ["array of fixes"],
  "severity": "error|warning|info"
}
```

### GET /health
Health check endpoint.

### GET /config
Returns configuration information.

## Extension Architecture

### Core Modules

1. **extension.ts**: Entry point and command registration
2. **analyzer.ts**: Core analysis logic
3. **provider.ts**: Code action provider for quick fixes

### Key Features

- **Intent Detection**: Regex-based pattern matching
- **Code Extraction**: Smart function boundary detection
- **Diagnostic Integration**: Native VS Code diagnostics
- **Auto-analysis**: On-save trigger option

## Backend Architecture

### Core Components

1. **app.py**: Flask application and routes
2. **SecurityAnalyzer**: LLM integration class
3. **Prompt Engineering**: Security-focused prompts

### Security Measures

- Input validation
- Error handling
- Rate limiting ready
- Secure configuration

## Docker Architecture

### Container Strategy

1. **Backend Container**:
   - Python environment
   - Gunicorn WSGI server
   - Health checks

2. **Test Container**:
   - Development environment
   - Testing tools
   - Example validation

### Networking

- Bridge network for container communication
- Port mapping for external access
- Service discovery via container names

## Future Enhancements

1. **Caching Layer**: Redis for result caching
2. **Webhook Support**: GitHub/GitLab integration
3. **Team Features**: Shared security policies
4. **Metrics**: Security trend analysis
5. **CI/CD Integration**: Pre-commit hooks