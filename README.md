"# Podium

A web scraping project with a REST API built in Python. This project provides a modular scraping framework with a FastAPI server to trigger and manage scraping jobs.

## Project Structure

```
podium/
├── scrapper/          # Web scraping module
│   ├── main.py        # Main scraper logic
│   ├── scrapers.py    # Custom scrapers for specific sites
│   └── requirements.txt
├── server/            # REST API server
│   ├── main.py        # FastAPI server
│   └── requirements.txt
├── client/            # Client implementation (future)
├── .env.example       # Example environment configuration
└── .gitignore
```

## Features

- **Modular Scraper**: Base `WebScraper` class with extensible architecture
- **REST API**: FastAPI server with async job processing
- **Background Jobs**: Asynchronous scraping with job tracking
- **Rate Limiting**: Configurable request rates
- **Error Handling**: Retry logic with exponential backoff
- **Logging**: Comprehensive logging for debugging

## Setup

### 1. Clone and Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

### 2. Install Scraper Dependencies

```bash
cd scrapper
pip install -r requirements.txt
```

### 3. Install Server Dependencies

```bash
cd ../server
pip install -r requirements.txt
```

## Usage

### Running the Scraper Standalone

```bash
cd scrapper
python main.py
```

### Running the API Server

```bash
cd server
python main.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, visit:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### API Endpoints

#### Start a Scraping Job

```bash
POST /scrape
{
  "url": "https://example.com",
  "scraper_type": "basic"
}
```

#### Get Job Result

```bash
GET /scrape/{job_id}
```

#### List All Jobs

```bash
GET /jobs
```

#### Delete a Job

```bash
DELETE /jobs/{job_id}
```

## Environment Variables

| Variable              | Description               | Default        |
| --------------------- | ------------------------- | -------------- |
| `API_HOST`            | API server host           | 0.0.0.0        |
| `API_PORT`            | API server port           | 8000           |
| `DEBUG`               | Debug mode                | True           |
| `USER_AGENT`          | HTTP User-Agent header    | Mozilla/5.0... |
| `REQUEST_TIMEOUT`     | Request timeout (seconds) | 30             |
| `MAX_RETRIES`         | Max retry attempts        | 3              |
| `TARGET_URLS`         | Comma-separated URLs      | -              |
| `REQUESTS_PER_SECOND` | Rate limit                | 1              |

## Development

### Creating Custom Scrapers

Extend the `WebScraper` class in `scrapper/scrapers.py`:

```python
from main import WebScraper

class CustomScraper(WebScraper):
    def scrape(self, url: str) -> Dict:
        html = self.fetch_page(url)
        soup = self.parse_html(html)
        # Your custom logic here
        return {"data": "scraped_data"}
```

### Adding New API Endpoints

Add endpoints in `server/main.py`:

```python
@app.get("/custom-endpoint")
async def custom_endpoint():
    return {"message": "Custom response"}
```

## Technologies

- **Scraping**: BeautifulSoup4, Requests, lxml, Selenium
- **API**: FastAPI, Uvicorn, Pydantic
- **Configuration**: python-dotenv

## License

MIT"
