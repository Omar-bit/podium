"""
Web Scraper Base Classes
This module contains the base scraper classes and utilities
"""

import os
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from typing import Dict, List, Optional
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class WebScraper:
    """Base web scraper class"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': os.getenv('USER_AGENT', 'Mozilla/5.0')
        })
        self.timeout = int(os.getenv('REQUEST_TIMEOUT', 10))
        self.max_retries = int(os.getenv('MAX_RETRIES', 3))
    
    def fetch_page(self, url: str) -> Optional[str]:
        """Fetch HTML content from a URL"""
        for attempt in range(self.max_retries):
            try:
                logger.info(f"Fetching {url} (attempt {attempt + 1}/{self.max_retries})")
                response = self.session.get(url, timeout=self.timeout)
                response.raise_for_status()
                return response.text
            except requests.RequestException as e:
                logger.error(f"Error fetching {url}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    return None
    
    def parse_html(self, html: str) -> BeautifulSoup:
        """Parse HTML content"""
        return BeautifulSoup(html, 'lxml')
    
    def scrape(self, url: str) -> Dict:
        """
        Main scraping method - override this in child classes
        Returns scraped data as a dictionary
        """
        html = self.fetch_page(url)
        if not html:
            return {"error": "Failed to fetch page"}
        
        soup = self.parse_html(html)
        
        # Example: Extract title and meta description
        title = soup.find('title')
        description = soup.find('meta', attrs={'name': 'description'})
        
        return {
            "url": url,
            "title": title.text.strip() if title else None,
            "description": description.get('content') if description else None,
            "status": "success"
        }
