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
        title: "Circuiti RLC: Resistore, Induttore e Condensatore",
        content: `
            <h3>1. I Componenti Fondamentali</h3>
            <p>I circuiti RLC prendono il nome dai tre componenti passivi fondamentali dell'elettronica lineare:</p>
            <ul>
                <li><strong>Resistore (R)</strong>: Si oppone al passaggio della corrente, dissipando energia sotto forma di calore (Effetto Joule). La sua unità di misura è l'Ohm (Ω). La legge di Ohm (V = R * I) governa il suo comportamento.</li>
                <li><strong>Induttore (L)</strong>: È costituito da una bobina di filo conduttore. Immagazzina energia sotto forma di campo magnetico. Si oppone alle variazioni di corrente. L'unità di misura è l'Henry (H).</li>
                <li><strong>Condensatore (C)</strong>: È formato da due armature conduttrici separate da un dielettrico. Immagazzina energia sotto forma di campo elettrico. Si oppone alle variazioni di tensione. L'unità di misura è il Farad (F).</li>
            </ul>

            <h3>2. Comportamento in Corrente Continua (CC) e Alternata (CA)</h3>
            <p>Mentre la resistenza ha lo stesso valore in CC e CA, induttori e condensatori si comportano diversamente in base alla frequenza del segnale (reattanza):</p>
            <ul>
                <li><strong>Condensatore:</strong> In CC si comporta come un circuito aperto (dopo essersi caricato). In CA, la sua opposizione (reattanza capacitiva) diminuisce all'aumentare della frequenza.</li>
                <li><strong>Induttore:</strong> In CC si comporta come un cortocircuito. In CA, la sua opposizione (reattanza induttiva) aumenta all'aumentare della frequenza.</li>
            </ul>

            <h3>3. Circuito RLC in Serie e Parallelo</h3>
            <p>In un circuito RLC, la combinazione delle reattanze e della resistenza si chiama <strong>Impedenza (Z)</strong>, misurata anch'essa in Ohm.</p>
            <p><strong>Risonanza:</strong> È il fenomeno più importante dei circuiti RLC. Avviene a una specifica frequenza (frequenza di risonanza) in cui la reattanza induttiva e quella capacitiva si annullano a vicenda.
            In un RLC serie in risonanza, l'impedenza è minima (uguale alla sola R) e la corrente è massima. Viene sfruttato nei filtri (es. sintonizzare una radio).</p>
        `
    },
    "Porte Logiche": {
        title: "Porte Logiche e Algebra Booleana",
        content: `
            <h3>1. L'Algebra di Boole e i Segnali Digitali</h3>
            <p>L'elettronica digitale si basa sull'Algebra di Boole, un sistema matematico che utilizza solo due valori: <strong>0 (Falso / Low)</strong> e <strong>1 (Vero / High)</strong>.
            Questi valori logici corrispondono a livelli di tensione nei circuiti fisici.</p>

            <h3>2. Le Porte Logiche Fondamentali</h3>
            <ul>
                <li><strong>NOT (Invertitore):</strong> Ha 1 ingresso e 1 uscita. L'uscita è l'opposto dell'ingresso. Se entra 0 esce 1, se entra 1 esce 0.</li>
                <li><strong>AND (Prodotto Logico):</strong> Ha 2 o più ingressi. L'uscita è 1 SOLO SE TUTTI gli ingressi sono 1. (Es: un sistema si attiva solo se chiave girata AND pulsante premuto).</li>
                <li><strong>OR (Somma Logica):</strong> Ha 2 o più ingressi. L'uscita è 1 se ALMENO UN ingresso è 1. (Es: allarme suona se si apre porta OR si apre finestra).</li>
            </ul>

            <h3>3. Porte Logiche Derivate</h3>
            <ul>
                <li><strong>NAND (NOT AND):</strong> È un AND seguito da un NOT. L'uscita è 0 solo se tutti gli ingressi sono 1.</li>
                <li><strong>NOR (NOT OR):</strong> È un OR seguito da un NOT. L'uscita è 1 solo se tutti gli ingressi sono 0.</li>
                <li><strong>XOR (OR Esclusivo):</strong> L'uscita è 1 se gli ingressi sono diversi tra loro (uno a 0, uno a 1). Se sono uguali (0-0 o 1-1) l'uscita è 0.</li>
            </ul>
            <p>Nota: NAND e NOR sono dette porte <em>universali</em> perché combinandole si può creare qualsiasi altra porta logica.</p>
        `
    },
    "Diodi e Ponte di Graetz": {
        title: "Diodi e Ponte di Graetz (Raddrizzatore)",
        content: `
            <h3>1. Il Diodo a Semiconduttore</h3>
            <p>Il diodo è il componente semiconduttore più semplice. Permette il passaggio di corrente elettrica <strong>in una sola direzione</strong>, bloccandola nella direzione opposta (come una valvola idraulica di non ritorno).</p>
            <p>È costituito da una giunzione P-N (silicio drogato positivamente e negativamente). I suoi terminali si chiamano <strong>Anodo</strong> (+) e <strong>Catodo</strong> (-).</p>

            <h3>2. Polarizzazione</h3>
            <ul>
                <li><strong>Diretta:</strong> Si applica tensione positiva all'anodo e negativa al catodo. Il diodo conduce (dopo aver superato la tensione di soglia, ~0.7V per il silicio).</li>
                <li><strong>Inversa:</strong> Si inverte la polarità. Il diodo non conduce e blocca il passaggio di corrente.</li>
            </ul>

            <h3>3. Raddrizzamento della Corrente</h3>
            <p>La rete elettrica fornisce corrente alternata (CA, un'onda sinusoidale che inverte polarità 50 volte al secondo). I circuiti elettronici hanno bisogno di corrente continua (CC, costante). I diodi servono a "raddrizzare" l'onda.</p>
            
            <h3>4. Il Ponte di Graetz</h3>
            <p>Il ponte di Graetz è un circuito intelligente costituito da <strong>4 diodi</strong> collegati a "rombo".</p>
            <p>È un raddrizzatore a <strong>doppia semionda</strong>. In CA, durante la semionda positiva, 2 dei 4 diodi conducono. Durante la semionda negativa, conducono gli altri 2 diodi.
            Il risultato è che la corrente all'uscita fluisce <strong>sempre nella stessa direzione</strong>.</p>
            <p>Dopo il ponte di Graetz, il segnale è raddrizzato (solo pulsazioni positive) ma non ancora continuo. Viene solitamente collegato un grosso <strong>Condensatore di livellamento</strong> in parallelo per "spianare" le pulsazioni e ottenere una vera CC (Corrente Continua) stabile, pronta per alimentare smartphone o PC.</p>
        `
    }
};
