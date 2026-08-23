import requests
import json
import re
import urllib.parse

def search_ddg_images(query):
    url = 'https://duckduckgo.com/'
    params = {'q': query}
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    
    res = requests.post(url, data=params, headers=headers)
    searchObj = re.search(r'vqd=([\d-]+)\&', res.text)
    if not searchObj:
        return None
    
    vqd = searchObj.group(1)
    
    url = 'https://duckduckgo.com/i.js'
    params = {'l': 'us-en', 'o': 'json', 'q': query, 'vqd': vqd, 'f': ',,,', 'p': '1'}
    
    try:
        res = requests.get(url, headers=headers, params=params)
        data = json.loads(res.text)
        return data["results"][0]["image"]
    except:
        return None

queries = {
    "service_chauffeur_stock.jpg": "chauffeur opening car door",
    "service_business_stock.jpg": "black mercedes sprinter van",
    "service_luxury_stock.jpg": "mercedes s class black driving"
}

for filename, query in queries.items():
    img_url = search_ddg_images(query)
    if img_url:
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            img_data = requests.get(img_url, headers=headers, timeout=10).content
            with open(f"public/assets/{filename}", 'wb') as handler:
                handler.write(img_data)
            print(f"Downloaded {filename}")
        except Exception as e:
            print(f"Failed to download {img_url}: {e}")
    else:
        print(f"No results for {query}")
