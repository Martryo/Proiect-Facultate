import cloudscraper # <--- The new hero
from bs4 import BeautifulSoup
import requests # We still need this for sending data to your backend

def scrape_with_cloudscraper(url):
    # 1. Create the Scraper (It mimics a real browser automatically)
    scraper = cloudscraper.create_scraper() 
    
    try:
        # 2. Use 'scraper.get' instead of 'requests.get'
        response = scraper.get(url)
        
        # Check if we got through
        if response.status_code != 200:
            print(f"⚠️ Blocked: {response.status_code}")
            return []

        print(f"✅ Success! Connected to {url}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        product_cards = soup.find_all('div', class_='product_box')
        
        print(f"Found {len(product_cards)} cards. Processing...")

        scraped_data = []

        for card in product_cards:
            try:
                # Extract Title & Link
                title_tag = card.find('div', class_='product_box_name').find('a')
                title = title_tag.get_text().strip()
                product_link = title_tag['href']
                
                # Extract Price
                price_tag = card.find('p', class_='price')
                if not price_tag: continue

                # Clean Price
                raw_price = price_tag.get_text()
                clean_str = ''.join(c for c in raw_price if c.isdigit() or c in ',.')
                clean_str = clean_str.replace('.', '').replace(',', '.')
                final_price = float(clean_str)

                # Extract Image
                image_tag = card.find('div', class_='product_box_image').find('img')
                image_url = image_tag['src']

                payload = {
                    "master_product_id": "rtx-5070-ti-list",
                    "source_store": "PC Garage",
                    "external_id": product_link.split('/')[-2],
                    "url": product_link,
                    "title": title,
                    "price": final_price,
                    "images": [image_url]
                }
                scraped_data.append(payload)

            # ... inside the loop ...
            except Exception as e:
                print(f"⚠️ Error on this card: {e}")  # <--- Add this!
                continue

        return scraped_data

    except Exception as e:
        print(f"❌ Error: {e}")
        return []

# --- RUN IT ---
url = "https://www.pcgarage.ro/placi-video/filtre/model-model-geforce-rtx-5070-ti/"
data = scrape_with_cloudscraper(url)

if data:
    print(f"🚀 Sending {len(data)} items to backend...")
    for item in data:
        requests.post("http://localhost:5000/api/products/update", json=item)
    print("Done!")
else:
    print("No data found.")