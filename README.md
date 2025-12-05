#El_Foundou_Squad_ISITCom
# Podium

A web scraping project with a modern React frontend and Python/FastAPI backend. This project provides a modular scraping framework with a REST API to trigger and manage scraping jobs, paired with an interactive web interface.

## Project Structure

```
podium/
├── scrapper/          # Web scraping backend (Python/FastAPI)
│   ├── main.py        # Main scraper logic
│   ├── scrapers.py    # Custom scrapers for specific sites
│   └── requirements.txt
├── client/            # React frontend (Vite + TypeScript)
│   ├── src/           # React components and app logic
│   ├── public/        # Static assets
│   └── package.json
├── .env.example       # Example environment configuration
└── .gitignore
```

## Features

- **Modular Scraper**: Base `WebScraper` class with extensible architecture
- **REST API**: FastAPI server with async job processing
- **React Frontend**: Modern UI built with React, TypeScript, and Vite
- **Background Jobs**: Asynchronous scraping with job tracking
- **Rate Limiting**: Configurable request rates
- **Error Handling**: Retry logic with exponential backoff
- **Logging**: Comprehensive logging for debugging

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** and **npm** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

---

## Backend Setup (Scraper)
#### Make sure you have python installed and its version == 3.10.10
### 1. Navigate to the Scraper Directory

```bash
cd scrapper
```

### 2. Create a Virtual Environment (Recommended)

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration (optional)
# The default values work out of the box
```

### 5. Launch the Backend Server

```bash
python main.py
```

The API will be available at **`http://localhost:8000`**

#### API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## Frontend Setup (React Client)

### 1. Navigate to the Client Directory

```bash
# From the project root directory
cd client
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (if needed)

Create a `.env` file in the `client/` directory if you need to configure the API endpoint:

```bash
# client/.env
VITE_API_URL=http://localhost:8000
```

### 4. Launch the React Development Server

```bash
npm run dev
```

The frontend will be available at **`http://localhost:5173`** (default Vite port)

### 5. Alternative: Start Command

You can also use:

```bash
npm start
```

---

## Running Both Backend and Frontend

To run the complete application:

### Terminal 1 - Backend (Scraper)

```bash
cd scrapper
# Activate virtual environment if needed
python main.py
```

### Terminal 2 - Frontend (Client)

```bash
cd client
npm run dev
```

Now you can:
- Access the **frontend** at `http://localhost:5173`
- Access the **API** at `http://localhost:8000`
- View **API docs** at `http://localhost:8000/docs`

---

## API Endpoints

### Start a Scraping Job

```bash
POST /scrape
{
  "url": "https://example.com",
  "scraper_type": "basic"
}
```

### Get Job Result

```bash
GET /scrape/{job_id}
```

### List All Jobs

```bash
GET /jobs
```

### Delete a Job

```bash
DELETE /jobs/{job_id}
```

---

## Environment Variables

### Backend (Scraper)

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

### Frontend (Client)

| Variable              | Description               | Default               |
| --------------------- | ------------------------- | --------------------- |
| `VITE_API_URL`        | Backend API URL           | http://localhost:8000 |

---

## Building for Production

### Backend

The backend runs with Uvicorn in production mode. Configure your production environment and use:

```bash
cd scrapper
pip install -r requirements.txt
python main.py
```

### Frontend

Build the optimized production bundle:

```bash
cd client
npm run build
```

The production files will be in `client/dist/`. Preview the build:

```bash
npm run preview
```

---

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

Add endpoints in `scrapper/main.py`:

```python
@app.get("/custom-endpoint")
async def custom_endpoint():
    return {"message": "Custom response"}
```

---

## Technologies

### Backend
- **Scraping**: BeautifulSoup4, Requests, lxml, Selenium
- **API**: FastAPI, Uvicorn, Pydantic
- **Configuration**: python-dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router

---

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change the port in .env
API_PORT=8001
```

**Module not found:**
```bash
# Ensure virtual environment is activated and dependencies are installed
pip install -r requirements.txt
```

### Frontend Issues

**Port already in use:**
The Vite dev server will automatically try the next available port.

**Dependencies not installed:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
Check that the backend is running on `http://localhost:8000` and update `VITE_API_URL` if needed.

---

## License

MIT
