// Controle do painel deslizante
const toggleBtn = document.getElementById('toggle-panel');
const closeBtn = document.getElementById('close-panel');
const newsPanel = document.getElementById('news-panel');
const overlay = document.getElementById('overlay');
const loading = document.getElementById('loading');

// Abrir painel
toggleBtn.addEventListener('click', () => {
  newsPanel.classList.add('active');
  overlay.classList.add('active');
  document.body.classList.add('panel-open');
});

// Fechar painel
function closePanel() {
  newsPanel.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('panel-open');
}

closeBtn.addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

// Fechar painel com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePanel();
  }
});

// Função para criar ícones de compartilhamento
function createShareIcons(title, link) {
  const shareContainer = document.createElement('div');
  shareContainer.className = 'share-icons';
  
  const encodedTitle = encodeURIComponent(title);
  const encodedLink = encodeURIComponent(link);
  
  // Facebook
  const facebookBtn = document.createElement('a');
  facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
  facebookBtn.target = '_blank';
  facebookBtn.className = 'share-btn facebook';
  facebookBtn.innerHTML = '<i class="fab fa-facebook-f"></i>';
  facebookBtn.title = 'Compartilhar no Facebook';
  
  // Twitter
  const twitterBtn = document.createElement('a');
  twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedLink}`;
  twitterBtn.target = '_blank';
  twitterBtn.className = 'share-btn twitter';
  twitterBtn.innerHTML = '<i class="fab fa-twitter"></i>';
  twitterBtn.title = 'Compartilhar no Twitter';
  
  // WhatsApp
  const whatsappBtn = document.createElement('a');
  whatsappBtn.href = `https://wa.me/?text=${encodedTitle}%20${encodedLink}`;
  whatsappBtn.target = '_blank';
  whatsappBtn.className = 'share-btn whatsapp';
  whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
  whatsappBtn.title = 'Compartilhar no WhatsApp';
  
  // LinkedIn
  const linkedinBtn = document.createElement('a');
  linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
  linkedinBtn.target = '_blank';
  linkedinBtn.className = 'share-btn linkedin';
  linkedinBtn.innerHTML = '<i class="fab fa-linkedin-in"></i>';
  linkedinBtn.title = 'Compartilhar no LinkedIn';
  
  shareContainer.appendChild(facebookBtn);
  shareContainer.appendChild(twitterBtn);
  shareContainer.appendChild(whatsappBtn);
  shareContainer.appendChild(linkedinBtn);
  
  return shareContainer;
}

// Função para formatar data/hora
function formatDateTime(pubDate) {
  try {
    const data = new Date(pubDate);
    const agora = new Date();
    const diffMs = agora - data;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? 'Agora' : `${diffMinutes}min`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  } catch (e) {
    return '';
  }
}

// Função para extrair editoria da URL
function extractEditoria(link) {
  try {
    const urlParts = new URL(link).pathname.split('/');
    let editoria = urlParts[1] || '';
    editoria = editoria.replace(/-/g, ' ');
    
    // Capitalizar primeira letra de cada palavra
    editoria = editoria.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return editoria;
  } catch (e) {
    return 'Notícias';
  }
}

// Função para extrair imagem da descrição ou usar imagem padrão
function extractImage(description, link) {
  // Tentar extrair imagem da descrição
  const imageMatch = description.match(/<img[^>]+src="([^">]+)"/);
  if (imageMatch) {
    return imageMatch[1];
  }
  
  // Tentar extrair de outras tags de mídia
  const mediaMatch = description.match(/src="([^"]*\.(jpg|jpeg|png|webp|gif))"/i);
  if (mediaMatch) {
    return mediaMatch[1];
  }
  
  // Imagem padrão baseada na editoria
  const editoria = extractEditoria(link).toLowerCase();
  const defaultImages = {
    'esportes': 'https://via.placeholder.com/300x200/1e40af/ffffff?text=ESPORTES',
    'política': 'https://via.placeholder.com/300x200/dc2626/ffffff?text=POLÍTICA',
    'economia': 'https://via.placeholder.com/300x200/059669/ffffff?text=ECONOMIA',
    'tecnologia': 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=TECH',
    'cultura': 'https://via.placeholder.com/300x200/ea580c/ffffff?text=CULTURA',
    'mundo': 'https://via.placeholder.com/300x200/0891b2/ffffff?text=MUNDO'
  };
  
  return defaultImages[editoria] || 'https://via.placeholder.com/300x200/6b7280/ffffff?text=NOTÍCIAS';
}

// Função principal para carregar RSS
function carregarRSS() {
  loading.style.display = 'flex';
  
  // Simular busca RSS (adapte conforme sua implementação)
  // Se estiver usando Chrome Extension, use chrome.runtime.sendMessage
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({ action: "buscarRSS" }, (response) => {
      processarRSS(response);
    });
  } else {
    // Para teste local, usar dados simulados
    setTimeout(() => {
      const mockResponse = {
        rss: `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <item>
              <title>Exemplo de Notícia 1</title>
              <link>https://exemplo.com/politica/noticia-1</link>
              <description><![CDATA[<img src="https://via.placeholder.com/300x200/dc2626/ffffff?text=POLÍTICA" />Descrição da notícia...]]></description>
              <pubDate>Mon, 05 Aug 2025 10:30:00 GMT</pubDate>
            </item>
            <item>
              <title>Exemplo de Notícia 2</title>
              <link>https://exemplo.com/esportes/noticia-2</link>
              <description><![CDATA[<img src="https://via.placeholder.com/300x200/1e40af/ffffff?text=ESPORTES" />Descrição da notícia de esportes...]]></description>
              <pubDate>Mon, 05 Aug 2025 09:15:00 GMT</pubDate>
            </item>
          </channel>
        </rss>`
      };
      processarRSS(mockResponse);
    }, 1000);
  }
}

// Função para processar o RSS
function processarRSS(response) {
  loading.style.display = 'none';
  
  if (response?.rss) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.rss, "application/xml");
    const items = xml.querySelectorAll("item");
    const container = document.getElementById("noticias");
    container.innerHTML = "";

    // Converter NodeList para Array e ordenar por data (mais recentes primeiro)
    const itemsArray = Array.from(items);
    itemsArray.sort((a, b) => {
      const dateA = new Date(a.querySelector("pubDate")?.textContent || 0);
      const dateB = new Date(b.querySelector("pubDate")?.textContent || 0);
      return dateB - dateA;
    });

    itemsArray.forEach(item => {
      const title = item.querySelector("title")?.textContent || "Sem título";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      
      // Extrair informações
      const editoria = extractEditoria(link);
      const hora = formatDateTime(pubDate);
      const imageUrl = extractImage(description, link);

      // Criar card
      const card = document.createElement("div");
      card.className = "news-card";

      // Imagem
      const imageContainer = document.createElement("div");
      imageContainer.className = "card-image";
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = title;
      img.loading = "lazy";
      imageContainer.appendChild(img);

      // Conteúdo
      const content = document.createElement("div");
      content.className = "card-content";

      // Editoria e hora
      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.innerHTML = `
        <span class="editoria">${editoria}</span>
        ${hora ? `<span class="separator">•</span><span class="time">${hora}</span>` : ''}
      `;

      // Título
      const titleElement = document.createElement("h3");
      titleElement.className = "card-title";
      const titleLink = document.createElement("a");
      titleLink.href = link;
      titleLink.target = "_blank";
      titleLink.textContent = title;
      titleElement.appendChild(titleLink);

      // Ícones de compartilhamento
      const shareIcons = createShareIcons(title, link);

      // Montar card
      content.appendChild(meta);
      content.appendChild(titleElement);
      content.appendChild(shareIcons);
      
      card.appendChild(imageContainer);
      card.appendChild(content);
      container.appendChild(card);
    });
  } else {
    const container = document.getElementById("noticias");
    container.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Erro ao carregar notícias. Tente novamente mais tarde.</p>
      </div>
    `;
    console.error("Erro ao buscar RSS:", response?.error);
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  carregarRSS();
});

// Atualizar automaticamente a cada 5 minutos
setInterval(() => {
  if (newsPanel.classList.contains('active')) {
    carregarRSS();
  }
}, 5 * 60 * 1000);

