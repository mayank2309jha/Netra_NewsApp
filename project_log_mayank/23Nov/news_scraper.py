import requests
from bs4 import BeautifulSoup
import json
import re
from urllib.parse import urljoin


def scrape_article(url: str):
    """
    UNIVERSAL NEWS SCRAPER (Option B)
    Extracts headline, image, content, author, publish date
    using OG tags, JSON-LD, microdata, fallbacks.
    Returns a JSON object (Python dict).
    """

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    }

    try:
        html = requests.get(url, headers=headers, timeout=10).text
    except Exception as e:
        return {"error": f"Cannot retrieve URL: {e}"}

    soup = BeautifulSoup(html, "html.parser")

    # -----------------------------------------------------
    # Helper functions
    # -----------------------------------------------------

    def get_og(property):
        tag = soup.find("meta", property=property)
        if tag and tag.get("content"):
            return tag["content"].strip()
        return None

    def get_meta(name):
        tag = soup.find("meta", attrs={"name": name})
        if tag and tag.get("content"):
            return tag["content"].strip()
        return None

    def extract_json_ld():
        """Extract from JSON-LD schema.org tags."""
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string, strict=False)
                if isinstance(data, dict):
                    yield data
                elif isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict):
                            yield item
            except:
                pass

    def clean_text(t):
        if not t:
            return None
        t = re.sub(r"\s+", " ", t).strip()
        return t if t else None

    # -----------------------------------------------------
    # 1. HEADLINE (OG → JSON-LD → <h1>)
    # -----------------------------------------------------
    headline = (
        get_og("og:title")
        or get_meta("twitter:title")
    )

    if not headline:
        for block in extract_json_ld():
            if "headline" in block:
                headline = block["headline"]
                break

    if not headline:
        h1 = soup.find("h1")
        headline = clean_text(h1.get_text()) if h1 else None

    # -----------------------------------------------------
    # 2. IMAGE
    # -----------------------------------------------------
    image = (
        get_og("og:image")
        or get_meta("twitter:image")
    )

    if not image:
        for block in extract_json_ld():
            if "image" in block:
                if isinstance(block["image"], dict) and "url" in block["image"]:
                    image = block["image"]["url"]
                elif isinstance(block["image"], str):
                    image = block["image"]
                break

    if not image:
        img = soup.find("img")
        if img and img.get("src"):
            image = urljoin(url, img["src"])

    # -----------------------------------------------------
    # 3. AUTHOR
    # -----------------------------------------------------
    author = (
        get_meta("author")
        or get_og("article:author")
    )

    if not author:
        for block in extract_json_ld():
            if "author" in block:
                a = block["author"]
                if isinstance(a, dict) and "name" in a:
                    author = a["name"]
                elif isinstance(a, str):
                    author = a
                break

    if not author:
        possible = soup.find(class_=re.compile("author", re.I))
        if possible:
            author = clean_text(possible.get_text())

    # -----------------------------------------------------
    # 4. PUBLISH DATE
    # -----------------------------------------------------
    published = (
        get_og("article:published_time")
        or get_meta("date")
    )

    if not published:
        for block in extract_json_ld():
            if "datePublished" in block:
                published = block["datePublished"]
                break

    if not published:
        time_tag = soup.find("time")
        if time_tag:
            published = time_tag.get("datetime") or time_tag.get_text()

    # -----------------------------------------------------
    # 5. CONTENT
    # -----------------------------------------------------
    content = None

    for block in extract_json_ld():
        if "articleBody" in block:
            content = clean_text(block["articleBody"])
            break

    if not content:
        article_tag = soup.find("article")
        if article_tag:
            content = clean_text(article_tag.get_text())

    if not content:
        paragraphs = soup.find_all("p")
        content = clean_text(" ".join([p.get_text() for p in paragraphs]))

    # -----------------------------------------------------
    # RETURN JSON OBJECT
    # -----------------------------------------------------
    return {
        "url": url,
        "headline": headline,
        "image": image,
        "author": author,
        "published": published,
        "content": content,
    }
