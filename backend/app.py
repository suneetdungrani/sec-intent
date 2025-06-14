"""
Security Intent Co-Pilot Backend Server
Author: Suneet Dungrani
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import logging
from typing import Dict, List, Any
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SecurityAnalyzer:
    """Analyzes code against security intents using LLM"""
    
    def __init__(self):
        self.api_key = os.getenv('OPENROUTER_API_KEY', '')
        self.base_url = 'https://openrouter.ai/api/v1'
        self.model = os.getenv('LLM_MODEL', 'anthropic/claude-3-sonnet')
    
    def analyze_security_intent(self, intent: str, code: str, language: str) -> Dict[str, Any]:
        """Analyze code against stated security intent"""
        
        prompt = self._build_security_prompt(intent, code, language)
        
        try:
            response = self._query_llm(prompt)
            return self._parse_llm_response(response)
        except Exception as e:
            logger.error(f"Analysis error: {str(e)}")
            return {
                "isSecure": False,
                "issues": [f"Analysis failed: {str(e)}"],
                "suggestions": [],
                "severity": "error"
            }
    
    def _build_security_prompt(self, intent: str, code: str, language: str) -> str:
        """Build the prompt for the LLM"""
        
        return f"""You are a world-class security expert. Analyze the following code against the stated security intent.

SECURITY INTENT: {intent}

CODE LANGUAGE: {language}

CODE:
```{language}
{code}
```

Please analyze whether the code correctly implements the stated security intent. Focus on:
1. Authentication and authorization requirements
2. Input validation and sanitization
3. Data protection and encryption
4. Access control
5. Security best practices for {language}

Respond with a JSON object containing:
- "isSecure": boolean indicating if the code meets the security intent
- "issues": array of specific security violations found
- "suggestions": array of actionable fixes for the issues
- "severity": "error", "warning", or "info" based on the severity

Be specific and actionable in your analysis."""

    def _query_llm(self, prompt: str) -> str:
        """Query the LLM via OpenRouter"""
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/suneetdungrani/sec-intent',
            'X-Title': 'Security Intent Co-Pilot'
        }
        
        data = {
            'model': self.model,
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are a security expert analyzing code for security vulnerabilities. Always respond with valid JSON.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.3,
            'max_tokens': 2000
        }
        
        response = requests.post(
            f'{self.base_url}/chat/completions',
            headers=headers,
            json=data,
            timeout=30
        )
        
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    
    def _parse_llm_response(self, response: str) -> Dict[str, Any]:
        """Parse the LLM response"""
        
        try:
            import json
            
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response[json_start:json_end]
                result = json.loads(json_str)
                
                return {
                    "isSecure": result.get("isSecure", False),
                    "issues": result.get("issues", []),
                    "suggestions": result.get("suggestions", []),
                    "severity": result.get("severity", "warning")
                }
        except Exception as e:
            logger.error(f"Failed to parse LLM response: {e}")
        
        return {
            "isSecure": False,
            "issues": ["Failed to parse security analysis"],
            "suggestions": [],
            "severity": "error"
        }

analyzer = SecurityAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Security Intent Co-Pilot"})

@app.route('/analyze', methods=['POST'])
def analyze():
    """Analyze code against security intent"""
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        intent = data.get('intent', '')
        code = data.get('code', '')
        language = data.get('language', 'unknown')
        
        if not intent or not code:
            return jsonify({"error": "Intent and code are required"}), 400
        
        result = analyzer.analyze_security_intent(intent, code, language)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Analysis endpoint error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/config', methods=['GET'])
def get_config():
    """Get configuration information"""
    return jsonify({
        "model": analyzer.model,
        "supported_languages": ["javascript", "typescript", "python", "java", "csharp"],
        "version": "1.0.0",
        "author": "Suneet Dungrani"
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('DEBUG', 'False').lower() == 'true')