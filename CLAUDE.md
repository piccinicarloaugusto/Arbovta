# ArboRisk – istruzioni di lavoro

PWA a file singolo per rilievi di rischio alberi (VTA ordinario/speditivo). Autore: Dott. Agr. Carlo Piccini. Rispondere in **italiano**.

## File dell'app
`index.html` (tutta l'app), `sw.js` (service worker, cache `arborisk-vNN`), `manifest.json`. Backup/sync: Firebase Firestore (progetto `arbovta`).

## Flusso di lavoro
1. Lavorare **solo sul ramo `sviluppo`**. `main` è collegato a Netlify (auto-deploy, consuma crediti): si unisce solo dopo che l'utente ha provato la versione.
2. A ogni versione: incrementare la cache in `sw.js` (`arborisk-vNN`) **e** l'etichetta visibile `#app-ver` in `index.html` (`vNN · rilievi VTA`).
3. Controllo sintassi: estrarre il `<script>` inline più grande e lanciare `node --check`.
4. Prima di consegnare, testare in simulazione con Playwright (`tests/`, vedi sotto).
5. Consegnare anche uno zip cumulativo (index.html, sw.js, manifest.json) all'utente.
6. Non toccare `main` senza ok esplicito dell'utente.

## Test
```
cd tests && npm install   # jspdf, leaflet
ARBO_HTML=/percorso/index.html node t33.js
```
Chromium/Playwright sono preinstallati nell'ambiente. Ogni `tNN.js` verifica una funzione (sync, mappa, eliminazione, snapshot, ecc.); Firebase va mockato.

## Modello dati e formule
- Stato `G = {trees, form, clino, ai}`; `G_projects` (clienti → progetti → rilievi); `G_nav`.
- IR = (J27+J37+J47)·FC·FD. Classi: A≤30, B≤120, C≤300, C/D≤600, D>600.
- FD = (sig(H;0.4;12) + fdTrunk(circM) + sig(chioma media;0.7;6))/3; `fdTrunk=10/(1+exp(-0.02*(circM*100-200)))` (circonferenza in metri); centro chioma 6 per tutte le specie (variante pini rimossa). Riferimento di controllo: CLQ12 → FD 8.96, IR≈269, classe C.

## Sync Firebase
- Collezioni: `trees` (solo metadati foto), `photos` (`${treeId}__${pid}`), `meta/projects`, `meta/deleted`. Quota gratuita 20k scritture/giorno: scrivere solo gli alberi cambiati (`stampChanged`, `isSynced`).
- Vince `_savedAt` più recente; l'albero in modifica non viene mai sovrascritto. Eliminazioni propagate con tombstone.
- I progetti si pushano solo dopo una lettura cloud riuscita (`_projPushOK`). Le scritture Firestore vanno avvolte in `withTimeout`.
- Foto in IndexedDB `arborisk-photos`, scaricate on demand (`ensureTreePhotos`).

## Cose da non rompere
Coordinate lat/lng possono essere stringhe (usare `normalizeTreeCoords`); pulsante "+ Nuovo" visibile anche in orizzontale; scheda Impostazioni separata (con Report PDF ed Export Excel).

## Da fare (storico)
Import archivio Ginve (formato in attesa), metodi QTRA/ARETE', Worker PlantNet non configurato, verifica coerenza FD con testo Sani.
