"""
FastAPI REST API Server for Web Scraping
Provides endpoints to scrape various websites
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import logging
from dotenv import load_dotenv
import os

from scrapers import NuitDelInfoScraper

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Podium Web Scraper API",
    description="REST API for web scraping operations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Podium Web Scraper API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/teams-principal")
async def get_teams_principal():
    """
    Scrape teams participating in the principal challenge
    
    Returns a JSON with the list of teams: {"teams": ["team1", "team2", ...]}
    """
    try:
        logger.info("Fetching teams from Nuit de l'Info principal challenge")
        
        # URL of the challenge page
        url = "https://www.nuitdelinfo.com/inscription/defis/174"
        
        # Create scraper instance
        scraper = NuitDelInfoScraper()
        
        # Scrape teams
        result = scraper.scrape_teams(url)
        
        if "error" in result:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to scrape teams: {result.get('error')}"
            )
        
        logger.info(f"Successfully scraped {result.get('total', 0)} teams")
        
        # Return only the teams list as requested
        return {"teams": result.get("teams", [])}
        
    except Exception as e:
        logger.error(f"Error in /teams-principal endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/team/{team_id}")
async def get_team_details(team_id: str):
    """
    Scrape details of a specific team
    
    Returns team members and selected challenges:
    {
        "name": "Team Name",
        "members": ["member1", "member2", ...],
        "selectedchall": [
            {"id": "174", "name": "Défi de la nuit 2025"},
            ...
        ]
    }
    """
    try:
        logger.info(f"Fetching team details for team ID: {team_id}")
        
        # Create scraper instance
        scraper = NuitDelInfoScraper()
        
        # Scrape team details
        result = scraper.scrape_team_details(team_id)
        
        if "error" in result:
            raise HTTPException(
                status_code=404,
                detail=f"Team not found or failed to scrape: {result.get('error')}"
            )
        
        logger.info(f"Successfully scraped team {team_id}: {len(result.get('members', []))} members, {len(result.get('selectedchall', []))} challenges")
        
        # Return team details
        return {
            "members": result.get("members", []),
            "selectedchall": result.get("selectedchall", []),
            "name": result.get("name", "")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in /team/{team_id} endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/challenges")
async def get_challenges():
    """
    Scrape all available challenges
    
    Returns a list of challenges with details:
    {
        "challenges": [
            {
                "id": "494",
                "name": "Chat'bruti",
                "category": "Chatbot",
                "thumbnail": "https://...",
                "participants": 265
            },
            ...
        ]
    }
    """
    try:
        logger.info("Fetching all challenges from Nuit de l'Info")
        
        # Create scraper instance
        scraper = NuitDelInfoScraper()
        
        # Scrape challenges
        result = scraper.scrape_challenges()
        
        if "error" in result:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to scrape challenges: {result.get('error')}"
            )
        
        logger.info(f"Successfully scraped {result.get('total', 0)} challenges")
        
        # Return challenges list
        return {"challenges": result.get("challenges", [])}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in /challenges endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/challenge/{challenge_id}")
async def get_challenge_details(challenge_id: str):
    """
    Scrape details of a specific challenge
    
    Returns challenge details including name, organizer, theme, prize, description, and participating teams
    """
    try:
        logger.info(f"Fetching challenge details for challenge ID: {challenge_id}")
        
        # Create scraper instance
        scraper = NuitDelInfoScraper()
        
        # Scrape challenge details
        result = scraper.scrape_challenge_details(challenge_id)
        
        if "error" in result:
            raise HTTPException(
                status_code=404,
                detail=f"Challenge not found or failed to scrape: {result.get('error')}"
            )
        
        logger.info(f"Successfully scraped challenge {challenge_id}")
        
        # Return challenge details
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in /challenge/{challenge_id} endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )