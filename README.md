# Progetto Solare · I.I.S.S. Archimede

Web app che guida passo passo lo studente nel progetto di un impianto a pannelli solari per un servizio combinato (acqua calda sanitaria + riscaldamento a pannelli radianti) e alla fine genera la relazione Word con gli 11 punti richiesti.

## Pubblicazione
Il deploy è automatico: ogni push su `main` pubblica l'app con `.github/workflows/deploy.yml` su https://layer8panic.github.io/solarpanels/
(una volta sola: Settings → Pages → Source: **GitHub Actions**).

Funziona anche aprendo `index.html` in locale e resta disponibile senza connessione dopo la prima apertura.

## Struttura
- `index.html` pagina dell'app
- `css/app.css` stile (PC e telefono)
- `js/data.js` tabelle tecniche (Tab. 7A, Legge 10, Tab. 9, coefficienti, glicole, province)
- `js/calc.js` calcoli del progetto
- `js/steps.js` le 16 fasi con i compiti passo passo
- `js/tables.js` tabelle da toccare
- `js/figs-*.js` disegni generati sui dati inseriti
- `js/report.js` testo della relazione (11 punti)
- `js/layouts.js` stili di impaginazione che cambiano tra un alunno e l'altro
- `js/docx.js` creazione del file Word
- `js/app.js` interfaccia e salvataggio dei progressi
- `assets/logo.png` logo dell'istituto

Classe e docente predefiniti: V MAT 2026/2027, LILLO TIROLO (si cambiano in `js/app.js`, oggetto `DEF`).

Le regole di sviluppo sono in `CLAUDE.md`; le scelte di interfaccia seguono le skill in `.claude/skills/` (in particolare `ui-ux-pro-max`).
