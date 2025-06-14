"""
Security Intent Co-Pilot Python Examples
Author: Suneet Dungrani
"""

import hashlib
import re
from typing import Optional, Dict, Any

# Example 1: Password Hashing
# SECURITY INTENT: This function must use a secure hashing algorithm with salt for password storage
def store_password_insecure(password: str) -> str:
    # VIOLATION: Using MD5 which is cryptographically broken
    return hashlib.md5(password.encode()).hexdigest()

# Example 2: Correct Password Hashing
# SECURITY INTENT: This function must use a secure hashing algorithm with salt for password storage
def store_password_secure(password: str, salt: bytes) -> str:
    # Using SHA-256 with salt (though bcrypt or scrypt would be better)
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000).hex()

# Example 3: Input Validation
# SECURITY INTENT: This function must validate email format and prevent email header injection
def send_email_unsafe(to_email: str, subject: str, body: str):
    # VIOLATION: No validation of email format or header injection prevention
    send_mail(to_email, subject, body)

# Example 4: Correct Input Validation
# SECURITY INTENT: This function must validate email format and prevent email header injection
def send_email_safe(to_email: str, subject: str, body: str):
    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, to_email):
        raise ValueError("Invalid email format")
    
    # Check for header injection attempts
    if '\\n' in to_email or '\\r' in to_email or '\\n' in subject or '\\r' in subject:
        raise ValueError("Potential header injection detected")
    
    send_mail(to_email, subject, body)

# Example 5: File Access Control
# SECURITY INTENT: This function must restrict file access to the user's own directory only
def read_file_unsafe(user_id: str, filename: str) -> str:
    # VIOLATION: No path traversal protection
    with open(f"/data/users/{user_id}/{filename}", 'r') as f:
        return f.read()

# Example 6: Correct File Access Control
# SECURITY INTENT: This function must restrict file access to the user's own directory only
def read_file_safe(user_id: str, filename: str) -> str:
    # Prevent path traversal
    if '..' in filename or filename.startswith('/'):
        raise ValueError("Invalid filename")
    
    # Sanitize filename
    safe_filename = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
    
    with open(f"/data/users/{user_id}/{safe_filename}", 'r') as f:
        return f.read()

# Example 7: API Rate Limiting
# SECURITY INTENT: This function must implement rate limiting to prevent abuse
def api_endpoint_unsafe(user_id: str, request_data: Dict[str, Any]):
    # VIOLATION: No rate limiting
    return process_request(request_data)

# Example 8: Session Management
# SECURITY INTENT: This function must validate session tokens and check for expiration
def get_user_data_unsafe(session_token: str) -> Optional[Dict[str, Any]]:
    # VIOLATION: No token validation or expiration check
    user_id = decode_token(session_token)
    return fetch_user_data(user_id)