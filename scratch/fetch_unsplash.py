import urllib.request
import json
import sys

queries = {
    "service_chauffeur_stock.jpg": "black driver luxury car",
    "service_business_stock.jpg": "black executive van",
    "service_luxury_stock.jpg": "black luxury car driving"
}

for filename, query in queries.items():
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(query)}&per_page=1"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        if data['results']:
            img_url = data['results'][0]['urls']['raw'] + "&w=1200&h=800&fit=crop&q=80"
            urllib.request.urlretrieve(img_url, f"public/assets/{filename}")
            print(f"Downloaded {filename}")
        else:
            print(f"No results for {query}")
    except Exception as e:
        print(f"Failed {query}: {e}")
