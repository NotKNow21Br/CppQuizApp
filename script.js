// Elementi del DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const lessonScreen = document.getElementById('lesson-screen');
const simulazioneScreen = document.getElementById('simulazione-screen');

const scoreDisplay = document.getElementById('score-display');
const questionCountDisplay = document.getElementById('question-count');

// Dashboard Elementi
const modulesContainer = document.getElementById('modules-container');

// Lezione Elementi
const lessonTitle = document.getElementById('lesson-title');
const lessonContent = document.getElementById('lesson-content');
const backToDashBtn = document.getElementById('back-to-dash-btn');
const finishLessonBtn = document.getElementById('finish-lesson-btn');

// Simulazione Elementi
const openSimulazioneBtn = document.getElementById('open-simulazione-btn');
const backToDashBtnSim = document.getElementById('back-to-dash-btn-sim');

// Quiz Elementi
const questionText = document.getElementById('question-text');
const topicBadge = document.getElementById('topic-badge');
const codeContainer = document.getElementById('code-snippet-container');
const codeSnippet = document.getElementById('code-snippet');
const optionsContainer = document.getElementById('options-container');

const feedbackContainer = document.getElementById('feedback-container');
const feedbackStatus = document.getElementById('feedback-status');
const explanationText = document.getElementById('explanation-text');
const visualExplanation = document.getElementById('visual-explanation');

const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const resetBtn = document.getElementById('reset-btn');

// Aggiunta webhook discord
const WEBHOOK_URL = "https://discord.com/api/webhooks/943692481290182667/3FV4yvjwdpZjkcbtfQIBTghAbRVBFteDCcdjqNQDRbWJHt9HV_zaSAhBGFGp0_dH1Ms3";

// Variabili di stato
let currentSessionQuestions = [];
let currentQuestionIndex = 0;
let sessionScore = 0;
let currentModule = "";
let userStats = {
    name: "",
    contact: "",
    totalScore: 0,
    gamesPlayed: 0,
    unlockedModules: [],
    domandeSuperate: []
};
let sessionTimer = null;
let timeRemaining = 0;

const QUESTIONS_PER_SESSION = 5;

// Inizializzazione
function init() {
    loadStats();
    renderDashboard();
    
    backToDashBtn.addEventListener('click', showDashboard);
    finishLessonBtn.addEventListener('click', completeLesson);
    nextBtn.addEventListener('click', loadNextQuestion);
    restartBtn.addEventListener('click', showDashboard);
    resetBtn.addEventListener('click', resetStats);
    
    // Nuovi listeners
    openSimulazioneBtn.addEventListener('click', openSimulazione);
    backToDashBtnSim.addEventListener('click', () => {
        if(window.demoInterval) clearInterval(window.demoInterval);
        showDashboard();
    });
    
    // Live coding
    document.getElementById('open-live-coding-btn').addEventListener('click', openLiveCoding);
    document.getElementById('back-to-dash-btn-coding').addEventListener('click', () => {
        if(sessionTimer) clearInterval(sessionTimer);
        showDashboard();
    });
    document.getElementById('submit-code-btn').addEventListener('click', submitLiveCoding);
}

function loadStats() {
    try {
        const saved = localStorage.getItem('cppQuizStats');
        if (saved) {
            userStats = Object.assign({ name: "", contact: "", totalScore: 0, gamesPlayed: 0, unlockedModules: [], domandeSuperate: [] }, JSON.parse(saved));
            scoreDisplay.textContent = userStats.totalScore;
            
            // Popola input
            const nameInput = document.getElementById('student-name');
            const contactInput = document.getElementById('student-contact');
            if(nameInput && userStats.name) nameInput.value = userStats.name;
            if(contactInput && userStats.contact) contactInput.value = userStats.contact;
        }
    } catch (e) {
        console.warn("LocalStorage bloccato dal browser su file local.", e);
    }
}

function saveStats() {
    try {
        localStorage.setItem('cppQuizStats', JSON.stringify(userStats));
    } catch (e) {}
    scoreDisplay.textContent = userStats.totalScore;
}

function resetStats() {
    if(confirm("Sei sicuro di voler azzerare tutti i tuoi progressi (inclusi i moduli sbloccati)?")) {
        userStats = { name: "", contact: "", totalScore: 0, gamesPlayed: 0, unlockedModules: [], domandeSuperate: [] };
        saveStats();
        renderDashboard();
    }
}

function showDashboard() {
    lessonScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    simulazioneScreen.classList.remove('active');
    document.getElementById('coding-screen').classList.remove('active');
    startScreen.classList.add('active');
    renderDashboard();
}

function openSimulazione() {
    startScreen.classList.remove('active');
    simulazioneScreen.classList.add('active');
    initSimMatrixDemo();
    initSimVectorDemo();
}

// Render Dashboard
function renderDashboard() {
    modulesContainer.innerHTML = '';
    
    // Iteriamo sugli argomenti disponibili nel database delle lezioni
    Object.keys(lessonsData).forEach(moduleName => {
        const isUnlocked = userStats.unlockedModules.includes(moduleName);
        
        const card = document.createElement('div');
        card.className = 'module-card';
        
        card.innerHTML = `
            <div class="module-title">${moduleName}</div>
            <div class="module-actions">
                <button class="btn-secondary w-full" onclick="openLesson('${moduleName}')">📖 Studia Teoria</button>
                <button class="btn-primary w-full" 
                        ${isUnlocked ? '' : 'disabled'} 
                        onclick="startSession('${moduleName}')"
                        title="${isUnlocked ? 'Inizia Quiz' : 'Devi prima completare la teoria!'}">
                    ${isUnlocked ? '🎯 Avvia Quiz' : '🔒 Quiz Bloccato'}
                </button>
            </div>
        `;
        modulesContainer.appendChild(card);
    });
}

// Gestione Lezione
function openLesson(moduleName) {
    currentModule = moduleName;
    const data = lessonsData[moduleName];
    
    lessonTitle.textContent = data.title;
    lessonContent.innerHTML = data.content;
    
    startScreen.classList.remove('active');
    lessonScreen.classList.add('active');
    
    // Cambia bottone se già sbloccato
    if (userStats.unlockedModules.includes(moduleName)) {
        finishLessonBtn.textContent = "✓ Teoria già completata (Vai alla Dashboard)";
    } else {
        finishLessonBtn.textContent = "Ho Letto e Capito ✓ (Sblocca Quiz)";
    }
    
    // Inizializza animazioni interattive se esistono nella lezione
    if(document.getElementById('interactive-matrix-demo')) initMatrixDemo();
    if(document.getElementById('interactive-vector-demo')) initVectorDemo();
    if(document.getElementById('interactive-buffer-demo')) initBufferDemo();
    if(document.getElementById('interactive-logic-demo')) initLogicDemo();
    if(document.getElementById('interactive-os-demo')) initOSDemo();
    if(document.getElementById('interactive-hamming-demo')) initHammingDemo();
}

function completeLesson() {
    if (!userStats.unlockedModules.includes(currentModule)) {
        userStats.unlockedModules.push(currentModule);
        saveStats();
    }
    // Ferma eventuali animazioni
    if(window.demoInterval) clearInterval(window.demoInterval);
    showDashboard();
}

// --- SIMULAZIONI VERIFICA ---
function initSimMatrixDemo() {
    const container = document.getElementById('sim-matrix-demo');
    container.innerHTML = '<div class="demo-title">Animazione: Ricerca Riga con Somma Massima</div>';
    
    const flexBox = document.createElement('div');
    flexBox.style.display = 'flex';
    flexBox.style.gap = '2rem';
    
    const grid = document.createElement('div');
    grid.className = 'interactive-grid';
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    
    const values = [
        [1, 2, 3, 4],    // sum = 10
        [5, 1, 0, 2],    // sum = 8
        [9, 9, 2, 1],    // sum = 21 (MAX)
        [0, 5, 5, 5]     // sum = 15
    ];
    
    const cells = [];
    for(let i=0; i<4; i++) {
        const row = [];
        for(let j=0; j<4; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = values[i][j];
            grid.appendChild(cell);
            row.push(cell);
        }
        cells.push(row);
    }
    
    const infoPanel = document.createElement('div');
    infoPanel.style.minWidth = '200px';
    infoPanel.innerHTML = `
        <div style="margin-bottom:10px"><strong>Stato Variabili:</strong></div>
        <div id="sim-mat-maxSum" class="code-line">maxSum = -2147483648</div>
        <div id="sim-mat-maxRow" class="code-line">maxRowIndex = 0</div>
        <div id="sim-mat-currSum" class="code-line" style="margin-top:20px; color:var(--secondary)">currentSum = 0</div>
    `;
    
    flexBox.appendChild(grid);
    flexBox.appendChild(infoPanel);
    container.appendChild(flexBox);
    
    const btnPlay = document.createElement('button');
    btnPlay.className = 'btn-secondary mt-4';
    btnPlay.textContent = '▶ Esegui Algoritmo';
    container.appendChild(btnPlay);
    
    let isPlaying = false;
    
    btnPlay.onclick = () => {
        if(isPlaying) return;
        isPlaying = true;
        btnPlay.disabled = true;
        
        let maxSum = -2147483648;
        let maxRowIndex = 0;
        let i = 0;
        let j = 0;
        let currentSum = 0;
        
        const updateUI = () => {
            document.getElementById('sim-mat-maxSum').textContent = `maxSum = ${maxSum}`;
            document.getElementById('sim-mat-maxRow').textContent = `maxRowIndex = ${maxRowIndex}`;
            document.getElementById('sim-mat-currSum').textContent = `currentSum = ${currentSum}`;
        };
        
        updateUI();
        cells.forEach(r => r.forEach(c => c.style.background = ''));
        
        if(window.demoInterval) clearInterval(window.demoInterval);
        
        window.demoInterval = setInterval(() => {
            if(j === 0 && currentSum === 0) {
                // Inizio riga
                cells.forEach(r => r.forEach(c => c.classList.remove('highlight-i')));
                for(let col=0; col<4; col++) cells[i][col].classList.add('highlight-i');
            }
            
            // Highlight current cell
            cells[i].forEach(c => c.classList.remove('highlight-j'));
            cells[i][j].classList.add('highlight-j');
            
            currentSum += values[i][j];
            updateUI();
            
            j++;
            if(j >= 4) {
                // Fine riga
                setTimeout(() => {
                    cells[i][3].classList.remove('highlight-j');
                    if(currentSum > maxSum) {
                        maxSum = currentSum;
                        maxRowIndex = i;
                        updateUI();
                        // Lampeggio per indicare nuovo record
                        document.getElementById('sim-mat-maxSum').style.color = 'var(--success)';
                        setTimeout(() => document.getElementById('sim-mat-maxSum').style.color = '', 500);
                    }
                    currentSum = 0;
                    i++;
                    j = 0;
                    if(i >= 4) {
                        clearInterval(window.demoInterval);
                        setTimeout(() => {
                            cells.forEach(r => r.forEach(c => c.className = 'grid-cell'));
                            for(let col=0; col<4; col++) {
                                cells[maxRowIndex][col].style.background = 'var(--success)';
                                cells[maxRowIndex][col].style.color = '#000';
                            }
                            isPlaying = false;
                            btnPlay.disabled = false;
                        }, 1000);
                    }
                }, 800); // Pausa a fine riga prima di passare alla successiva
            }
        }, 800);
    };
}

function initSimVectorDemo() {
    const container = document.getElementById('sim-vector-demo');
    container.innerHTML = '<div class="demo-title">Animazione: Ricerca Parola Più Lunga</div>';
    
    const flexBox = document.createElement('div');
    flexBox.style.display = 'flex';
    flexBox.style.flexDirection = 'column';
    flexBox.style.gap = '1rem';
    
    const words = ["Gatto", "Elefante", "Cane", "Ippopotamo", "Rana"];
    const grid = document.createElement('div');
    grid.className = 'interactive-grid';
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    
    const cells = [];
    words.forEach((w, index) => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.style.width = 'auto';
        cell.style.padding = '10px';
        cell.innerHTML = `[${index}]<br><strong>${w}</strong><br><small>len: ${w.length}</small>`;
        grid.appendChild(cell);
        cells.push(cell);
    });
    
    const infoPanel = document.createElement('div');
    infoPanel.style.display = 'flex';
    infoPanel.style.gap = '2rem';
    infoPanel.innerHTML = `
        <div id="sim-vec-maxLen" class="code-line">maxLength = ${words[0].length}</div>
        <div id="sim-vec-maxIdx" class="code-line">maxIndex = 0</div>
    `;
    
    flexBox.appendChild(grid);
    flexBox.appendChild(infoPanel);
    container.appendChild(flexBox);
    
    const btnPlay = document.createElement('button');
    btnPlay.className = 'btn-secondary mt-4';
    btnPlay.textContent = '▶ Esegui Algoritmo';
    container.appendChild(btnPlay);
    
    let isPlaying = false;
    
    btnPlay.onclick = () => {
        if(isPlaying) return;
        isPlaying = true;
        btnPlay.disabled = true;
        
        let maxLength = words[0].length;
        let maxIndex = 0;
        let i = 1;
        
        const updateUI = () => {
            document.getElementById('sim-vec-maxLen').textContent = `maxLength = ${maxLength}`;
            document.getElementById('sim-vec-maxIdx').textContent = `maxIndex = ${maxIndex}`;
        };
        
        updateUI();
        cells.forEach(c => {
            c.style.background = '';
            c.style.color = '';
            c.style.border = '1px solid transparent';
            c.classList.remove('highlight-j');
        });
        
        // Highlight iniziale di maxIndex
        cells[0].style.border = '2px solid var(--secondary)';
        
        if(window.demoInterval) clearInterval(window.demoInterval);
        
        window.demoInterval = setInterval(() => {
            cells.forEach((c, idx) => {
                if(idx !== maxIndex) c.style.border = '1px solid transparent';
                c.classList.remove('highlight-j');
            });
            
            cells[i].classList.add('highlight-j');
            
            if(words[i].length > maxLength) {
                cells[maxIndex].style.border = '1px solid transparent';
                maxLength = words[i].length;
                maxIndex = i;
                cells[maxIndex].style.border = '2px solid var(--secondary)';
                updateUI();
            }
            
            i++;
            if(i >= words.length) {
                clearInterval(window.demoInterval);
                setTimeout(() => {
                    cells.forEach(c => c.classList.remove('highlight-j'));
                    cells[maxIndex].style.background = 'var(--secondary)';
                    cells[maxIndex].style.color = '#fff';
                    isPlaying = false;
                    btnPlay.disabled = false;
                }, 1000);
            }
        }, 1200);
    };
}

function initMatrixDemo() {
    const container = document.getElementById('interactive-matrix-demo');
    container.innerHTML = '<div class="demo-title">Esecuzione: for(int i=0...) { for(int j=0...) { ... } }</div>';
    
    const grid = document.createElement('div');
    grid.className = 'interactive-grid';
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    
    const cells = [];
    for(let i=0; i<3; i++) { // 3 righe
        const row = [];
        for(let j=0; j<4; j++) { // 4 colonne
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = `[${i}][${j}]`;
            grid.appendChild(cell);
            row.push(cell);
        }
        cells.push(row);
    }
    container.appendChild(grid);
    
    const codeDisplay = document.createElement('div');
    codeDisplay.className = 'code-line';
    codeDisplay.innerHTML = 'Stato: In attesa...';
    container.appendChild(codeDisplay);
    
    const btnPlay = document.createElement('button');
    btnPlay.className = 'btn-secondary';
    btnPlay.textContent = '▶ Avvia Animazione Ciclo Annidato';
    container.appendChild(btnPlay);
    
    let isPlaying = false;
    
    btnPlay.onclick = () => {
        if(isPlaying) return;
        isPlaying = true;
        btnPlay.disabled = true;
        
        let i = 0; let j = 0;
        
        if(window.demoInterval) clearInterval(window.demoInterval);
        
        window.demoInterval = setInterval(() => {
            // Reset old highlights
            cells.forEach(r => r.forEach(c => {
                c.classList.remove('highlight-j');
                c.classList.remove('highlight-i');
            }));
            
            // Highlight current row (i)
            for(let col=0; col<4; col++) {
                cells[i][col].classList.add('highlight-i');
            }
            
            // Highlight current cell (j)
            cells[i][j].classList.add('highlight-j');
            
            codeDisplay.innerHTML = `Esecuzione: i = <span>${i}</span>, j = <span>${j}</span> -> Accesso a <span>mat[${i}][${j}]</span>`;
            
            j++;
            if(j >= 4) {
                j = 0;
                i++;
                if(i >= 3) {
                    clearInterval(window.demoInterval);
                    codeDisplay.innerHTML = 'Esecuzione completata!';
                    setTimeout(() => {
                        isPlaying = false;
                        btnPlay.disabled = false;
                        cells.forEach(r => r.forEach(c => c.className = 'grid-cell'));
                    }, 2000);
                }
            }
        }, 800);
    };
}

function initVectorDemo() {
    const container = document.getElementById('interactive-vector-demo');
    container.innerHTML = '<div class="demo-title">Memoria Contigua del Vettore</div>';
    
    const grid = document.createElement('div');
    grid.className = 'interactive-grid';
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    
    const words = ["Cane", "Gatto", "Ippopotamo", "Topo", "Elefante"];
    const cells = [];
    
    words.forEach((w, index) => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.style.width = 'auto';
        cell.style.padding = '0 10px';
        cell.innerHTML = `[${index}]<br><small>${w}</small>`;
        grid.appendChild(cell);
        cells.push(cell);
    });
    
    container.appendChild(grid);
    
    const btnPlay = document.createElement('button');
    btnPlay.className = 'btn-secondary';
    btnPlay.textContent = '▶ Cerca la parola più lunga';
    container.appendChild(btnPlay);
    
    let isPlaying = false;
    btnPlay.onclick = () => {
        if(isPlaying) return;
        isPlaying = true;
        btnPlay.disabled = true;
        
        cells.forEach(c => c.className = 'grid-cell');
        
        let maxIndex = 0;
        let currIndex = 1;
        cells[0].style.border = '2px solid var(--primary)'; // Current max
        
        if(window.demoInterval) clearInterval(window.demoInterval);
        
        window.demoInterval = setInterval(() => {
            cells.forEach((c, idx) => {
                if(idx !== maxIndex) c.style.border = '1px solid transparent';
                c.classList.remove('highlight-j');
            });
            
            cells[currIndex].classList.add('highlight-j');
            
            if(words[currIndex].length > words[maxIndex].length) {
                cells[maxIndex].style.border = '1px solid transparent';
                maxIndex = currIndex;
                cells[maxIndex].style.border = '2px solid var(--primary)';
            }
            
            currIndex++;
            if(currIndex >= 5) {
                clearInterval(window.demoInterval);
                setTimeout(() => {
                    cells.forEach(c => c.classList.remove('highlight-j'));
                    cells[maxIndex].classList.add('highlight-j'); // Vincitore finale
                    isPlaying = false;
                    btnPlay.disabled = false;
                }, 1000);
            }
        }, 1000);
    };
}

function initBufferDemo() {
    const container = document.getElementById('interactive-buffer-demo');
    container.innerHTML = '<div class="demo-title">Simulazione Buffer RAM vs Disco</div>';
    
    const flex = document.createElement('div');
    flex.style.display = 'flex';
    flex.style.alignItems = 'center';
    flex.style.gap = '2rem';
    
    const ramBox = document.createElement('div');
    ramBox.innerHTML = '<strong>RAM (Buffer)</strong><br>';
    const bufferGrid = document.createElement('div');
    bufferGrid.className = 'interactive-grid';
    bufferGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    for(let i=0; i<4; i++) {
        const c = document.createElement('div');
        c.className = 'grid-cell';
        bufferGrid.appendChild(c);
    }
    ramBox.appendChild(bufferGrid);
    
    const arrow = document.createElement('div');
    arrow.innerHTML = '➔';
    arrow.style.fontSize = '2rem';
    
    const diskBox = document.createElement('div');
    diskBox.innerHTML = '<strong>Disco Fisso</strong><br>';
    const diskContent = document.createElement('div');
    diskContent.style.width = '100px';
    diskContent.style.height = '60px';
    diskContent.style.border = '2px solid var(--text-muted)';
    diskContent.style.borderRadius = '8px';
    diskContent.style.display = 'flex';
    diskContent.style.alignItems = 'center';
    diskContent.style.justifyContent = 'center';
    diskBox.appendChild(diskContent);
    
    flex.appendChild(ramBox);
    flex.appendChild(arrow);
    flex.appendChild(diskBox);
    
    container.appendChild(flex);
    
    const btnPlay = document.createElement('button');
    btnPlay.className = 'btn-secondary';
    btnPlay.textContent = '▶ Scrivi "C-i-a-o"';
    container.appendChild(btnPlay);
    
    let isPlaying = false;
    btnPlay.onclick = () => {
        if(isPlaying) return;
        isPlaying = true;
        btnPlay.disabled = true;
        
        diskContent.textContent = '';
        const cells = bufferGrid.children;
        for(let c of cells) { c.textContent = ''; c.style.background = 'rgba(255,255,255,0.05)'; }
        
        const chars = ['C', 'i', 'a', 'o'];
        let step = 0;
        
        if(window.demoInterval) clearInterval(window.demoInterval);
        
        window.demoInterval = setInterval(() => {
            if(step < 4) {
                cells[step].textContent = chars[step];
                cells[step].style.background = 'var(--primary)';
            } else if (step === 4) {
                // FLUSH
                for(let c of cells) c.style.background = 'rgba(255,255,255,0.05)';
                diskContent.textContent = "Ciao";
                diskContent.style.background = 'var(--success)';
                diskContent.style.color = '#000';
            } else {
                clearInterval(window.demoInterval);
                setTimeout(() => {
                    diskContent.style.background = 'transparent';
                    diskContent.style.color = '';
                    for(let c of cells) c.textContent = '';
                    isPlaying = false;
                    btnPlay.disabled = false;
                }, 2000);
            }
            step++;
        }, 800);
    };
}

// --- NUOVE SIMULAZIONI ---
function initLogicDemo() {
    const container = document.getElementById('interactive-logic-demo');
    container.innerHTML = '<div class="demo-title">Simulatore Porte Logiche</div>';
    
    const flex = document.createElement('div');
    flex.style.display = 'flex';
    flex.style.gap = '2rem';
    flex.style.alignItems = 'center';
    flex.style.background = 'rgba(0,0,0,0.2)';
    flex.style.padding = '1rem';
    flex.style.borderRadius = '12px';
    
    const inputsBox = document.createElement('div');
    inputsBox.style.display = 'flex';
    inputsBox.style.flexDirection = 'column';
    inputsBox.style.gap = '1rem';
    
    const btnA = document.createElement('button');
    btnA.className = 'btn-secondary';
    btnA.style.minWidth = '80px';
    btnA.textContent = 'A = 0';
    let valA = 0;
    
    const btnB = document.createElement('button');
    btnB.className = 'btn-secondary';
    btnB.style.minWidth = '80px';
    btnB.textContent = 'B = 0';
    let valB = 0;
    
    inputsBox.appendChild(btnA);
    inputsBox.appendChild(btnB);
    
    const gatesBox = document.createElement('div');
    gatesBox.style.display = 'flex';
    gatesBox.style.flexDirection = 'column';
    gatesBox.style.gap = '0.5rem';
    
    const gateSelect = document.createElement('select');
    gateSelect.className = 'form-input';
    gateSelect.style.padding = '0.5rem';
    gateSelect.style.background = 'var(--bg-dark)';
    gateSelect.style.color = 'white';
    gateSelect.style.border = '1px solid var(--primary)';
    gateSelect.style.borderRadius = '6px';
    ['AND', 'OR', 'XOR', 'NAND', 'NOR'].forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = 'Porta ' + g;
        gateSelect.appendChild(opt);
    });
    gatesBox.appendChild(gateSelect);
    
    const arrow = document.createElement('div');
    arrow.innerHTML = '➔';
    arrow.style.fontSize = '2rem';
    
    const outputBox = document.createElement('div');
    outputBox.style.display = 'flex';
    outputBox.style.flexDirection = 'column';
    outputBox.style.alignItems = 'center';
    
    const outLight = document.createElement('div');
    outLight.style.width = '50px';
    outLight.style.height = '50px';
    outLight.style.borderRadius = '50%';
    outLight.style.background = '#333';
    outLight.style.border = '2px solid #555';
    outLight.style.transition = 'all 0.3s ease';
    
    const outLabel = document.createElement('div');
    outLabel.textContent = 'Y = 0';
    outLabel.style.marginTop = '0.5rem';
    outLabel.style.fontWeight = 'bold';
    
    outputBox.appendChild(outLight);
    outputBox.appendChild(outLabel);
    
    flex.appendChild(inputsBox);
    flex.appendChild(gatesBox);
    flex.appendChild(arrow);
    flex.appendChild(outputBox);
    
    container.appendChild(flex);
    
    const updateLogic = () => {
        const gate = gateSelect.value;
        let y = 0;
        if(gate === 'AND') y = valA & valB;
        if(gate === 'OR') y = valA | valB;
        if(gate === 'XOR') y = valA ^ valB;
        if(gate === 'NAND') y = !(valA & valB) ? 1 : 0;
        if(gate === 'NOR') y = !(valA | valB) ? 1 : 0;
        
        outLabel.textContent = 'Y = ' + y;
        if(y === 1) {
            outLight.style.background = 'var(--accent)';
            outLight.style.boxShadow = '0 0 20px var(--accent)';
            outLight.style.borderColor = '#fff';
        } else {
            outLight.style.background = '#333';
            outLight.style.boxShadow = 'none';
            outLight.style.borderColor = '#555';
        }
    };
    
    btnA.onclick = () => {
        valA = valA === 0 ? 1 : 0;
        btnA.textContent = 'A = ' + valA;
        if(valA) { btnA.style.background = 'var(--primary)'; btnA.style.color = '#fff'; }
        else { btnA.style.background = ''; btnA.style.color = ''; }
        updateLogic();
    };
    
    btnB.onclick = () => {
        valB = valB === 0 ? 1 : 0;
        btnB.textContent = 'B = ' + valB;
        if(valB) { btnB.style.background = 'var(--primary)'; btnB.style.color = '#fff'; }
        else { btnB.style.background = ''; btnB.style.color = ''; }
        updateLogic();
    };
    
    gateSelect.onchange = updateLogic;
    updateLogic();
}

function initOSDemo() {
    const container = document.getElementById('interactive-os-demo');
    container.innerHTML = '<div class="demo-title">Simulazione Scheduler: Round Robin</div>';
    
    const flex = document.createElement('div');
    flex.style.display = 'flex';
    flex.style.flexDirection = 'column';
    flex.style.gap = '1rem';
    flex.style.width = '100%';
    
    const cpuBox = document.createElement('div');
    cpuBox.style.padding = '1rem';
    cpuBox.style.background = 'rgba(99, 102, 241, 0.1)';
    cpuBox.style.border = '2px dashed var(--primary)';
    cpuBox.style.borderRadius = '12px';
    cpuBox.style.textAlign = 'center';
    cpuBox.innerHTML = '<strong>CPU (In Esecuzione)</strong><br><span id="os-cpu-proc" style="font-size:1.2rem; color:var(--accent); min-height:30px; display:inline-block">In attesa...</span>';
    
    const queueBox = document.createElement('div');
    queueBox.style.display = 'flex';
    queueBox.style.gap = '0.5rem';
    queueBox.style.justifyContent = 'center';
    queueBox.style.padding = '1rem';
    queueBox.style.background = 'rgba(255,255,255,0.05)';
    queueBox.style.borderRadius = '12px';
    
    flex.appendChild(cpuBox);
    flex.appendChild(queueBox);
    container.appendChild(flex);
    
    const btnPlay = document.createElement('button');
    btnPlay.className = 'btn-secondary mt-4';
    btnPlay.textContent = '▶ Avvia Scheduler';
    container.appendChild(btnPlay);
    
    let isPlaying = false;
    
    btnPlay.onclick = () => {
        if(isPlaying) return;
        isPlaying = true;
        btnPlay.disabled = true;
        
        let procs = [
            { id: 'P1', timeLeft: 3, color: '#f87171' },
            { id: 'P2', timeLeft: 2, color: '#60a5fa' },
            { id: 'P3', timeLeft: 4, color: '#34d399' }
        ];
        
        const renderQueue = () => {
            queueBox.innerHTML = '<strong>Coda Ready:</strong> ';
            if(procs.length === 0) queueBox.innerHTML += 'Vuota';
            procs.forEach(p => {
                const el = document.createElement('div');
                el.style.padding = '5px 10px';
                el.style.background = p.color;
                el.style.color = '#000';
                el.style.borderRadius = '4px';
                el.style.fontWeight = 'bold';
                el.textContent = p.id + ' (' + p.timeLeft + 'q)';
                queueBox.appendChild(el);
            });
        };
        
        renderQueue();
        
        if(window.demoInterval) clearInterval(window.demoInterval);
        
        window.demoInterval = setInterval(() => {
            if(procs.length === 0) {
                document.getElementById('os-cpu-proc').textContent = 'Tutti i processi terminati!';
                clearInterval(window.demoInterval);
                setTimeout(() => {
                    isPlaying = false;
                    btnPlay.disabled = false;
                    document.getElementById('os-cpu-proc').textContent = 'In attesa...';
                    queueBox.innerHTML = '';
                }, 2000);
                return;
            }
            
            // Estrai il primo
            const curr = procs.shift();
            
            // Esecuzione 1 quantum
            document.getElementById('os-cpu-proc').textContent = 'Esecuzione ' + curr.id;
            document.getElementById('os-cpu-proc').style.color = curr.color;
            renderQueue();
            
            setTimeout(() => {
                curr.timeLeft--;
                if(curr.timeLeft > 0) {
                    // Rimetti in coda (Context Switch)
                    procs.push(curr);
                }
                renderQueue();
            }, 800);
            
        }, 1200);
    };
}

function initHammingDemo() {
    const container = document.getElementById('interactive-hamming-demo');
    container.innerHTML = '<div class="demo-title">Posizionamento Bit di Parità (Dati a 4 bit)</div>';
    
    const grid = document.createElement('div');
    grid.style.display = 'flex';
    grid.style.gap = '0.5rem';
    grid.style.marginTop = '1rem';
    grid.style.marginBottom = '1rem';
    
    // Posizioni 1 a 7
    const cells = [];
    for(let i=1; i<=7; i++) {
        const cellBox = document.createElement('div');
        cellBox.style.display = 'flex';
        cellBox.style.flexDirection = 'column';
        cellBox.style.alignItems = 'center';
        
        const label = document.createElement('div');
        label.style.fontSize = '0.8rem';
        label.style.color = 'var(--text-muted)';
        label.textContent = 'P' + i;
        
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.style.width = '40px';
        cell.style.height = '40px';
        cell.textContent = '?';
        
        if(i===1 || i===2 || i===4) {
            cell.style.border = '2px solid var(--accent)';
            label.textContent = 'Par ' + i;
            label.style.color = 'var(--accent)';
        } else {
            label.textContent = 'Dat ' + i;
        }
        
        cellBox.appendChild(label);
        cellBox.appendChild(cell);
        grid.appendChild(cellBox);
        cells[i] = cell;
    }
    
    container.appendChild(grid);
    
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '1rem';
    inputContainer.style.alignItems = 'center';
    
    const dataInput = document.createElement('input');
    dataInput.type = 'text';
    dataInput.maxLength = 4;
    dataInput.value = '1011';
    dataInput.className = 'form-input';
    dataInput.style.width = '80px';
    dataInput.style.padding = '0.5rem';
    dataInput.style.background = 'var(--bg-dark)';
    dataInput.style.color = 'white';
    dataInput.style.border = '1px solid var(--glass-border)';
    
    const btnCalc = document.createElement('button');
    btnCalc.className = 'btn-secondary';
    btnCalc.textContent = 'Calcola Hamming';
    
    inputContainer.appendChild(document.createTextNode('Dati (4 bit): '));
    inputContainer.appendChild(dataInput);
    inputContainer.appendChild(btnCalc);
    container.appendChild(inputContainer);
    
    const infoText = document.createElement('div');
    infoText.style.marginTop = '1rem';
    infoText.style.fontSize = '0.9rem';
    infoText.className = 'code-line';
    infoText.textContent = 'Pronto.';
    container.appendChild(infoText);
    
    btnCalc.onclick = () => {
        const val = dataInput.value;
        if(val.length !== 4 || !/^[01]+$/.test(val)) {
            alert('Inserisci esattamente 4 bit (0 o 1)');
            return;
        }
        
        const d1 = parseInt(val[0]);
        const d2 = parseInt(val[1]);
        const d3 = parseInt(val[2]);
        const d4 = parseInt(val[3]);
        
        cells[3].textContent = d1;
        cells[5].textContent = d2;
        cells[6].textContent = d3;
        cells[7].textContent = d4;
        
        // P1 controlla 1, 3, 5, 7 -> P1 = D1 xor D2 xor D4
        const p1 = d1 ^ d2 ^ d4;
        // P2 controlla 2, 3, 6, 7 -> P2 = D1 xor D3 xor D4
        const p2 = d1 ^ d3 ^ d4;
        // P4 controlla 4, 5, 6, 7 -> P4 = D2 xor D3 xor D4
        const p4 = d2 ^ d3 ^ d4;
        
        cells[1].textContent = p1;
        cells[1].style.color = 'var(--accent)';
        cells[2].textContent = p2;
        cells[2].style.color = 'var(--accent)';
        cells[4].textContent = p4;
        cells[4].style.color = 'var(--accent)';
        
        infoText.innerHTML = `P1 = ${d1}^${d2}^${d4} = <span>${p1}</span><br>P2 = ${d1}^${d3}^${d4} = <span>${p2}</span><br>P4 = ${d2}^${d3}^${d4} = <span>${p4}</span>`;
    };
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Gestione Quiz
function startSession(moduleName) {
    const nameInput = document.getElementById('student-name').value.trim();
    const contactInput = document.getElementById('student-contact').value.trim();
    if(!nameInput || !contactInput) {
        alert("Inserisci Nome e Contatto prima di iniziare!");
        return;
    }
    
    // Salva info studente
    userStats.name = nameInput;
    userStats.contact = contactInput;
    saveStats();

    const timeSelect = document.getElementById('quiz-time').value;
    const questionsCount = timeSelect == 5 ? 5 : (timeSelect == 10 ? 10 : 15);
    const timeInSeconds = timeSelect * 60;

    sessionScore = 0;
    currentQuestionIndex = 0;
    
    // Filtra domande solo per questo modulo e NON già superate
    let moduleQuestions = quizQuestions.filter(q => q.category === moduleName && !userStats.domandeSuperate.includes(q.id));
    
    if(moduleQuestions.length < questionsCount) {
        // Se non ce ne sono abbastanza nuove, peschiamo anche tra quelle vecchie per riempire
        const oldQuestions = quizQuestions.filter(q => q.category === moduleName && userStats.domandeSuperate.includes(q.id));
        moduleQuestions = moduleQuestions.concat(shuffleArray(oldQuestions));
    }
    
    const shuffled = shuffleArray(moduleQuestions);
    currentSessionQuestions = shuffled.slice(0, questionsCount);
    
    if(currentSessionQuestions.length === 0) {
        alert("Attenzione: Non ci sono ancora domande per questo modulo!");
        return;
    }
    
    startScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    startTimer(timeInSeconds, 'quiz-timer-display', endSession);
    renderQuestion();
}

function startTimer(seconds, displayId, onTimeout) {
    if(sessionTimer) clearInterval(sessionTimer);
    timeRemaining = seconds;
    const display = document.getElementById(displayId);
    
    const updateDisplay = () => {
        const m = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
        const s = (timeRemaining % 60).toString().padStart(2, '0');
        if(display) display.textContent = `${m}:${s}`;
        
        if(timeRemaining <= 60 && display) display.style.color = 'var(--danger)';
        else if (display) display.style.color = '';
    };
    
    updateDisplay();
    sessionTimer = setInterval(() => {
        timeRemaining--;
        updateDisplay();
        if(timeRemaining <= 0) {
            clearInterval(sessionTimer);
            alert("Tempo scaduto!");
            onTimeout();
        }
    }, 1000);
}

function renderQuestion() {
    // Reset UI
    feedbackContainer.classList.add('hidden');
    optionsContainer.innerHTML = '';
    visualExplanation.innerHTML = '';
    visualExplanation.classList.add('hidden');
    
    const q = currentSessionQuestions[currentQuestionIndex];
    
    // Aggiorna indicatori
    topicBadge.textContent = q.category;
    questionCountDisplay.textContent = `${currentQuestionIndex + 1}/${currentSessionQuestions.length}`;
    
    // Testo e codice
    questionText.textContent = q.text;
    if (q.codeSnippet) {
        codeSnippet.textContent = q.codeSnippet;
        codeContainer.classList.remove('hidden');
    } else {
        codeContainer.classList.add('hidden');
    }
    
    // Opzioni ABCD
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((optText, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="opt-letter">${letters[index]}</span> <span class="opt-text">${escapeHTML(optText)}</span>`;
        btn.onclick = () => handleAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });

    updateProgressBar();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function handleAnswer(selectedIndex, btnElement) {
    // Disabilita tutti i bottoni
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    const q = currentSessionQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correctAnswer;
    
    // Evidenzia corretta ed errata
    buttons[q.correctAnswer].classList.add('correct');
    if (!isCorrect) {
        btnElement.classList.add('wrong');
    } else {
        sessionScore += 10; // 10 punti a risposta esatta
        if(!userStats.domandeSuperate.includes(q.id)) {
            userStats.domandeSuperate.push(q.id);
            saveStats();
        }
    }
    
    showFeedback(isCorrect, q);
}

function showFeedback(isCorrect, questionData) {
    feedbackContainer.classList.remove('hidden');
    
    if (isCorrect) {
        feedbackStatus.textContent = "✓ Esatto!";
        feedbackStatus.className = "feedback-status status-correct";
    } else {
        feedbackStatus.textContent = "✗ Sbagliato";
        feedbackStatus.className = "feedback-status status-wrong";
    }
    
    explanationText.innerHTML = `<strong>Spiegazione:</strong> ${questionData.explanation}`;
    
    // Spiegazione visiva dinamica
    if (questionData.visualType && questionData.visualType !== "none") {
        renderVisualExplanation(questionData.visualType);
    }
}

function renderVisualExplanation(type) {
    visualExplanation.classList.remove('hidden');
    visualExplanation.innerHTML = '';
    
    if (type === 'buffer') {
        visualExplanation.innerHTML = '<h4>Simulazione Flusso Dati (Buffer RAM)</h4>';
        const bufferDiv = document.createElement('div');
        bufferDiv.className = 'visual-buffer';
        for(let i=0; i<8; i++) {
            const cell = document.createElement('div');
            cell.className = 'buffer-cell';
            cell.textContent = '01';
            // Animazione progressiva
            setTimeout(() => { cell.classList.add('filled'); }, i * 200);
            bufferDiv.appendChild(cell);
        }
        visualExplanation.appendChild(bufferDiv);
        
        const label = document.createElement('p');
        label.style.fontSize = '0.8rem';
        label.style.marginTop = '10px';
        label.innerHTML = "<em>I dati riempiono il buffer in RAM... poi un blocco unico va su disco.</em>";
        visualExplanation.appendChild(label);
    } 
    else if (type === 'matrix') {
        visualExplanation.innerHTML = '<h4>Matrice (Righe e Colonne)</h4>';
        const mat = document.createElement('div');
        mat.className = 'visual-matrix';
        mat.style.gridTemplateColumns = 'repeat(4, 1fr)';
        
        let maxSumRowIndex = 2; // Simuliamo che la riga 2 (terza riga) abbia la somma max
        
        for(let r=0; r<4; r++) {
            for(let c=0; c<4; c++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                let val = Math.floor(Math.random() * 10);
                if(r === maxSumRowIndex) val += 5; // Facciamo in modo che la riga 2 sia più alta
                cell.textContent = val;
                
                if (r === maxSumRowIndex) {
                    setTimeout(() => { cell.classList.add('highlight'); }, c * 150);
                }
                mat.appendChild(cell);
            }
        }
        visualExplanation.appendChild(mat);
        const label = document.createElement('p');
        label.style.fontSize = '0.8rem';
        label.innerHTML = `<em>In giallo: gli elementi di \`m[${maxSumRowIndex}][j]\` che formano la somma maggiore.</em>`;
        visualExplanation.appendChild(label);
    }
}

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentSessionQuestions.length) {
        renderQuestion();
    } else {
        endSession();
    }
}

function updateProgressBar() {
    const progress = document.getElementById('progress-bar');
    const percent = (currentQuestionIndex / currentSessionQuestions.length) * 100;
    progress.style.width = `${percent}%`;
}

function endSession() {
    if(sessionTimer) clearInterval(sessionTimer);
    
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    document.getElementById('final-score-val').textContent = sessionScore;
    
    userStats.totalScore += sessionScore;
    userStats.gamesPlayed++;
    saveStats();
    
    const summary = document.getElementById('summary-container');
    if (sessionScore === currentSessionQuestions.length * 10) {
        summary.innerHTML = "<h3>Ottimo lavoro! 🏆</h3><p>Hai completato il modulo a pieni voti.</p>";
    } else {
        summary.innerHTML = "<h3>Continua ad esercitarti 📚</h3><p>Rileggi la teoria se hai ancora dei dubbi.</p>";
    }
    
    inviaRisultatiDiscord();
}

function inviaRisultatiDiscord() {
    if(!userStats.name) return;
    
    const timeSelect = document.getElementById('quiz-time').value;
    const timeSpent = timeSelect * 60 - timeRemaining;
    const m = Math.floor(timeSpent / 60);
    const s = timeSpent % 60;
    
    const payload = {
        embeds: [{
            title: "📝 Nuovo Quiz Completato",
            color: 0x00F0FF,
            fields: [
                { name: "Studente", value: userStats.name, inline: true },
                { name: "Contatto", value: userStats.contact, inline: true },
                { name: "Argomento", value: currentModule || "Quiz", inline: false },
                { name: "Punteggio", value: `${sessionScore} / ${currentSessionQuestions.length * 10}`, inline: true },
                { name: "Tempo Impiegato", value: `${m}m ${s}s`, inline: true }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).catch(e => console.error("Errore invio webhook:", e));
}

function openLiveCoding() {
    const nameInput = document.getElementById('student-name').value.trim();
    const contactInput = document.getElementById('student-contact').value.trim();
    if(!nameInput || !contactInput) {
        alert("Inserisci Nome e Contatto prima di iniziare il Live Coding!");
        return;
    }
    
    userStats.name = nameInput;
    userStats.contact = contactInput;
    saveStats();
    
    startScreen.classList.remove('active');
    document.getElementById('coding-screen').classList.add('active');
    
    const tracce = [
        "Scrivi un programma in C++ che dichiari una matrice 4x4 di interi, la riempia con numeri casuali da 1 a 10 e calcoli la somma degli elementi sulla diagonale principale.",
        "Scrivi un programma in C++ che chieda all'utente 5 stringhe, le inserisca in un array e poi stampi la parola più corta.",
        "Implementa una struttura 'Studente' e scrivi il codice necessario per salvare un array di 3 studenti all'interno di un file binario chiamato 'classe.dat'."
    ];
    const traccia = tracce[Math.floor(Math.random() * tracce.length)];
    document.getElementById('coding-prompt-text').textContent = traccia;
    
    document.getElementById('code-editor').value = "";
    document.getElementById('coding-status-msg').textContent = "";
    document.getElementById('submit-code-btn').disabled = false;
    
    startTimer(20 * 60, 'coding-timer', submitLiveCoding);
}

function submitLiveCoding() {
    const code = document.getElementById('code-editor').value.trim();
    if(!code && timeRemaining > 0) {
        alert("Scrivi almeno una riga di codice prima di consegnare!");
        return;
    }
    
    if(sessionTimer) clearInterval(sessionTimer);
    
    const traccia = document.getElementById('coding-prompt-text').textContent;
    const btn = document.getElementById('submit-code-btn');
    const msg = document.getElementById('coding-status-msg');
    
    btn.disabled = true;
    msg.textContent = "Invio in corso...";
    msg.style.color = "var(--primary)";
    
    const payload = {
        embeds: [{
            title: "💻 Consegna Live Coding",
            color: 0xFF3EA5,
            fields: [
                { name: "Studente", value: userStats.name, inline: true },
                { name: "Contatto", value: userStats.contact, inline: true },
                { name: "Traccia", value: traccia, inline: false }
            ],
            description: "```cpp\n" + (code || "// Nessun codice inserito") + "\n```",
            timestamp: new Date().toISOString()
        }]
    };

    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(res => {
        if(res.ok) {
            msg.textContent = "✓ Inviato con successo al Tutor!";
            msg.style.color = "var(--success)";
        } else {
            msg.textContent = "✗ Errore durante l'invio.";
            msg.style.color = "var(--danger)";
            btn.disabled = false;
        }
    }).catch(e => {
        msg.textContent = "✗ Errore di rete.";
        msg.style.color = "var(--danger)";
        btn.disabled = false;
    });
}

// Avvio applicazione
init();
