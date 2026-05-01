// Elementi del DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const lessonScreen = document.getElementById('lesson-screen');

const scoreDisplay = document.getElementById('score-display');
const questionCountDisplay = document.getElementById('question-count');

// Dashboard Elementi
const modulesContainer = document.getElementById('modules-container');

// Lezione Elementi
const lessonTitle = document.getElementById('lesson-title');
const lessonContent = document.getElementById('lesson-content');
const backToDashBtn = document.getElementById('back-to-dash-btn');
const finishLessonBtn = document.getElementById('finish-lesson-btn');

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

// Variabili di stato
let currentSessionQuestions = [];
let currentQuestionIndex = 0;
let sessionScore = 0;
let currentModule = "";
let userStats = {
    totalScore: 0,
    gamesPlayed: 0,
    unlockedModules: []
};

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
}

function loadStats() {
    try {
        const saved = localStorage.getItem('cppQuizStats');
        if (saved) {
            userStats = JSON.parse(saved);
            if (!userStats.unlockedModules) userStats.unlockedModules = [];
            scoreDisplay.textContent = userStats.totalScore;
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
        userStats = { totalScore: 0, gamesPlayed: 0, unlockedModules: [] };
        saveStats();
        renderDashboard();
    }
}

function showDashboard() {
    lessonScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
    renderDashboard();
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

// --- DEMO INTERATTIVE TEORIA ---
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
    sessionScore = 0;
    currentQuestionIndex = 0;
    
    // Filtra domande solo per questo modulo
    const moduleQuestions = quizQuestions.filter(q => q.category === moduleName);
    
    // Se non ci sono abbastanza domande per il modulo, usa quelle che ci sono
    const shuffled = shuffleArray(moduleQuestions);
    currentSessionQuestions = shuffled.slice(0, Math.min(QUESTIONS_PER_SESSION, shuffled.length));
    
    if(currentSessionQuestions.length === 0) {
        alert("Attenzione: Non ci sono ancora domande per questo modulo!");
        return;
    }
    
    startScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    renderQuestion();
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
}

// Avvio applicazione
init();
