const quizQuestions = [
    // --- PARTE 1 E PARTE 2: DOMANDE TEORICHE (Convertite a scelta multipla) ---
    {
        category: "File I/O",
        text: "Come viene utilizzato il buffer nelle operazioni di apertura, chiusura, lettura e scrittura di un file?",
        options: [
            "A) Il buffer cripta i dati sul disco per renderli sicuri ad ogni scrittura.",
            "B) È un'area di memoria temporanea RAM che accumula i dati. In lettura preleva blocchi dal disco per velocizzare; in scrittura accumula byte per poi trasferirli sul disco in un colpo solo (o alla chiusura).",
            "C) Il buffer serve esclusivamente per svuotare il file (truncate) al momento dell'apertura.",
            "D) È un componente fisico dell'hard disk che converte il C++ in linguaggio macchina."
        ],
        correctAnswer: 1,
        explanation: "Il buffer è una memoria temporanea vitale per le prestazioni: riduce il numero di accessi fisici (molto lenti) al disco raggruppando i dati in blocchi.",
        visualType: "buffer"
    },
    {
        category: "File I/O",
        text: "Fornisci un esempio di codice che illustra come scrivere dati verso un file in C++.",
        options: [
            "A) cin >> file(\"dati.txt\"); file << \"Ciao\";",
            "B) ofstream file(\"dati.txt\"); if(file.is_open()) { file << \"Dati\"; file.close(); }",
            "C) FileWrite fw = new FileWrite(\"dati.txt\"); fw.write(\"Dati\");",
            "D) fstream file; file.read(\"Dati\", \"dati.txt\");"
        ],
        correctAnswer: 1,
        explanation: "Si usa la classe `ofstream` (Output File Stream). L'operatore di inserimento `<<` manda i dati nel file, e `close()` assicura che il buffer venga scaricato sul disco.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Come gestire gli errori durante l'apertura di un file in C++ per verificare se si è aperto correttamente?",
        options: [
            "A) if(file.error() == true)",
            "B) if(!file.is_open()) { cout << \"Errore\"; }",
            "C) try { file.open(); } catch() { ... }",
            "D) if(file == null)"
        ],
        correctAnswer: 1,
        explanation: "Il metodo `is_open()` restituisce true se lo stream è associato a un file fisico valido. È la pratica standard in C++ per gestire l'errore di file non trovato o inaccessibile.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale metodo viene utilizzato per leggere un singolo carattere per volta da un file?",
        options: [
            "A) get() -> Esempio: char c; file.get(c);",
            "B) getline() -> Esempio: char c = file.getline();",
            "C) readChar() -> Esempio: char c = file.readChar();",
            "D) L'operatore >> -> Esempio: file >> char;"
        ],
        correctAnswer: 0,
        explanation: "`get(char&)` estrae un singolo carattere dallo stream, inclusi gli spazi vuoti e gli invii (cosa che l'operatore >> ignorerebbe).",
        visualType: "none"
    },
    {
        category: "Generazione Numeri",
        text: "Fornisci un esempio di codice che illustra come inizializzare e generare numeri casuali.",
        options: [
            "A) random_start(); int n = generate_random();",
            "B) rand(time()); int n = rand();",
            "C) srand(time(NULL)); int n = rand();",
            "D) random.seed(); int n = random.nextInt();"
        ],
        correctAnswer: 2,
        explanation: "`srand(time(NULL))` inizializza il generatore usando l'orologio di sistema (seed). `rand()` estrae un numero da quella sequenza pseudocasuale.",
        visualType: "none"
    },
    
    // --- PARTE 2: RISPOSTA MULTIPLA ORIGINALE ---
    {
        category: "File I/O",
        text: "Quale modalità di apertura di un file consente di appendere dati alla fine di un file esistente?",
        options: [
            "A) fstream::in",
            "B) fstream::out",
            "C) fstream::app",
            "D) fstream::trunc"
        ],
        correctAnswer: 2,
        explanation: "`app` sta per Append. I dati vengono aggiunti alla coda del file senza cancellare i contenuti preesistenti.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale di queste modalità di apertura cancella il contenuto esistente di un file?",
        options: [
            "A) fstream::in",
            "B) fstream::out",
            "C) fstream::app",
            "D) fstream::ate"
        ],
        correctAnswer: 1,
        explanation: "`fstream::out` (usato da solo per scrittura) per impostazione predefinita comporta anche il troncamento del file esistente. (Se tra le opzioni ci fosse stato `trunc`, sarebbe stato ugualmente corretto).",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale delle seguenti classi viene utilizzata per gestire sia la lettura che la scrittura di file in C++?",
        options: [
            "A) ifstream",
            "B) ofstream",
            "C) fstream",
            "D) none of the above"
        ],
        correctAnswer: 2,
        explanation: "`ifstream` è solo per Input (lettura), `ofstream` solo per Output (scrittura). `fstream` li supporta entrambi contemporaneamente.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale dei seguenti metodi è utilizzato per verificare se lo stato di un flusso di file è arrivato alla fine?",
        options: [
            "A) eof()",
            "B) end()",
            "C) finish()",
            "D) is_done()"
        ],
        correctAnswer: 0,
        explanation: "`eof()` (End Of File) restituisce true quando si tenta di leggere oltre l'ultimo carattere del file.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "La gestione fisica di un file nel file system è di competenza:",
        options: [
            "A) dei programmi usati per la sua gestione",
            "B) del sistema operativo",
            "C) della directory che lo contiene",
            "D) del supporto di memoria permanente su cui è memorizzato"
        ],
        correctAnswer: 1,
        explanation: "Il Sistema Operativo (Windows, Linux, macOS) gestisce il file system e i settori del disco, fornendo un'astrazione sicura ai programmi (attraverso le API o system calls).",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale dei seguenti metodi è utilizzato per verificare se il file si è aperto correttamente?",
        options: [
            "A) eof()",
            "B) is_open()",
            "C) good()",
            "D) Nessuno"
        ],
        correctAnswer: 1,
        explanation: "`is_open()` controlla se lo stream di file è correntemente associato a un file fisico valido.",
        visualType: "none"
    },

    // --- PARTE 4: ESERCIZI C++ ---
    {
        category: "Matrici",
        text: "Es. 1: Creare una funzione in cpp che ricevuta una matrice 4x4 di interi stampi in output la riga con la somma più alta. Scegli il codice corretto:",
        codeSnippet: `// OPZIONE A
void maxRow(int m[4][4]) {
    int maxIdx = 0, maxSum = -9999;
    for(int i=0; i<4; i++) {
        int sum = 0;
        for(int j=0; j<4; j++) sum += m[i][j];
        if(sum > maxSum) { maxSum = sum; maxIdx = i; }
    }
    cout << maxIdx;
}`,
        options: [
            "A) Il codice nell'OPZIONE A",
            "B) Un ciclo for singolo da 0 a 16 e dividere per 4",
            "C) Cambiare l'ordine dei for: for(j) { for(i) { ... } }",
            "D) Non è possibile farlo senza puntatori dinamici"
        ],
        correctAnswer: 0,
        explanation: "L'opzione A è corretta. Un ciclo esterno (i) scorre le righe. La variabile `sum` viene azzerata all'inizio di ogni riga. Il ciclo interno (j) somma gli elementi della riga corrente. Infine, si confronta se la somma ha battuto il record `maxSum`.",
        visualType: "matrix"
    },
    {
        category: "Vettori",
        text: "Es. 2: Creare una funzione in cpp che ricevuto un array di stringhe già riempito, determini in che posizione del vettore si trova la parola più lunga. Scegli il codice corretto:",
        codeSnippet: `// OPZIONE B
int maxStr(string arr[], int size) {
    int maxIdx = 0;
    for(int i=1; i<size; i++) {
        if(arr[i].length() > arr[maxIdx].length()) {
            maxIdx = i;
        }
    }
    return maxIdx;
}`,
        options: [
            "A) Utilizzare array[i].size > array[maxIdx].size (senza parentesi)",
            "B) Il codice nell'OPZIONE B",
            "C) Confrontare direttamente le stringhe: arr[i] > arr[maxIdx]",
            "D) Utilizzare sizeof(arr[i]) al posto di length()"
        ],
        correctAnswer: 1,
        explanation: "L'opzione B è corretta. Usa un indice `maxIdx` per tracciare la posizione della stringa più lunga, e il metodo `length()` (o `size()`) per comparare i numeri di caratteri. L'opzione C farebbe un confronto alfabetico, non di lunghezza. L'opzione D restituirebbe la dimensione dell'oggetto string in RAM (byte), non i caratteri.",
        visualType: "none"
    }
];
