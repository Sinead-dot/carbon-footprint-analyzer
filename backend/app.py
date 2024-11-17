from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
import httpx
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from typing import Dict

app = FastAPI()

class WebsiteRequest(BaseModel):
    url: HttpUrl

class WebsiteAnalysis(BaseModel):
    total_co2: float
    metrics: Dict

@app.get("/")
async def read_root():
    return {"status": "ok", "message": "Carbon Footprint Analyzer API"}

@app.post("/analyze")
async def analyze_website(request: WebsiteRequest):
    try:
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as session:
            # Get main page
            response = await session.get(str(request.url))
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Calculate basic metrics
            total_size = len(response.content) / (1024 * 1024)  # Convert to MB
            
            # Count resources
            js_files = len(soup.find_all('script', src=True))
            css_files = len(soup.find_all('link', rel='stylesheet'))
            images = len(soup.find_all('img'))
            
            # Simple CO2 calculation (example values)
            total_co2 = total_size * 0.2  # Simple estimation
            
            return WebsiteAnalysis(
                total_co2=round(total_co2, 3),
                metrics={
                    'pageSize': round(total_size, 2),
                    'jsCount': js_files,
                    'cssCount': css_files,
                    'imageCount': images,
                    'serverLocation': 'Estimated',
                    'caching': 'Not Checked',
                    'cdnUsage': False
                }
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
