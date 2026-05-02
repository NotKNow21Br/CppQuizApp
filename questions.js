const quizQuestions = [
    // --- FILE I/O (TESTO) ---
    {
        category: "File I/O",
        text: "Come viene utilizzato il buffer nelle operazioni di apertura, chiusura, lettura e scrittura di un file?",
        options: [
            "A) Il buffer cripta i dati sul disco per renderli sicuri ad ogni scrittura.",
            "B) È un'area di memoria temporanea RAM che accumula i dati per ridurre gli accessi fisici (lenti) al disco.",
            "C) Il buffer serve esclusivamente per svuotare il file (truncate) al momento dell'apertura.",
            "D) È un componente fisico dell'hard disk che converte il C++ in linguaggio macchina."
        ],
        correctAnswer: 1,
        explanation: "Il buffer è una memoria temporanea vitale per le prestazioni: riduce il numero di accessi fisici al disco raggruppando i dati in blocchi.",
        visualType: "buffer"
    },
    {
        category: "File I/O",
        text: "Fornisci un esempio di codice che illustra come scrivere dati verso un file di testo in C++.",
        options: [
            "A) cin >> file(\"dati.txt\"); file << \"Ciao\";",
            "B) ofstream file(\"dati.txt\"); if(file.is_open()) { file << \"Dati\"; file.close(); }",
            "C) FileWrite fw = new FileWrite(\"dati.txt\"); fw.write(\"Dati\");",
            "D) fstream file; file.read(\"Dati\", \"dati.txt\");"
        ],
        correctAnswer: 1,
        explanation: "Si usa la classe `ofstream`. L'operatore `<<` manda i dati nello stream, e `close()` forza lo scaricamento del buffer su disco.",
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
        explanation: "Il metodo `is_open()` restituisce true se lo stream è associato a un file fisico valido sul disco.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale metodo viene utilizzato per leggere un singolo carattere per volta da un file (inclusi spazi bianchi)?",
        options: [
            "A) get()",
            "B) getline()",
            "C) readChar()",
            "D) L'operatore >>"
        ],
        correctAnswer: 0,
        explanation: "`get()` estrae esattamente un char, mentre l'operatore `>>` ignorerebbe gli spazi o i ritorni a capo.",
        visualType: "none"
    },
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
        explanation: "`app` sta per Append. I dati vengono aggiunti in coda al file preservando il contenuto precedente.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale di queste modalità di apertura cancella il contenuto esistente di un file?",
        options: [
            "A) ios::in",
            "B) ios::out",
            "C) ios::app",
            "D) ios::ate"
        ],
        correctAnswer: 1,
        explanation: "`ios::out` (o fstream::out), se usata da sola, crea il file o, se esiste già, lo tronca (svuota).",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale delle seguenti classi viene utilizzata per gestire SIA la lettura che la scrittura di file in C++?",
        options: [
            "A) ifstream",
            "B) ofstream",
            "C) fstream",
            "D) streamIO"
        ],
        correctAnswer: 2,
        explanation: "`fstream` eredita da entrambi e permette I/O combinato (es. usando ios::in | ios::out).",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Quale dei seguenti metodi è utilizzato per verificare se lo stato di un flusso di file è arrivato alla fine?",
        options: [
            "A) eof()",
            "B) is_done()",
            "C) end()",
            "D) good()"
        ],
        correctAnswer: 0,
        explanation: "`eof()` (End Of File) restituisce true quando si tenta di leggere oltre la fine del file.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "La gestione fisica di un file nel file system è di competenza:",
        options: [
            "A) dei programmi usati per la sua gestione",
            "B) del sistema operativo",
            "C) della directory che lo contiene",
            "D) del supporto di memoria"
        ],
        correctAnswer: 1,
        explanation: "È il Sistema Operativo (es. Windows) che astrae la scrittura sull'hard disk, tu devi solo passare il 'nome logico'.",
        visualType: "none"
    },

    // --- FILE I/O (BINARI E AVANZATI) ---
    {
        category: "File I/O",
        text: "Perché, nei file binari strutturati (record), si usa un array di char (es. char nome[30]) e NON std::string?",
        options: [
            "A) Perché std::string è più lento a caricarsi.",
            "B) Perché std::string richiede librerie esterne.",
            "C) Perché è indispensabile mantenere FISSA in byte la dimensione del record su massa.",
            "D) Perché il C++ non sa scrivere std::string su disco."
        ],
        correctAnswer: 2,
        explanation: "Le struct scritte su file binario devono avere una lunghezza fissa. `string` è dinamica e usa puntatori nascosti, scrivendo nel file l'indirizzo di memoria RAM invece della parola!",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Qual è l'istruzione corretta per SCRIVERE l'intero record 'buffer' in un file binario associato allo stream 'f'?",
        options: [
            "A) f.write(buffer, sizeof(buffer));",
            "B) f.write((char*)&buffer, sizeof(buffer));",
            "C) f << buffer;",
            "D) write(f, buffer);"
        ],
        correctAnswer: 1,
        explanation: "`write` necessita di un cast a `char*` dell'indirizzo di memoria della struct (`&buffer`), e del numero di byte da scrivere (`sizeof`).",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "A cosa serve l'istruzione f.seekg(offset, origine) in un file binario?",
        options: [
            "A) A cancellare record dal file.",
            "B) A saltare (accesso diretto) a una specifica posizione nel file per la LETTURA.",
            "C) A spostare il cursore per la SCRITTURA.",
            "D) A restituire il numero totale di byte del file."
        ],
        correctAnswer: 1,
        explanation: "`seekg` (seek get) sposta il cursore di lettura. `seekp` (seek put) sposta quello di scrittura.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Se f.tellg() restituisce la posizione corrente, come calcolo la posizione per SOVRASCRIVERE (modificare) il record appena letto?",
        options: [
            "A) f.seekp(f.tellg());",
            "B) f.seekp(f.tellg() + sizeof(buffer));",
            "C) f.seekp(f.tellg() - sizeof(buffer));",
            "D) Non serve, basta fare f.write()."
        ],
        correctAnswer: 2,
        explanation: "Dopo aver fatto una `read`, il cursore si è spostato in avanti. Per sovrascrivere il record APPENA LETTO, devo spostare il cursore di scrittura (`seekp`) indietro della dimensione del record.",
        visualType: "none"
    },
    {
        category: "File I/O",
        text: "Qual è la tecnica standard in C++ per CANCELLARE FISICAMENTE un record in mezzo a un file binario strutturato?",
        options: [
            "A) Usare f.deleteRecord().",
            "B) Posizionarsi col seekp e sovrascrivere con zeri.",
            "C) Usare un file temporaneo di appoggio: copiare tutti i record TRANNE quello da cancellare, svuotare l'originale, e riscriverlo.",
            "D) Chiamare la funzione clear() del Sistema Operativo."
        ],
        correctAnswer: 2,
        explanation: "Poiché il file system non permette di 'accorciare' un file al centro, bisogna ricrearlo filtrando il record indesiderato in un file di appoggio (appo.dat).",
        visualType: "none"
    },

    // --- VETTORI ---
    {
        category: "Vettori",
        text: "In C++, cosa accade se tento di accedere a v[5] in un array dichiarato come int v[5]?",
        options: [
            "A) Il programma lancia un'eccezione Java-style gestibile con try-catch.",
            "B) Viene restituito 0.",
            "C) Leggo un'area di memoria esterna all'array (potenziale buffer overflow/comportamento indefinito).",
            "D) L'array si ridimensiona automaticamente a 6 elementi."
        ],
        correctAnswer: 2,
        explanation: "Un array di 5 elementi in C++ ha indici da 0 a 4. Il C++ non fa controlli sui limiti (bounds checking), quindi accedi a memoria arbitraria!",
        visualType: "none"
    },
    {
        category: "Vettori",
        text: "Quale codice stampa correttamente gli elementi di un vettore (dimensione N) in ordine INVERSO (dall'ultimo al primo)?",
        options: [
            "A) for(int i=0; i<N; i--) cout << v[i];",
            "B) for(int i=N; i>=0; i--) cout << v[i];",
            "C) for(int i=N-1; i>=0; i--) cout << v[i];",
            "D) for(int i=N; i>0; i++) cout << v[i];"
        ],
        correctAnswer: 2,
        explanation: "L'ultimo elemento valido è all'indice `N-1`. Il ciclo deve scendere fino a `>= 0` e decrementare `i--`.",
        visualType: "none"
    },
    {
        category: "Vettori",
        text: "Data la dichiarazione int v[N], come faccio a modificare SOLO gli elementi che si trovano negli INDICI dispari aggiungendovi 100?",
        options: [
            "A) if (v[i] % 2 != 0) v[i] += 100;",
            "B) if (i % 2 != 0) v[i] += 100;",
            "C) if (i % 2 == 0) v[i] += 100;",
            "D) if (v[i] % 2 == 0) i += 100;"
        ],
        correctAnswer: 1,
        explanation: "Attenzione a distinguere il VALORE `v[i]` dalla sua POSIZIONE (indice `i`). La condizione `i % 2 != 0` verifica se la posizione è dispari.",
        visualType: "none"
    },
    {
        category: "Vettori",
        text: "Se in un ciclo for ho la seguente istruzione: c[i] = a[i] + b[i]; cosa sto facendo?",
        options: [
            "A) Calcolo la somma di tutti gli elementi di 'a'.",
            "B) Fondo gli array 'a' e 'b' in uno solo più lungo.",
            "C) Effettuo la somma di elementi di indici uguali tra due array (array paralleli).",
            "D) Sto convertendo i caratteri in interi."
        ],
        correctAnswer: 2,
        explanation: "Questo è un classico algoritmo con array paralleli. Sommo l'elemento 0 di 'a' con lo 0 di 'b', salvandolo in 'c' posizione 0, e così via.",
        visualType: "none"
    },
    {
        category: "Vettori",
        text: "Es. 2 Verifica: Creare una funzione che, ricevuto un array di stringhe, determini in che posizione del vettore si trova la parola più lunga.",
        options: [
            "A) for(i=1; i<size; i++) if(arr[i].length() > arr[maxIdx].length()) maxIdx = i;",
            "B) for(i=0; i<size; i++) if(sizeof(arr[i]) > sizeof(arr[maxIdx])) maxIdx = i;",
            "C) for(i=1; i<size; i++) if(arr[i] > arr[maxIdx]) maxIdx = i;",
            "D) if(arr[maxIdx] > size)"
        ],
        correctAnswer: 0,
        explanation: "Si confrontano le stringhe usando la funzione `.length()`. Se la lunghezza della stringa corrente batte il record precedente, si salva il suo indice `maxIdx`.",
        visualType: "none"
    },

    // --- MATRICI ---
    {
        category: "Matrici",
        text: "Come si dichiara correttamente una matrice di 10 righe e 5 colonne riempita a ZERI in C++?",
        options: [
            "A) int m[5][10] = 0;",
            "B) int m[10, 5];",
            "C) int m[10][5] = {};",
            "D) matrix<int> m(10,5);"
        ],
        correctAnswer: 2,
        explanation: "La sintassi C++ standard per l'inizializzazione uniforme a zeri di un array multidimensionale è usare le parentesi graffe vuote `= {}`.",
        visualType: "none"
    },
    {
        category: "Matrici",
        text: "Per stampare una matrice intera, come si organizzano i cicli for annidati?",
        options: [
            "A) Un solo ciclo for fino a riga * colonna.",
            "B) Ciclo esterno (i) per le righe, ciclo interno (j) per le colonne. Accesso tramite mat[i][j].",
            "C) Ciclo esterno per le colonne (j), ciclo interno per le righe (i). Accesso tramite mat[j][i].",
            "D) È indifferente ai fini della RAM."
        ],
        correctAnswer: 1,
        explanation: "Essendo immagazzinata in Row-Major order, iterare prima sulle righe e poi sulle colonne è molto più veloce e cache-friendly.",
        visualType: "matrix"
    },
    {
        category: "Matrici",
        text: "Es. 1 Verifica: Funzione che, ricevuta una matrice 4x4 di interi, stampi la riga con la somma più alta.",
        options: [
            "A) for(int i=0; i<4; i++) { int sum=0; for(int j=0; j<4; j++) sum+=m[i][j]; if(sum>maxSum) { maxSum=sum; maxIdx=i; } }",
            "B) for(int i=0; i<4; i++) { sum+=m[i][i]; }",
            "C) for(int i=0; i<4; i++) for(int j=0; j<4; j++) { if(m[i][j] > maxSum) maxSum = m[i][j]; }",
            "D) Non è risolvibile senza array paralleli."
        ],
        correctAnswer: 0,
        explanation: "Nel ciclo esterno (scorrimento righe) creiamo una variabile 'sum' che parte da 0. Nel ciclo interno sommiamo tutti i valori di quella riga. Finito il ciclo interno, verifichiamo se 'sum' batte il record.",
        visualType: "none"
    },

    // --- GENERAZIONE NUMERI ---
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
        explanation: "`srand(time(NULL))` usa i secondi passati dal 1970 per impostare il Seed (il punto di partenza deterministico dell'equazione). `rand()` estrae un numero da quella sequenza.",
        visualType: "none"
    }
];
