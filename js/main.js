async function carregarCatalogo() {
    try {
    // Simula loading
    const container = document.getElementById("produtos-container");
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Carregando catálogo...</p>
        </div>
        `;
    
    const jsonData = await fetch('dados-produtos-convertido.json');
    const data = await jsonData.json();
    container.innerHTML = '';

    // 1. Criar botões de filtro
    criarBotoesFiltro(data);
    
    // 2. Carregar todos os produtos inicialmente
    
    exibirProdutos(data);
    const contador = document.createElement('div');
    contador.className = 'contador-produtos';
    contador.textContent = `Mostrando ${produtos.length} produto(s)`;
    container.prepend(contador);

    function criarBotoesFiltro(produtos) {
        const filtroContainer = document.querySelector('.filtro-categorias');
        
        // Pegar todas as categorias únicas
        const categorias = [...new Set(produtos.map(p => p.categoria))].sort();
        
        // Criar botão para cada categoria
        categorias.forEach(categoria => {
            const botao = document.createElement('button');
            botao.className = 'filtro-btn';
            botao.textContent = categoria;
            botao.dataset.categoria = categoria;
            filtroContainer.appendChild(botao);
        });
        
        // Adicionar eventos de clique
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover classe 'active' de todos os botões
                document.querySelectorAll('.filtro-btn').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Adicionar classe 'active' no botão clicado
                this.classList.add('active');
                
                // Filtrar produtos
                const categoria = this.dataset.categoria;
                const produtosFiltrados = categoria === 'todos' 
                    ? data 
                    : data.filter(p => p.categoria === categoria);
                
                exibirProdutos(produtosFiltrados);
            });
        });
    }

    function exibirProdutos(produtos) {
        container.innerHTML = '';
        
        produtos.forEach(produto => {
            const produtoDiv = document.createElement("div");
            produtoDiv.classList.add("produto");
            
            let variacoesHTML = produto.variacoes.slice(0, 3).map(variacao => `
                <tr>
                    <td>${variacao.codigo}</td>
                    <td>${variacao.medidas}</td>
                </tr>
            `).join('');
            
            let ocultasHTML = produto.variacoes.slice(3).map(variacao => `
                <tr class="oculto">
                    <td>${variacao.codigo}</td>
                    <td>${variacao.medidas}</td>
                </tr>
            `).join('');
            
            const temVariacoesOcultas = produto.variacoes.length > 3;
            
            produtoDiv.innerHTML = `
                <table>
                    <tr>
                        <th colspan="2" style="position: relative;" class="container-imagem">
                            <!-- Imagem principal (visível por padrão) -->
                            <img src="${produto.imagem}" alt="${produto.nome}" class="imagem-principal">
                            
                            <!-- Imagem secundária (hidden por padrão) -->
                            <img src="${produto.imagem2}" alt="${produto.nome} - Vista alternativa" 
                                class="imagem-secundaria" 
                                onerror="this.style.display='none'">
                            
                            ${produto.nome.toLowerCase().includes('concha') ? '<div class="selo" style="background: #0055a5">Em breve</div>' : ''}
                            ${produto.nome.toLowerCase().includes('botton') ? '<div class="selo" style="background:rgb(0, 165, 63)">Promoções em Kits</div>' : ''}

                        </th>
                    </tr>
                    <tr>
                        <th colspan="2" class="nome-produto">${produto.nome}</th>
                    </tr>
                    <tr>
                        <th>Código</th>
                        <th>Medidas</th>
                    </tr>
                    ${variacoesHTML}
                    <tbody class="variacoes-ocultas" style="display: none;">${ocultasHTML}</tbody>
                </table>

            <div class="btn-pedido-container">
                <a href="#" class="btn-whatsapp-animado" data-produto="${produto.nome}">
                    <span class="icone-whatsapp">+</span>
                    <span class="texto-whatsapp">FAZER PEDIDO</span>
                </a>
            </div>
                
                ${temVariacoesOcultas ? '<button class="ver-mais">Outras Medidas</button>' : ''}
            `;
            
            if (temVariacoesOcultas) {
                const botao = produtoDiv.querySelector(".ver-mais");
                const tbodyOcultas = produtoDiv.querySelector(".variacoes-ocultas");
                
                botao.addEventListener("mouseover", () => {
                    botao.style.backgroundColor = "#0055a5";
                });
                
                botao.addEventListener("mouseout", () => {
                    botao.style.backgroundColor = "#003366";
                });
                
                botao.addEventListener("click", () => {
                    if (tbodyOcultas.style.display === "none") {
                        tbodyOcultas.style.display = "table-row-group";
                        botao.textContent = "Veja menos";
                    } else {
                        tbodyOcultas.style.display = "none";
                        botao.textContent = "Veja mais";
                    }
                });
            }

            container.appendChild(produtoDiv);
        });
    }
    
} catch (error) {
    console.error('Erro ao carregar os dados:', error);
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #d32f2f;">
            <h3>Erro ao carregar o catálogo</h3>
            <p>Por favor, tente recarregar a página ou entre em contato conosco.</p>
        </div>
    `;
}
}
carregarCatalogo()