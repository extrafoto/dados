document.getElementById('extraForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Pega o dado inserido
    let extraData = document.getElementById('extraData').value;
    
    // Aqui você pode capturar os dados da maneira que precisar (API, scraping, etc)
    // Vamos apenas simular a captura de dados com uma saída de console
    console.log("Dados capturados da Extra: ", extraData);

    // Exibe o resultado na página
    document.getElementById('result').innerHTML = `<p>Dados capturados: ${extraData}</p>`;
    
    // Limpa o campo de entrada
    document.getElementById('extraForm').reset();
});
