import pytest
from server import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_report(client):
    response = client.get("/report/51101")
    assert response.status_code == 200
    assert response.is_json

def test_power(client):
    response = client.get("/power/51101")
    assert response.status_code == 200
    assert response.is_json

def test_forecast(client):
    response = client.get("/forecast/51101")
    assert response.status_code == 200
    assert response.is_json

def test_marine_forecast(client):
    response = client.get("/marine-forecast")
    assert response.status_code == 200
    assert response.is_json

def test_tide(client):
    response = client.get("/tide/51201/2025-06-01/2025-06-05/HST")
    assert response.status_code == 200
    assert response.is_json

def test_histogram(client):
    response = client.get("/histogram")
    assert response.status_code == 200
    assert response.is_json

def test_wave_model(client):
    response = client.get("/wave-model/51201/animation")
    assert response.status_code == 200
    # could be image or JSON depending on endpoint
