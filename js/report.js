// ===================== LA RELAZIONE: GLI 11 PUNTI (sul modello allegato) =====================
function b64bytes(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
async function buildReport(){
  TH=makeTheme();const D=compute(),L=makeLayout(),up=s=>String(s||'').toUpperCase().trim(),g=GLICOLE[D.gtype];
  const TITLE='PROGETTO IMPIANTO A PANNELLI SOLARI PER UN SERVIZIO COMBINATO';
  const ed=S.edificio==='palazzina'?'palazzina':'villetta unifamiliare',esp=(S.dir||'Sud').toLowerCase();
  const doc=new Doc('Progetto impianto a pannelli solari per un servizio combinato',L);
  // ---------- copertina ----------
  doc.raw(b64bytes(LOGO_B64),LOGO_W,LOGO_H,16);
  doc.p(TITLE,{style:'TitoloCop'});
  doc.fig(figImpianto(D,{mini:true}),'',{width:15,nocap:true});
  doc.p('',{style:'Spazio'});
  [`ALUNNO: ${up(S.cognome)} ${up(S.nome)}`,`CLASSE: ${up(S.classe)}`,`DOCENTE DI RIFERIMENTO: ${up(S.docente)}`].forEach(t=>doc.p(t,{style:'Copertina'}));
  doc.pb();
  // ---------- traccia ----------
  doc.p(TITLE,{style:'TitoloSez'});
  doc.p(`In una ${ed} di ${f0(D.A)} m² sita nella provincia di ${D.loc} si vuole realizzare un impianto a pannelli solari per adempiere al servizio combinato idrosanitario e riscaldamento a pannelli radianti.`);
  doc.p(`Si effettui il dimensionamento dell’impianto solare e la sua disposizione sul tetto della casa esposto a ${esp}. Il tetto è a falda inclinata di ${D.tilt}°.`);
  // ---------- 1 ----------
  doc.h1('1. CALCOLO DEL NUMERO DI PANNELLI DELL’IMPIANTO COMBINATO');
  doc.p(`La prima cosa da effettuare è la scelta del pannello solare impiegato nell’impianto. La scelta è quella del pannello **${D.P.n}**, le cui caratteristiche sono riportate sulla scheda tecnica allegata al progetto. Considerando l’impianto di ${D.size==='small'?'piccole':'medio-grandi'} dimensioni, dalla letteratura tecnica si ricava che nell’**Italia ${D.zona}** sono sufficienti **${f2(D.coef)} m²** di pannello ricettivo per ogni **10 m²** di superficie abitata.`);
  doc.fig(figCoef(D),'Edifici ad uso abitativo: superfici nette dei pannelli piani',{width:11});
  doc.p(`**Calcolo:** la superficie abitata è di **${f0(D.A)} m²**, quindi:`);doc.cp(`${f2(D.coef)} × ${f0(D.A)} / 10 = ${f2(D.Sreq)} m²`);
  doc.p(`Dalla scheda tecnica la superficie netta ricettiva del pannello scelto è di **${f2(D.Aref)} m²**, quindi il numero di pannelli sarà:`);
  doc.cp(`${f2(D.Sreq)} m² / ${f2(D.Aref)} m² = ${f2(D.Nraw)} → ${D.N} pannelli solari ${D.P.n}`);
  doc.p(`Il risultato si arrotonda per eccesso: la superficie installata è ${D.N} × ${f2(D.Aref)} = **${f2(D.Snet)} m²**. I pannelli sono disposti sulla falda esposta a ${esp}, con la stessa inclinazione di ${D.tilt}°.`);
  doc.fig(sceneHouse(D,{cut:false,dims:true}),'Disposizione dei pannelli sul tetto',{width:14});
  // ---------- 2 ----------
  doc.h1('2. DIAMETRO DEI TUBI, MATERIALE DEI TUBI E ISOLAMENTO TERMICO PREVISTO');
  doc.h2(`${L.bullet} Materiale e diametro dei tubi`);
  doc.p(`Come materiale del tubo scegliamo l’**acciaio non zincato**, perché oltre i **60 °C** avvengono fenomeni di **dezincatura**. Il dimensionamento delle tubazioni viene effettuato con il **metodo delle perdite di carico lineari costanti**.`);
  doc.p(`La portata di un pannello è **Gp = 40 × ${f2(D.Aref)} = ${f0(D.Gp)} l/h** (40 l/h per ogni m² di pannello); con ${D.N} pannelli in stringa nel tubo passano **G = ${f0(D.Gp)} × ${D.N} = ${f0(D.G)} l/h**. Imponiamo una perdita di carico lineare di **12 mm c.a./m**. Per i tubi in acciaio in cui scorre acqua a **50 °C**, con tale perdita di carico, nella riga 12 della Tab. 7A il primo tubo che porta almeno ${f0(D.G)} l/h ha diametro esterno di **${f1(D.pipeP.de)} mm** e diametro interno di **${f1(D.pipeP.di)} mm**.`);
  doc.fig(figTab7A(D),'Tab. 7A – Tubi in acciaio, acqua a 50 °C: perdite di carico continue',{width:16});
  doc.h2(`${L.bullet} L’isolamento del tubo`);
  doc.p(`L’isolante e gli spessori vengono calcolati secondo la **Legge 10**. Il materiale isolante scelto è **${D.im.n.toLowerCase()}**, che ha una conduttività termica utile pari a **λ = ${f3(D.lam)} W/mK**. Dato che il diametro esterno del tubo è pari a ${f1(D.pipeP.de)} mm, dalla tabella della Legge 10 (riga λ = ${f3(INS_L[D.lamRow])}, colonna ${INS_C[D.insCol]} mm) è previsto uno spessore dell’isolante di **${D.insTab} mm**${D.insComm!==D.insTab?`, arrotondato a **${D.insComm} mm**`:''}.`);
  doc.fig(figDPR(D),'Isolamento delle reti di distribuzione del calore (Legge 10, DPR 412/93)',{width:15});
  doc.p(`Pertanto, dalla **Tab. 9**, per un metro di tubo isolato si ricava una superficie esterna di **${f3(D.Sext)} m²**.`);
  doc.fig(figTab9(D),'Tab. 9 – Superficie esterna riferita a un metro di tubo isolato',{width:14});
  doc.p('DISEGNO TRIDIMENSIONALE LINEA IMPIANTO SOLARE PRIMARIO COMBINATO',{style:'TitoloSez'});
  doc.fig(figTube3D(D),'Tubo del circuito primario con la guaina isolante e sezione quotata',{width:16});
  // ---------- 3 ----------
  doc.h1('3. ADDITIVI DEL FLUIDO VETTORE');
  doc.p(`Come additivo del fluido vettore utilizziamo il **${g.n}** che, mescolato con acqua, consente di ottenere soluzioni che rimangono allo stato liquido anche a temperature molto basse. Il suo utilizzo, dovuto a un aumento della densità e della viscosità della soluzione rispetto all’acqua, determina una maggiorazione della perdita di pressione nel circuito.`);
  doc.p(`Con una concentrazione volumetrica di ${g.n} del **${D.gpct}%** siamo protetti per una temperatura pari a **${D.Tg} °C**, valore adeguato per l’Italia ${D.zona}. Tale valore nei tubi di acciaio determina un fattore di maggiorazione delle perdite di pressione di **${f2(D.fg)}**.`);
  doc.fig(figGlycol(D),`Temperatura di congelamento del ${g.n} e concentrazione scelta`,{width:12.5});
  // ---------- 4 ----------
  doc.h1('4. DIMENSIONAMENTO DELLA POMPA DI CIRCOLAZIONE');
  doc.p('La scelta della pompa di circolazione viene effettuata determinando la portata volumetrica e la prevalenza manometrica.');
  doc.p(`Dalla scheda tecnica del pannello scelto si ricava una perdita di carico **Hp = ${f0(D.P.Hp)} mm c.a.** con una portata **Gp = ${f0(D.P.Gp)} l/h**. Dal calcolo del numero di pannelli (${D.N} pannelli) deduciamo il seguente schema di stringa:`);
  doc.fig(figString(D),'Schema di stringa dei pannelli',{width:15});
  doc.p('**Calcolo portata totale della pompa di circolazione:**');doc.cp(`G = ${f0(D.Gp)} l/h × ${D.N} pannelli = ${f0(D.G)} l/h`);
  doc.p('**Calcolo perdita di pressione della stringa** – perdita di un solo pannello attraversato dalla portata totale:');
  doc.cp(`H = (G / Gp)² × Hp = (${f0(D.G)} / ${f0(D.P.Gp)})² × ${f0(D.P.Hp)} = ${f0(D.Hp1)} mm c.a.`);doc.p('Perdita della stringa:');doc.cp(`${f0(D.Hp1)} mm c.a. × ${D.N} = ${f0(D.Hfield)} mm c.a.`);
  doc.p(`**Calcolo perdita di pressione circuito solare:** ipotizzando una lunghezza dei tubi che collegano la stringa con il serbatoio di accumulo posto in centrale pari a ${D.Lone} m × 2 (andata e ritorno) = ${D.Ltot} m, la perdita di pressione continua sarà:`);
  doc.cp(`12 mm c.a./m × ${D.Ltot} m = ${f0(D.Hcont)} mm c.a.`);
  doc.p(`**Prevalenza totale:** si sommano le perdite, si moltiplicano per il fattore del glicole (${f2(D.fg)}) e si aggiunge la perdita dello scambiatore, assunta pari a 500 mm c.a.:`);
  doc.cp(`H = (${f0(D.Hfield)} + ${f0(D.Hcont)}) × ${f2(D.fg)} + 500 = ${f0(D.Htot)} mm c.a. = ${f2(D.Htot/1000)} m c.a.`);
  doc.p(`Si sceglie quindi un circolatore per impianti solari con portata di **${f0(D.G)} l/h (${f3(D.G/1000)} m³/h)** e prevalenza di almeno **${f2(D.Htot/1000)} m c.a.**`);
  // ---------- 5 ----------
  doc.h1('5. DIMENSIONAMENTO DELLO SCAMBIATORE DI CALORE');
  doc.p('La potenza specifica di progetto è la potenza captabile e trasferibile al fluido vettore da 1 m² di pannello con insolazione massima. Per pannelli piani con copertura trasparente, come i pannelli scelti, possiamo assumere il valore q = 400 kcal/h per m²; pertanto la potenza termica dello scambiatore a piastre sarà:');
  doc.cp(`Q = q × S = 400 kcal/(h·m²) × ${f2(D.Aref)} × ${D.N} pannelli = ${f0(D.Q)} kcal/h = ${f2(D.QkW)} kW`);
  doc.p('Si ipotizzano le seguenti temperature del circuito solare e del circuito del serbatoio di accumulo:');
  doc.table([['Circuito','Temperatura di entrata','Temperatura di uscita'],['Circuito solare','50 °C','40 °C'],['Circuito serbatoio','35 °C','45 °C']],{widths:[2,1.4,1.4],w:0.8});
  doc.fig(figHX(D),'Scambiatore di calore a piastre: circuito solare e circuito serbatoio',{width:13});
  // ---------- 6 ----------
  doc.h1('6. DIMENSIONAMENTO DEL VASO DI ESPANSIONE ASSUMENDO CON CRITERIO I PARAMETRI DI PROGETTAZIONE');
  doc.p('Il volume commerciale del vaso di espansione si determina con la seguente formula:');doc.cp('Vn = Vu × (Pf + 1) / (Pf − Pi)');
  doc.bul(['**Vn** è il valore commerciale in litri del vaso di espansione;','**Pi** è la pressione di riempimento dell’impianto in bar: pressione statica + 0,5 bar;','**Pf** è la pressione finale in bar: pressione di apertura della valvola di sicurezza − 0,5 bar.']);
  doc.p('**Calcolo del volume utile del vaso di espansione:**');doc.cp('Vu = (Vc × e + VP) × k');doc.p('con Vc contenuto di fluido nel circuito solare, e = 0,07 e k = 1,1.');
  doc.p('**a) Contenuto di liquido nei pannelli solari**');doc.p(`Un pannello del tipo scelto contiene ${f1(D.P.vol)} l di liquido. Essendo l’impianto costituito da ${D.N} pannelli, il contenuto totale è:`);doc.cp(`VP = ${f1(D.P.vol)} × ${D.N} = ${f1(D.VP)} l`);
  doc.p('**b) Contenuto di liquido nei tubi**');doc.p(`Il tubo scelto ha un diametro interno di ${fmt(D.pipeP.di/1000,4)} m (${f1(D.pipeP.di)} mm). Considerando ${D.Ltot} m di tubo tra andata e ritorno, il contenuto di liquido sarà:`);
  doc.cp(`π × Di² / 4 × L = 3,14 × ${fmt(D.pipeP.di/1000,4)}² / 4 × ${D.Ltot} = ${fmt(D.Vt/1000,4)} m³ = ${f1(D.Vt)} l`);
  doc.p('**c) Contenuto di liquido nello scambiatore**');doc.p(`Dalla scheda tecnica dello scambiatore, considerata la sua potenza, si assume un contenuto di liquido di ${f0(D.Vsc)} l (valori tra 24 e 30 l).`);
  doc.p('Il contenuto totale di liquido nel circuito solare primario è:');doc.cp(`Vc = ${f1(D.VP)} + ${f1(D.Vt)} + ${f0(D.Vsc)} = ${f1(D.Vc)} l`);
  doc.cp(`Vu = (${f1(D.Vc)} × 0,07 + ${f1(D.VP)}) × 1,1 = ${f2(D.Vu)} l`);
  doc.p(`La pressione statica è data dall’altezza del liquido sopra il vaso: circa ${f1(D.Hst)} m, cioè ${f1(D.Hst)} / 10,2 = ${f2(D.Pst)} bar.`);
  doc.cp(`Pf = ${f0(D.Pvs)} bar − 0,5 bar = ${f1(D.Pf)} bar`);doc.cp(`Pi = ${f2(D.Pst)} bar + 0,5 bar ≈ ${f1(D.Pi)} bar`);doc.cp(`Vn = ${f2(D.Vu)} × (${f1(D.Pf)} + 1) / (${f1(D.Pf)} − ${f1(D.Pi)}) = ${f2(D.Vn)} l`);
  doc.p(`Il valore calcolato porta alla scelta del vaso di espansione commerciale da **${D.vaso} l**.`);
  // ---------- 7 ----------
  doc.h1('7. DIMENSIONAMENTO DELLA VALVOLA DI SICUREZZA');
  doc.p(`Utilizziamo una valvola di sicurezza con un valore di apertura pari a **${f0(D.Pvs)} bar**; deve essere previsto l’eventuale scarico della miscela antigelo in un contenitore di raccolta, ad esempio una tanica del fluido antigelo: è vietato lo scarico nella rete fognaria.`);
  doc.fig(figValve(D),'Valvola di sicurezza con tanica di raccolta della miscela antigelo',{width:10.5});
  // ---------- 8 ----------
  doc.h1('8. DIMENSIONAMENTO DEL SERBATOIO DI ACCUMULO');
  doc.p('Il volume del serbatoio di accumulo si determina con la seguente formula:');doc.cp('V = (50 ÷ 60) × S');doc.p('dove V è il volume in litri e S è la superficie netta dei pannelli in m².');
  doc.cp(`V = ${D.kV} l/m² × ${f2(D.Snet)} m² = ${f0(D.Vcalc)} l`);
  doc.p(`Si sceglie un ${D.tankName.toLowerCase()} commerciale da **${D.Vtank} l** (${fmt(D.Vtank/1000,2)} m³).`);
  doc.fig(figTank3(D),D.tankName,{width:9.5});
  // ---------- 9 ----------
  doc.h1('9. SCHEMA DELLA CENTRALE TERMICA DELL’IMPIANTO SOLARE E RELATIVA REGOLAZIONE');
  doc.fig(figCentraleSol(D,{on:true}),'Centrale termica dell’impianto solare a circolazione forzata',{width:15});
  doc.p('La regolazione del circuito solare viene effettuata mediante l’impiego di un **termoregolatore differenziale**. Tale strumento è costituito da un regolatore che consente di impostare la differenza di temperatura ΔT voluta e da **due sonde** che rilevano la temperatura dei pannelli e del serbatoio di accumulo.');
  doc.p(`Se tra i pannelli e il serbatoio le sonde registrano una differenza di temperatura superiore al ΔT di taratura del regolatore, scelto pari a **${D.dton} °C** (valori usuali tra 5 e 8 °C), viene attivata la pompa del circuito solare; in caso contrario resta disattivata.`);
  // ---------- 10 ----------
  doc.h1('10. SCHEMA DELLA CENTRALE TERMICA DELL’IMPIANTO COMBINATO E LA SUA REGOLAZIONE');
  doc.fig(figCentraleComb(D,{T1:55,T2:30}),'Centrale termica dell’impianto combinato',{width:15.5});
  doc.num(['**L’acqua fredda** dall’acquedotto va nell’accumulatore 1 e può andare nella valvola deviatrice dell’idrosanitario.','**Nell’accumulatore 1** l’acqua fredda si riscalda a spese del circuito primario del solare.','**Consideriamo il ritorno** del riscaldamento a pannelli radianti: la sonda T2 ne misura la temperatura. Il ritorno, essendo freddo, deve prendere calore, direttamente dalla caldaia o dall’accumulatore 1 se questo è caldo per energia solare: se T1 > T2 la valvola deviatrice immette il ritorno nel circuito di recupero dell’energia solare termica. La pompa avvia l’acqua calda dell’accumulatore verso lo scambiatore di calore a piastre, che cede calore al ritorno del pannello radiante.','**Il ritorno del pannello radiante va in caldaia**: qui può prendere calore oppure solo transitare, se la sua temperatura è già quella richiesta. Poi ritorna nel riscaldamento a pannelli radianti.','**Nello stesso tempo** l’acqua calda che esce dalla caldaia, spinta dalla pompa del 2° accumulatore azionata dal suo termostato, va a riscaldare l’acqua del servizio idrosanitario, alimentato attraverso la valvola miscelatrice.']);
  // ---------- 11 ----------
  doc.h1('11. IL SURRISCALDAMENTO NEGLI IMPIANTI SOLARI TERMICI COMBINATI');
  doc.p('Il surriscaldamento è un fenomeno che si verifica quando l’impianto solare termico riceve più energia solare di quella necessaria per soddisfare il fabbisogno di acqua calda sanitaria (ACS) e di riscaldamento.');
  doc.p('Questo fenomeno può causare un aumento eccessivo della temperatura dell’acqua nei pannelli solari e nei serbatoi di accumulo, con conseguenti aumenti di pressione e possibili problemi ai componenti dell’impianto.');
  doc.fig(figImpianto(D),'Impianto solare termico per servizio combinato con gestione del surriscaldamento',{width:14.5});
  doc.p('**Le principali cause del surriscaldamento sono:**');doc.bul(['eccessiva esposizione dei pannelli solari al sole;','scarso utilizzo dell’acqua calda sanitaria;','accumulo già completamente riscaldato;','mancanza di circolazione del fluido termovettore.']);
  doc.p('**I sistemi di protezione dal surriscaldamento sono:**');doc.bul([`**valvola di sicurezza** (${f0(D.Pvs)} bar): interviene quando la pressione supera il limite consentito;`,`**vaso di espansione** (${D.vaso} l): assorbe le variazioni di volume del fluido dovute all’aumento della temperatura;`,'**centralina di controllo**: monitora le temperature e gestisce il funzionamento delle pompe;','**sistema di raffreddamento**: permette di ridurre la temperatura dell’accumulo quando necessario.']);
  doc.p('La gestione del surriscaldamento è fondamentale per garantire il corretto funzionamento, la sicurezza e la durata dell’impianto solare termico combinato. Grazie ai sistemi di protezione è possibile sfruttare l’energia solare riducendo i rischi di temperature e pressioni eccessive.');
  return doc;
}
