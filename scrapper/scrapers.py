"""
Custom scrapers for specific websites
Extend the WebScraper class for site-specific scraping logic
"""

from scraper_base import WebScraper
from typing import Dict, List


class ExampleScraper(WebScraper):
    """Example custom scraper - adapt this for your specific needs"""
    
    def scrape(self, url: str) -> Dict:
        """
        Custom scraping logic for a specific website
        """
        html = self.fetch_page(url)
        if not html:
            return {"error": "Failed to fetch page", "url": url}
        
        soup = self.parse_html(html)
        
        # Add your custom scraping logic here
        # Example: Extract specific elements
        data = {
            "url": url,
            "title": None,
            "items": [],
            "status": "success"
        }
        
        # Example: Get page title
        title = soup.find('h1')
        if title:
            data['title'] = title.text.strip()
        
        # Example: Get list items
        items = soup.find_all('li', class_='item')
        data['items'] = [item.text.strip() for item in items]
        
        return data


class NuitDelInfoScraper(WebScraper):
    """Scraper for Nuit de l'Info challenge pages"""
    
    def scrape_teams(self, url: str) -> Dict:
        """
        Scrape teams participating in a challenge
        Returns: {"teams": [{"id": "1", "name": "team1"}, ...]}
        """
        html = self.fetch_page(url)
        if not html:
            return {"error": "Failed to fetch page", "url": url}
        
        soup = self.parse_html(html)
        
        # Find the panel-info div containing the teams
        panel = soup.find('div', class_='panel-info')
        if not panel:
            return {"error": "Panel not found", "teams": []}
        
        # Find the list-group div within the panel
        list_group = panel.find('div', class_='list-group')
        if not list_group:
            return {"error": "List group not found", "teams": []}
        
        # Extract all team names and IDs from list-group-item links
        team_links = list_group.find_all('a', class_='list-group-item')
        teams = []
        for link in team_links:
            team_name = link.text.strip()
            team_url = link.get('href', '')
            # Extract ID from URL (e.g., /inscription/equipes/1 -> 1)
            team_id = team_url.split('/')[-1] if team_url else None
            
            teams.append({
                "id": team_id,
                "name": team_name
            })
        
        return {
            "teams": teams,
            "total": len(teams),
            "status": "success"
        }
    
    def scrape_team_details(self, team_id: str) -> Dict:
        """
        Scrape details of a specific team
        Returns: {"members": ["member1", ...], "selectedchall": [{"id": "123", "name": "Challenge name"}, ...]}
        """
        url = f"https://www.nuitdelinfo.com/inscription/equipes/{team_id}"
        html = self.fetch_page(url)
        
        if not html:
            return {"error": "Failed to fetch page", "team_id": team_id}
        
        soup = self.parse_html(html)
        
        # Find the main panel
        panel = soup.find('div', class_='panel panel-info')
        if not panel:
            return {"error": "Panel not found", "team_id": team_id}
        
        # Extract team name
        name = None
        panel_heading = panel.find('div', class_='panel-heading')
        if panel_heading:
            h1_tag = panel_heading.find('h1')
            if h1_tag:
                name = h1_tag.text.strip()
        
        # Extract members from the list-group
        members = []
        panel_body = panel.find('div', class_='panel-body')
        if panel_body:
            # Find the ul list-group containing members (not inside a div with class list-group)
            member_list = panel_body.find('ul', class_='list-group')
            if member_list:
                member_items = member_list.find_all('li', class_='list-group-item')
                members = [item.text.strip() for item in member_items]
        
        # Extract challenges
        selected_challenges = []
        if panel_body:
            # Find the div with class list-group containing challenges
            challenge_div = panel_body.find('div', class_='list-group')
            if challenge_div:
                challenge_links = challenge_div.find_all('a', class_='list-group-item')
                for link in challenge_links:
                    challenge_name = link.text.strip()
                    challenge_url = link.get('href', '')
                    # Extract ID from URL (e.g., /inscription/defis/174 -> 174)
                    challenge_id = challenge_url.split('/')[-1] if challenge_url else None
                    
                    selected_challenges.append({
                        "id": challenge_id,
                        "name": challenge_name
                    })
        
        return {
            "name": name,
            "members": members,
            "selectedchall": selected_challenges,
            "status": "success"
        }
    
    def scrape_challenges(self) -> Dict:
        """
        Scrape all available challenges
        Returns: {"challenges": [{"id": "123", "name": "...", "category": "...", "thumbnail": "...", "participants": 123}, ...]}
        """
        url = "https://www.nuitdelinfo.com/inscription/defis/liste"
        html = self.fetch_page(url)
        
        if not html:
            return {"error": "Failed to fetch page"}
        
        soup = self.parse_html(html)
        
        # Find the defiList div
        defi_list = soup.find('div', class_='defiList')
        if not defi_list:
            return {"error": "Challenge list not found", "challenges": []}
        
        # Find all individual challenge divs
        defi_items = defi_list.find_all('div', class_='defi')
        
        challenges = []
        for defi in defi_items:
            challenge = {}
            
            # Extract title and category
            title_div = defi.find('div', class_='title')
            if title_div:
                link = title_div.find('a')
                if link:
                    challenge['name'] = link.text.strip()
                    # Extract ID from href
                    href = link.get('href', '')
                    challenge['id'] = href.split('/')[-1] if href else None
                
                # Category is the text after the link
                category_text = title_div.get_text(strip=True)
                # Remove the challenge name to get category
                if link:
                    category_text = category_text.replace(link.text.strip(), '').strip()
                challenge['category'] = category_text if category_text else None
            
            # Extract thumbnail
            thumbnail_div = defi.find('div', class_='thumbnail')
            if thumbnail_div:
                img = thumbnail_div.find('img')
                if img:
                    challenge['thumbnail'] = img.get('src', None)
            
            # Extract participants count
            participants_div = defi.find('div', class_='participants')
            if participants_div:
                count_div = participants_div.find('div', class_='count')
                if count_div:
                    try:
                        challenge['participants'] = int(count_div.text.strip())
                    except ValueError:
                        challenge['participants'] = 0
            
            challenges.append(challenge)
        
        return {
            "challenges": challenges,
            "total": len(challenges),
            "status": "success"
        }
    
    def scrape_challenge_details(self, challenge_id: str) -> Dict:
        """
        Scrape details of a specific challenge
        Returns: {"name": "...", "organizer": "...", "theme": "...", "prize": "...", "description": "...", "teams": [...]}
        """
        url = f"https://www.nuitdelinfo.com/inscription/defis/{challenge_id}"
        html = self.fetch_page(url)
        
        if not html:
            return {"error": "Failed to fetch page", "challenge_id": challenge_id}
        
        soup = self.parse_html(html)
        
        # Find all panel-info divs
        panels = soup.find_all('div', class_='panel-info')
        
        challenge_data = {
            "name": None,
            "organizer": None,
            "theme": None,
            "prize": None,
            "description": None,
            "expectedElements": None,
            "submissionMode": None,
            "teams": []
        }
        
        # First panel usually contains the logo/organizer
        if len(panels) > 0:
            first_panel = panels[0]
            img = first_panel.find('img')
            if img:
                challenge_data['logo'] = img.get('src', None)
        
        # Second panel contains organizer name
        if len(panels) > 1:
            organizer_panel = panels[1]
            h1 = organizer_panel.find('h1')
            if h1:
                organizer_span = h1.find('span')
                if organizer_span:
                    challenge_data['organizer'] = organizer_span.text.strip()
        
        # Third panel contains the main challenge details
        if len(panels) > 2:
            details_panel = panels[2]
            
            # Extract challenge name
            h2 = details_panel.find('h2')
            if h2:
                name_text = h2.text.strip()
                # Remove "Le défi: " prefix if present
                if name_text.startswith("Le défi:"):
                    name_text = name_text.replace("Le défi:", "").strip()
                challenge_data['name'] = name_text
            
            # Extract theme
            theme_alert = details_panel.find('div', class_='alert-info')
            if theme_alert:
                theme_h4 = theme_alert.find_all('h4')
                if len(theme_h4) > 1:
                    challenge_data['theme'] = theme_h4[1].text.strip()
            
            # Extract prize
            prize_alert = details_panel.find('div', class_='alert-warning')
            if prize_alert:
                prize_h4 = prize_alert.find_all('h4')
                if len(prize_h4) > 1:
                    # Get the HTML content and clean it
                    prize_content = prize_h4[1]
                    challenge_data['prize'] = prize_content.get_text(strip=True)
            
            # Extract description (first paragraph)
            paragraphs = details_panel.find_all('p')
            if paragraphs:
                challenge_data['description'] = paragraphs[0].get_text(strip=True)
            
            # Extract expected elements
            expected_h2 = details_panel.find('h2', string=lambda text: text and 'Elements attendus' in text)
            if expected_h2:
                # Find the next ul after this h2
                next_ul = expected_h2.find_next('ul')
                if next_ul:
                    elements = [li.get_text(strip=True) for li in next_ul.find_all('li')]
                    challenge_data['expectedElements'] = elements
            
            # Extract submission mode
            submission_h2 = details_panel.find('h2', string=lambda text: text and 'Mode de restitution' in text)
            if submission_h2:
                next_p = submission_h2.find_next('p')
                if next_p:
                    challenge_data['submissionMode'] = next_p.get_text(strip=True)
        
        # Fourth panel contains teams
        if len(panels) > 3:
            teams_panel = panels[3]
            list_group = teams_panel.find('div', class_='list-group')
            if list_group:
                team_links = list_group.find_all('a', class_='list-group-item')
                for link in team_links:
                    team_name = link.text.strip()
                    team_url = link.get('href', '')
                    team_id = team_url.split('/')[-1] if team_url else None
                    
                    challenge_data['teams'].append({
                        "id": team_id,
                        "name": team_name
                    })
        
        return {
            **challenge_data,
            "status": "success"
        }
    
    def scrape(self, url: str) -> Dict:
        """Default scrape method calls scrape_teams"""
        return self.scrape_teams(url)