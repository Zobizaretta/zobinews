import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from transformers import pipeline

load_dotenv()
api_key = os.getenv("API_KEY")
url = f"https://cryptopanic.com/api/v1/posts/?auth_token={api_key}&public=true"

# HuggingFace duygu analizi modeli
sentiment_pipeline = pipeline("sentiment-analysis")

# Haberde geçen coinleri tespit etme (BTC, ETH, SOL, vs.)
def detect_coin_from_title(title):
    keywords = ["BTC", "Bitcoin", "ETH", "Ethereum", "SOL", "Solana", "XRP", "Ripple", "DOGE", "Dogecoin", "BNB", "AVAX"]
    for keyword in keywords:
        if keyword.lower() in title.lower():
            return keyword.upper()
    return "GLOBAL"

# Crypto haberlerini çekme
def get_crypto_news():
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        articles = data.get("results", [])
        news_list = []
        for item in articles:
            title = item.get("title")
            published_utc = item.get("published_at")
            domain = item.get("domain", "unknown")

            # Türkiye saati (UTC+3)
            if published_utc:
                dt_utc = datetime.strptime(published_utc, "%Y-%m-%dT%H:%M:%S%z")
                dt_tr = dt_utc + timedelta(hours=3)
                formatted_date = dt_tr.strftime("%Y-%m-%d %H:%M")
            else:
                formatted_date = "Bilinmiyor"

            # Duygu analizi
            if title:
                result = sentiment_pipeline(title)[0]
                sentiment = result["label"]
                score = round(result["score"], 2)
            else:
                sentiment = "N/A"
                score = 0.0

            # Coin tespiti
            coin = detect_coin_from_title(title)

            news_list.append({
                "title": title,
                "content": domain,
                "author": "CryptoPanic",
                "date": formatted_date,
                "sentiment": sentiment,
                "score": score,
                "coin": coin
            })
        return news_list
    else:
        print("Haber çekme başarısız oldu:", response.status_code)
        return []

# Fear & Greed endeksini çekme
def get_fear_greed_index():
    try:
        response = requests.get("https://api.alternative.me/fng/")
        if response.status_code == 200:
            data = response.json()["data"][0]
            index_value = int(data["value"])
            classification = data["value_classification"]
            timestamp = datetime.fromtimestamp(int(data["timestamp"]))
            return {
                "value": index_value,
                "classification": classification,
                "timestamp": timestamp.strftime("%Y-%m-%d %H:%M")
            }
        else:
            print("Fear & Greed API hatası:", response.status_code)
            return None
    except Exception as e:
        print("Fear & Greed veri çekme hatası:", e)
        return None
