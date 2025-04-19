function fetchNews() {
    fetch('/api/news')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("news-container");
            container.innerHTML = "";

            data.forEach(article => {
                // Duyguya göre kart sınıfı
                let cardClass = "card mb-3 ";
                if (article.sentiment === "POSITIVE") {
                    cardClass += "card-positive";
                } else if (article.sentiment === "NEGATIVE") {
                    cardClass += "card-negative";
                } else {
                    cardClass += "card-neutral";
                }

                const card = document.createElement("div");
                card.className = cardClass;

                const cardBody = document.createElement("div");
                cardBody.className = "card-body";

                const title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = article.title;

                const subtitle = document.createElement("h6");
                subtitle.className = "card-subtitle mb-2 custom-meta";
                subtitle.innerHTML = "<strong>Time:</strong> " + article.date;

                const content = document.createElement("p");
                content.className = "card-text";
                content.innerHTML = "<strong>Source:</strong> " + article.content;
                

                const sentiment = document.createElement("p");
                sentiment.className = "card-text";
                sentiment.innerHTML = `<strong>Duygu:</strong> ${article.sentiment} <br><strong>Skor:</strong> ${article.score}`;

                const relatedCoin = document.createElement("p");
                relatedCoin.className = "card-text";
                relatedCoin.innerHTML = `<strong>İlgili Coin:</strong> ${article.coin || 'GENEL'}`;

                // Butonlar
                const buttonContainer = document.createElement("div");
                buttonContainer.className = "d-flex justify-content-start mt-3";

                const buyBtn = document.createElement("button");
                buyBtn.className = "buy-btn";
                buyBtn.textContent = "Buy";
                buyBtn.onclick = () => {
                    alert(`BUY sinyali verildi: ${article.coin || 'GENEL'} - ${article.title}`);
                };

                const sellBtn = document.createElement("button");
                sellBtn.className = "sell-btn";
                sellBtn.textContent = "Sell";
                sellBtn.onclick = () => {
                    alert(`SELL sinyali verildi: ${article.coin || 'GENEL'} - ${article.title}`);
                };

                buttonContainer.appendChild(buyBtn);
                buttonContainer.appendChild(sellBtn);

                cardBody.appendChild(title);
                cardBody.appendChild(subtitle);
                cardBody.appendChild(content);
                cardBody.appendChild(sentiment);
                cardBody.appendChild(relatedCoin);
                cardBody.appendChild(buttonContainer);

                card.appendChild(cardBody);
                container.appendChild(card);
            });

            // Başlık animasyonu (pulse efekt)
            const mainTitle = document.getElementById("main-title");
            mainTitle.classList.add("pulse-effect");
            setTimeout(() => {
                mainTitle.classList.remove("pulse-effect");
            }, 800); // animasyon süresi ile uyumlu

            // Güncelleme zamanı
            const lastUpdated = document.getElementById("last-updated");
            const now = new Date();
            lastUpdated.textContent = `Son güncelleme: ${now.toLocaleTimeString()}`;
        })
        .catch(error => console.error("Haberler yüklenirken hata oluştu:", error));
}



setInterval(fetchNews, 10000);
window.onload = fetchNews;

async function updateTicker() {
    try {
        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple&vs_currencies=usd",
            {
                headers: {
                    'x-cg-api-key': 'CG-BtejmPBt8EgitxEUHZGEM7xt'
                }
            }
        );

        const data = await response.json();
        const tickerText = document.getElementById("ticker-text");

        const coins = [
            { name: "BTC", price: data.bitcoin.usd },
            { name: "ETH", price: data.ethereum.usd },
            { name: "SOL", price: data.solana.usd },
            { name: "XRP", price: data.ripple.usd }
        ];

        tickerText.innerHTML = coins.map(c => `${c.name}: $${c.price.toLocaleString()}`).join(" | ");
    } catch (error) {
        console.error("Ticker güncellenemedi:", error);
        document.getElementById("ticker-text").innerText = "Fiyatlar yüklenemedi.";
    }
}

setInterval(updateTicker, 15000);
window.addEventListener("load", updateTicker);

// script.js

function guncelSaat() {
    const saatDiv = document.getElementById('turkiye-saat');

    // Türkiye saati için UTC+3 ayarlaması
    const turkiyeZamani = new Date().toLocaleTimeString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Saati HTML'deki div'e yazdır
    saatDiv.textContent = turkiyeZamani;
}

// Sayfa yüklendiğinde ve her saniye saati güncelle
document.addEventListener('DOMContentLoaded', () => {
    guncelSaat(); // İlk çalıştırma
    setInterval(guncelSaat, 1000); // Her saniye güncelle
});
