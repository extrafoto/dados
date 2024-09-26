async function fetchGloboContent() {
    const articleUrl = document.getElementById('globoUrl').value;

    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const urlWithTimestamp = `${proxyUrl}${encodeURIComponent(articleUrl)}?timestamp=${new Date().getTime()}`;

        const response = await fetch(urlWithTimestamp);
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Capturar o título e a descrição do O Globo
        const title = doc.querySelector('meta[property="og:title"]').getAttribute('content').trim();
        const description = doc.querySelector('meta[property="og:description"]').getAttribute('content').trim();
        const imageUrl = doc.querySelector('meta[property="og:image"]').getAttribute('content');

        // Salvar o conteúdo no localStorage
        localStorage.setItem('title', title);
        localStorage.setItem('description', description);
        localStorage.setItem('imageUrl', imageUrl);

        // Redirecionar para a página de exibição do conteúdo
        window.location.href = 'capture.html';

    } catch (error) {
        console.error('Erro ao capturar o conteúdo do Globo:', error);
        alert('Erro ao capturar o conteúdo. Verifique o link.');
    }
}
