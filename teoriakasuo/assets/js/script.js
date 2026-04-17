// Variável global para armazenar a instância do gráfico
let myChart = null;

function showPage(page) {
    ['turing', 'all', 'comp'].forEach(p => {
        document.getElementById('page-' + p).style.display = 'none';
        document.getElementById('nav-' + p).className = '';
    });
    document.getElementById('page-' + page).style.display = 'flex';
    document.getElementById('nav-' + page).className = 'active-' + page;
    
    // Dispara a renderização do gráfico apenas quando entra na página de complexidade
    if (page === 'comp') {
        // Pequeno delay para garantir que o canvas esteja visível antes de renderizar
        setTimeout(renderChart, 100);
    }
}

// LÓGICA TURING - COMPUTABILIDADE
async function runTuringComp() {
    let val = document.getElementById('in-turing-comp').value.split('');
    let head = 0;
    const st = document.getElementById('st-turing-comp');
    const tape = document.getElementById('tape-turing-comp');

    while (head < val.length) {
        tape.innerHTML = val.map((v, i) => `<div class="cell ${i === head ? 'turing-active' : ''}">${v}</div>`).join('');
        st.textContent = "Computando existência de solução...";
        await new Promise(r => setTimeout(r, 400));
        val[head] = val[head] === '0' ? '1' : '0';
        head++;
    }
    tape.innerHTML = val.map((v, i) => `<div class="cell">${v}</div>`).join('');
    st.textContent = "✔ COMPUTÁVEL: Algoritmo construído e finalizado.";
}

// LÓGICA TURING - COMPLEXIDADE
async function runTuringSize() {
    let val = document.getElementById('in-turing-size').value.split('');
    let head = 0; let steps = 0;
    const st = document.getElementById('st-turing-size');
    const tape = document.getElementById('tape-turing-size');

    while (head < val.length) {
        steps++;
        tape.innerHTML = val.map((v, i) => `<div class="cell ${i === head ? 'warning-active' : ''}">${v}</div>`).join('');
        st.textContent = `Passos: ${steps} | Espaço: ${val.length} | Tempo: ${steps * 400}ms`;
        await new Promise(r => setTimeout(r, 400));
        head++;
    }
    tape.innerHTML = val.map((v, i) => `<div class="cell">${v}</div>`).join('');
    st.innerHTML = `<b>Resultado:</b> Complexidade Linear O(n) medida.`;
}

// LÓGICA ALL - COMPUTABILIDADE
async function runAllComp() {
    let input = document.getElementById('in-all-comp').value;
    let val = ['[', ...input.split(''), ']'];
    let head = 1;
    const st = document.getElementById('st-all-comp');
    const tape = document.getElementById('tape-all-comp');

    st.textContent = "Iniciando validação aⁿbⁿcⁿ...";
    
    while (val.includes('a')) {
        head = val.indexOf('a');
        val[head] = 'X';
        tape.innerHTML = val.map((v, i) => `<div class="cell ${i === head ? 'all-active' : ''}">${v}</div>`).join('');
        st.textContent = "Marcando 'a'...";
        await new Promise(r => setTimeout(r, 400));

        let bIdx = val.indexOf('b');
        if (bIdx === -1) { st.textContent = "✘ Erro: Falta de 'b'. Rejeitado."; return; }
        head = bIdx;
        val[head] = 'X';
        tape.innerHTML = val.map((v, i) => `<div class="cell ${i === head ? 'all-active' : ''}">${v}</div>`).join('');
        st.textContent = "Marcando 'b' correspondente...";
        await new Promise(r => setTimeout(r, 400));

        let cIdx = val.indexOf('c');
        if (cIdx === -1) { st.textContent = "✘ Erro: Falta de 'c'. Rejeitado."; return; }
        head = cIdx;
        val[head] = 'X';
        tape.innerHTML = val.map((v, i) => `<div class="cell ${i === head ? 'all-active' : ''}">${v}</div>`).join('');
        st.textContent = "Marcando 'c' correspondente...";
        await new Promise(r => setTimeout(r, 400));
    }

    if (val.includes('b') || val.includes('c')) {
        st.textContent = "✘ Erro: Quantidades desiguais. Rejeitado.";
    } else {
        st.textContent = "✔ Sucesso: Cadeia aceita pelo ALL!";
    }
}

// LÓGICA ALL - COMPLEXIDADE (ESPAÇO)
async function runAllSpace() {
    let inputVal = document.getElementById('in-all-space').value;
    if (!inputVal) return;

    let val = ['[', ...inputVal.split(''), ']'];
    let head = 1;
    const st = document.getElementById('st-all-space');
    const tape = document.getElementById('tape-all-space');
    
    while (head < val.length - 1) {
        tape.innerHTML = val.map((v, i) => `<div class="cell ${i === head ? 'warning-active' : ''}">${v}</div>`).join('');
        st.textContent = `Célula Atual: ${head} | Memória: ${head}/${inputVal.length}`;
        await new Promise(r => setTimeout(r, 400));
        head++;
    }
    st.innerHTML = `<b>Análise Final:</b> Espaço O(n) confirmado.`;
}

// FUNÇÃO DO GRÁFICO (CHART.JS)
function renderChart() {
    const ctx = document.getElementById('complexityChart').getContext('2d');
    
    // Se já existir um gráfico, destrói para criar um novo (evita bugs visuais)
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 4, 8, 16, 32],
            datasets: [
                { 
                    label: 'O(n) - Linear', 
                    data: [1, 2, 4, 8, 16, 32], 
                    borderColor: '#00ffcc',
                    tension: 0.1 
                },
                { 
                    label: 'O(n²) - Quadrática', 
                    data: [1, 4, 16, 64, 256, 1024], 
                    borderColor: '#ffcc00',
                    tension: 0.1
                },
                { 
                    label: 'O(2ⁿ) - Exponencial', 
                    data: [2, 4, 16, 256, 65536, 4294967296], 
                    borderColor: '#ff0077',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Operações (Escala Log)' }
                },
                x: {
                    title: { display: true, text: 'Tamanho da Entrada (n)' }
                }
            },
            plugins: {
                legend: { labels: { color: '#333' } }
            }
        }
    });
}