const lessonsData = {
    "File I/O": {
        title: "Operazioni su File e Buffer in C++",
        content: `
            <h3>1. L'Astrazione degli Stream e il Buffer</h3>
            <p>In C++, l'Input/Output (I/O) non avviene direttamente con l'hardware, ma tramite un'astrazione chiamata <strong>Stream</strong> (Flusso). Un flusso è semplicemente una sequenza di byte.</p>
            <p>La libreria standard C++ gestisce gli stream in memoria usando un <strong>Buffer</strong>. Il buffer è una zona temporanea della memoria RAM usata per accumulare i byte prima di trasferirli fisicamente sul disco. Perché? Perché il disco fisso è ordini di grandezza più lento della RAM!</p>
            <div id="interactive-buffer-demo" class="demo-container"></div>
            <ul>
                <li>Quando chiami <code>file << "Ciao";</code>, la parola "Ciao" va nel buffer in RAM.</li>
                <li>Il disco rigido si attiverà per salvare i dati solo quando il buffer è pieno, oppure quando chiami esplicitamente <code>file.flush()</code>, o quando chiudi il file (<code>file.close()</code>).</li>
            </ul>

            <h3>2. Fstream: Apertura e Chiusura</h3>
            <p>Per interagire coi file, includiamo <code>&lt;fstream&gt;</code> che ci fornisce le classi <code>ifstream</code> (per leggere) e <code>ofstream</code> (per scrivere).</p>
            <pre><code class="language-cpp">
#include &lt;iostream&gt;
#include &lt;fstream&gt;
using namespace std;

int main() {
    // Apro un file in modalità scrittura (out)
    ofstream fileOutput("dati.txt", ios::out); 
    
    // Verifico sempre se il file è stato aperto correttamente!
    if (!fileOutput.is_open()) {
        cerr << "Errore irreversibile: Impossibile aprire il file!" << endl;
        return 1;
    }

    fileOutput << "Questo testo finisce prima nel Buffer, poi su Disco.";
    fileOutput.close(); // Forza il salvataggio fisico su disco e rilascia la risorsa
    return 0;
}
            </code></pre>

            <h3>3. Modalità di Apertura (Flags ios)</h3>
            <p>Le modalità determinano il comportamento del file all'apertura. Si possono combinare con l'operatore bit a bit OR (<code>|</code>).</p>
            <ul>
                <li><code>ios::in</code> : Lettura. Se il file non esiste, fallisce.</li>
                <li><code>ios::out</code> : Scrittura. Se il file esiste, <strong>viene cancellato (troncato)</strong> e riscritto da zero!</li>
                <li><code>ios::app</code> : Append. Tutto ciò che scrivi viene incollato alla <strong>fine</strong> del file, preservando i dati vecchi.</li>
                <li><code>ios::trunc</code> : Truncate. Svuota esplicitamente un file già esistente.</li>
            </ul>

            <h3>4. Lettura carattere per carattere</h3>
            <p>Per leggere testi complessi o con spazi particolari senza far collassare la formattazione, è utile leggere un byte (char) alla volta con <code>get()</code>:</p>
            <pre><code class="language-cpp">
ifstream fileInput("dati.txt");
char c;
// get(c) estrae esattamente un char dallo stream, inclusi spazi e ritorni a capo (\\n)
while (fileInput.get(c)) {
    cout << c; 
}
            </code></pre>
        `
    },
    "Matrici": {
        title: "Le Matrici in C++ (Array Bidimensionali)",
        content: `
            <h3>1. La Struttura di una Matrice</h3>
            <p>In C++, una matrice non è nient'altro che un <strong>"Array di Array"</strong>. Quando dichiariamo <code>int mat[3][4];</code> stiamo creando un array di 3 elementi, dove ogni elemento è a sua volta un array di 4 interi.</p>
            <p>Sebbene noi la immaginiamo come una griglia 2D, nella memoria RAM (che è lineare), il C++ la memorizza in modalità <strong>Row-Major Order</strong>: le righe vengono adagiate una dopo l'altra consecutivamente nella memoria.</p>
            
            <h3>2. Visualizzazione Dinamica dell'Iterazione</h3>
            <p>Il modo standard per attraversare una matrice in C++ è l'utilizzo di due cicli <code>for</code> annidati. Il ciclo esterno (di solito variabile <code>i</code>) scorre le <strong>righe</strong>, mentre il ciclo interno (variabile <code>j</code>) scorre le <strong>colonne</strong> all'interno di quella riga.</p>
            
            <div id="interactive-matrix-demo" class="demo-container"></div>
            
            <p>Premi il bottone qui sopra per vedere come le variabili <code>i</code> e <code>j</code> muovono l'indice di memoria (puntatore) all'interno della griglia.</p>

            <h3>3. Esempio Codice: Somma Massima di una Riga</h3>
            <p>Per calcolare quale riga possiede la somma degli elementi più alta (tipica domanda di esame):</p>
            <pre><code class="language-cpp">
int matrix[4][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8}, // <-- Riga con somma massima in questo esempio? No, l'ultima!
    {1, 1, 1, 1},
    {10, 10, 10, 10} // <-- Questa!
};

int maxIdx = 0;
int maxSum = -999999;

for(int i = 0; i < 4; i++) {
    int currentSum = 0; // Azzera la somma all'inizio di ogni nuova riga!
    for(int j = 0; j < 4; j++) {
        currentSum += matrix[i][j];
    }
    // Finita la riga, controllo se ha battuto il record
    if(currentSum > maxSum) {
        maxSum = currentSum;
        maxIdx = i; // Memorizzo l'indice della riga vincente!
    }
}
cout << "La riga con la somma massima è la " << maxIdx << " con somma: " << maxSum << endl;
            </code></pre>
        `
    },
    "Vettori": {
        title: "I Vettori (Array Monodimensionali) in C++",
        content: `
            <h3>1. Cos'è un Vettore (Array)?</h3>
            <p>In C++, un vettore o array è una <strong>collezione di elementi tutti dello stesso tipo</strong>, memorizzati in un blocco contiguo (di seguito) nella memoria RAM.</p>
            <p>A differenza di Python dove una lista può contenere sia numeri che stringhe, in C++ un array è <strong>fortemente tipizzato</strong>. Se dichiari un array di interi, può contenere solo interi.</p>
            
            <pre><code class="language-cpp">
// Array di interi
int numeri[5] = {10, 20, 30, 40, 50};

// Array di float (numeri con la virgola)
float temperature[3] = {36.5, 37.2, 38.0};

// Array di char (stringa in stile C antico)
char vocali[5] = {'A', 'E', 'I', 'O', 'U'};
            </code></pre>

            <h3>2. L'Indice base-0 e la Memoria Contigua</h3>
            <p>In C++, gli array iniziano <strong>sempre dall'indice 0</strong>. Quindi un array di 5 elementi andrà dall'indice 0 all'indice 4. Se provi ad accedere all'indice 5, leggerai memoria non tua (Buffer Overflow!), causando bug gravissimi.</p>
            
            <div id="interactive-vector-demo" class="demo-container"></div>

            <h3>3. Iterare su un Array generico</h3>
            <p>Per leggere o modificare un array, usiamo un ciclo <code>for</code>. Ecco un esempio su un array di interi in cui raddoppiamo i valori:</p>
            <pre><code class="language-cpp">
int arr[4] = {1, 2, 3, 4};
for(int i = 0; i < 4; i++) {
    arr[i] = arr[i] * 2; 
    cout << "Ora vale: " << arr[i] << endl;
}
// Output: 2, 4, 6, 8
            </code></pre>

            <h3>4. Vettori di Stringhe e il problema della dimensione</h3>
            <p>Un caso particolare sono gli array di tipo <code>std::string</code>. Le stringhe del C++ sono oggetti, ma possiamo metterle in un array normale.</p>
            <pre><code class="language-cpp">
#include &lt;string&gt;
using namespace std;

string arrayParole[3] = {"Pippo", "Pluto", "Paperino"};
            </code></pre>
            <p><strong>Attenzione:</strong> In C++ puro, a differenza dei linguaggi moderni (come Java che ha <code>arr.length</code>), l'array nativo <strong>non conosce la sua lunghezza</strong>. Devi sempre passarla separatamente alle funzioni! Le stringhe invece sanno la loro lunghezza interna tramite <code>.length()</code> o <code>.size()</code>.</p>
            
            <h3>5. Esercizio Tipico (Esame): Trovare la parola più lunga</h3>
            <p>Esempio: "Creare una funzione che ricevuto un array di stringhe già riempito, determini in che posizione si trova la parola più lunga."</p>
            <pre><code class="language-cpp">
int trovaPosizioneParolaPiuLunga(string arr[], int size) {
    int maxIdx = 0; // Assumo che la prima (indice 0) sia la vincitrice all'inizio
    
    // Ciclo partendo dalla seconda parola (i = 1)
    for(int i = 1; i < size; i++) {
        // Se la stringa attuale è PIU' LUNGA del record attuale
        if(arr[i].length() > arr[maxIdx].length()) {
            maxIdx = i; // Aggiorno il record!
        }
    }
    
    return maxIdx; // Ritorno l'indice (la POSIZIONE)
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
    }
};
