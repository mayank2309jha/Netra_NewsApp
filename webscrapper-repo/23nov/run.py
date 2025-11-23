import os
import sys
import subprocess


def run_scraper():
    scraper_file = "news-scraper.py"

    if not os.path.exists(scraper_file):
        print("Error: news-scraper.py not found!")
        return

    print("Running scraper...")
    subprocess.run([sys.executable, scraper_file])


if __name__ == "__main__":
    run_scraper()
