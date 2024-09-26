async function fetchExtraContent() {
    const articleUrl = document.getElementById('extraUrl').value;

    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const urlWithTimestamp = `${proxyUrl}${encodeURIComponent(articleUrl)}?timestamp=${new Date().getTime()}`;

        const response = await fetch(urlWithTimestamp);
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Capturar o título e a descrição do Extra
        const title = doc.querySelector('h1.content-head__title').textContent.trim();
        const description = doc.querySelector('h2.content-head__subtitle').textContent.trim();
        const imageUrl = doc.querySelector('meta[property="og:image"]').getAttribute('content');

        // Encurtar a URL com a API do TinyURL
        const shortUrl = await encurtarUrl(articleUrl);

        // Salvar o conteúdo no localStorage
        localStorage.setItem('title', title);
        localStorage.setItem('description', description);
        localStorage.setItem('imageUrl', imageUrl);
        localStorage.setItem('shortUrl', shortUrl);

        // Redirecionar para a página de exibição do conteúdo
        window.location.href = 'capture.html';

    } catch (error) {
        console.error('Erro ao capturar o conteúdo do Extra:', error);
        alert('Erro ao capturar o conteúdo. Verifique o link.');
    }
}

// Função para encurtar a URL usando TinyURL
async function encurtarUrl(longUrl) {
    const apiUrl = 'https://api.tinyurl.com/create';
    const apiKey = 'pJtDisay712pqvikxYaZRxjOXnycECCMgdk6EcnGENujgYWSy6BBQP6NaFLU';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            url: longUrl,
            domain: 'tiny.one'
        })
    });

    const data = await response.json();
    return data.data.tiny_url;
}
