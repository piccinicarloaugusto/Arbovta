# ArboVTA PWA — Guida al Deploy

## Struttura file

```
arbovta-pwa/
├── index.html        ← App principale
├── manifest.json     ← Configurazione PWA
├── sw.js             ← Service Worker (offline + cache)
├── .nojekyll         ← Per GitHub Pages
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png
```

---

## Deploy su GitHub Pages (gratuito, HTTPS automatico)

### 1. Crea un account GitHub
Vai su https://github.com e registrati se non hai già un account.

### 2. Crea un nuovo repository
- Clicca **"New repository"**
- Nome: `arbovta` (o qualsiasi nome)
- Visibilità: **Public** (richiesto per GitHub Pages gratuito)
- Clicca **"Create repository"**

### 3. Carica i file
Nella pagina del repository appena creato:
- Clicca **"uploading an existing file"**
- Trascina TUTTI i file della cartella `arbovta-pwa/`
  - Attenzione: carica anche la cartella `icons/` con tutte le icone
- Scrivi un messaggio di commit: `ArboVTA PWA v3.0`
- Clicca **"Commit changes"**

### 4. Attiva GitHub Pages
- Vai su **Settings** → **Pages** (menu laterale sinistro)
- Source: **Deploy from a branch**
- Branch: **main** → cartella **/ (root)**
- Clicca **Save**

### 5. Accedi alla tua app
Dopo 1-2 minuti il sito sarà disponibile all'indirizzo:
```
https://TUO-USERNAME.github.io/arbovta/
```

---

## Installazione sul tablet/smartphone

### Android (Chrome)
1. Apri l'URL con Chrome
2. Appare automaticamente il banner "Installa ArboVTA" in basso
3. Tocca **Installa** → l'app appare nella schermata home

### iPad / iPhone (Safari)
1. Apri l'URL con Safari
2. Tocca l'icona **Condividi** (quadrato con freccia su)
3. Scorri e tocca **"Aggiungi a schermata Home"**
4. Conferma con **Aggiungi**

### Verifica funzionamento offline
1. Apri l'app una volta con connessione internet
2. Disattiva il WiFi/dati
3. Riapri l'app — funziona completamente offline
4. (Solo riconoscimento AI e sincronizzazione cloud richiedono internet)

---

## Permessi richiesti all'avvio

| Permesso | Utilizzo | Obbligatorio |
|----------|----------|--------------|
| **Fotocamera** | Riconoscimento specie + foto pianta | Consigliato |
| **Posizione GPS** | Georeferenziazione rilievo | Consigliato |
| **Orientamento dispositivo** | Clinometro digitale | Consigliato |

Tutti i permessi possono essere concessi in un secondo momento dalle impostazioni del browser.

---

## Aggiornamenti

Quando rilasci una nuova versione:
1. Modifica il numero versione in `sw.js` → `const CACHE_NAME = 'arbovta-v4'`
2. Carica i file aggiornati su GitHub
3. Gli utenti vedono automaticamente il banner "Aggiornamento disponibile"

---

## Risoluzione problemi

**La fotocamera non si attiva**
→ Verifica che il sito sia aperto in HTTPS (non http://)
→ Su iOS: Impostazioni → Safari → Fotocamera → Consenti

**Il sensore di orientamento non funziona (iOS 13+)**
→ L'app chiede il permesso con il pulsante "Attiva sensori"
→ Se il permesso viene negato, usa il simulatore con i cursori

**L'app non si installa**
→ Chrome Android: verifica che il sito sia in HTTPS
→ Safari iOS: usa "Aggiungi a schermata Home" dal menu Condividi

**Dati persi dopo chiusura app**
→ I dati sono salvati in localStorage del browser
→ Non cancellare i dati del browser/sito per non perdere i rilievi
→ Prossima versione: backend cloud con sync automatico
