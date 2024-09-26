async function fetchContentExtra() {
    const articleUrl = document.getElementById('extraUrl').value;
    document.getElementById('content-container').classList.add('hidden');
    document.getElementById('clearButton').classList.add('hidden');

    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const urlWithTimestamp = `${proxyUrl}${encodeURIComponent(articleUrl)}?timestamp=${new Date().getTime()}`;

        const response = await fetch(urlWithTimestamp);
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const titleElement = doc.querySelector('h1.content-head__title');
        const title = titleElement ? titleElement.textContent : 'Título não encontrado';

        const subtitleElement = doc.querySelector('h2.content-head__subtitle');
        const description = subtitleElement ? subtitleElement.textContent : 'Subtítulo não encontrado';

        const imageElement = doc.querySelector('meta[property="og:image"]');
        const imageUrl = imageElement ? imageElement.getAttribute('content') : null;

        document.getElementById('title').value = title;
        document.getElementById('description').value = description;

        if (imageUrl) {
            document.getElementById('newsImage').src = imageUrl;
            document.getElementById('newsImage').style.display = 'block';
        } else {
            document.getElementById('newsImage').style.display = 'none';
        }

        document.getElementById('content-container').classList.remove('hidden');
    } catch (error) {
        console.error('Erro ao capturar o conteúdo do Extra:', error);
        alert('Erro ao capturar o conteúdo. Verifique o link.');
    }
}
