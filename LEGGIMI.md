# Allenamento — PWA da mettere su GitHub Pages

Questa cartella contiene l'app come **Progressive Web App**: una volta online e
installata sulla home, si apre come un'app vera, funziona **offline** e salva i
dati da sola (IndexedDB). Niente più export/import per l'uso quotidiano.

## File inclusi
- `index.html` — l'app (deve chiamarsi esattamente così)
- `manifest.webmanifest` — descrive l'app (nome, icona, colori)
- `sw.js` — il service worker (cache offline)
- `icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — icone

**Importante:** tieni tutti i file nella stessa cartella, con questi nomi.

## Metterla online (GitHub Pages)
1. Su github.com crea un repository **Public**, es. `allenamento`.
2. "Add file" → "Upload files" → trascina **tutti** i file di questa cartella
   (index.html, manifest, sw.js e le 4 icone) → "Commit changes".
3. Settings → Pages → "Build and deployment":
   Source = **Deploy from a branch**, Branch = **main**, cartella **/ (root)** → Save.
4. Dopo 1-2 minuti compare il link: `https://TUONOME.github.io/allenamento/`

## Installarla sul telefono
- **iPhone (Safari):** apri il link → pulsante Condividi → "Aggiungi a Home".
- **Android (Chrome):** apri il link → menu ⋮ → "Installa app" / "Aggiungi a schermata Home".

Da quel momento l'icona sulla home apre l'app a schermo intero. I dati restano
sul telefono e sopravvivono alla chiusura, anche senza connessione.

## Quando aggiorni l'app in futuro
Se ricarichi una nuova versione dei file, apri `sw.js` e cambia la riga
`var CACHE = "allenamento-v1";` in `"allenamento-v2"` (poi v3, ecc.).
Questo forza il telefono a scaricare la versione nuova invece di quella in cache.

## Backup (opzionale)
Il menu ⋯ dell'app ha ancora Esporta/Importa JSON: usali solo come backup di
sicurezza o se un giorno vuoi spostare i dati altrove. Per l'uso di tutti i
giorni non servono.
