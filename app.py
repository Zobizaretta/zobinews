from flask import Flask, render_template, jsonify
from get_news import get_crypto_news, get_fear_greed_index

app = Flask(__name__)

@app.route('/')
def home():
    news_list = get_crypto_news()
    return render_template("index.html", news=news_list)

@app.route('/api/news')
def api_news():
    news = get_crypto_news()
    return jsonify(news)

@app.route('/charts')
def charts():
    return render_template("charts.html")

@app.route('/feargreed')
def feargreed():
    fg_data = get_fear_greed_index()
    return render_template("feargreed.html", fg=fg_data)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
    app.run(debug=True)
