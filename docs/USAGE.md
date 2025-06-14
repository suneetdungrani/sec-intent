# Usage Guide

**Author: Suneet Dungrani**

## Writing Security Intents

Security intents are special comments that describe the security requirements for your code. They follow this format:

```
// SECURITY INTENT: <your security requirement here>
```

The comment must be placed directly above the function or code block you want to analyze.

## Examples

### JavaScript/TypeScript

```javascript
// SECURITY INTENT: This function must only be callable by authenticated users with admin role
function deleteUser(userId, currentUser) {
    // Your implementation
}

// SECURITY INTENT: This function must sanitize all HTML input to prevent XSS attacks
function renderUserContent(htmlContent) {
    // Your implementation
}
```

### Python

```python
# SECURITY INTENT: This function must use parameterized queries to prevent SQL injection
def get_user_by_email(email: str):
    # Your implementation
    pass

# SECURITY INTENT: This function must hash passwords using bcrypt with a minimum of 12 rounds
def store_password(password: str):
    # Your implementation
    pass
```

### Common Security Intents

1. **Authentication & Authorization**
   - "This function must only be callable by authenticated users"
   - "This function requires admin role"
   - "This function must verify user ownership of the resource"

2. **Input Validation**
   - "This function must validate all inputs against XSS"
   - "This function must sanitize SQL inputs"
   - "This function must validate email format"

3. **Data Protection**
   - "This function must encrypt sensitive data before storage"
   - "This function must not log sensitive information"
   - "This function must use secure random number generation"

4. **Access Control**
   - "This function must prevent path traversal attacks"
   - "This function must implement rate limiting"
   - "This function must check file permissions"

## Running Analysis

### Manual Analysis

1. **Analyze at cursor**: Place cursor in a function with security intent and run:
   - Command Palette: `Analyze Security Intent`
   - Right-click menu: "Analyze Security Intent Here"

2. **Analyze entire file**: 
   - Command Palette: `Analyze Security Intent for Entire File`

### Automatic Analysis

With `autoAnalyze` enabled (default), the extension automatically analyzes your code when you save a file.

## Understanding Results

The extension provides feedback through:

### Diagnostics Panel
- **Errors** (Red): Critical security violations
- **Warnings** (Yellow): Potential security issues
- **Info** (Blue): Security recommendations

### Inline Feedback
Security issues appear as underlined code with hover information.

### Example Analysis Result

Given this code:
```javascript
// SECURITY INTENT: This function must validate user role before deletion
function deleteRecord(recordId) {
    database.delete(recordId); // No role check!
}
```

The tool might report:
- **Issue**: "Function does not validate user role as specified in security intent"
- **Suggestion**: "Add user authentication and role validation before performing deletion"
- **Severity**: Error

## Best Practices

1. **Be Specific**: Write clear, specific security intents
   - Good: "This function must validate email format using RFC 5322 standard"
   - Bad: "This function should be secure"

2. **One Intent Per Function**: Focus on a single security concern per intent

3. **Use Standard Security Terms**: Reference known security concepts:
   - XSS, CSRF, SQL Injection
   - Authentication, Authorization
   - Encryption, Hashing
   - Rate limiting, Input validation

4. **Update Intents**: Keep security intents updated as code evolves

5. **Review All Findings**: Even "info" level findings can reveal important security improvements

## Advanced Features

### Custom Models

You can configure different LLM models in settings:
```json
"securityIntent.model": "openai/gpt-4"
```

### Batch Analysis

Analyze multiple files:
1. Select files in Explorer
2. Right-click → "Analyze Security Intents"

### Export Results

Results can be exported for security audits:
1. Command Palette: `Export Security Analysis`
2. Choose format (JSON, CSV, Markdown)