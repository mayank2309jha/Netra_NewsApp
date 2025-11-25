run.py:-


import os
import sys
import subprocess
import json
import re


def extract_json_from_output(raw_output):
    """Extract JSON from raw output that may contain other text"""
    # Find JSON object in the output
    json_match = re.search(r'\{[\s\S]*\}', raw_output)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            return None
    return None


def run_scraper():
    scraper_file = "news-scraper.py"

    if not os.path.exists(scraper_file):
        return {
            "primary_article": {
                "headline": "N/A",
                "author": "N/A",
                "article_link": "N/A",
                "featured_image": "N/A",
                "source_logo": "N/A",
                "source_name": "N/A",
                "publish_date": "N/A",
                "summary": "N/A"
            },
            "related_articles": [],
            "total_related_articles": 0,
            "error": "news-scraper.py not found!"
        }

    # Check if URL is provided as command line argument
    if len(sys.argv) < 2:
        return {
            "primary_article": {
                "headline": "N/A",
                "author": "N/A",
                "article_link": "N/A",
                "featured_image": "N/A",
                "source_logo": "N/A",
                "source_name": "N/A",
                "publish_date": "N/A",
                "summary": "N/A"
            },
            "related_articles": [],
            "total_related_articles": 0,
            "error": "No URL provided! Usage: python run.py <URL>"
        }

    url = sys.argv[1]

    # Capture the output from the scraper subprocess
    result = subprocess.run(
        [sys.executable, scraper_file, url],
        capture_output=True,
        text=True
    )

    # Try to extract and parse JSON from the output
    scraped_data = extract_json_from_output(result.stdout)

    if scraped_data:
        # Map the scraped data to the required structure
        structured_output = {
            "primary_article": {
                "headline": scraped_data.get("headline") or "N/A",
                "author": scraped_data.get("author") or "N/A",
                "article_link": scraped_data.get("url") or "N/A",
                "featured_image": scraped_data.get("image") or "N/A",
                "source_logo": "N/A",
                "source_name": scraped_data.get("source_name") or "N/A",
                "publish_date": scraped_data.get("published") or "N/A",
                "summary": scraped_data.get("content") or "N/A"
            },
            "related_articles": scraped_data.get("related_articles", []),
            "total_related_articles": len(scraped_data.get("related_articles", []))
        }
        return structured_output
    else:
        # If JSON extraction fails, return error in structured format
        return {
            "primary_article": {
                "headline": "N/A",
                "author": "N/A",
                "article_link": "N/A",
                "featured_image": "N/A",
                "source_logo": "N/A",
                "source_name": "N/A",
                "publish_date": "N/A",
                "summary": "N/A"
            },
            "related_articles": [],
            "total_related_articles": 0,
            "error": "Could not extract valid JSON from scraper output",
            "raw_output": result.stdout
        }


if __name__ == "__main__":
    result = run_scraper()
    print(json.dumps(result, indent=2))