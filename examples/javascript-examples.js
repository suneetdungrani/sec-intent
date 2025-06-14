/**
 * Security Intent Co-Pilot Examples
 * Author: Suneet Dungrani
 */

// Example 1: Correct implementation
// SECURITY INTENT: This function must only be callable by users with an 'ADMIN' role
function deleteUser(userId, currentUser) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required');
    }
    
    // Delete user logic here
    console.log(`User ${userId} deleted by admin ${currentUser.id}`);
}

// Example 2: Violation - Missing role check
// SECURITY INTENT: This function must only be callable by users with an 'ADMIN' role
function deleteAllUsers(currentUser) {
    // VIOLATION: No role check!
    console.log('Deleting all users...');
}

// Example 3: XSS Prevention
// SECURITY INTENT: This function must sanitize all input strings to prevent XSS
function displayUserComment(comment) {
    // VIOLATION: Direct HTML insertion without sanitization
    document.getElementById('comments').innerHTML = comment;
}

// Example 4: Correct XSS Prevention
// SECURITY INTENT: This function must sanitize all input strings to prevent XSS
function displayUserCommentSafe(comment) {
    const sanitized = comment
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    
    document.getElementById('comments').textContent = sanitized;
}

// Example 5: SQL Injection Prevention
// SECURITY INTENT: This function must prevent SQL injection by using parameterized queries
function getUserById(userId, db) {
    // VIOLATION: String concatenation in SQL query
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return db.query(query);
}

// Example 6: Correct SQL Injection Prevention
// SECURITY INTENT: This function must prevent SQL injection by using parameterized queries
function getUserByIdSafe(userId, db) {
    const query = 'SELECT * FROM users WHERE id = ?';
    return db.query(query, [userId]);
}

// Example 7: Authentication Check
// SECURITY INTENT: This function must verify user authentication before accessing sensitive data
function getSensitiveData(userId) {
    // VIOLATION: No authentication check
    return fetchDataFromDatabase(userId);
}

// Example 8: Correct Authentication
// SECURITY INTENT: This function must verify user authentication before accessing sensitive data
function getSensitiveDataSafe(userId, authToken) {
    if (!authToken || !verifyAuthToken(authToken)) {
        throw new Error('Authentication required');
    }
    
    return fetchDataFromDatabase(userId);
}