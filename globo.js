document.getElementById('globoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Pega o dado inserido
    let globoData = document.getElementById('globoData').value;
    
    // Aqui você pode capturar os dados da maneira que precisar (API, scraping, etc)
    // Vamos apenas simular a captura de dados com uma saída de console
    console.log("Dados capturados da Globo: ", globoData);

    // Exibe o resultado na página
    document.getElementById('result').innerHTML = `<p>Dados capturados: ${globoData}</p>`;
    
    // Limpa o campo de entrada
    document.getElementById('globoForm').reset();
});
