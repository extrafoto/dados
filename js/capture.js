async function fetchContent() {
    const articleUrl = document.getElementById('articleUrl').value;

    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const urlWithTimestamp = `${proxyUrl}${encodeURIComponent(articleUrl)}?timestamp=${new Date().getTime()}`;

        const response = await fetch(urlWithTimestamp);
        const htmlText = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Capturar o título e a descrição
        let title, description, imageUrl;

        if (articleUrl.includes('oglobo')) {
            title = doc.querySelector('meta[property="og:title"]').getAttribute('content').trim();
            description = doc.querySelector('meta[property="og:description"]').getAttribute('content').trim();
            imageUrl = doc.querySelector('meta[property="og:image"]').getAttribute('content');
        } else if (articleUrl.includes('extra')) {
            title = doc.querySelector('h1.content-head__title').textContent.trim();
            description = doc.querySelector('h2.content-head__subtitle').textContent.trim();
            imageUrl = doc.querySelector('meta[property="og:image"]').getAttribute('content');
        }

        // Salvar o conteúdo no localStorage
        localStorage.setItem('title', title);
        localStorage.setItem('description', description);
        localStorage.setItem('imageUrl', imageUrl);

        // Redirecionar para a página de exibição do conteúdo
        window.location.href = 'capture.html';

    } catch (error) {
        console.error('Erro ao capturar o conteúdo:', error);
        alert('Erro ao capturar o conteúdo. Verifique o link.');
    }
}
