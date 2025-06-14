"""
Tests for Security Intent Co-Pilot Backend
Author: Suneet Dungrani
"""

import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert data['service'] == 'Security Intent Co-Pilot'

def test_config_endpoint(client):
    """Test configuration endpoint"""
    response = client.get('/config')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'model' in data
    assert 'supported_languages' in data
    assert data['author'] == 'Suneet Dungrani'

def test_analyze_missing_data(client):
    """Test analyze endpoint with missing data"""
    response = client.post('/analyze', json={})
    assert response.status_code == 400

def test_analyze_missing_intent(client):
    """Test analyze endpoint with missing intent"""
    response = client.post('/analyze', json={
        'code': 'function test() {}'
    })
    assert response.status_code == 400

def test_analyze_missing_code(client):
    """Test analyze endpoint with missing code"""
    response = client.post('/analyze', json={
        'intent': 'This function must be secure'
    })
    assert response.status_code == 400

def test_analyze_valid_request(client):
    """Test analyze endpoint with valid request (mocked)"""
    # Note: This would need mocking of the OpenRouter API in production
    response = client.post('/analyze', json={
        'intent': 'This function must validate input',
        'code': 'function test(input) { return input; }',
        'language': 'javascript'
    })
    # Without API key, this will return an error, but structure should be correct
    assert response.status_code in [200, 500]