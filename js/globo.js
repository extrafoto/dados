async function fetchContent() {
    const articleUrl = document.getElementById('articleUrl').value;
    document.getElementById('content-container').classList.add('hidden');
    document.getElementById('clearButton').classList.add('hidden');

    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const urlWithTimestamp = `${proxyUrl}${encodeURIComponent(articleUrl)}?timestamp=${new Date().getTime()}`;

        const response = await fetch(urlWithTimestamp);
        const htmlText = await response.text();

        // Cria um DOM virtual
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Extrair o título
        const titleElement = doc.querySelector('h1');
        const title = titleElement ? titleElement.textContent.trim() : 'Título não encontrado';

        // Extrair a descrição (meta description)
        const descriptionMeta = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[property="og:description"]');
        const description = descriptionMeta ? descriptionMeta.getAttribute('content').trim() : 'Descrição não encontrada';

        // Extrair imagem
        const imageElement = doc.querySelector('figure img');
        const imageUrl = imageElement ? imageElement.src : null;

        // Preencher os campos com o conteúdo capturado
        document.getElementById('title').value = title;
        document.getElementById('description').value = description;

        // Exibir a imagem
        if (imageUrl) {
            document.getElementById('newsImage').src = imageUrl;
            document.getElementById('newsImage').style.display = 'block';
        } else {
            document.getElementById('newsImage').style.display = 'none';
        }

        // Mostrar os campos preenchidos
        document.getElementById('content-container').classList.remove('hidden');
    } catch (error) {
        console.error('Erro ao capturar o conteúdo:', error);
        alert('Erro ao capturar o conteúdo. Verifique o link.');
    }
}

async function shareOnWhatsApp() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const articleUrl = document.getElementById('articleUrl').value;

    // Encurtar a URL com a API do TinyURL
    const shortUrl = await encurtarUrl(articleUrl);

    // Formatar a mensagem para o WhatsApp
    const mensagem = `*${title.toUpperCase()}*\n\n${description}\n\n➡️ Leia aqui: ${shortUrl}`;

    // Codificar a mensagem para o WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;

    // Redirecionar para o WhatsApp
    window.open(whatsappUrl, '_blank');

    // Exibir o botão de limpar
    document.getElementById('clearButton').classList.remove('hidden');
}

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

function clearForm() {
    // Limpar os campos
    document.getElementById('articleUrl').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('newsImage').src = '';
    document.getElementById('newsImage').style.display = 'none';

    // Ocultar a área de conteúdo e o botão de limpar
    document.getElementById('content-container').classList.add('hidden');
    document.getElementById('clearButton').classList.add('hidden');
}
