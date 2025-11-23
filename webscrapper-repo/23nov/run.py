import os
import sys
import subprocess


def run_scraper():
    scraper_file = "news-scraper.py"

    if not os.path.exists(scraper_file):
        print("Error: news-scraper.py not found!")
        return

    # Check if URL is provided as command line argument
    if len(sys.argv) < 2:
        print("Error: No URL provided!")
        print("Usage: python run.py <URL>")
        return

    url = sys.argv[1]

    print("=" * 60)
    print("NEWS ARTICLE SCRAPER")
    print("=" * 60)
    print(f"\nScraping: {url}\n")

    # Pass the URL as a command line argument to the scraper
    subprocess.run([sys.executable, scraper_file, url])


if __name__ == "__main__":
    run_scraper()
