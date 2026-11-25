// ===================== LA RELAZIONE: GLI 11 PUNTI =====================
function b64bytes(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
async function buildReport(){
  TH=makeTheme();const D=compute(),L=makeLayout(),R=rngFrom(hashStr(seedStr()+'#rep')),pick=a=>a[Math.floor(R()*a.length)];
  const Ly=D.layout,ed=EDIFICI[S.edificio]||'abitazione',up=s=>String(s||'').toUpperCase().trim(),g=GLICOLE[D.gtype];
  const TITLE='PROGETTO IMPIANTO A PANNELLI SOLARI PER UN SERVIZIO COMBINATO';
  const doc=new Doc('Progetto impianto a pannelli solari per un servizio combinato',L);
  // ---------- copertina (tre impaginazioni) ----------
  const cover=sceneHouse(D,{cut:true,title:V('ct',['Progetto impianto a pannelli solari','Impianto solare termico combinato','Pannelli solari per ACS e riscaldamento','Energia dal sole per la casa']),sub:V('cs',[`servizio combinato ACS + riscaldamento · ${D.loc}`,`${ed} · ${f0(D.A)} m² · ${D.loc}`,`${D.N} collettori solari · ${D.loc}`])});
  const who=[`ALUNNO: ${up(S.cognome)} ${up(S.nome)}`,`CLASSE: ${up(S.classe)}`,`DOCENTE DI RIFERIMENTO: ${up(S.docente)}`];
  doc.raw(b64bytes(LOGO_B64),LOGO_W,LOGO_H,16.5);
  if(L.cover==='C'){doc.p(TITLE,{style:'TitoloCop'});who.forEach(t=>doc.p(t,{style:'Copertina'}));doc.fig(cover,'',{width:L.coverFig,nocap:true})}
  else{doc.p(TITLE,{style:'TitoloCop'});doc.fig(cover,'',{width:L.coverFig,nocap:true});doc.p('',{style:'Spazio'});
    if(L.cover==='B')doc.table(who.map(t=>{const [a,b]=t.split(': ');return [`**${a}**`,b]}),{header:false,widths:[1.3,2],w:0.8,zebra:true});else who.forEach(t=>doc.p(t,{style:'Copertina'}))}
  doc.pb();
  // ---------- traccia ----------
  doc.p(TITLE,{style:'TitoloSez'});
  doc.p(`In una ${ed} di ${f0(D.A)} m² sita nella provincia di ${D.loc} si vuole realizzare un impianto a pannelli solari per adempiere al servizio combinato idrosanitario e riscaldamento a pannelli radianti.`);
  doc.p(`Si effettui il dimensionamento dell’impianto solare e la sua disposizione sul tetto della casa esposto a ${(S.dir||'Sud').toLowerCase()}${S.roof==='falda'?`, a falda inclinata di ${D.tilt}°`:', piano'}.`);
  doc.p(V('intro',[`La località appartiene all’Italia ${D.zona} (latitudine circa ${f1(D.lat)}° N) e ha una temperatura esterna di progetto di ${D.Tp} °C: il primo dato serve per scegliere la superficie dei pannelli, il secondo per l’antigelo.`,`Per la provincia di ${D.loc} si considera la zona Italia ${D.zona} e una temperatura esterna di progetto di ${D.Tp} °C.`,`Dati climatici di partenza: zona Italia ${D.zona}, temperatura minima di progetto ${D.Tp} °C, sole alto ${f1(D.noonW)}° a mezzogiorno del 21 dicembre e ${f1(D.noonS)}° il 21 giugno.`]));
  if(R()<.5)doc.fig(figSun3(D),V('fs',['Altezza del sole a mezzogiorno nelle diverse stagioni','Il percorso del sole rispetto alla falda']),{width:12.5});
  // ---------- 1 ----------
  doc.h1('1. CALCOLO DEL NUMERO DI PANNELLI DELL’IMPIANTO COMBINATO');
  doc.p(V('p1a',[`La prima cosa da fare è la scelta del pannello solare. Si sceglie il pannello **${D.P.n}**, di cui si riportano i dati principali della scheda tecnica.`,`Il pannello scelto è il **${D.P.n}**, un collettore ${D.P.tipo}: i dati usati nei calcoli vengono dalla sua scheda tecnica.`,`Per l’impianto si adotta il collettore **${D.P.n}** (${D.P.tipo}); dalla scheda tecnica si ricavano superficie, contenuto di liquido e perdite di carico.`]));
  if(L.pairs&&R()<.6)doc.pair(figPanelSheet(D),'Dati del pannello dalla scheda tecnica',figPanelType('piano'),'Struttura del collettore piano vetrato');
  else doc.fig(figPanelSheet(D),'Dati principali del pannello dalla scheda tecnica',{width:14});
  doc.p(V('p1b',[`Considerando l’impianto di ${D.size==='small'?'piccole dimensioni':'medie e grandi dimensioni'}, dalla letteratura tecnica si ricava che nell’Italia ${D.zona} servono da ${f2(D.zr[0])} a ${f2(D.zr[1])} m² di pannello ogni 10 m² di superficie abitata. Si sceglie **${f2(D.coef)} m²**.`,`La tabella degli impianti combinati per edifici abitativi indica, per l’Italia ${D.zona}, un intervallo di ${f2(D.zr[0])} ÷ ${f2(D.zr[1])} m² di pannello ogni 10 m² abitati. Si assume **${f2(D.coef)} m²**.`,`Dalla tabella dei coefficienti (impianti combinati, Italia ${D.zona}) si legge l’intervallo ${f2(D.zr[0])} ÷ ${f2(D.zr[1])} m² ogni 10 m² di casa; si adotta il valore **${f2(D.coef)}**.`]));
  doc.fig(figCoef(D),'Tabella dei coefficienti con il valore scelto',{width:12.5});
  doc.p(`**Calcolo:** la superficie abitata è di ${f0(D.A)} m², quindi:`);doc.cp(`S = ${f2(D.coef)} × ${f0(D.A)} / 10 = ${f2(D.Sreq)} m²`);
  doc.p(`La superficie di un pannello è di ${f2(D.Aref)} m², quindi il numero di pannelli sarà:`);doc.cp(`N = ${f2(D.Sreq)} m² / ${f2(D.Aref)} m² = ${f2(D.Nraw)} → ${D.N} pannelli`);
  doc.p(V('p1c',[`Arrotondando per eccesso si installano ${D.N} pannelli solari ${D.P.n}, per una superficie captante di **${f2(D.Snet)} m²**.`,`Il risultato si arrotonda per eccesso: ${D.N} pannelli, cioè **${f2(D.Snet)} m²** di superficie captante.`]));
  doc.h2(`${L.bullet} Disposizione dei pannelli sul tetto`);
  doc.p(V('p1d',[`I ${D.N} pannelli sono montati ${S.orient==='V'?'in verticale':'in orizzontale'} su ${Ly.rows} fil${Ly.rows>1?'e':'a'}, ${S.roof==='piano'?`su supporti inclinati di ${D.tilt}°`:`complanari alla falda inclinata di ${D.tilt}°`} ed esposta a ${(S.dir||'Sud').toLowerCase()}. Il campo occupa ${f2(Ly.blockW)} × ${f2(Ly.blockH)} m e lascia ${f1(S.margin)} m liberi dai bordi.`,`Sul tetto esposto a ${(S.dir||'Sud').toLowerCase()} si collocano ${D.N} pannelli ${S.orient==='V'?'verticali':'orizzontali'} su ${Ly.rows} fil${Ly.rows>1?'e':'a'}: il campo misura ${f2(Ly.blockW)} × ${f2(Ly.blockH)} m, a ${f1(S.margin)} m dai bordi${S.camino?' e lontano dal camino':''}.`]));
  if(L.pairs)doc.pair(sceneHouse(D,{cut:false,dims:true}),'Vista della casa con i pannelli',figPlan3(D),'Pianta della falda');
  else{doc.fig(sceneHouse(D,{cut:false,dims:true}),'Vista tridimensionale della casa con i pannelli',{width:14.5});doc.fig(figPlan3(D),'Pianta della falda con la posizione dei pannelli',{width:13})}
  // ---------- 2 ----------
  doc.h1('2. DIAMETRO DEI TUBI, MATERIALE DEI TUBI E ISOLAMENTO TERMICO PREVISTO');
  doc.h2(`${L.bullet} Materiale e diametro dei tubi`);
  doc.p(V('p2a',[`Come materiale del tubo si sceglie l’**acciaio non zincato**, perché oltre i 60 °C avvengono fenomeni di dezincatura. Il dimensionamento si effettua con il **metodo delle perdite di carico lineari costanti**.`,`Le tubazioni sono in **acciaio non zincato**: il tubo zincato non è adatto perché sopra i 60 °C, specie con il glicole, lo zinco si stacca. Si usa il **metodo delle perdite di carico lineari costanti**.`]));
  doc.p(V('p2b',[`Con una portata di ${f0(D.G)} l/h e una perdita di carico imposta di **${D.rimp} mm c.a./m**, nella tabella delle perdite di carico per tubi in acciaio con acqua a 50 °C il primo tubo adatto ha diametro esterno **${f1(D.pipeP.de)} mm** e diametro interno **${f1(D.pipeP.di)} mm**. Scendendo nella sua colonna si trova la perdita reale: **${D.r} mm c.a./m**.`,`La portata del circuito è ${f0(D.G)} l/h. Imponendo **${D.rimp} mm c.a./m** si sceglie, nella tabella dei tubi in acciaio, il tubo con De **${f1(D.pipeP.de)} mm** e Di **${f1(D.pipeP.di)} mm**; con questa portata la sua perdita effettiva è di **${D.r} mm c.a./m**.`]));
  doc.fig(figTab7A(D),'Tabella delle perdite di carico nei tubi in acciaio con la scelta evidenziata',{width:15.5});
  doc.h2(`${L.bullet} L’isolamento del tubo`);
  doc.p(V('p2c',[`L’isolante e gli spessori si calcolano secondo la Legge 10. Il materiale scelto è **${D.im.n.toLowerCase()}** con conduttività λ = ${f3(D.lam)} W/(m·K). Con un tubo di diametro esterno ${f1(D.pipeP.de)} mm la tabella prevede ${D.insTab} mm: si adotta lo spessore commerciale di **${D.insComm} mm**.`,`Per l’isolamento si segue la Legge 10. Si sceglie **${D.im.n.toLowerCase()}** (λ = ${f3(D.lam)} W/(m·K)); entrando nella tabella con λ = ${f3(INS_L[D.lamRow])} e De ${f1(D.pipeP.de)} mm si legge ${D.insTab} mm, quindi l’isolante commerciale è da **${D.insComm} mm**.`]));
  doc.p(`Dalla tabella della superficie esterna, un metro di tubo isolato ha **${f3(D.Sext)} m²** di superficie; per ${D.Ltot} m di tubo servono ${f2(D.Sext*D.Ltot)} m² di rivestimento. All’esterno l’isolante è protetto con un lamierino contro pioggia, raggi UV e animali.`);
  doc.fig(figDPR(D),'Spessori minimi dell’isolante (Legge 10)',{width:14});doc.fig(figTab9(D),'Superficie esterna per metro di tubo isolato',{width:13})
  doc.p('DISEGNO TRIDIMENSIONALE LINEA IMPIANTO SOLARE PRIMARIO COMBINATO',{style:'TitoloSez'});
  doc.fig(figTube3D(D),'Tubo del circuito primario con il suo isolamento',{width:14});
  // ---------- 3 ----------
  doc.h1('3. ADDITIVI DEL FLUIDO VETTORE');
  doc.p(V('p3a',[`Come additivo del fluido vettore si usa il **${g.n}**, che mescolato con l’acqua dà soluzioni che restano liquide anche a temperature molto basse. Il suo uso aumenta densità e viscosità della soluzione e quindi le perdite di pressione nel circuito.`,`Il fluido che circola nei pannelli è una miscela di acqua e **${g.n}**: non gela d’inverno, ma è più denso e viscoso dell’acqua e fa aumentare le perdite di carico.`]));
  doc.p(V('p3b',[`La temperatura esterna di progetto è ${D.Tp} °C; per sicurezza si protegge il circuito fino a ${D.Tprot} °C. Con una concentrazione in volume del **${D.gpct}%** si è protetti fino a **${D.Tg} °C**. Nei tubi d’acciaio questa miscela porta un fattore di maggiorazione delle perdite di pressione di **${f2(D.fg)}**.`,`Con ${D.Tp} °C di progetto si vuole una protezione fino a ${D.Tprot} °C. Una miscela al **${D.gpct}%** resta liquida fino a **${D.Tg} °C**; il fattore di maggiorazione delle perdite di carico nei tubi d’acciaio vale **${f2(D.fg)}**.`])+(g.tox?' Il glicole etilico è tossico: con l’acqua sanitaria è preferibile il propilenico.':''));
  doc.fig(figGlycol(D),`Temperatura di congelamento del ${g.n} e concentrazione scelta`,{width:13});
  // ---------- 4 ----------
  doc.h1('4. DIMENSIONAMENTO DELLA POMPA DI CIRCOLAZIONE');
  doc.p(V('p4a',['La scelta della pompa di circolazione si fa determinando la portata volumetrica e la prevalenza manometrica.','Per scegliere la pompa servono due dati: la portata da far circolare e la prevalenza, cioè la somma delle perdite di carico.']));
  doc.p(`Dalla scheda tecnica il pannello ha una perdita di carico di ${f0(D.P.Hp)} mm c.a. con una portata di ${f0(D.P.Gp)} l/h. Ogni pannello è attraversato da Gp = 40 × ${f2(D.Aref)} = ${f1(D.Gp)} l/h. I ${D.N} pannelli sono collegati ${D.conn==='serie'?'in serie':'in parallelo'}:`);
  doc.fig(figString(D),'Schema di stringa dei pannelli',{width:14});
  doc.p('**Calcolo portata totale della pompa di circolazione:**');doc.cp(`G = ${f1(D.Gp)} l/h × ${D.N} pannelli = ${f0(D.G)} l/h`);
  doc.p('**Calcolo perdita di pressione della stringa:**');
  if(D.conn==='serie'){doc.cp(`un pannello: (${f0(D.Gline)} / ${f0(D.P.Gp)})² × ${f0(D.P.Hp)} = ${f1(D.Hfield/D.per)} mm c.a.`);doc.cp(`${D.per} pannelli in serie: ${f1(D.Hfield/D.per)} × ${D.per} = ${f0(D.Hfield)} mm c.a.`)}
  else{doc.cp(`H = (${f1(D.Gp)} / ${f0(D.P.Gp)})² × ${f0(D.P.Hp)} = ${f1(D.Hfield)} mm c.a.`);doc.p('In parallelo ogni pannello è attraversato dalla propria portata: la perdita della stringa coincide con quella di un pannello.')}
  doc.p('**Calcolo perdita di pressione circuito solare:**');doc.p(`La lunghezza dei tubi tra la stringa e il serbatoio in centrale termica è di ${f1(D.Lone)} m × 2 (andata e ritorno) = ${D.Ltot} m.`);
  doc.cp(`perdite continue = ${D.r} mm c.a./m × ${D.Ltot} m = ${f0(D.Hcont)} mm c.a.`);doc.cp(`perdite localizzate (30%) = ${f0(D.Hloc)} mm c.a.`);
  doc.cp(`H = (${f0(D.Hcont)} + ${f0(D.Hloc)} + ${f0(D.Hfield)}) × ${f2(D.fg)} + ${f0(D.Hsc)} = ${f0(D.Htot)} mm c.a. = ${f2(D.Htot/1000)} m c.a.`);
  doc.p(V('p4b',[`Si sceglie un circolatore per impianti solari con portata di **${f3(D.G/1000)} m³/h** e prevalenza di almeno **${f2(D.Htot/1000)} m c.a.**, tarando la portata con il regolatore del gruppo idraulico.`,`Il circolatore deve garantire **${f3(D.G/1000)} m³/h** con una prevalenza di almeno **${f2(D.Htot/1000)} m c.a.**; la portata esatta si regola con il regolatore del gruppo di circolazione.`]));
  if(L.pairs)doc.pair(figPump3(D),'Curva dell’impianto e punto di lavoro',figLosses(D),'Composizione della prevalenza');else doc.fig(pick([figPump3,figLosses])(D),'Prevalenza richiesta alla pompa',{width:13});
  // ---------- 5 ----------
  doc.h1('5. POTENZA DELLO SCAMBIATORE DI CALORE');
  doc.p(V('p5a',['La potenza specifica di progetto è la potenza che 1 m² di pannello può captare e trasferire al fluido vettore con l’insolazione massima. Per pannelli piani con copertura trasparente si assume q = 400 kcal/(h·m²); la potenza dello scambiatore sarà:','Per i pannelli piani vetrati la potenza specifica di progetto è q = 400 kcal/(h·m²), cioè il calore che un metro quadrato di pannello può cedere al fluido nelle condizioni migliori. La potenza dello scambiatore vale:']));
  doc.cp(`Q = q × S = 400 kcal/(h·m²) × ${f2(D.Snet)} m² = ${f0(D.Q)} kcal/h = ${f2(D.QkW)} kW`);
  doc.p('Si ipotizzano le seguenti temperature del circuito solare e del circuito del serbatoio di accumulo:');
  doc.table([['Circuito','Entrata','Uscita'],['Circuito solare','50 °C','40 °C'],['Circuito serbatoio','35 °C','45 °C']],{widths:[2,1,1],w:0.7});
  doc.fig(figHX(D),'Scambiatore di calore a piastre con le temperature dei due circuiti',{width:14});
  // ---------- 6 ----------
  doc.h1('6. DIMENSIONAMENTO DEL VASO DI ESPANSIONE ASSUMENDO CON CRITERIO I PARAMETRI DI PROGETTAZIONE');
  doc.p('Il volume commerciale del vaso di espansione si determina con la formula:');doc.cp('Vn = Vu × (Pf + 1) / (Pf − Pi)');
  doc.bul(['**Vn** è il volume commerciale del vaso in litri;','**Pi** è la pressione di riempimento dell’impianto in bar: pressione statica + 0,5 bar;','**Pf** è la pressione finale in bar: pressione di apertura della valvola di sicurezza − 0,5 bar;','**Vu** è il volume utile: Vu = (Vc × e + VP) × k, con e = 0,07 per le miscele con glicole e k = 1,1.']);
  doc.p('**Calcolo del volume utile del vaso di espansione:**');
  doc.p('**a) Contenuto di liquido nei pannelli solari**');doc.cp(`VP = ${f1(D.P.vol)} l × ${D.N} = ${f1(D.VP)} l`);
  doc.p('**b) Contenuto di liquido nei tubi**');doc.p(`Il tubo ha diametro interno ${f1(D.pipeP.di)} mm; tra andata e ritorno ci sono ${D.Ltot} m di tubo:`);doc.cp(`π × Di² / 4 × L = 3,14 × ${fmt(D.pipeP.di/1000,4)}² / 4 × ${D.Ltot} = ${f1(D.Vt)} l`);
  doc.p('**c) Contenuto di liquido nello scambiatore**');doc.p(`Dalla scheda tecnica si considera un contenuto di ${f1(D.Vsc)} l.`);
  doc.cp(`Vc = ${f1(D.VP)} + ${f1(D.Vt)} + ${f1(D.Vsc)} = ${f1(D.Vc)} l`);doc.cp(`Vu = (${f1(D.Vc)} × 0,07 + ${f1(D.VP)}) × 1,1 = ${f1(D.Vu)} l`);
  doc.cp(`Pi = ${f1(D.Hst)} / 10,2 + 0,5 = ${f1(D.Pi)} bar`);doc.cp(`Pf = ${f1(D.Pvs)} − 0,5 = ${f1(D.Pf)} bar`);doc.cp(`Vn = ${f1(D.Vu)} × (${f1(D.Pf)} + 1) / (${f1(D.Pf)} − ${f1(D.Pi)}) = ${f1(D.Vn)} l`);
  doc.p(V('p6a',[`Il valore calcolato porta alla scelta del vaso commerciale da **${D.vaso} l**, con precarica di ${f1(D.Pi)} bar, montato sul ritorno con l’attacco in basso e senza isolamento.`,`Si sceglie un vaso commerciale da **${D.vaso} l**, precaricato a ${f1(D.Pi)} bar e installato sul ritorno, attacco verso il basso, senza isolante.`]));
  doc.fig(figVaso3(D,Math.round(105+R()*40)),'Il vaso accoglie la dilatazione del fluido e il vapore dei pannelli',{width:12});
  // ---------- 7 ----------
  doc.h1('7. DIMENSIONAMENTO DELLA VALVOLA DI SICUREZZA');
  doc.p(V('p7a',[`Si usa una valvola di sicurezza con pressione di apertura di **${f1(D.Pvs)} bar**. Deve essere previsto lo scarico della miscela antigelo in un contenitore di raccolta, ad esempio una tanica: è vietato lo scarico nella rete fognaria.`,`La valvola di sicurezza è tarata a **${f1(D.Pvs)} bar**, sotto la pressione massima dei pannelli. Lo scarico va in una tanica di raccolta della miscela antigelo, perché il glicole non può finire in fognatura.`]));
  doc.fig(figValve(D),'Valvola di sicurezza con tanica di raccolta',{width:11});
  // ---------- 8 ----------
  doc.h1('8. DIMENSIONAMENTO DEL SERBATOIO DI ACCUMULO');
  doc.p('Il volume del serbatoio di accumulo si determina con la formula:');doc.cp('V = (50 ÷ 60) × S');doc.p('dove V è in litri e S è la superficie dei pannelli in m².');
  doc.cp(`V = ${D.kV} × ${f2(D.Snet)} = ${f0(D.Vcalc)} l → serbatoio commerciale da ${D.Vtank} l`);
  doc.fig(figTank3(D),D.tankName,{width:10.5});
  // ---------- 9 ----------
  doc.h1('9. SCHEMA DELLA CENTRALE TERMICA DELL’IMPIANTO SOLARE E RELATIVA REGOLAZIONE');
  doc.fig(figCentraleSol(D,{on:true}),'Centrale termica dell’impianto solare',{width:16});
  doc.p(V('p9a',['La regolazione del circuito solare si effettua con un **termoregolatore differenziale**, che permette di impostare la differenza di temperatura ΔT voluta. Due sonde rilevano la temperatura dei pannelli (S1) e del serbatoio di accumulo (S2).','Il circuito solare è comandato da una **centralina differenziale** collegata a due sonde: S1 sui pannelli e S2 nella parte bassa del serbatoio.']));
  doc.p(`Se la differenza di temperatura supera il ΔT di taratura, scelto pari a **${D.dton} °C** (valori usuali 5 ÷ 8 °C), la pompa del circuito solare si accende; in caso contrario resta spenta. La pompa si ferma anche quando il serbatoio raggiunge ${D.tmax} °C.`);
  // ---------- 10 ----------
  doc.h1('10. SCHEMA DELLA CENTRALE TERMICA DELL’IMPIANTO COMBINATO E LA SUA REGOLAZIONE');
  doc.fig(figCentraleComb(D,{T1:Math.round(48+R()*14),T2:Math.round(27+R()*5)}),'Centrale termica dell’impianto combinato',{width:16});
  doc.num(['**L’acqua fredda** dell’acquedotto va nell’accumulatore 1 e può andare nella valvola deviatrice dell’idrosanitario.','**Nell’accumulatore 1** l’acqua fredda si riscalda a spese del circuito primario del solare.','**Il ritorno del riscaldamento** a pannelli radianti è misurato dalla sonda T2. Essendo freddo deve prendere calore: dalla caldaia oppure dall’accumulatore 1, se questo è caldo grazie al sole. Se T1 > T2 la valvola deviatrice manda il ritorno nel circuito di recupero: la pompa porta l’acqua calda dell’accumulatore allo scambiatore a piastre, che cede calore al ritorno.','**Il ritorno passa in caldaia**: prende calore se serve, oppure la attraversa soltanto se è già alla temperatura richiesta, e torna all’impianto a pavimento.','**Nello stesso tempo** l’acqua calda della caldaia, spinta dalla pompa dell’accumulatore 2 comandata dal suo termostato, scalda l’acqua sanitaria, che arriva alle utenze attraverso la valvola miscelatrice.']);
  // ---------- 11 ----------
  doc.h1('11. IL SURRISCALDAMENTO NEGLI IMPIANTI SOLARI TERMICI COMBINATI');
  doc.p(V('p11a',['Il surriscaldamento è un fenomeno che si verifica quando l’impianto solare termico riceve più energia solare di quella necessaria per l’acqua calda sanitaria e il riscaldamento. La temperatura nei pannelli e nei serbatoi sale troppo, con aumenti di pressione e possibili problemi ai componenti.','Si parla di surriscaldamento quando il sole fornisce più calore di quello richiesto da acqua calda e riscaldamento: pannelli e accumulo si scaldano oltre il necessario, la pressione cresce e i componenti vengono sollecitati.']));
  doc.p('**Le principali cause del surriscaldamento sono:**');doc.bul(['eccessiva esposizione dei pannelli solari al sole;','scarso utilizzo dell’acqua calda sanitaria;','accumulo già completamente riscaldato;','mancanza di circolazione del fluido termovettore.']);
  doc.p('**I sistemi di protezione dal surriscaldamento sono:**');doc.bul([`**valvola di sicurezza** (${f1(D.Pvs)} bar): interviene quando la pressione supera il limite consentito;`,`**vaso di espansione** (${D.vaso} l): assorbe le variazioni di volume del fluido e il vapore;`,`**centralina di controllo**: ferma la pompa a ${D.tmax} °C e gestisce l’impianto;`,'**sistemi di raffreddamento**: dissipatore o raffreddamento notturno dell’accumulo.']);
  doc.p(V('p11b',['Una corretta gestione del surriscaldamento garantisce sicurezza, efficienza e lunga durata dell’impianto.','Con questi dispositivi l’impianto sfrutta il sole restando in sicurezza anche nelle giornate estive più calde.']));
  doc.fig(figSurr(D,{stag:true}),'Cause e protezioni del surriscaldamento',{width:15});
  return doc;
}
