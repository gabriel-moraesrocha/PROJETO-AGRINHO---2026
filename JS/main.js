// ============================================================================
// AUTOR: [Gabriel de Moraes Rocha]
// DATA: Junho/Julho de 2026
// PROJETO: Agrinho 2026 - Agro forte futuro sustentável
// DESCRIÇÃO: Sistema completo de acessibilidade, jogos, quiz, notícias, mapa interativo e gráficos
// ============================================================================

// ============================================================================
// 1. SISTEMA DE ACESSIBILIDADE
// ============================================================================
// Função: Controla aumento/diminuição de texto, alto contraste e daltonismo

// Captura os elementos do DOM para os botões de acessibilidade
const accToggle = document.getElementById('accessibleToggle');  // Botão que abre/fecha o menu
const accMenu = document.getElementById('accessibleMenu');      // Menu de opções de acessibilidade
const btnContrast = document.getElementById('btnContrast');     // Botão de alto contraste
const btnDaltonismo = document.getElementById('btnDaltonismo'); // Botão de modo daltonismo
const btnIncText = document.getElementById('btnIncText');       // Botão de aumentar texto
const btnDecText = document.getElementById('btnDecText');       // Botão de diminuir texto
        
// Variável global para controlar o fator de escala da fonte (mínimo 0.8, máximo 1.5)
let fontScale = 1.0;

// Abre/fecha o menu de acessibilidade ao clicar no botão ♿
// e impede que o clique se propague para não fechar imediatamente
accToggle.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    accMenu.classList.toggle('active'); 
});

// Fecha o menu quando o usuário clica em qualquer lugar fora do menu
document.addEventListener('click', () => { 
    accMenu.classList.remove('active'); 
});

// Ativa/desativa o modo alto contraste
// Remove o modo daltonismo se estiver ativo para evitar conflitos
btnContrast.addEventListener('click', () => {
    document.body.classList.remove('daltonismo');  // Remove modo daltonismo
    document.body.classList.toggle('alto-contraste'); // Alterna alto contraste
});

// Ativa/desativa o modo daltonismo (protanopia - vermelho/verde)
// Remove o alto contraste se estiver ativo para evitar conflitos
btnDaltonismo.addEventListener('click', () => {
    document.body.classList.remove('alto-contraste'); // Remove alto contraste
    document.body.classList.toggle('daltonismo');     // Alterna daltonismo
});

// Aumenta o tamanho do texto em 10% (limite máximo de 1.5x)
btnIncText.addEventListener('click', () => {
    if (fontScale < 1.5) {
        fontScale += 0.1; // Incrementa 10%
        // Atualiza a variável CSS --font-scale que controla o tamanho das fontes
        document.documentElement.style.setProperty('--font-scale', fontScale);
     }
});

// Diminui o tamanho do texto em 10% (limite mínimo de 0.8x)
btnDecText.addEventListener('click', () => {
    if (fontScale > 0.8) {
        fontScale -= 0.1; // Decrementa 10%
        // Atualiza a variável CSS --font-scale
        document.documentElement.style.setProperty('--font-scale', fontScale);
    }
});

// ============================================================================
// 2. BOLHAS INTERATIVAS (Drag and Drop)
// ============================================================================
// Função: Permite que o usuário arraste as bolhas decorativas pela tela

// Seleciona todas as bolhas da página
const bubbles = document.querySelectorAll('.bubble');

// Para cada bolha, adiciona funcionalidade de arrastar
bubbles.forEach(bubble => {
    let isDragging = false;       // Indica se a bolha está sendo arrastada
    let startX, startY;           // Posição inicial do clique
    let initialLeft, initialTop;  // Posição inicial da bolha

    // Inicia o arrasto (mouse ou toque)
    function startDrag(e) {
        isDragging = true;
        bubble.style.animationPlayState = 'paused'; // Pausa animação durante arrasto
        
        // Obtém posição atual da bolha
        const rect = bubble.getBoundingClientRect();
        initialLeft = rect.left + window.scrollX;
        initialTop = rect.top + window.scrollY;
        
        // Ajusta o posicionamento para absolute
        bubble.style.right = 'auto';
        bubble.style.bottom = 'auto';
        bubble.style.left = initialLeft + 'px';
        bubble.style.top = initialTop + 'px';
        
        // Calcula offset do clique em relação à bolha
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        startX = clientX - initialLeft;
        startY = clientY - initialTop;
        
        // Adiciona listeners para movimento e fim do arrasto
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }

    // Move a bolha durante o arrasto
    function drag(e) {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault(); // Previne scroll durante arrasto
        
        // Calcula nova posição baseada no movimento do mouse/toque
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        bubble.style.left = (clientX - startX) + 'px';
        bubble.style.top = (clientY - startY) + 'px';
    }

    // Finaliza o arrasto
    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        bubble.style.animationPlayState = 'running'; // Retoma animação
        
        // Remove listeners
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }

    // Eventos para iniciar arrasto (mouse e toque)
    bubble.addEventListener('mousedown', startDrag);
    bubble.addEventListener('touchstart', startDrag, { passive: true });
});

// ============================================================================
// 3. PÁGINA PRINCIPAL - NOTÍCIAS
// ============================================================================
// Função: Gerencia as notícias do agro sustentável

// Array com os dados das notícias (cada notícia tem id, título, descrição, etc.)
const noticias = [
    {
        id: 1,
        titulo: "Projeto vai recuperar Mata Atlântica e aumentar renda de produtores de cacau",
        descricao: "Ceplac lança projeto para recuperar áreas da Mata Atlântica no sul da Bahia utilizando sistema agroflorestal 'cabruca', que preserva árvores nativas enquanto aumenta a produção de cacau.",
        conteudo: "A Ceplac lançou um projeto para recuperar áreas da Mata Atlântica no sul da Bahia utilizando o sistema agroflorestal 'cabruca', que preserva árvores nativas enquanto aumenta a produção de cacau. A iniciativa deve beneficiar cerca de 3 mil produtores rurais. A mensagem positiva é: Produzir mais alimentos e preservar a floresta ao mesmo tempo.",
        categoria: "Preservação",
        imagem: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop",
        data: "14/04/2026",
        tags: ["Mata Atlântica", "Cacau", "Agrofloresta", "Produtores Rurais"]
    },
    {
        id: 2,
        titulo: "Amazônia receberá R$ 56 milhões para recuperação de áreas degradadas",
        descricao: "Projeto prevê recuperação de áreas degradadas em 3 mil propriedades rurais da Amazônia, promovendo restauração florestal e geração de renda para agricultores familiares.",
        conteudo: "O projeto prevê a recuperação de áreas degradadas em 3 mil propriedades rurais da Amazônia, promovendo restauração florestal e geração de renda para agricultores familiares. A mensagem positiva é: Agricultura e reflorestamento trabalhando juntos para proteger a Amazônia.",
        categoria: "Meio Ambiente",
        imagem: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&auto=format&fit=crop",
        data: "29/04/2026",
        tags: ["Amazônia", "Recuperação", "Reflorestamento", "Agricultura Familiar"]
    },
    {
        id: 3,
        titulo: "Programa Caminho Verde Brasil investirá R$ 3 bilhões em desenvolvimento sustentável",
        descricao: "Programa tem meta de restaurar até 40 milhões de hectares de áreas degradadas e transformá-las em sistemas produtivos sustentáveis.",
        conteudo: "O programa Caminho Verde Brasil tem como meta restaurar até 40 milhões de hectares de áreas degradadas e transformá-las em sistemas produtivos sustentáveis, fortalecendo a segurança alimentar e a preservação ambiental. A mensagem positiva é: Áreas degradadas podem voltar a produzir sem prejudicar a natureza.",
        categoria: "Desenvolvimento",
        imagem: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format&fit=crop",
        data: "Abril/2026",
        tags: ["Investimento", "Desenvolvimento Sustentável", "Restauração", "Segurança Alimentar"]
    },
    {
        id: 4,
        titulo: "Novo decreto fortalece adaptação climática na agricultura familiar",
        descricao: "Governo moderniza programa Garantia-Safra e cria estratégia nacional de adaptação climática para aumentar resistência às mudanças climáticas.",
        conteudo: "O governo modernizou o programa Garantia-Safra e criou uma estratégia nacional de adaptação climática para aumentar a resistência da agricultura familiar às mudanças climáticas. A mensagem positiva é: Mais segurança para pequenos produtores enfrentarem secas e eventos climáticos extremos.",
        categoria: "Política Agrícola",
        imagem: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop",
        data: "26/03/2026",
        tags: ["Agricultura Familiar", "Mudanças Climáticas", "Garantia-Safra", "Adaptação"]
    },
    {
        id: 5,
        titulo: "Campanha Nacional incentiva produção de alimentos orgânicos",
        descricao: "XXII Campanha Nacional de Promoção do Produto Orgânico destaca práticas agrícolas sustentáveis que preservam solo, água e biodiversidade.",
        conteudo: "A XXII Campanha Nacional de Promoção do Produto Orgânico destaca práticas agrícolas sustentáveis que preservam o solo, a água e a biodiversidade, além de promover alimentos mais saudáveis para a população. A mensagem positiva é: Cresce o incentivo à produção sustentável e à alimentação saudável.",
        categoria: "Orgânicos",
        imagem: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop",
        data: "26/05/2026",
        tags: ["Orgânicos", "Alimentação Saudável", "Sustentabilidade", "Biodiversidade"]
    },
    {
        id: 6,
        titulo: "Plano Safra 2026/2027 deve ampliar incentivos à sustentabilidade no campo",
        descricao: "Governo federal anuncia que Plano Safra 2026/2027 priorizará práticas sustentáveis no agronegócio brasileiro.",
        conteudo: "O governo federal anunciou que o Plano Safra 2026/2027 deverá priorizar práticas sustentáveis no agronegócio brasileiro. Entre as medidas previstas estão incentivos para recuperação de pastagens degradadas, fortalecimento do seguro rural, adoção de tecnologias de baixa emissão de carbono e melhoria da gestão de riscos climáticos nas propriedades rurais.",
        categoria: "Política Agrícola",
        imagem: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop",
        data: "17/03/2026",
        tags: ["Plano Safra", "Sustentabilidade", "Carbono", "Gestão de Riscos"]
    }
];

// ============================================================================
// 4. QUIZ - PERGUNTAS DE MÚLTIPLA ESCOLHA
// ============================================================================
// Função: Armazena todas as perguntas do quiz (múltipla escolha e verdadeiro/falso)

const perguntas = [
    { texto: "O que significa agricultura sustentável?", tipo: "mc", alternativas: ["Produzir o máximo possível sem considerar impactos ambientais", "Produzir alimentos preservando os recursos naturais para as futuras gerações", "Substituir toda a tecnologia por métodos tradicionais", "Utilizar apenas fertilizantes químicos"], correta: 1 },
    { texto: "Qual é o principal objetivo da sustentabilidade no agronegócio?", tipo: "mc", alternativas: ["Aumentar apenas os lucros", "Reduzir a produção agrícola", "Equilibrar produção, desenvolvimento econômico e preservação ambiental", "Eliminar toda atividade pecuária"], correta: 2 },
    { texto: "Qual tecnologia permite monitorar lavouras por imagens aéreas?", tipo: "mc", alternativas: ["Trator", "Colheitadeira", "Drone", "Arado"], correta: 2 },
    { texto: "O que é agricultura de precisão?", tipo: "mc", alternativas: ["Produção feita manualmente", "Uso de tecnologia para aplicar recursos de forma eficiente", "Agricultura sem irrigação", "Produção apenas em estufas"], correta: 1 },
    { texto: "O sistema ILPF significa:", tipo: "mc", alternativas: ["Integração de Lavoura, Pecuária e Floresta", "Investimento Local para Produção Familiar", "Integração Logística de Produção Florestal", "Instituto de Lavoura Permanente Federal"], correta: 0 },
    { texto: "Qual benefício a recuperação de pastagens degradadas oferece?", tipo: "mc", alternativas: ["Aumento do desmatamento", "Redução da produtividade", "Produção maior sem necessidade de abrir novas áreas", "Menor fertilidade do solo"], correta: 2 },
    { texto: "Qual recurso natural é essencial para a agricultura?", tipo: "mc", alternativas: ["Petróleo", "Ouro", "Água", "Carvão mineral"], correta: 2 },
    { texto: "O uso de bioinsumos ajuda a:", tipo: "mc", alternativas: ["Aumentar a poluição", "Reduzir impactos ambientais", "Eliminar totalmente os microrganismos", "Substituir a irrigação"], correta: 1 },
    { texto: "As mudanças climáticas podem causar:", tipo: "mc", alternativas: ["Secas mais frequentes", "Alterações nas chuvas", "Eventos climáticos extremos", "Todas as alternativas"], correta: 3 },
    { texto: "Qual destes é um dos maiores produtores agrícolas do mundo?", tipo: "mc", alternativas: ["Brasil", "Portugal", "Chile", "Bélgica"], correta: 0 },
    { texto: "A sustentabilidade busca preservar os recursos naturais para as futuras gerações.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 0 },
    { texto: "Produzir mais sempre significa ocupar mais terras.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 1 },
    { texto: "A agricultura de precisão reduz desperdícios.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 0 },
    { texto: "A preservação ambiental prejudica necessariamente a produtividade agrícola.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 1 },
    { texto: "Drones podem ser utilizados para monitorar plantações.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 0 },
    { texto: "A recuperação de áreas degradadas contribui para a sustentabilidade.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 0 },
    { texto: "O Brasil possui importantes biomas que precisam ser preservados.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 0 },
    { texto: "O uso inadequado do solo pode causar erosão.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 0 },
    { texto: "A tecnologia não tem relação com a sustentabilidade agrícola.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 1 },
    { texto: "A educação ambiental ajuda na conservação dos recursos naturais.", tipo: "vf", alternativas: ["Verdadeiro", "Falso"], correta: 0 }
];

// ============================================================================
// 5. QUIZ - PERGUNTAS DISCURSIVAS
// ============================================================================
// Função: Armazena perguntas discursivas para avaliação manual

const perguntasDiscursivas = [
    { texto: "O que é sustentabilidade no agronegócio?", respostaEsperada: "É a produção de alimentos e matérias-primas de forma economicamente viável, socialmente justa e ambientalmente responsável." },
    { texto: "Como a tecnologia contribui para um agro mais sustentável?", respostaEsperada: "Por meio de drones, sensores, inteligência artificial, GPS e agricultura de precisão." },
    { texto: "Cite dois benefícios da Integração Lavoura-Pecuária-Floresta (ILPF).", respostaEsperada: "Recuperação do solo e redução das emissões de carbono." },
    { texto: "Por que a preservação da água é importante para a agricultura?", respostaEsperada: "Porque a água é essencial para o crescimento das plantas e produção de alimentos." },
    { texto: "Qual é a importância dos biomas brasileiros para o equilíbrio ambiental?", respostaEsperada: "Preservam a biodiversidade, regulam o clima e protegem recursos hídricos." },
    { texto: "Como produzir mais alimentos sem aumentar o desmatamento?", respostaEsperada: "Utilizando tecnologias modernas e recuperação de pastagens degradadas." },
    { texto: "Qual a relação entre sustentabilidade e economia no agronegócio?", respostaEsperada: "Práticas sustentáveis reduzem custos e aumentam a eficiência produtiva." },
    { texto: "De que forma as mudanças climáticas afetam a produção agrícola?", respostaEsperada: "Provocam secas, enchentes e alterações no regime de chuvas." },
    { texto: "O produtor rural pode contribuir para a preservação ambiental? Como?", respostaEsperada: "Sim, mantendo áreas de preservação e adotando práticas sustentáveis." },
    { texto: "Explique a frase: 'Produzir mais com menos impacto ambiental.'", respostaEsperada: "Aumentar a produção utilizando menos recursos naturais e reduzindo desperdícios." },
    { texto: "Qual é o maior desafio para o futuro do agronegócio mundial?", respostaEsperada: "Produzir alimentos para uma população crescente preservando os recursos naturais." }
];

// ============================================================================
// 6. QUIZ - LÓGICA PRINCIPAL
// ============================================================================
// Função: Controla a navegação, exibição e avaliação do quiz

// Combina todas as perguntas em um único array
const todasPerguntas = [...perguntas, ...perguntasDiscursivas];
let respostasUsuario = new Array(todasPerguntas.length).fill(null); // Armazena respostas do usuário
let perguntaAtual = 0;        // Índice da pergunta atual (começa na 0)
let quizFinalizado = false;    // Indica se o quiz já foi finalizado

// Função: Renderiza a pergunta atual na tela
function renderizarPergunta() {
    if (quizFinalizado) return; // Sai se o quiz já acabou
    
    const pergunta = todasPerguntas[perguntaAtual];
    const containerPergunta = document.getElementById('quizPergunta');
    const containerAlternativas = document.getElementById('quizAlternativas');
    const contador = document.getElementById('quizContador');
    const btnAnterior = document.getElementById('quizBtnAnterior');
    const btnProximo = document.getElementById('quizBtnProximo');
    const progressoBar = document.getElementById('quizProgressoBar');
    
    // Atualiza contador e barra de progresso
    contador.textContent = `Pergunta ${perguntaAtual + 1} de ${todasPerguntas.length}`;
    progressoBar.style.width = `${((perguntaAtual + 1) / todasPerguntas.length) * 100}%`;
    containerPergunta.textContent = pergunta.texto;
    
    // Verifica o tipo da pergunta (múltipla escolha, verdadeiro/falso ou discursiva)
    if (pergunta.tipo === 'mc' || pergunta.tipo === 'vf') {
        // Renderiza alternativas como botões clicáveis
        const letras = ['A', 'B', 'C', 'D'];
        containerAlternativas.innerHTML = pergunta.alternativas.map((alt, idx) => `
            <div class="quiz-alternativa ${respostasUsuario[perguntaAtual] === idx ? 'selected' : ''}" data-valor="${idx}">
                <div class="quiz-letra">${letras[idx]}</div>
                <div class="quiz-texto">${alt}</div>
            </div>
        `).join('');
        
        // Adiciona evento de clique para cada alternativa
        document.querySelectorAll('.quiz-alternativa').forEach(el => {
            el.addEventListener('click', () => {
                if (!quizFinalizado) {
                    const valor = parseInt(el.dataset.valor);
                    respostasUsuario[perguntaAtual] = valor; // Salva resposta
                    // Remove seleção de todas e marca a atual
                    document.querySelectorAll('.quiz-alternativa').forEach(alt => alt.classList.remove('selected'));
                    el.classList.add('selected');
                }
            });
        });
    } else {
        // Renderiza campo de texto para perguntas discursivas
        containerAlternativas.innerHTML = `
            <textarea id="respostaDiscursiva" rows="4" style="width:100%; padding:12px; border-radius:12px; border:1px solid rgba(0,68,204,0.3); background:rgba(255,255,255,0.8); font-family:'Nunito',sans-serif; font-size:14px;" placeholder="Digite sua resposta aqui...">${respostasUsuario[perguntaAtual] || ''}</textarea>
        `;
        const textarea = document.getElementById('respostaDiscursiva');
        if (textarea) {
            textarea.addEventListener('input', (e) => {
                respostasUsuario[perguntaAtual] = e.target.value; // Salva resposta
            });
        }
    }

    // Habilita/desabilita botão anterior (primeira pergunta não tem anterior)
    btnAnterior.disabled = perguntaAtual === 0;
    
    // Muda texto do botão para "Finalizar" na última pergunta
    if (perguntaAtual === todasPerguntas.length - 1) {
        btnProximo.textContent = 'Finalizar';
    } else {
        btnProximo.textContent = 'Próxima ▶';
    }
}

// Função: Avalia o quiz e exibe pontuação final
function avaliarQuiz() {
    let pontuacao = 0;
    
    // Avalia perguntas de múltipla escolha (resposta exata)
    for (let i = 0; i < perguntas.length; i++) {
        if (respostasUsuario[i] !== null && respostasUsuario[i] === perguntas[i].correta) {
            pontuacao++;
        }
    }
    
    // Avalia perguntas discursivas (resposta com mais de 15 caracteres)
    for (let i = 0; i < perguntasDiscursivas.length; i++) {
        const resposta = respostasUsuario[perguntas.length + i];
        if (resposta && resposta.length > 15) {
            pontuacao++;
        }
    }
    
    // Define o nível do usuário baseado na pontuação
    let nivel = "";
    if (pontuacao <= 10) { nivel = "Iniciante 🌱"; }
    else if (pontuacao <= 20) { nivel = "Conhecedor 🚜"; }
    else if (pontuacao <= 30) { nivel = "Especialista em Sustentabilidade 🌳"; }
    else { nivel = "Mestre do Agro Sustentável 🌎🌾"; }
    
    // Exibe resultado no DOM
    const resultadoDiv = document.getElementById('quizResultado');
    resultadoDiv.style.display = 'block';
    resultadoDiv.innerHTML = `
        <div class="quiz-pontuacao">🎯 Pontuação: ${pontuacao} de ${todasPerguntas.length}</div>
        <div class="quiz-nivel" style="background: linear-gradient(135deg, #52c41a20, #1890ff20);">🏅 ${nivel}</div>
        <p style="margin-top:15px;">Parabéns! Você completou o quiz sobre Agro Sustentável!</p>
        <button id="reiniciarQuiz" class="quiz-btn" style="margin-top:15px;">🔄 Refazer Quiz</button>
    `;
    
    // Botão para reiniciar o quiz
    document.getElementById('reiniciarQuiz')?.addEventListener('click', () => {
        respostasUsuario = new Array(todasPerguntas.length).fill(null); // Limpa respostas
        perguntaAtual = 0;
        quizFinalizado = false;
        resultadoDiv.style.display = 'none';
        renderizarPergunta(); // Reinicia da primeira pergunta
    });
    
    quizFinalizado = true; // Marca quiz como finalizado
}

// Evento do botão "Próxima" ou "Finalizar"
document.getElementById('quizBtnProximo')?.addEventListener('click', () => {
    if (quizFinalizado) return;
    
    if (perguntaAtual === todasPerguntas.length - 1) {
        avaliarQuiz(); // Finaliza e avalia
    } else {
        perguntaAtual++;
        renderizarPergunta(); // Avança para próxima
    }
});

// Evento do botão "Anterior"
document.getElementById('quizBtnAnterior')?.addEventListener('click', () => {
    if (quizFinalizado) return;
    if (perguntaAtual > 0) {
        perguntaAtual--;
        renderizarPergunta(); // Volta para pergunta anterior
    }
});

// ============================================================================
// 7. NOTÍCIAS - MODAL E COMPARTILHAMENTO
// ============================================================================
// Função: Gerencia abertura, fechamento e compartilhamento de notícias

let noticiaAtual = null;    // Armazena a notícia que está sendo visualizada
let charts = {};            // Objeto para armazenar instâncias dos gráficos
let mapaMundial = null;     // Instância do mapa Leaflet

// Renderiza o grid de notícias na página
function renderizarNoticias() {
    const grid = document.getElementById('noticiasGrid');
    if (!grid) return;
    grid.innerHTML = noticias.map(noticia => `
        <div class="noticia-card" onclick="abrirModal(${noticia.id})">
            <img class="noticia-imagem" src="${noticia.imagem}" alt="${noticia.titulo}" loading="lazy">
            <div class="noticia-conteudo">
                <span class="noticia-categoria">${noticia.categoria}</span>
                <h3>${noticia.titulo.length > 55 ? noticia.titulo.substring(0, 55) + '...' : noticia.titulo}</h3>
                <p>${noticia.descricao.length > 90 ? noticia.descricao.substring(0, 90) + '...' : noticia.descricao}</p>
                <div class="noticia-data">${noticia.data}</div>
            </div>
        </div>
    `).join('');
}

// Abre o modal com os detalhes da notícia
function abrirModal(id) {
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;
    noticiaAtual = noticia;
    const modal = document.getElementById('modalNoticia');
    document.getElementById('modalImagem').src = noticia.imagem;
    document.getElementById('modalTitulo').textContent = noticia.titulo;
    document.getElementById('modalMeta').innerHTML = `<div class="modal-meta-item">📅 ${noticia.data}</div><div class="modal-meta-item">🏷️ ${noticia.categoria}</div>`;
    document.getElementById('modalConteudo').textContent = noticia.conteudo;
    document.getElementById('modalTags').innerHTML = noticia.tags.map(tag => `<span class="modal-tag">#${tag}</span>`).join('');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Impede scroll da página
}

// Compartilha a notícia (navegador ou clipboard)
function compartilharNoticia() {
    if (noticiaAtual) {
        const texto = `${noticiaAtual.titulo}\n\n${noticiaAtual.descricao}`;
        if (navigator.share) {
            navigator.share({ title: noticiaAtual.titulo, text: noticiaAtual.descricao });
        } else {
            navigator.clipboard.writeText(texto);
            alert('📋 Texto copiado para a área de transferência!');
        }
    }
}

// Fecha o modal e restaura o scroll
function fecharModal() {
    document.getElementById('modalNoticia').style.display = 'none';
    document.body.style.overflow = 'auto';
    noticiaAtual = null;
}

// Fecha modal ao clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target === document.getElementById('modalNoticia')) fecharModal();
}

// ============================================================================
// 8. MAPA INTERATIVO (LEAFLET)
// ============================================================================
// Função: Inicializa o mapa mundial com marcadores de países

function inicializarMapaMundial() {
    const mapaDiv = document.getElementById('mapaMundialInterativo');
    if (!mapaDiv) return;

    // Dados dos países (nome, coordenadas, cor, produção, etc.)
    const paises = [
        { nome: "Brasil", lat: -14.2350, lng: -51.9253, cor: "#2e7d32", producao: "Maior produtor de soja, café e carne", areaAgricola: "31,3%", preservacao: "65,6% de vegetação nativa", sustentabilidade: "Líder em bioenergia e ILPF" },
        { nome: "Estados Unidos", lat: 37.0902, lng: -95.7129, cor: "#1565c0", producao: "Maior produtor de milho e soja do mundo", areaAgricola: "44,5%", preservacao: "Agricultura de precisão avançada", sustentabilidade: "Líder em biocombustíveis" },
        { nome: "China", lat: 35.8617, lng: 104.1954, cor: "#f9a825", producao: "Maior produtor de arroz e trigo", areaAgricola: "54,7%", preservacao: "Expansão da agricultura orgânica", sustentabilidade: "Maior investimento em agritech" },
        { nome: "Índia", lat: 20.5937, lng: 78.9629, cor: "#ef6c00", producao: "Maior produtor de leite e especiarias", areaAgricola: "60,4%", preservacao: "Crescimento da agricultura regenerativa", sustentabilidade: "Líder em agricultura orgânica" },
        { nome: "Alemanha", lat: 51.1657, lng: 10.4515, cor: "#1565c0", producao: "Maior produtor europeu de batata e centeio", areaAgricola: "47,8%", preservacao: "Referência em agricultura sustentável", sustentabilidade: "Líder em energia renovável no campo" },
        { nome: "França", lat: 46.2276, lng: 2.2137, cor: "#1565c0", producao: "Maior produtor de vinho e trigo da UE", areaAgricola: "52,3%", preservacao: "Agricultura ecológica em expansão", sustentabilidade: "Redução de 50% de pesticidas" }
    ];

    // Inicializa o mapa com centro no globo e zoom 2
    mapaMundial = L.map('mapaMundialInterativo').setView([20, 0], 2);

    // Camada base do mapa (estilo claro)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB' 
    }).addTo(mapaMundial);

    // Camada de imagens de satélite (opcional)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
        attribution: 'Tiles &copy; Esri', 
        maxZoom: 12 
    }).addTo(mapaMundial);

    // Adiciona marcadores para cada país
    paises.forEach(pais => {
        // Ícone personalizado (círculo colorido)
        const customIcon = L.divIcon({ 
            html: `<div style="background-color: ${pais.cor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`, 
            iconSize: [12, 12], 
            className: 'custom-marker' 
        });
        const marker = L.marker([pais.lat, pais.lng], { icon: customIcon }).addTo(mapaMundial);
        // Popup com informações detalhadas
        marker.bindPopup(`<div style="min-width:260px"><h3 style="color:${pais.cor}">${pais.nome}</h3><hr><p><strong>🚜 Produção:</strong> ${pais.producao}</p><p><strong>🌾 Área Agrícola:</strong> ${pais.areaAgricola}</p><p><strong>🌿 Preservação:</strong> ${pais.preservacao}</p><p><strong>🌱 Sustentabilidade:</strong> ${pais.sustentabilidade}</p></div>`);
    });
 
    // Adiciona escala ao mapa
    L.control.scale({ metric: true, imperial: true }).addTo(mapaMundial);
}

// ============================================================================
// 9. GRÁFICOS (CHART.JS)
// ============================================================================
// Função: Renderiza todos os gráficos da página

function renderizarTodosGraficos() {
    // Gráfico 1: Top 5 Produtores (Barras)
    const ctx1 = document.getElementById('chartTopProdutores').getContext('2d');
    new Chart(ctx1, { 
        type: 'bar', 
        data: { 
            labels: ['China', 'Estados Unidos', 'Brasil', 'Índia', 'Rússia'], 
            datasets: [{ 
                label: 'Produção Alimentícia (Milhões de toneladas/ano)', 
                data: [620, 580, 470, 410, 280], 
                backgroundColor: ['#f9a825', '#1565c0', '#2e7d32', '#ef6c00', '#4a148c'] 
            }] 
        }, 
        options: { responsive: true, maintainAspectRatio: false } 
    });

    // Gráfico 2: Sustentabilidade por Continente (Doughnut/Rosca)
    const ctx2 = document.getElementById('chartContinentes').getContext('2d');
    new Chart(ctx2, { 
        type: 'doughnut', 
        data: { 
            labels: ['Europa (68%)', 'América do Norte (55%)', 'América do Sul (42%)', 'Ásia (38%)', 'Oceania (35%)', 'África (25%)'], 
            datasets: [{ data: [68, 55, 42, 38, 35, 25], backgroundColor: ['#1565c0', '#2e7d32', '#f9a825', '#ef6c00', '#4a148c', '#ff8c00'] }] 
        }, 
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } } 
    });

    // Gráfico 3: Emissões por Setor (Pizza)
    const ctx3 = document.getElementById('chartEmissoes').getContext('2d');
    new Chart(ctx3, { 
        type: 'pie', 
        data: { 
            labels: ['Energia (34%)', 'Indústria (24%)', 'Agricultura (18%)', 'Transporte (16%)', 'Resíduos (8%)'], 
            datasets: [{ data: [34, 24, 18, 16, 8], backgroundColor: ['#ef6c00', '#1565c0', '#2e7d32', '#f9a825', '#4a148c'] }] 
        }, 
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } } 
    });

    // Gráfico 4: Investimentos Globais (Linha)
    const ctx4 = document.getElementById('chartInvestimentosGlobais').getContext('2d');
    new Chart(ctx4, { 
        type: 'line', 
        data: { 
            labels: ['2022', '2023', '2024', '2025', '2026 (Proj)'], 
            datasets: [{ 
                label: 'Investimentos em Agricultura Sustentável (US$ Bi)', 
                data: [85, 102, 128, 156, 195], 
                borderColor: '#2e7d32', 
                backgroundColor: 'rgba(46,125,50,0.1)', 
                fill: true, 
                tension: 0.3 
            }] 
        }, 
        options: { responsive: true, maintainAspectRatio: false } 
    });

    // Gráfico 5: Recuperação de Solos (Barras horizontais)
    const ctx5 = document.getElementById('chartRecuperacaoSolos').getContext('2d');
    new Chart(ctx5, { 
        type: 'bar', 
        data: { 
            labels: ['América do Sul', 'África', 'Ásia', 'Europa', 'América do Norte'], 
            datasets: [{ label: 'Hectares recuperados (Milhões)', data: [28, 22, 18, 12, 8], backgroundColor: '#2e7d32' }] 
        }, 
        options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y' } // Barras na horizontal
    });
}

// ============================================================================
// 10. NAVEGAÇÃO ENTRE ABAS
// ============================================================================
// Função: Controla a exibição das diferentes seções do site

const menuPrincipal = document.getElementById('menuPrincipal');
const barraWidgets = document.getElementById('barraWidgets');
const noticiasContainer = document.getElementById('noticiasContainer');
const botoesMenu = document.querySelectorAll('.botao-aero');      // Botões do menu principal
const botoesVoltar = document.querySelectorAll('.btn-voltar');    // Botões de voltar
const janelas = document.querySelectorAll('.janela-conteudo');    // Todas as janelas de conteúdo

// Ao clicar em um botão do menu, exibe a janela correspondente
botoesMenu.forEach(botao => {
    botao.addEventListener('click', () => {
        const alvo = botao.getAttribute('data-target'); // Obtém o ID da janela alvo
        const janelaAlvo = document.getElementById(alvo);
        if(janelaAlvo) {
            // Esconde menu, widgets e notícias
            menuPrincipal.classList.add('escondido');
            barraWidgets.classList.add('escondido');
            noticiasContainer.classList.add('escondido');
            // Exibe a janela selecionada
            janelaAlvo.style.display = 'block';
            // Inicializa conteúdo específico conforme a janela
            if(alvo === 'janela-mapeamento') {
                setTimeout(() => { renderizarTodosGraficos(); inicializarMapaMundial(); }, 100);
            }
            if(alvo === 'janela-interatividade') {
                setTimeout(() => { renderizarPergunta(); }, 100);
            }
        }
    });
});

// Ao clicar em "Voltar", retorna ao menu principal
botoesVoltar.forEach(btn => {
    btn.addEventListener('click', () => {
        janelas.forEach(j => j.style.display = 'none');      // Esconde todas as janelas
        menuPrincipal.classList.remove('escondido');         // Mostra menu
        barraWidgets.classList.remove('escondido');          // Mostra widgets
        noticiasContainer.classList.remove('escondido');     // Mostra notícias
    });
});

// ============================================================================
// 11. RELÓGIO E CLIMA (WIDGETS)
// ============================================================================
// Função: Exibe horário atual e temperatura em tempo real

// Atualiza o relógio a cada segundo
function atualizarRelogio() {
    const agora = new Date();
    const relogioEl = document.getElementById('relogio');
    if(relogioEl) relogioEl.textContent = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}:${String(agora.getSeconds()).padStart(2, '0')}`;
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Busca temperatura via API Open-Meteo (coordenadas de Curitiba - PR)
async function buscarClima() {
    const climaEl = document.getElementById('clima');
    if (!climaEl) return;
    try {
        const resposta = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-25.4284&longitude=-49.2733&current_weather=true');
        const dados = await resposta.json();
        const temp = Math.round(dados.current_weather.temperature);
        climaEl.textContent = `${temp}°C`; // Atualiza temperatura
    } catch { 
        climaEl.textContent = "24°C"; // Fallback caso a API falhe
    }
}
buscarClima();
setInterval(buscarClima, 15 * 60 * 1000); // Atualiza a cada 15 minutos

// ============================================================================
// 12. INICIALIZAÇÃO
// ============================================================================
// Inicia o grid de notícias quando a página carrega
renderizarNoticias();

// MODO ESCURO
function toggleModoEscuro() {
    document.body.classList.toggle('modo-escuro');
    const modoEscuroAtivo = document.body.classList.contains('modo-escuro');
    localStorage.setItem('modoEscuro', modoEscuroAtivo);
    
    // Mudar ícone do botão
    const btnModoEscuro = document.getElementById('btnModoEscuro');
    if (btnModoEscuro) {
        btnModoEscuro.innerHTML = modoEscuroAtivo ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    }
}

// Carregar preferência do usuário
if (localStorage.getItem('modoEscuro') === 'true') {
    document.body.classList.add('modo-escuro');
}

// Adicionar botão no menu de acessibilidade
document.getElementById('btnModoEscuro')?.addEventListener('click', toggleModoEscuro);

// ============================================================================
// 13. PASSATEMPOS
// ============================================================================
// Parte lógica dos passatempos, incluindo controle de música e jogo de decisões

// ========== CONTROLE DE VISIBILIDADE DOS CONTROLES DE MÚSICA ==========
        // Referências aos elementos do DOM para controle de visibilidade
        const musicControlsDiv = document.getElementById('musicControls');
        const conquistasDetalheDiv = document.getElementById('conquistasDetalhe');

        // Função para esconder/mostrar os controles de música
        function toggleMusicControlsVisibility(shouldHide) {
            if (shouldHide) {
                musicControlsDiv.classList.add('hidden');      // Adiciona classe para esconder
            } else {
                musicControlsDiv.classList.remove('hidden');   // Remove classe para mostrar
            }
        }

        // Abre o painel de conquistas e esconde os controles de música
        function abrirPainelConquistas() {
            conquistasDetalheDiv.classList.add('open');        // Adiciona classe para abrir o painel
            toggleMusicControlsVisibility(true);               // Esconde controles de música
        }

        // Fecha o painel de conquistas e mostra os controles de música
        function fecharPainelConquistas() {
            conquistasDetalheDiv.classList.remove('open');     // Remove classe para fechar o painel
            toggleMusicControlsVisibility(false);              // Mostra controles de música
        }

        // Eventos para abrir/fechar o painel de conquistas
        document.getElementById("nivelMiniCard").addEventListener("click", abrirPainelConquistas);
        document.getElementById('fecharConquistasBtn').addEventListener('click', fecharPainelConquistas);

        // ========== MÚSICA DE FUNDO ==========
        // Cria o objeto de áudio com caminho para o arquivo de música
        const audio = new Audio('/ASSETS/passatempo.mp3');
        audio.loop = true;      // Reproduz em loop contínuo
        audio.volume = 0.5;     // Volume inicial em 50%

        let isPlaying = false;   // Estado da reprodução (tocando ou pausado)

        // Alterna entre play e pause
        function togglePlayPause() {
            if (isPlaying) {
                audio.pause();                                 // Pausa a música
                document.getElementById('playPauseBtn').innerHTML = '▶️';  // Muda ícone para play
            } else {
                audio.play().catch(e => console.log('Autoplay blocked - user interaction needed')); // Inicia a reprodução
                document.getElementById('playPauseBtn').innerHTML = '⏸️';  // Muda ícone para pause
            }
            isPlaying = !isPlaying;  // Inverte o estado
        }

        // Ajusta o volume da música
        function setVolume(value) {
            audio.volume = value / 100;  // Converte valor 0-100 para 0-1
        }

        // Tenta iniciar a música automaticamente ao primeiro clique do usuário
        document.body.addEventListener('click', function initAudio() {
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    document.getElementById('playPauseBtn').innerHTML = '⏸️';
                }).catch(() => {});
            }
            document.body.removeEventListener('click', initAudio);  // Remove após executar uma vez
        });

        // Eventos dos controles de música
        document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
        document.getElementById('volumeSlider').addEventListener('input', (e) => setVolume(e.target.value));

        // ========== ESCOLHA SEU CAMINHO - JOGO DE DECISÕES ==========
        // Array com as 6 perguntas, opções, respostas corretas e feedbacks
        const perguntasCaminho = [
            { texto: "🌾 Sua lavoura está sofrendo com a seca. O que fazer?", opcoes: ["A) Instalar irrigação eficiente", "B) Ignorar o problema"], correta: 0, feedback: ["✅ Excelente! A irrigação eficiente economiza água e mantém a produção.", "❌ Infelizmente, ignorar a seca leva à perda total da safra."], pontos: [1, 0] },
            { texto: "🐛 Você identificou pragas na plantação. Qual a melhor abordagem sustentável?", opcoes: ["A) Usar agrotóxicos em excesso", "B) Implementar controle biológico com inimigos naturais"], correta: 1, feedback: ["❌ Agrotóxicos em excesso contaminam o solo e a água.", "✅ Correto! O controle biológico é sustentável e não agride o meio ambiente."], pontos: [0, 1] },
            { texto: "🌳 Uma área de mata nativa em sua propriedade pode ser desmatada para plantio. O que fazer?", opcoes: ["A) Desmatar para aumentar a produção", "B) Preservar a mata e buscar outras áreas degradadas para recuperar"], correta: 1, feedback: ["❌ O desmatamento causa perda de biodiversidade e erosão do solo.", "✅ Perfeito! Preservar a mata e recuperar áreas degradadas é o caminho sustentável."], pontos: [0, 1] },
            { texto: "💧 O solo da sua fazenda está mostrando sinais de erosão. Qual atitude tomar?", opcoes: ["A) Ignorar e continuar plantando", "B) Adotar plantio direto e curvas de nível"], correta: 1, feedback: ["❌ Ignorar a erosão piora a perda de solo e nutrientes.", "✅ Ótimo! O plantio direto e as curvas de nível previnem a erosão."], pontos: [0, 1] },
            { texto: "♻️ Você tem resíduos orgânicos na propriedade. Qual destino mais sustentável?", opcoes: ["A) Queimar ou descartar em aterro", "B) Transformar em adubo através da compostagem"], correta: 1, feedback: ["❌ Queimar libera CO₂ e desperdiça nutrientes.", "✅ Excelente! A compostagem recicla nutrientes e enriquece o solo."], pontos: [0, 1] },
            { texto: "🌱 Como aumentar a produtividade sem expandir a área cultivada?", opcoes: ["A) Desmatar novas áreas", "B) Investir em tecnologia e integração lavoura-pecuária-floresta (ILPF)"], correta: 1, feedback: ["❌ Desmatar é insustentável e prejudicial ao meio ambiente.", "✅ Perfeito! A ILPF aumenta a produtividade de forma sustentável."], pontos: [0, 1] }
        ];

        // Variáveis de controle do jogo
        let perguntaAtualCaminho = 0, pontuacaoCaminho = 0, respostasDadasCaminho = new Array(6).fill(false), jogoFinalizadoCaminho = false;

        // Carrega a pergunta atual do jogo
        function carregarPerguntaCaminho() {
            if (jogoFinalizadoCaminho || perguntaAtualCaminho >= perguntasCaminho.length) { finalizarJogoCaminho(); return; }
            const pergunta = perguntasCaminho[perguntaAtualCaminho];
            document.getElementById('perguntaTexto').innerHTML = pergunta.texto;
            const opcoesContainer = document.getElementById('opcoesContainer');
            opcoesContainer.innerHTML = '';
            pergunta.opcoes.forEach((opcao, idx) => {
                const btn = document.createElement('button');
                btn.className = 'btn-caminho';
                btn.innerHTML = opcao;
                btn.onclick = () => responderCaminho(idx);
                opcoesContainer.appendChild(btn);
            });
            document.getElementById('resultadoCaminho').innerHTML = '';
            document.getElementById('btnProximaPergunta').style.display = 'none';
        }

        // Processa a resposta do usuário
        function responderCaminho(resposta) {
            if (jogoFinalizadoCaminho || respostasDadasCaminho[perguntaAtualCaminho]) return;
            const pergunta = perguntasCaminho[perguntaAtualCaminho];
            const isCorrect = (resposta === pergunta.correta);
            if (isCorrect) pontuacaoCaminho += pergunta.pontos[resposta];
            respostasDadasCaminho[perguntaAtualCaminho] = true;
            document.getElementById('caminhoPontuacao').innerText = pontuacaoCaminho;
            const resultadoDiv = document.getElementById('resultadoCaminho');
            resultadoDiv.innerHTML = pergunta.feedback[resposta];
            resultadoDiv.style.background = isCorrect ? '#4caf50' : '#f44336';
            resultadoDiv.style.color = 'white';
            document.getElementById('btnProximaPergunta').style.display = 'block';
        }

        // Avança para a próxima pergunta ou finaliza
        function proximaPergunta() {
            if (jogoFinalizadoCaminho) return;
            perguntaAtualCaminho++;
            if (perguntaAtualCaminho < perguntasCaminho.length) carregarPerguntaCaminho();
            else finalizarJogoCaminho();
        }

        // Finaliza o jogo e exibe pontuação final
        function finalizarJogoCaminho() {
            jogoFinalizadoCaminho = true;
            const porcentagem = (pontuacaoCaminho / 6) * 100;
            let mensagem = pontuacaoCaminho === 6 ? "🏆 PARABÉNS! Você é um MESTRE em sustentabilidade agrícola!" : pontuacaoCaminho >= 4 ? "🌱 Muito bem! Continue assim!" : pontuacaoCaminho >= 2 ? "📚 Bom trabalho! Estude mais!" : "🌍 Continue aprendendo!";
            document.getElementById('resultadoCaminho').innerHTML = `<strong>🎉 JOGO FINALIZADO! 🎉</strong><br><br>📊 Pontuação: ${pontuacaoCaminho} de 6 (${Math.round(porcentagem)}%)<br>${mensagem}<br><br><button class="btn-reiniciar-caminho" onclick="reiniciarCaminho()" style="margin-top:10px;">🔄 Jogar Novamente</button>`;
            document.getElementById('resultadoCaminho').style.background = '#2e7d32';
            document.getElementById('opcoesContainer').innerHTML = '';
            document.getElementById('btnProximaPergunta').style.display = 'none';
            if (!quizCompleto && pontuacaoCaminho === 6) { quizCompleto = true; verificarTodas(); }
        }

        // Reinicia o jogo
        function reiniciarCaminho() { perguntaAtualCaminho = 0; pontuacaoCaminho = 0; respostasDadasCaminho = new Array(6).fill(false); jogoFinalizadoCaminho = false; document.getElementById('caminhoPontuacao').innerText = '0'; carregarPerguntaCaminho(); }

        // ========== SISTEMA DE CONQUISTAS E NÍVEL ==========
        // Objeto que controla quais conquistas já foram obtidas
        let conquistasFeitas = { c1: false, c2: false, c3: false, c4: false };
        let nivelAtual = 0;  // 0 = Aprendiz, 1 = Defensor, 2 = Especialista, 3 = Herói do Agro
        const niveisNomes = ["🌾 Aprendiz", "🛡️ Defensor da Natureza", "🎓 Especialista", "🌟 Herói do Agro"];

        // Atualiza a interface do usuário com o nível atual
        function atualizarUI_Nivel() {
            let progresso = (nivelAtual / 3) * 100;  // Barra de progresso (0 a 100%)
            document.getElementById("nivelMiniNome").innerHTML = niveisNomes[nivelAtual];
            document.getElementById("nivelMiniBarra").style.width = progresso + "%";
            let iconeMap = {0:"🌾",1:"🛡️",2:"🎓",3:"🌟"};
            document.getElementById("nivelMiniIcone").innerHTML = iconeMap[nivelAtual];
            document.getElementById("detalheNivelNome").innerHTML = niveisNomes[nivelAtual];
            document.getElementById("detalheNivelBarra").style.width = progresso + "%";
            let proxTexto = nivelAtual < 3 ? `Próximo: ${niveisNomes[nivelAtual+1]}` : "🏆 MÁXIMO! Lenda do agro!";
            document.getElementById("detalheNivelProx").innerHTML = proxTexto;
            document.getElementById("conq1").classList.toggle("obtida", conquistasFeitas.c1);
            document.getElementById("conq2").classList.toggle("obtida", conquistasFeitas.c2);
            document.getElementById("conq3").classList.toggle("obtida", conquistasFeitas.c3);
            document.getElementById("conq4").classList.toggle("obtida", conquistasFeitas.c4);
        }

        // Desbloqueia uma conquista e atualiza o nível
        function desbloquearConquista(id) { if(conquistasFeitas[id]) return; conquistasFeitas[id] = true; let novas = Object.values(conquistasFeitas).filter(Boolean).length; let novoNivel = Math.min(3, Math.floor(novas)); if(novoNivel > nivelAtual) { nivelAtual = novoNivel; atualizarUI_Nivel(); if(nivelAtual === 3) document.getElementById("popupMax").classList.add("show"); } else { atualizarUI_Nivel(); } }
        function fecharPopup() { document.getElementById("popupMax").classList.remove("show"); }

        // Flags para controlar quais jogos foram completados
        let dragCompleto = false, cacaCompleto = false, quizCompleto = false, produtorCompleto = false, tourCompleto = false;
        function verificarTodas() { if(dragCompleto && !conquistasFeitas.c1) desbloquearConquista("c1"); if(cacaCompleto && !conquistasFeitas.c2) desbloquearConquista("c2"); if(quizCompleto && !conquistasFeitas.c3) desbloquearConquista("c3"); if(produtorCompleto && tourCompleto && !conquistasFeitas.c4) desbloquearConquista("c4"); }

        // ========== PRODUTOR SUSTENTÁVEL ==========
        // Estado do jogo do produtor sustentável
        let prodEstado = { lucro:0, amb:0, sust:0, ano:1 };
        
        // Atualiza a interface do jogo Produtor Sustentável
        function atualizarProdUI() {
            document.getElementById('lucroValor').innerText = prodEstado.lucro;
            document.getElementById('ambientalValor').innerText = prodEstado.amb;
            document.getElementById('sustentavelValor').innerText = prodEstado.sust;
            document.getElementById('anoAtual').innerText = prodEstado.ano;
            document.getElementById('progressoBar').style.width = ((prodEstado.ano-1)/10*100)+'%';
            let estacoes = ["🌱 Primavera","☀️ Verão","🍂 Outono","❄️ Inverno"];
            let idx = (prodEstado.ano-1)%4;
            document.getElementById('estacaoTexto').innerHTML = estacoes[idx];
            document.getElementById('fazendaEmoji').innerHTML = ["🌾🚜🌳","🌻🐄🌲","🍎🌽🌿","🌲🦌❄️"][idx];
        }
        
        // Executa uma ação do produtor (boa ou ruim)
        function acaoProdutor(tipo) {
            if(prodEstado.ano > 10) { document.getElementById('resultadoProdutor').innerHTML = "🎮 Jogo finalizado! Reinicie."; return; }
            let msg="";
            if(tipo==='recuperar'){ prodEstado.lucro+=15; prodEstado.amb+=20; prodEstado.sust+=15; msg="🌱 Pastagens recuperadas!"; }
            else if(tipo==='arvores'){ prodEstado.lucro+=10; prodEstado.amb+=25; prodEstado.sust+=20; msg="🌳 Árvores plantadas!"; }
            else if(tipo==='drones'){ prodEstado.lucro+=20; prodEstado.amb+=10; prodEstado.sust+=15; msg="🛸 Drones em ação!"; }
            else if(tipo==='agua'){ prodEstado.lucro+=10; prodEstado.amb+=15; prodEstado.sust+=20; msg="💧 Irrigação eficiente!"; }
            else if(tipo==='compostagem'){ prodEstado.lucro+=12; prodEstado.amb+=18; prodEstado.sust+=18; msg="♻️ Compostagem!"; }
            else if(tipo==='desmatar'){ prodEstado.lucro+=25; prodEstado.amb-=30; prodEstado.sust-=25; msg="🔥 Desmatamento!"; }
            else if(tipo==='desperdicar'){ prodEstado.lucro-=10; prodEstado.amb-=20; prodEstado.sust-=15; msg="💦 Água desperdiçada!"; }
            else if(tipo==='inadequado'){ prodEstado.lucro-=5; prodEstado.amb-=25; prodEstado.sust-=20; msg="⚠️ Uso inadequado!"; }
            prodEstado.ano++; atualizarProdUI();
            document.getElementById('resultadoProdutor').innerHTML = `<strong>📊 ${msg}</strong><br>💰 Lucro:${prodEstado.lucro} 🌿Amb:${prodEstado.amb} 🌱Sust:${prodEstado.sust}<br>📅 Ano ${prodEstado.ano-1}`;
            if(prodEstado.ano > 10) { if(!produtorCompleto){ produtorCompleto=true; verificarTodas(); } }
        }
        
        // Reinicia o jogo do produtor sustentável
        function resetarJogoProdutor() { prodEstado = { lucro:0, amb:0, sust:0, ano:1 }; produtorCompleto=false; atualizarProdUI(); document.getElementById('resultadoProdutor').innerHTML = "🌾 Jogo reiniciado!"; }

        // ========== DRAG AND DROP (COM SUPORTE PARA DISPOSITIVOS MÓVEIS) ==========
        // Variáveis do jogo de arrastar e soltar
        let dragScore = 0, dragItens = [];
        let itemSendoArrastado = null;  // Para controle no mobile
        let offsetX = 0, offsetY = 0;   // Para posicionamento no mobile

        // Inicializa os eventos de drag and drop (desktop e mobile)
        function initDrag() {
            // Configuração para desktop (mouse)
            document.querySelectorAll('.item-drag').forEach(el => {
                el.setAttribute('draggable', 'true');
                
                // Eventos para desktop
                el.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        nome: el.dataset.nome,
                        cat: el.dataset.cat,
                        html: el.outerHTML
                    }));
                    el.style.opacity = '0.5';
                });
                
                el.addEventListener('dragend', e => {
                    el.style.opacity = '1';
                });
                
                // ===== EVENTOS PARA DISPOSITIVOS MÓVEIS (TOQUE) =====
                el.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    itemSendoArrastado = this;
                    const rect = this.getBoundingClientRect();
                    const touch = e.touches[0];
                    offsetX = touch.clientX - rect.left;
                    offsetY = touch.clientY - rect.top;
                    this.style.position = 'fixed';
                    this.style.zIndex = '9999';
                    this.style.opacity = '0.8';
                    this.style.width = rect.width + 'px';
                    this.style.left = (touch.clientX - offsetX) + 'px';
                    this.style.top = (touch.clientY - offsetY) + 'px';
                });
                
                el.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                    if (!itemSendoArrastado) return;
                    const touch = e.touches[0];
                    itemSendoArrastado.style.left = (touch.clientX - offsetX) + 'px';
                    itemSendoArrastado.style.top = (touch.clientY - offsetY) + 'px';
                    
                    // Verifica sobre qual drop zone está
                    document.querySelectorAll('.drop-zone').forEach(zone => {
                        const rect = zone.getBoundingClientRect();
                        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                            zone.classList.add('drag-over');
                        } else {
                            zone.classList.remove('drag-over');
                        }
                    });
                });
                
                el.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    if (!itemSendoArrastado) return;
                    
                    const touch = e.changedTouches[0];
                    let dropZoneEncontrada = null;
                    
                    // Verifica em qual drop zone o item foi solto
                    document.querySelectorAll('.drop-zone').forEach(zone => {
                        const rect = zone.getBoundingClientRect();
                        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                            dropZoneEncontrada = zone;
                        }
                        zone.classList.remove('drag-over');
                    });
                    
                    // Se encontrou uma drop zone, processa o drop
                    if (dropZoneEncontrada) {
                        const data = {
                            nome: itemSendoArrastado.dataset.nome,
                            cat: itemSendoArrastado.dataset.cat,
                            html: itemSendoArrastado.outerHTML
                        };
                        
                        if (data.cat === dropZoneEncontrada.dataset.zona && !dragItens.includes(data.nome)) {
                            dragItens.push(data.nome);
                            dragScore++;
                            document.getElementById('dragPontos').innerText = dragScore;
                            
                            const dropDiv = document.createElement('div');
                            dropDiv.className = 'drop-item';
                            dropDiv.innerHTML = `${data.html} <button onclick="removerItemDrag(this,'${data.nome}','${data.cat}')">✖</button>`;
                            dropZoneEncontrada.appendChild(dropDiv);
                            itemSendoArrastado.remove();
                            
                            const msgDiv = document.getElementById('dragMsg');
                            msgDiv.innerHTML = '✅ Correto! +1';
                            msgDiv.className = 'feedback-message feedback-correct';
                            msgDiv.style.display = 'block';
                            setTimeout(() => msgDiv.style.display = 'none', 1500);
                            
                            if (dragScore === 6 && !dragCompleto) {
                                dragCompleto = true;
                                verificarTodas();
                            }
                        } else {
                            const msgDiv = document.getElementById('dragMsg');
                            msgDiv.innerHTML = `❌ "${data.nome}" não pertence aqui!`;
                            msgDiv.className = 'feedback-message feedback-wrong';
                            msgDiv.style.display = 'block';
                            setTimeout(() => msgDiv.style.display = 'none', 1500);
                        }
                    }
                    
                    // Restaura o estilo do item
                    itemSendoArrastado.style.position = '';
                    itemSendoArrastado.style.zIndex = '';
                    itemSendoArrastado.style.opacity = '1';
                    itemSendoArrastado.style.left = '';
                    itemSendoArrastado.style.top = '';
                    itemSendoArrastado.style.width = '';
                    itemSendoArrastado = null;
                });
            });
            
            // Configuração das zonas de drop
            document.querySelectorAll('.drop-zone').forEach(zone => {
                // Eventos para desktop
                zone.addEventListener('dragover', e => {
                    e.preventDefault();
                    zone.classList.add('drag-over');
                });
                
                zone.addEventListener('dragleave', () => {
                    zone.classList.remove('drag-over');
                });
                
                zone.addEventListener('drop', e => {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    
                    if (data.cat === zone.dataset.zona && !dragItens.includes(data.nome)) {
                        dragItens.push(data.nome);
                        dragScore++;
                        document.getElementById('dragPontos').innerText = dragScore;
                        const dropDiv = document.createElement('div');
                        dropDiv.className = 'drop-item';
                        dropDiv.innerHTML = `${data.html} <button onclick="removerItemDrag(this,'${data.nome}','${data.cat}')">✖</button>`;
                        zone.appendChild(dropDiv);
                        document.querySelector(`.item-drag[data-nome="${data.nome}"]`)?.remove();
                        
                        const msgDiv = document.getElementById('dragMsg');
                        msgDiv.innerHTML = '✅ Correto! +1';
                        msgDiv.className = 'feedback-message feedback-correct';
                        msgDiv.style.display = 'block';
                        setTimeout(() => msgDiv.style.display = 'none', 1500);
                        
                        if (dragScore === 6 && !dragCompleto) {
                            dragCompleto = true;
                            verificarTodas();
                        }
                    } else {
                        const msgDiv = document.getElementById('dragMsg');
                        msgDiv.innerHTML = `❌ "${data.nome}" não pertence aqui!`;
                        msgDiv.className = 'feedback-message feedback-wrong';
                        msgDiv.style.display = 'block';
                        setTimeout(() => msgDiv.style.display = 'none', 1500);
                    }
                });
            });
        }
        
        // Remove um item da zona de drop e devolve para a área de origem
        function removerItemDrag(btn, nome, cat) {
            let parent = btn.parentElement;
            parent.remove();
            let idx = dragItens.indexOf(nome);
            if (idx !== -1) dragItens.splice(idx, 1);
            dragScore--;
            document.getElementById('dragPontos').innerText = dragScore;
            let container = document.getElementById('itensContainer');
            let novo = document.createElement('div');
            novo.className = 'item-drag';
            novo.setAttribute('data-cat', cat);
            novo.setAttribute('data-nome', nome);
            let emoji = nome.includes('Agricultura') ? '🛸' : nome.includes('Reflore') ? '🌳' : nome.includes('Irrigação') ? '💧' : nome.includes('Queimada') ? '🔥' : nome.includes('Desmatamento') ? '🪓' : '💦';
            novo.innerHTML = `${emoji} ${nome}`;
            novo.setAttribute('draggable', 'true');
            container.appendChild(novo);
            initDrag();
        }
        
        // Reinicia o jogo de drag and drop
        function resetDrag() {
            dragScore = 0;
            dragItens = [];
            dragCompleto = false;
            document.getElementById('dragPontos').innerText = '0';
            document.getElementById('dropSust').innerHTML = '';
            document.getElementById('dropNao').innerHTML = '';
            document.getElementById('itensContainer').innerHTML = `
                <div class="item-drag" data-cat="sustentavel" data-nome="Agricultura de precisão">🛸 Agricultura de precisão</div>
                <div class="item-drag" data-cat="sustentavel" data-nome="Reflorestamento">🌳 Reflorestamento</div>
                <div class="item-drag" data-cat="sustentavel" data-nome="Irrigação eficiente">💧 Irrigação eficiente</div>
                <div class="item-drag" data-cat="nao" data-nome="Queimadas ilegais">🔥 Queimadas ilegais</div>
                <div class="item-drag" data-cat="nao" data-nome="Desmatamento excessivo">🪓 Desmatamento excessivo</div>
                <div class="item-drag" data-cat="nao" data-nome="Desperdício de água">💦 Desperdício de água</div>
            `;
            initDrag();
        }

        // ========== CAÇA AO ERRO ==========
        // Array para armazenar erros já encontrados e pontuação
        let errosEncontradosCaca=[], cacaScore=0;
        const errosInfo={ rio:"💧 Rio Poluído", queimada:"🔥 Queimada", erosao:"⛰️ Erosão", agua:"💦 Desperdício" };
        
        // Função para encontrar um erro ambiental
        function encontrarErroGame(el,tipo){ if(errosEncontradosCaca.includes(tipo)) return; errosEncontradosCaca.push(tipo); cacaScore++; document.getElementById('cacaPontos').innerText=cacaScore; el.classList.add('erro-encontrado'); document.getElementById('erroInfoBox').innerHTML=`<strong>🔍 ${errosInfo[tipo]}</strong> encontrado! (${cacaScore}/4)`; if(cacaScore===4 && !cacaCompleto){ cacaCompleto=true; verificarTodas(); document.getElementById('erroInfoBox').innerHTML="🎉 PARABÉNS! Todos os erros encontrados!"; } }
        
        // Reinicia o jogo da caça ao erro
        function resetCaca(){ errosEncontradosCaca=[]; cacaScore=0; cacaCompleto=false; document.getElementById('cacaPontos').innerText='0'; document.querySelectorAll('.erro').forEach(e=>{ e.classList.remove('erro-encontrado'); e.style.background='rgba(255,0,0,0.5)'; }); document.getElementById('erroInfoBox').innerHTML="🕵️ Clique nas áreas vermelhas!"; }

        // ========== QUIZ VERDADEIRO OU FALSO ==========
        // Array com as 35 perguntas e respostas do quiz
        const perguntasVF = ["A agricultura sustentável busca produzir sem comprometer recursos futuros.","O desmatamento é a única forma de aumentar produção.","Agricultura de precisão usa GPS e drones.","Uso consciente da água é importante.","Mudanças climáticas não afetam produção agrícola.","Recuperar pastagens evita abrir novas áreas.","Preservar matas ciliares protege rios.","Erosão do solo prejudica produtividade.","Brasil possui biomas a serem preservados.","Desperdício de água contribui para sustentabilidade.","Drones monitoram lavouras.","Plantio direto conserva solo.","Biodiversidade é irrelevante para agricultura.","Tecnologia reduz desperdícios.","ILPF é prática sustentável.","Produzir mais sempre exige mais terra.","Árvores capturam carbono.","Queimadas ilegais causam danos.","Educação ambiental é importante.","Solo é essencial para agricultura.","Agricultura sustentável equilibra produção e ambiente.","Bioinsumos reduzem químicos.","APPs não têm importância ambiental.","Poluição dos rios afeta produção.","Agronegócio sustentável gera benefícios econômicos e ambientais.","Sensores monitoram umidade do solo.","Preservação impede totalmente agricultura.","Reciclagem de resíduos contribui.","Florestas regulam clima.","Sustentabilidade é só dos agricultores.","Tecnologia aumenta produtividade sem expandir área.","Recuperar áreas degradadas reduz desmatamento.","Mudanças climáticas aumentam secas e enchentes.","Conservação do solo ajuda segurança alimentar.","Produção e preservação são incompatíveis."];
        const respostasVF = [true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,false,true,true,true,true,true,true,false,true,true,true,false,true,true,false,true,true,true,true,false];
        let quizIdx=0, quizPontos=0, quizFinalizadoVF=false;
        
        // Carrega a pergunta atual do quiz
        function carregarQuiz(){ if(quizFinalizadoVF) return; document.getElementById('vfPergunta').innerHTML=`${quizIdx+1}. ${perguntasVF[quizIdx]}`; document.getElementById('vfBar').style.width=`${((quizIdx+1)/35)*100}%`; }
        
        // Processa a resposta do usuário no quiz
        function responderQuiz(resp){ if(quizFinalizadoVF) return; let correto=(resp===respostasVF[quizIdx]); if(correto) quizPontos++; document.getElementById('vfPontos').innerText=quizPontos; let msgDiv=document.getElementById('vfMsg'); msgDiv.innerHTML=correto?"✅ Correto!":`❌ Errado! Resposta: ${respostasVF[quizIdx]?"Verdadeiro":"Falso"}`; msgDiv.style.background=correto?"#4caf50":"#f44336"; setTimeout(()=>{ if(quizIdx<34){ quizIdx++; carregarQuiz(); } else{ quizFinalizadoVF=true; if(!quizCompleto){ quizCompleto=true; verificarTodas(); } msgDiv.innerHTML=`🎉 QUIZ FINALIZADO! Pontos: ${quizPontos}/35. Parabéns!`; msgDiv.style.background="#2e7d32"; } },1200); }
        
        // Reinicia o quiz
        function resetQuiz(){ quizIdx=0; quizPontos=0; quizFinalizadoVF=false; quizCompleto=false; document.getElementById('vfPontos').innerText='0'; document.getElementById('vfBar').style.width='0%'; carregarQuiz(); document.getElementById('vfMsg').innerHTML=""; }

        // ========== TOUR VIRTUAL ==========
        // Array para armazenar áreas já visitadas e pontuação
        let areasVisit=[], tourScore=0;
        const areasDesc={ plantio:"🌾 Área de Plantio - Técnicas sustentáveis.", floresta:"🌳 Reserva Florestal - Preserva biodiversidade.", irrigacao:"💧 Irrigação eficiente - Economiza 40% de água.", drones:"🛸 Drones - Monitoramento preciso.", pastagens:"🌱 Pastagens - Manejo rotacionado.", compostagem:"♻️ Compostagem - Adubo natural." };
        
        // Visita uma área do tour
        function visitarTour(area){ if(!areasVisit.includes(area)){ areasVisit.push(area); tourScore++; document.getElementById('tourPontos').innerText=tourScore; document.getElementById('tourInfo').innerHTML=`📍 ${areasDesc[area]}<br>✅ Área visitada!`; document.getElementById('guiaFala').innerHTML=`Ótimo! ${area==='plantio'?'🌾 O plantio sustentável é a base!':area==='floresta'?'🌳 Preservar é cuidar do futuro!':'💚 Sustentabilidade em ação!'}`; if(tourScore===6 && !tourCompleto){ tourCompleto=true; verificarTodas(); document.getElementById('tourInfo').innerHTML+="<br><br>🏆 Tour completo!"; document.getElementById('guiaFala').innerHTML="🏆 Fantástico! Você conheceu todas as áreas!"; } } else{ document.getElementById('tourInfo').innerHTML=`${areasDesc[area]}<br><br>⚠️ Você já visitou.`; } }
        
        // Reinicia o tour virtual
        function resetTour(){ areasVisit=[]; tourScore=0; tourCompleto=false; document.getElementById('tourPontos').innerText='0'; document.getElementById('tourInfo').innerHTML="🌿 Clique para começar!"; document.getElementById('guiaFala').innerHTML="Bem-vindo ao Tour Virtual! Clique em qualquer área!"; }

        // ========== SIMULADOR ==========
        // Calcula e exibe os resultados do simulador em tempo real
        function simular(){ let a=document.getElementById('arvoresSlider').value,ag=document.getElementById('aguaSlider').value,f=document.getElementById('fertSlider').value,t=document.getElementById('tecSlider').value; document.getElementById('arvVal').innerText=a; document.getElementById('aguaVal').innerText=ag; document.getElementById('fertVal').innerText=f; document.getElementById('tecVal').innerText=t; let prod=(a*0.1+(1000-ag)*0.05+t*2).toFixed(0); let emi=(f*0.5+(1000-a)*0.1).toFixed(0); let sus=((a/10)+t-(f/5)).toFixed(0); document.getElementById('simResultado').innerHTML=`📈 Produção: ${prod} t<br>🌫️ CO₂: ${emi} kg<br>🌱 Sustentabilidade: ${sus}`; }
        
        // Calcula a pegada ecológica com base nos parâmetros fornecidos
        function calcPegada(){ let h=parseInt(document.getElementById('hectares').value)||0, p=0; if(h>200)p+=10; else if(h>100)p+=20; else p+=30; if(document.getElementById('irrigacao').value==='sim')p-=10; if(document.getElementById('areaPres').value==='sim')p+=25; if(document.getElementById('reflor').value==='sim')p+=20; let r=p>=60?'🌱 Baixo Impacto':p>=35?'🌳 Sustentável':'🚜 Em Transição'; document.getElementById('calcRes').innerHTML=`<strong>${r}</strong><br>Pontuação: ${p}/75`; document.getElementById('calcRes').style.background='#4caf50'; document.getElementById('calcRes').style.color='white'; }

        // ========== INFOGRÁFICOS ANIMADOS ==========
        // Anima os números dos infográficos contando progressivamente
        setTimeout(()=>{ let n1=0,n2=0,n3=0; let i=setInterval(()=>{ if(n1<65.6){n1+=1;document.getElementById('inf1').innerText=n1.toFixed(1)+'%';} if(n2<31.3){n2+=0.5;document.getElementById('inf2').innerText=n2.toFixed(1)+'%';} if(n3<28){n3+=0.5;document.getElementById('inf3').innerText=Math.floor(n3);} if(n1>=65.6&&n2>=31.3&&n3>=28)clearInterval(i); },50); },500);

        // ========== EVENTOS E INICIALIZAÇÃO ==========
        // Configuração dos eventos dos botões e inicialização dos jogos
        document.getElementById('btnV').onclick=()=>responderQuiz(true);
        document.getElementById('btnF').onclick=()=>responderQuiz(false);
        document.getElementById('resetQuizBtn').onclick=resetQuiz;
        document.getElementById('arvoresSlider').oninput=simular;
        document.getElementById('aguaSlider').oninput=simular;
        document.getElementById('fertSlider').oninput=simular;
        document.getElementById('tecSlider').oninput=simular;
        document.getElementById('erroRio').onclick=()=>encontrarErroGame(document.getElementById('erroRio'),'rio');
        document.getElementById('erroQueimada').onclick=()=>encontrarErroGame(document.getElementById('erroQueimada'),'queimada');
        document.getElementById('erroErosao').onclick=()=>encontrarErroGame(document.getElementById('erroErosao'),'erosao');
        document.getElementById('erroAgua').onclick=()=>encontrarErroGame(document.getElementById('erroAgua'),'agua');

        // Inicialização de todos os jogos e funcionalidades
        initDrag();                    // Inicia o drag and drop
        carregarQuiz();               // Carrega o quiz verdadeiro/falso
        atualizarProdUI();            // Atualiza a interface do produtor sustentável
        simular();                    // Calcula os valores iniciais do simulador
        atualizarUI_Nivel();          // Atualiza a interface de nível e conquistas
        carregarPerguntaCaminho();    // Carrega a primeira pergunta do jogo "Escolha seu Caminho"