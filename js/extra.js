async function fetchExtraContent() {
    const articleUrl = document.getElementById('extraUrl').value;

    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const urlWithTimestamp = `${proxyUrl}${encodeURIComponent(articleUrl)}?timestamp=${new Date().getTime()}`;

        const response = await fetch(urlWithTimestamp);
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Tentando diferentes seletores para capturar o título
        let titleElement = doc.querySelector('h1.content-head__title'); // seletor padrão
        if (!titleElement) {
            titleElement = doc.querySelector('meta[property="og:title"]'); // fallback para meta tag
        }
        
        const title = titleElement ? (titleElement.textContent || titleElement.getAttribute('content')).trim() : 'Título não encontrado';

        // Tentando diferentes seletores para capturar o subtítulo
        let subtitleElement = doc.querySelector('h2.content-head__subtitle'); // seletor padrão
        if (!subtitleElement) {
            subtitleElement = doc.querySelector('meta[property="og:description"]'); // fallback para meta tag
        }
        
        const description = subtitleElement ? (subtitleElement.textContent || subtitleElement.getAttribute('content')).trim() : 'Subtítulo não encontrado';

        // Capturar a imagem (og:image)
        const imageElement = doc.querySelector('meta[property="og:image"]');
        const imageUrl = imageElement ? imageElement.getAttribute('content') : null;

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
