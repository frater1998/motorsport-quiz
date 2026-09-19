# APEX Grand Prix Quiz Engine (1990 - Oggi)
### WebApp Single Page Application (SPA) per Formula 1, Formula 2 e Formula 3

> **Requisito Chiave**: Questa applicazione **non** si basa su un file JSON statico di 100 domande fisse. È alimentata da un **Motore di Generazione Procedurale** che si auto-aggiorna in tempo reale ad ogni nuovo Gran Premio disputato senza alcun intervento manuale sul codice o sul database.

---

## 🏎️ Caratteristiche Principali

1. **Auto-Aggiornamento Automatico ad ogni Nuovo Gran Premio**:
   - All'avvio, l'applicazione interroga le API pubbliche e gratuite del motorsport (**Jolpica F1 API** con fallback su **Ergast API** storica).
   - Rileva automaticamente l'ultimo GP completato, il vincitore, il podio e la classifica piloti/costruttori in tempo reale.
   - Il giorno dopo qualsiasi Gran Premio (es. Monza, Silverstone, Madrid, Abu Dhabi), il quiz include immediatamente domande sulla gara appena conclusa.

2. **Motore di Generazione Domande Procedurale (Procedural Engine)**:
   - Template dinamici in TypeScript che trasformano i dati grezzi in quiz interattivi:
     - *"Chi ha vinto il Gran Premio di [Circuito/Nazione] nell'anno [Anno]?"*
     - *"Chi ha fatto la pole position a [Circuito] nel [Anno]?"*
     - *"Chi ha vinto il campionato mondiale piloti nel [Anno]?"*
     - *"Quale pilota della [Scuderia] è arrivato a podio nel GP di [Nazione] [Anno]?"*
     - *"Quale scuderia ha vinto il Campionato Costruttori nel [Anno]?"*
     - *"Chi ha vinto la Feature Race / Sprint Race di Formula 2 a [Circuito] nel [Anno]?"*
     - *"Chi si è laureato Campione del Mondo di Formula 3 / GP3 nel [Anno]?"*
     - *"Quale pilota ha trionfato nel prestigioso GP di Macao di Formula 3 nel [Anno]?"*
     - *"Chi ha vinto l'ultimo Gran Premio disputato ([Nome GP] [Anno])?"* (Live Auto-Sync)
     - *"Chi è attualmente in testa alla classifica del Mondiale Piloti F1?"* (Live Auto-Sync)

3. **Generatore Intelligente di Distrattori Coerenti per Epoca**:
   - **Regola Rigorosa**: Per una domanda su una gara del 1998, i distrattori sono rigorosamente piloti che gareggiavano nel 1998 (Coulthard, Irvine, Frentzen, Schumacher, Villeneuve, Alesi), **MAI** piloti moderni (Verstappen, Leclerc, Hamilton).
   - L'algoritmo filtra e raggruppa i candidati in base all'anno e all'era storica selezionata.

4. **UI/UX Motorsport & Telemetria**:
   - **Tachimetro RPM con Timer di 15 Secondi**: indicatore circolare e a barre segmentate con avviso visivo e sonoro nell'area rossa (rev-limiter < 5s).
   - **Barra Telemetria Giri & Settori**: 10 settori per ogni domanda con bandiere viola (risposta ultra-rapida), verdi (corretta) e rosse (errore).
   - **Combo Multiplier**: bonus velocità di reazione e moltiplicatore streak (fino a 2.5x).
   - **Feedback Immediato & Curiosità**: contesto storico e spiegazione tecnica mostrati subito dopo la risposta.
   - **Sintesi Audio Web Audio API**: semaforo di partenza F1, radio box click, suoni di risposta e fanfara della bandiera a scacchi senza dipendenze da file audio esterni.
   - **Superlicenza Pilota FIA & Podio Finale**: calcolo del grado finale (Campione del Mondo, Pilota Ufficiale F1, Pilota Academy F2, Test Driver) con coriandoli celebrativi e riepilogo dettagliato giro per giro.

5. **Architettura di Fallback & Cache di Sicurezza**:
   - Cache con TTL in memoria e `sessionStorage` per evitare chiamate ridondanti alle API.
   - Timeout di 5 secondi con degradazione trasparente verso il database storico interno (1990-2026), garantendo che l'app non si blocchi mai anche in assenza di connessione.

---

## 📁 Struttura del Progetto

```
motorsport-quiz/
├── src/
│   ├── api/
│   │   ├── cache.ts                 # Cache intelligente con TTL e sessionStorage
│   │   └── motorsportApi.ts         # Connettore API Jolpica/Ergast con rilevamento live GP
│   ├── data/
│   │   ├── f1HistoricalData.ts      # Database storico F1 (1990-2026): Campioni, GP iconici, roster piloti/costruttori
│   │   ├── f2HistoricalData.ts      # Database storico F2 & GP2: Campioni, gare feature/sprint, roster piloti
│   │   └── f3HistoricalData.ts      # Database storico F3 & GP3: Campioni, GP di Macao, roster piloti
│   ├── engine/
│   │   ├── distractorGenerator.ts   # Algoritmo generatore di distrattori storicamente coerenti
│   │   ├── templates.ts             # Template procedurali per F1, F2, F3 e gare live
│   │   └── questionEngine.ts        # Motore centrale di generazione delle 10 domande
│   ├── utils/
│   │   ├── sound.ts                 # Sintetizzatore sonoro procedurale (Web Audio API)
│   │   └── formatters.ts            # Calcolo punteggi, bonus velocità e Superlicenza FIA
│   ├── components/
│   │   ├── Header.tsx               # Header motorsport con feed live e controllo audio
│   │   ├── TachometerTimer.tsx      # Conto alla rovescia RPM 15s con stile tachimetro
│   │   ├── TelemetryBar.tsx         # Barra telemetria giri, settori colorati e punteggio
│   │   ├── QuestionCard.tsx         # Scheda domanda con pulsanti interattivi e feedback
│   │   ├── TelemetryInsight.tsx     # Box curiosità storica / retroscena di gara
│   │   ├── HomeScreen.tsx           # Schermata di selezione Categoria ed Epoca con widget Live GP
│   │   ├── QuizScreen.tsx           # Container di gioco attivo
│   │   └── PodiumSummary.tsx        # Schermata podio finale con Superlicenza e telemetria completa
│   ├── types/
│   │   └── index.ts                 # Definizioni TypeScript complete
│   ├── test/
│   │   └── verifyQuizEngine.ts      # Suite di test e verifica automatica della logica
│   ├── App.tsx                      # Componente principale
│   ├── index.css                    # Tailwind CSS v4 con stili motorsport
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Istruzioni per l'Avvio

### 1. Installazione dipendenze (già completata)
```bash
npm install
```

### 2. Avvio del server di sviluppo
```bash
npm run dev
```
L'applicazione sarà accessibile localmente (solitamente su `http://localhost:5173`).

### 3. Esecuzione dei Test di Verifica del Motore Procedurale
Per verificare in tempo reale il fetch dei dati live dell'ultimo GP, la generazione dei distrattori e il bilanciamento delle domande:
```bash
npx tsx src/test/verifyQuizEngine.ts
```

### 4. Build di Produzione
```bash
npm run build
```
Genera il pacchetto ottimizzato nella cartella `dist/`.
