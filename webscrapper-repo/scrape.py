import requests
from bs4 import BeautifulSoup

def fetch_python_events():
    url = "https://www.python.org/"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Error: Unable to fetch page (status {response.status_code})")
        return

    soup = BeautifulSoup(response.text, "html.parser")
    events = soup.select(".event-widget li a")

    print("Upcoming Python.org Events:")
    for e in events:
        print("-", e.get_text(strip=True))

if __name__ == "__main__":
    fetch_python_events()

print('Another line added')