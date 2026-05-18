const lessonsData = {
    "File I/O": {
        title: "File di Testo e File Binari in C++",
        content: `
            <h3>1. La gestione di file in C++</h3>
            <p>I file consentono di conservare permanentemente, su memoria di massa, i nostri dati. Imparare ad usare i file è INDISPENSABILE per poter programmare. Per lavorare con i file su disco è necessario includere l'header <code>&lt;fstream&gt;</code>.</p>
            <p>I file in C++ possono essere di <strong>testo</strong> o <strong>binari</strong>. I file di testo contengono caratteri in formato ASCII (visibili). I file binari memorizzano i dati nello stesso formato in cui sono rappresentati in memoria RAM, garantendo alte prestazioni ma minore portabilità.</p>

            <h3>2. Assegnazione, Dichiarazione e Apertura</h3>
            <p>Il Sistema Operativo gestisce fisicamente il disco. A noi basta usare il "nome logico" dello stream per comunicare con il file.</p>
            <ul>
                <li><code>fstream</code> per I/O combinato.</li>
                <li><code>ofstream</code> per solo Output (scrittura).</li>
                <li><code>ifstream</code> per solo Input (lettura).</li>
            </ul>
            <p>Modalità principali (si combinano con <code>|</code>, es: <code>ios::out | ios::app</code>):</p>
            <ul>
                <li><code>ios::out</code> (crea o tronca in scrittura).</li>
                <li><code>ios::app</code> (append, aggiunge alla fine senza cancellare).</li>
                <li><code>ios::in</code> (lettura).</li>
                <li><code>ios::binary</code> (apre il file in formato binario invece che testo).</li>
            </ul>
            
            <div id="interactive-buffer-demo" class="demo-container"></div>

            <h3>3. File di Testo</h3>
            <p>Si usano come <code>cin</code> e <code>cout</code>. Spazi e a capo fanno da separatori.</p>
            <ul>
                <li><code>f.get(char)</code> legge un singolo carattere.</li>
                <li><code>f >> stringa</code> legge fino al primo spazio.</li>
                <li><code>getline(f, stringa)</code> legge l'intera riga.</li>
                <li><code>f.put(char)</code> scrive un singolo carattere.</li>
                <li><code>f << stringa << endl;</code> scrive una stringa seguita da "a capo".</li>
            </ul>

            <h3>4. File Binari e Record (Struct)</h3>
            <p>I file binari non contengono caratteri ma byte grezzi. Spesso si organizzano in <strong>record</strong> tramite le <code>struct</code>. È obbligatorio usare array di caratteri (<code>char[]</code>) invece di <code>string</code> per mantenere una dimensione in byte FISSA.</p>
            <pre><code class="language-cpp">
typedef struct contatto {
    char nome[30];
    char tel[15];
};
contatto buffer; // Variabile di appoggio in RAM
            </code></pre>
            
            <h4>Lettura e Scrittura Binaria</h4>
            <p>Avvengono un <strong>intero record alla volta</strong> usando le dimensioni esatte (<code>sizeof</code>) della struct e i puntatori (<code>char*</code>).</p>
            <ul>
                <li><code>f.read((char*)&buffer, sizeof(buffer));</code></li>
                <li><code>f.write((char*)&buffer, sizeof(buffer));</code></li>
            </ul>
            <p>Queste operazioni sono rapidissime perché copiano i byte dalla RAM al Disco 1:1.</p>

            <h3>5. Accesso Diretto (seekg, seekp, tellg)</h3>
            <p>I file binari permettono l'accesso diretto (saltare a un punto specifico):</p>
            <ul>
                <li><code>tellg()</code> e <code>tellp()</code> restituiscono la posizione (byte) corrente nel file.</li>
                <li><code>seekg(offset, origine)</code> sposta il cursore di lettura. (Origine: <code>ios::beg</code>, <code>ios::cur</code>, <code>ios::end</code>).</li>
                <li><code>seekp(offset, origine)</code> sposta il cursore di scrittura.</li>
            </ul>
            <p><strong>Esempio Modifica:</strong> Per modificare un record appena letto, devo tornare indietro di un record intero prima di sovrascrivere:</p>
            <pre><code class="language-cpp">
long int pos = f.tellg(); // Dove sono ora?
pos = pos - sizeof(buffer); // Torno indietro di una struct
f.seekp(pos, ios::beg); // Riposiziono il cursore di scrittura
f.write((char*)&buffer, sizeof(buffer)); // Sovrascrivo
            </code></pre>

            <h3>6. Cancellazione Fisica (File di Appoggio)</h3>
            <p>In C++ non esiste un comando magico per "cancellare una riga dal centro". La tecnica standard è:</p>
            <ol>
                <li>Aprire in lettura il file originale.</li>
                <li>Aprire in scrittura un file temporaneo (<code>appo.dat</code>).</li>
                <li>Copiare dal vecchio al nuovo TUTTI i record <strong>TRANNE</strong> quello da cancellare.</li>
                <li>Svuotare il vecchio file e ricopiarvi tutto il file temporaneo.</li>
            </ol>
        `
    },
    "Matrici": {
        title: "Matrici (Array bidimensionali) in C++",
        content: `
            <h3>1. Cos'è una matrice in C++</h3>
            <p>Le matrici non sono altro che array bidimensionali. Se un array è una cassettiera, una matrice è un insieme di cassettiere una a fianco all'altra. Ogni cella è individuata da una COPPIA di coordinate (riga e colonna), proprio come a Battaglia Navale.</p>
            
            <pre><code class="language-cpp">
// Dichiaro una matrice m di int con 4 righe e 5 colonne
int m[4][5];
            </code></pre>
            <p>Gli indici partono da 0. Le righe andranno da 0 a 3, le colonne da 0 a 4. Attenzione a non superare questi limiti (in C++ non avrai errori espliciti, ma andrai a sfasciare altre aree di memoria!).</p>
            
            <div id="interactive-matrix-demo" class="demo-container"></div>

            <h3>2. Lavorare con tutte le celle (Cicli Annidati)</h3>
            <p>La tecnica standard per scorrere una matrice è usare due cicli <code>for</code> annidati.</p>
            <pre><code class="language-cpp">
// Stampa l'intera matrice
for(int i = 0; i < numeroDiRighe; i++) {
    for(int j = 0; j < numeroDiColonne; j++) {
        cout << m[i][j] << " ";
    }
    cout << endl; // A capo dopo ogni riga
}
            </code></pre>

            <h3>3. Inizializzare una matrice</h3>
            <p>Esistono vari modi per riempire la matrice:</p>
            <ul>
                <li><strong>Inizializzazione a zeri:</strong> <code>int m[4][5] = {};</code> (Pone tutte le celle a 0 automaticamente).</li>
                <li><strong>Valori predefiniti:</strong> <code>int m[2][2] = {1, 2, 3, 4};</code>. Verranno caricati ordinatamente (1 e 2 nella prima riga, 3 e 4 nella seconda).</li>
                <li><strong>Da tastiera:</strong> Inserendo il <code>cin >> m[i][j];</code> dentro al doppio ciclo for.</li>
            </ul>
        `
    },
    "Vettori": {
        title: "I Vettori (Array) in C++: Esercizi Pratici",
        content: `
            <h3>1. Caricare e visualizzare un vettore</h3>
            <p>Un array è una sequenza contigua di elementi. L'indice inizia da 0. Ecco come riempirlo con input utente e visualizzarlo.</p>
            <pre><code class="language-cpp">
#include &lt;iostream&gt;
using namespace std;
const int N = 5;

int main() {
    int v[N];
    // Caricamento
    for(int i = 0; i < N; i++) {
        cout << "Inserisci numero: ";
        cin >> v[i];
    }
    // Visualizzazione normale
    for(int i = 0; i < N; i++) cout << v[i] << " ";
    
    // Visualizzazione decrescente (dall'ultimo al primo)
    for(int i = N - 1; i >= 0; i--) cout << v[i] << " ";
    return 0;
}
            </code></pre>

            <div id="interactive-vector-demo" class="demo-container"></div>

            <h3>2. Modificare Condizionalmente</h3>
            <p>Spesso viene chiesto di modificare "gli elementi pari" o "gli elementi in posizione dispari". Bisogna distinguere il <strong>valore</strong> dall'<strong>indice</strong>!</p>
            <pre><code class="language-cpp">
// Modificare i VALORI pari
for (int i = 0; i < N; i++) {
    if (v[i] % 2 == 0) v[i] *= 3; // Moltiplico per 3 il contenuto
}

// Modificare i valori negli INDICI dispari
for (int i = 0; i < N; i++) {
    if (i % 2 != 0) v[i] += 100; // Aggiungo 100
}
            </code></pre>

            <h3>3. Somme e Array Paralleli</h3>
            <p>Un esercizio comune è gestire più array contemporaneamente. Se hai due array <code>a</code> e <code>b</code>, puoi sommarli in un array <code>c</code> con un singolo ciclo!</p>
            <pre><code class="language-cpp">
int a[N], b[N], c[N];
int sommap = 0, sommad = 0;

for (int i = 0; i < N; i++) {
    // Somma di vettori paralleli
    c[i] = a[i] + b[i];
    
    // Somma dei contenuti pari/dispari del vettore a
    if (i % 2 == 0) sommap += a[i]; // Somma valori in posizioni pari
    else sommad += a[i]; // Somma valori in pos. dispari
}
            </code></pre>

            <h3>4. Inserimenti particolari</h3>
            <p>Se voglio inserire al volo un pattern (ad es. i multipli di 3, partendo da 3, 6, 9...)</p>
            <pre><code class="language-cpp">
for (int i = 0; i < N; i++) {
    v[i] = (i + 1) * 3; // All'indice 0 metto 1*3=3. All'indice 1 metto 2*3=6...
}

// Array al rovescio matematicamente:
for (int i = 0; i < N; i++) {
    v[i] = N - 1 - i;
}
            </code></pre>
        `
    },
    "Generazione Numeri": {
        title: "Numeri Casuali: Random Seed",
        content: `
            <h3>1. Pseudocasualità e il Seme (Seed)</h3>
            <p>I computer non sono macchine "casuali", ma deterministiche. Per generare numeri "random", utilizzano complesse equazioni matematiche. Queste equazioni hanno però bisogno di un numero di partenza, chiamato <strong>Seme (Seed)</strong>.</p>
            <p>Se non cambi mai il seme, il computer seguirà la stessa identica equazione ogni volta, restituendoti <strong>la stessa identica sequenza di numeri casuali ad ogni esecuzione del programma!</strong></p>

            <h3>2. srand() e time()</h3>
            <p>Per evitare questo problema, usiamo <code>srand()</code> (Seed Random) per cambiare il seme iniziale all'avvio del programma.</p>
            <p>E quale numero cambia costantemente ogni singolo secondo? <strong>L'orologio del computer!</strong></p>
            <pre><code class="language-cpp">
#include &lt;iostream&gt;
#include &lt;cstdlib&gt;  // Per rand() e srand()
#include &lt;ctime&gt;    // Per time()

using namespace std;

int main() {
    // 1. time(NULL) restituisce i secondi trascorsi dal 1 Gennaio 1970
    // 2. srand() usa questi secondi come seme.
    srand(time(NULL));
    
    // 3. Ora ogni volta che chiamo rand(), la sequenza sarà imprevedibile!
    for(int i = 0; i < 5; i++) {
        cout << rand() % 10 << " "; // Numeri da 0 a 9
    }
    
    return 0;
}
            </code></pre>
        `
    },
    "Circuiti RLC": {
        title: "Circuiti RLC: Analisi Avanzata e Risonanza",
        content: `
            <h3>1. I Componenti Fondamentali</h3>
            <p>I circuiti RLC prendono il nome dai tre componenti passivi fondamentali dell'elettronica lineare:</p>
            <ul>
                <li><strong>Resistore (R)</strong>: Si oppone al passaggio della corrente, dissipando energia sotto forma di calore (Effetto Joule). La sua unità di misura è l'Ohm (Ω). La legge di Ohm (V = R * I) governa il suo comportamento. Non introduce sfasamento tra tensione e corrente.</li>
                <li><strong>Induttore (L)</strong>: È costituito da una bobina di filo conduttore. Immagazzina energia sotto forma di campo magnetico. L'unità di misura è l'Henry (H). In un induttore ideale, la tensione anticipa la corrente di 90°.</li>
                <li><strong>Condensatore (C)</strong>: Formato da due armature conduttrici separate da un dielettrico. Immagazzina energia sotto forma di campo elettrico. L'unità di misura è il Farad (F). In un condensatore ideale, la corrente anticipa la tensione di 90°.</li>
            </ul>

            <h3>2. Reattanza e Impedenza</h3>
            <p>In Corrente Alternata (CA), induttori e condensatori offrono una resistenza al passaggio della corrente che dipende dalla frequenza (<em>f</em>), detta <strong>Reattanza (X)</strong>:</p>
            <ul>
                <li><strong>Reattanza Induttiva (X<sub>L</sub>):</strong> X<sub>L</sub> = 2πfL. Aumenta all'aumentare della frequenza. In CC (f=0) è zero (cortocircuito).</li>
                <li><strong>Reattanza Capacitiva (X<sub>C</sub>):</strong> X<sub>C</sub> = 1 / (2πfC). Diminuisce all'aumentare della frequenza. In CC (f=0) è infinita (circuito aperto).</li>
            </ul>
            <p>La combinazione vettoriale di Resistenza e Reattanza è l'<strong>Impedenza (Z)</strong>, misurata in Ohm. Per un circuito RLC serie, si calcola con il Teorema di Pitagora sui fasori:</p>
            <p style="text-align:center; font-size:1.2rem; margin:1rem 0; padding:10px; background:rgba(0,255,0,0.1); border-radius:5px;"><strong>Z = &radic;(R² + (X<sub>L</sub> - X<sub>C</sub>)²)</strong></p>

            <h3>3. Circuito in Risonanza</h3>
            <p>La risonanza è il fenomeno che si verifica quando la Reattanza Induttiva e quella Capacitiva sono esattamente uguali (X<sub>L</sub> = X<sub>C</sub>). In questa condizione, i loro effetti si annullano a vicenda.</p>
            <p>La frequenza alla quale avviene questo è detta <strong>Frequenza di Risonanza (f<sub>r</sub>)</strong> ed è data dalla formula di Thomson:</p>
            <p style="text-align:center; font-size:1.2rem; margin:1rem 0; padding:10px; background:rgba(0,255,0,0.1); border-radius:5px;"><strong>f<sub>r</sub> = 1 / (2π&radic;(LC))</strong></p>
            <p>In un circuito RLC serie in risonanza, l'impedenza è minima (Z = R) e la corrente raggiunge il suo valore massimo. Questa proprietà è ampiamente utilizzata nei sintonizzatori radio per selezionare una specifica frequenza (stazione) rigettando le altre.</p>
        `
    },
    "Porte Logiche": {
        title: "Porte Logiche, Tabelle di Verità e Algebra di Boole",
        content: `
            <h3>1. L'Algebra di Boole e i Segnali Digitali</h3>
            <p>L'elettronica digitale si basa sull'Algebra di Boole, un sistema matematico in cui le variabili possono assumere solo due valori: <strong>0 (Low/Falso)</strong> e <strong>1 (High/Vero)</strong>. Questi valori vengono manipolati tramite operatori logici fondamentali.</p>

            <h3>2. Tabelle di Verità: AND, OR, NOT</h3>
            <p>Le tre porte logiche basilari. Una <em>tabella di verità</em> elenca tutti i possibili stati degli ingressi (A, B) e il corrispondente stato dell'uscita (Y).</p>
            
            <div style="display:flex; flex-wrap:wrap; gap:2rem; margin-top:1rem;">
                <!-- Tabella AND -->
                <table border="1" style="border-collapse:collapse; text-align:center; min-width:150px;">
                    <caption style="font-weight:bold; margin-bottom:5px;">Porta AND (A · B)</caption>
                    <tr style="background:var(--primary); color:black;"><th>A</th><th>B</th><th>Y</th></tr>
                    <tr><td>0</td><td>0</td><td>0</td></tr>
                    <tr><td>0</td><td>1</td><td>0</td></tr>
                    <tr><td>1</td><td>0</td><td>0</td></tr>
                    <tr><td>1</td><td>1</td><td><strong>1</strong></td></tr>
                </table>

                <!-- Tabella OR -->
                <table border="1" style="border-collapse:collapse; text-align:center; min-width:150px;">
                    <caption style="font-weight:bold; margin-bottom:5px;">Porta OR (A + B)</caption>
                    <tr style="background:var(--secondary); color:white;"><th>A</th><th>B</th><th>Y</th></tr>
                    <tr><td>0</td><td>0</td><td>0</td></tr>
                    <tr><td>0</td><td>1</td><td><strong>1</strong></td></tr>
                    <tr><td>1</td><td>0</td><td><strong>1</strong></td></tr>
                    <tr><td>1</td><td>1</td><td><strong>1</strong></td></tr>
                </table>

                <!-- Tabella NOT -->
                <table border="1" style="border-collapse:collapse; text-align:center; min-width:150px;">
                    <caption style="font-weight:bold; margin-bottom:5px;">Porta NOT (A')</caption>
                    <tr style="background:var(--success); color:black;"><th>A</th><th>Y</th></tr>
                    <tr><td>0</td><td><strong>1</strong></td></tr>
                    <tr><td>1</td><td>0</td></tr>
                </table>
            </div>
            <div id="interactive-logic-demo" class="demo-container"></div>
            <p>L'AND restituisce 1 SOLO SE entrambi gli ingressi sono 1. L'OR restituisce 1 se ALMENO UN ingresso è 1. Il NOT inverte il segnale.</p>

            <h3>3. Porte Logiche Universali e Derivate (NAND, NOR, XOR)</h3>
            <p>Aggiungendo un NOT in cascata a AND e OR, otteniamo <strong>NAND</strong> e <strong>NOR</strong>. Sono dette porte "universali" perché è possibile ricostruire qualsiasi circuito logico usando ESCLUSIVAMENTE porte NAND o ESCLUSIVAMENTE porte NOR.</p>
            
            <div style="display:flex; flex-wrap:wrap; gap:2rem; margin-top:1rem;">
                <!-- Tabella NAND -->
                <table border="1" style="border-collapse:collapse; text-align:center; min-width:150px;">
                    <caption style="font-weight:bold; margin-bottom:5px;">Porta NAND (NOT AND)</caption>
                    <tr style="background:#555; color:white;"><th>A</th><th>B</th><th>Y</th></tr>
                    <tr><td>0</td><td>0</td><td>1</td></tr>
                    <tr><td>0</td><td>1</td><td>1</td></tr>
                    <tr><td>1</td><td>0</td><td>1</td></tr>
                    <tr><td>1</td><td>1</td><td><strong>0</strong></td></tr>
                </table>

                <!-- Tabella NOR -->
                <table border="1" style="border-collapse:collapse; text-align:center; min-width:150px;">
                    <caption style="font-weight:bold; margin-bottom:5px;">Porta NOR (NOT OR)</caption>
                    <tr style="background:#555; color:white;"><th>A</th><th>B</th><th>Y</th></tr>
                    <tr><td>0</td><td>0</td><td><strong>1</strong></td></tr>
                    <tr><td>0</td><td>1</td><td>0</td></tr>
                    <tr><td>1</td><td>0</td><td>0</td></tr>
                    <tr><td>1</td><td>1</td><td>0</td></tr>
                </table>

                <!-- Tabella XOR -->
                <table border="1" style="border-collapse:collapse; text-align:center; min-width:150px;">
                    <caption style="font-weight:bold; margin-bottom:5px;">Porta XOR (OR Esclusivo)</caption>
                    <tr style="background:#f39c12; color:black;"><th>A</th><th>B</th><th>Y</th></tr>
                    <tr><td>0</td><td>0</td><td>0</td></tr>
                    <tr><td>0</td><td>1</td><td><strong>1</strong></td></tr>
                    <tr><td>1</td><td>0</td><td><strong>1</strong></td></tr>
                    <tr><td>1</td><td>1</td><td>0</td></tr>
                </table>
            </div>
            <p>La porta <strong>XOR</strong> restituisce 1 se e solo se gli ingressi sono <em>diversi</em> tra loro. Molto usata nei circuiti sommatori e di parità.</p>

            <h3>4. Teoremi di De Morgan</h3>
            <p>Fondamentali nell'algebra di Boole per semplificare i circuiti logici:</p>
            <ul>
                <li><strong>1° Teorema:</strong> NOT(A AND B) = (NOT A) OR (NOT B). <em>Una porta NAND equivale a un OR con gli ingressi negati.</em></li>
                <li><strong>2° Teorema:</strong> NOT(A OR B) = (NOT A) AND (NOT B). <em>Una porta NOR equivale a un AND con gli ingressi negati.</em></li>
            </ul>
        `
    },
    "Diodi e Ponte di Graetz": {
        title: "Diodi Semiconduttori e Alimentatori (Ponte di Graetz)",
        content: `
            <h3>1. Il Diodo a Semiconduttore</h3>
            <p>Il diodo è un componente passivo non lineare costituito da una giunzione P-N (solitamente Silicio). Consente il flusso di corrente <strong>in un'unica direzione</strong> (dall'Anodo al Catodo), bloccandolo nell'altra.</p>
            <ul>
                <li><strong>Polarizzazione Diretta:</strong> Anodo positivo rispetto al catodo. Superata la tensione di soglia (circa 0.7V per il silicio), il diodo conduce corrente comportandosi come un interruttore chiuso.</li>
                <li><strong>Polarizzazione Inversa:</strong> Anodo negativo. Il diodo non conduce (interruttore aperto). Attenzione: se la tensione inversa supera la <em>Tensione di Breakdown</em>, il componente viene distrutto.</li>
            </ul>

            <h3>2. L'Alimentatore Lineare</h3>
            <p>Per trasformare la corrente alternata di rete (es. 230V CA a 50Hz) in corrente continua (es. 12V CC) servono più stadi:</p>
            <ol>
                <li><strong>Trasformatore:</strong> Abbassa la tensione alternata da 230V a un valore sicuro (es. 12V CA).</li>
                <li><strong>Raddrizzatore (Ponte di Graetz):</strong> Converte la CA in corrente pulsante, obbligando il flusso in una sola direzione.</li>
                <li><strong>Filtro (Condensatore di livellamento):</strong> "Spiana" le pulsazioni per avvicinarsi a una corrente continua costante.</li>
                <li><strong>Stabilizzatore (Regolatore / Diodo Zener):</strong> Mantiene la tensione esattamente al valore desiderato (es. 12.0V) indipendentemente dal carico.</li>
            </ol>

            <h3>3. Il Ponte di Graetz (Raddrizzatore a Doppia Semionda)</h3>
            <p>A differenza di un singolo diodo (che taglia via metà dell'onda), il ponte di Graetz utilizza <strong>4 diodi collegati a rombo</strong>. Il suo scopo è "ribaltare" la semionda negativa facendola diventare positiva.</p>
            <ul>
                <li>Durante la semionda positiva del trasformatore, i diodi D1 e D3 conducono, mentre D2 e D4 sono interdetti (bloccati).</li>
                <li>Durante la semionda negativa, D2 e D4 conducono, mentre D1 e D3 sono interdetti.</li>
            </ul>
            <p>In ogni istante, la corrente attraversa sempre il carico nella <strong>stessa direzione</strong>. Questo produce un segnale costituito solo da semionde positive, raddoppiando l'efficienza rispetto a un raddrizzatore a singola semionda.</p>

            <h3>4. Il Ripple e il Diodo Zener</h3>
            <p>Anche dopo il raddrizzamento e l'uso di un condensatore, rimangono piccole variazioni di tensione (ondulazioni) chiamate <strong>Ripple</strong>. Per eliminarlo completamente si usa un regolatore integrato o un <strong>Diodo Zener</strong>. Lo Zener è un diodo speciale progettato per lavorare <em>in polarizzazione inversa</em>: mantiene una tensione fissa e costante ai suoi capi, offrendo una "tensione di riferimento" perfetta per l'elettronica sensibile.</p>
        `
    },
    "Codici Rilevazione Errore": {
        title: "Codici di Rilevazione dell'Errore",
        content: `
            <h3>1. Perché servono i codici di rilevazione dell'errore?</h3>
            <p>Immagina di dettare il tuo numero di telefono a un amico in un luogo molto rumoroso. Per sicurezza, potresti ripeterlo due volte o chiedergli di rileggertelo. In informatica avviene la stessa cosa: quando i bit (0 e 1) viaggiano su un cavo (bus) o via Wi-Fi, possono subire alterazioni a causa di interferenze elettromagnetiche (rumore). Per evitare che un'informazione sbagliata venga elaborata, aggiungiamo dei <strong>bit di controllo</strong> che agiscono come una sorta di "firma di sicurezza".</p>
            
            <h3>2. Codici Pesati e Non Pesati</h3>
            <p>I codici usati per trasmettere queste informazioni si dividono in due famiglie principali:</p>
            <ul>
                <li><strong>Codici Pesati:</strong> Sono simili al nostro sistema decimale. Ogni posizione del bit ha un "peso" o un valore esatto. Ad esempio, nel binario classico, le posizioni valgono 1, 2, 4, 8. Un esempio famoso è la <strong>Codifica Aiken</strong>.</li>
                <li><strong>Codici Non Pesati:</strong> Il valore dei bit non dipende dalla loro posizione, ma da regole logiche specifiche create per risolvere problemi tecnici. Esempi famosi sono il <strong>Codice Gray</strong> e il <strong>Codice di Hamming</strong>.</li>
            </ul>

            <h3>3. Codifica Aiken (Pesato e Auto-complementante)</h3>
            <p>La codifica Aiken serve per rappresentare le cifre da 0 a 9 usando 4 bit. Ha una proprietà speciale: è <em>simmetrica</em> rispetto al centro. Per i numeri da 5 a 9, sfrutta un trucco logico chiamato <strong>Complemento a 9</strong>.</p>
            <ul>
                <li><strong>Per i numeri da 0 a 4:</strong> Si usa il codice binario classico (es. 2 = 0010, 4 = 0100).</li>
                <li><strong>Per i numeri da 5 a 9:</strong> Si prende il numero, si calcola quanto manca per arrivare a 9, si scrive quel risultato in binario e poi <em>si invertono tutti i bit</em> (cioè si fa il NOT logico).</li>
            </ul>
            <div class="code-container" style="background: rgba(0,0,0,0.3); border-left: 4px solid var(--accent); padding: 10px;">
                <strong>Esempio pratico: Convertiamo il 6 in Aiken</strong><br>
                1. Quanto manca per arrivare a 9? (9 - 6 = 3)<br>
                2. Scrivo il 3 in binario a 4 bit: <code>0011</code><br>
                3. Inverto tutti i bit (0 diventa 1, 1 diventa 0): <code>1100</code>.<br>
                <em>Risultato: Il 6 in Aiken si scrive 1100!</em>
            </div>

            <h3>4. Codice Gray (Non Pesato e Antierrore)</h3>
            <p>I computer a volte si confondono quando troppi bit cambiano tutti insieme in una frazione di secondo. Ad esempio, contando in binario classico da 3 a 4, passiamo da <code>011</code> a <code>100</code>. Sono cambiati ben 3 bit contemporaneamente! Questo può causare "glitch" o letture errate nei sensori hardware.</p>
            <p>Il <strong>Codice Gray</strong> risolve questo problema con una regola d'oro: <strong>tra un numero e il successivo cambia un solo bit alla volta!</strong></p>
            <ul style="font-family: var(--font-code);">
                <li>Decimale 0 &rarr; Gray 000</li>
                <li>Decimale 1 &rarr; Gray 001 (cambia 1 bit)</li>
                <li>Decimale 2 &rarr; Gray 011 (cambia 1 bit)</li>
                <li>Decimale 3 &rarr; Gray 010 (cambia 1 bit)</li>
            </ul>
            <p>Si calcola confrontando i bit tramite porte logiche <strong>XOR</strong>.</p>

            <h3>5. Codice di Hamming e Controllo Parità</h3>
            <p>Il codice di Hamming è un vero colpo di genio: non solo si accorge se un file è corrotto, ma <strong>capisce esattamente quale singolo bit è sbagliato e lo ripara da solo!</strong></p>
            <p>Funziona inserendo dei <em>bit spia</em> (detti bit di parità) in posizioni strategiche, ovvero sulle potenze di due (posizione 1, 2, 4, 8...). Ogni "spia" sorveglia un gruppo specifico di bit di dati tramite le regole della parità. Se in quel gruppo c'è un errore, la spia suona l'allarme.</p>
            <p><strong>Il Trucco Magico:</strong> Se durante la ricezione i bit di controllo 2 e 4 segnalano un errore... basta fare la somma! 2 + 4 = 6. Significa che il bit corrotto (passato da 0 a 1 o viceversa) è esattamente quello in <strong>posizione 6</strong>. Il computer andrà alla posizione 6 e invertirà il bit, correggendo il file magicamente.</p>
            
            <div id="interactive-hamming-demo" class="demo-container"></div>

            <h3>6. Codice a Barre EAN-13 (La matematica della spesa)</h3>
            <p>Ogni prodotto al supermercato ha un codice a barre EAN-13 (European Article Number). È composto da 13 cifre. Le prime 12 indicano nazione, produttore e articolo. L'ultima cifra (la 13esima) è un <strong>Check Digit</strong> (Cifra di controllo).</p>
            <p>Serve a evitare che la cassiera batta uno scontrino errato se il laser o il lettore sbagliano una cifra. Si calcola così:</p>
            <ol>
                <li>Si moltiplicano le prime 12 cifre, alternando: la prima per 1, la seconda per 3, la terza per 1, la quarta per 3 e così via.</li>
                <li>Si sommano tutti i risultati ottenuti.</li>
                <li>La cifra di controllo è il numero esatto che bisogna aggiungere alla somma totale per farla finire con uno zero (cioè per arrivare al multiplo di 10 successivo).</li>
            </ol>
        `
    },
    "Il Sistema Operativo": {
        title: "Il Sistema Operativo e la Gestione dei Processi",
        content: `
            <h3>1. Cos'è un Sistema Operativo e il Bootstrap (L'Avvio)</h3>
            <p>Il Sistema Operativo (Windows, Linux, macOS) è come il "Direttore d'Orchestra" del computer. Senza di esso, processore, RAM e hard disk sarebbero un ammasso di metallo incapace di comunicare. Prima ancora che il SO prenda vita, all'accensione del PC parte il <strong>Ciclo di Bootstrap (o Boot)</strong>, che funziona come il risveglio di una persona:</p>
            <ol>
                <li><strong>POST (Power On Self Test):</strong> Il computer si sveglia e "controlla il proprio corpo". Invia piccoli impulsi elettrici a RAM, tastiera e disco per assicurarsi che niente sia rotto o bruciato.</li>
                <li><strong>IPL (Initial Program Loader):</strong> Se l'hardware sta bene, un piccolo chip sulla scheda madre cerca sull'hard disk l'indirizzo in cui "dorme" il Sistema Operativo e lo sveglia (lancia il Bootloader).</li>
                <li><strong>Caricamento Kernel:</strong> Il cuore del Sistema Operativo viene caricato nella memoria RAM. Da questo momento, il SO prende il controllo assoluto della macchina e appare la schermata di caricamento.</li>
            </ol>

            <h3>2. I Supereroi del Sistema Operativo</h3>
            <p>Il SO non è un singolo programma, ma una squadra di moduli specializzati:</p>
            <ul>
                <li><strong>Il Kernel:</strong> Il capo supremo. Gestisce il processore e la memoria. Lavora in un'area blindata chiamata <em>Kernel Mode</em>: nessun programma utente (come Chrome o un videogioco) può toccare la memoria del Kernel, altrimenti il sistema crasherà ("Schermata blu della morte").</li>
                <li><strong>Il File System:</strong> È l'archivista. Decide come salvare i tuoi documenti sul disco fisso organizzandoli in cartelle e percorsi logici (es. <code>C:\Utenti\Documenti</code>), tenendo traccia dei cluster fisici usati.</li>
                <li><strong>Lo Scheduler:</strong> Il vigile urbano. Dato che la CPU può fare una cosa alla volta, lo Scheduler decide <em>quale</em> programma far girare in quel millisecondo e <em>chi</em> deve aspettare in coda.</li>
                <li><strong>Lo Spooler:</strong> Il segretario. Se invii 5 file alla stampante contemporaneamente, la stampante impazzirebbe. Lo Spooler prende i file, li mette ordinatamente in fila in una "coda di stampa" e li invia uno ad uno alla stampante.</li>
                <li><strong>La Shell:</strong> Il traduttore. È l'interfaccia utente (Grafica o a riga di comando) che traduce i tuoi click del mouse in codici comprensibili dal Kernel.</li>
            </ul>

            <h3>3. Multitasking, Stati dei Processi e Context-Switch</h3>
            <p>Oggi puoi ascoltare Spotify mentre scrivi su Word e navighi su Chrome. Questo si chiama <strong>Multitasking</strong>. In realtà, se hai un processore a singolo core, il computer sta passando da Word a Spotify migliaia di volte al secondo, così velocemente che a te sembrano simultanei.</p>
            <p>Un programma in esecuzione prende il nome di <strong>Processo</strong>. Quando la CPU smette di eseguire Word per passare a Spotify, fa un <strong>Context-switch (Cambio di Contesto)</strong>. Salva la posizione in cui era arrivato Word dentro una speciale "carta d'identità" chiamata <strong>PCB (Process Control Block)</strong>, così quando tornerà a Word saprà da dove riprendere!</p>
            <p>Gli stati di vita di un processo sono come una stazione della metropolitana:</p>
            <ul>
                <li><strong>Nuovo:</strong> Hai appena fatto doppio click sull'icona.</li>
                <li><strong>Pronto (Ready):</strong> Il processo è caricato in RAM e aspetta il suo turno in coda per prendere la CPU.</li>
                <li><strong>In Esecuzione (Running):</strong> La CPU sta calcolando il suo codice (questo stato dura pochi millisecondi).</li>
                <li><strong>In Attesa (Waiting):</strong> Il processo è in pausa perché aspetta una risposta esterna lenta (es. aspetta che tu prema un tasto della tastiera).</li>
                <li><strong>Finito:</strong> Hai chiuso il programma. La RAM viene svuotata.</li>
            </ul>

            <h3>4. Algoritmi di Scheduling (Il Vigile Urbano)</h3>
            <p>Come fa lo Scheduler a decidere a chi dare la CPU? Usa algoritmi specifici. Alcuni sono gentili (Pre-emptive) e altri prepotenti (Non pre-emptive).</p>
            <ul>
                <li><strong>FC_FS (First Come First Serve):</strong> È la fila alle Poste. Chi arriva primo viene servito fino alla fine (Non pre-emptive). Se c'è un processo lunghissimo, tutti gli altri restano bloccati finché non ha finito.</li>
                <li><strong>SJ_F (Shortest Job First):</strong> Esegue prima i programmi che richiedono meno tempo (Non pre-emptive). Causa "starvation": i programmi pesanti potrebbero non partire mai se ne arrivano in continuazione di piccolissimi.</li>
                <li><strong>Round Robin:</strong> Il più giusto (Pre-emptive). Assegna a tutti uno slot di tempo uguale e strettissimo, chiamato <strong>Quantum</strong> (es. 20 millisecondi). Scaduto il tempo, vieni "scacciato" dalla CPU e rimesso in fondo alla coda. Garantisce che il computer risponda fluidamente.</li>
            </ul>
            
            <div id="interactive-os-demo" class="demo-container"></div>
            
            <h3>5. Il problema del Deadlock e i "Filosofi a cena"</h3>
            <p>A volte due programmi si bloccano a vicenda in modo permanente. Questo si chiama <strong>Deadlock</strong> (Stallo). Il famoso informatico Dijkstra lo spiegò col problema dei <em>Cinque Filosofi a cena</em>.</p>
            <div class="code-container" style="background: rgba(0,0,0,0.3); border-left: 4px solid var(--error); padding: 10px;">
                Cinque filosofi sono seduti attorno a un tavolo rotondo. Tra ogni filosofo c'è <strong>una forchetta</strong> (totale 5 forchette). Per mangiare gli spaghetti servono <strong>due forchette</strong>.<br><br>
                Se per coincidenza tutti e 5 i filosofi afferrano la forchetta alla loro destra contemporaneamente, ognuno avrà 1 forchetta in mano. Nessuno ha le due forchette necessarie per mangiare. Tutti aspetteranno all'infinito che il vicino posi la forchetta per potergliola prendere. Sono in stallo!
            </div>
            <p>Nei PC questo accade se Word prende possesso della Scheda Audio e aspetta la Stampante, mentre Spotify prende la Stampante e aspetta la Scheda Audio. Il SO deve prevenire queste situazioni!</p>
        `
    }
};
