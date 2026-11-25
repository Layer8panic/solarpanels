// ===================== IL PERCORSO GUIDATO =====================
// Segue gli 11 punti della relazione modello. Ogni fase: cosa facciamo, da dove vengono i numeri, perché.
// Ogni calcolo ha "why": cosa sto calcolando e perché si calcola così.
const ZIDX={Nord:0,Centro:1,Sud:2};
const provOpts=()=>Object.entries(REGIONI).map(([r,v])=>`<optgroup label="${xesc(r)}">${Object.keys(v.p).map(p=>`<option value="${xesc(p)}" ${S.prov===p?'selected':''}>${p}</option>`).join('')}</optgroup>`).join('');
const STEPS=[
{id:'copertina',grp:'Inizio',t:'Chi sei',
 tutor:D=>({msg:'Ciao! Ti accompagno passo passo nel progetto, fino alla relazione Word con gli <b>11 punti</b>. Non serve sapere niente prima: ogni numero ti dico da dove viene e perché si usa.<br>Per cominciare scrivi <b>nome e cognome</b> per la copertina.'}),
 form:D=>`<img class="logo-img" alt="I.I.S.S. Archimede" src="./assets/logo.png" style="margin-bottom:12px"><div class="g2">${txt('nome','Nome')}${txt('cognome','Cognome')}</div><div class="g2">${txt('classe','Classe')}${txt('docente','Docente di riferimento')}</div>`,
 need:['nome','cognome'],
 figs:[{n:'L’impianto che progetteremo',f:D=>figImpianto(D,{mini:true})}]},

{id:'casa',grp:'I dati della traccia',t:'La casa',
 tutor:D=>({msg:'Copia dalla traccia la <b>superficie abitata</b> e la <b>provincia</b>. Esempio della traccia: “villetta unifamiliare di 180 m² in provincia di Agrigento”.',
  dove:'Tutti e tre i dati sono scritti nella prima riga della traccia. I piani servono solo per stimare l’altezza dell’impianto (vaso di espansione); se non sono scritti, una villetta ha di solito 2 piani.',
  perche:`Dalla provincia ricavo la <b>zona</b> (Italia Nord, Centro o Sud): al Sud c’è più sole, quindi servono meno pannelli.${S.prov?` ${xesc(S.prov)} → <b>Italia ${D.zona}</b>.`:''}`}),
 form:D=>`<div class="g2"><div>${numf('A','Superficie abitata','m²',20,5000,1)}${sel('edificio','Tipo di edificio',[['villetta','Villetta unifamiliare'],['palazzina','Palazzina (impianto medio-grande)']])}</div>
  <div><div class="ctrl"><label>Provincia</label><select data-k="prov" class="${isNull(S.prov)?'miss':''}"><option value="">Scegli…</option>${provOpts()}</select></div>${numf('piani','Piani della casa','',1,6,1)}${S.prov?`<div class="note">Zona: <b>Italia ${D.zona}</b> (${xesc(D.reg)})</div>`:''}</div></div>`,
 need:['A','prov'],
 gives:D=>[['Superficie',f0(D.A)+' m²'],['Zona',`Italia ${D.zona}`]],
 figs:[{n:'Le tre zone d’Italia',f:D=>figLat(D)}]},

{id:'tetto',grp:'I dati della traccia',t:'Il tetto',
 tutor:D=>({msg:'Dalla traccia: verso dove guarda il tetto e quanto è inclinato. Esempio: “tetto esposto a sud, a falda inclinata di 35°”.',
  dove:'Sono scritti nella traccia, subito dopo la superficie.',
  perche:'I pannelli si montano appoggiati sulla falda, quindi prendono la stessa inclinazione e la stessa esposizione del tetto. Verso Sud prendono il sole tutto il giorno.'}),
 form:D=>`<div class="g2"><div>${sel('dir','Il tetto è esposto a',Object.keys(DIR_AZ).map(k=>[k,k]))}</div><div>${numf('tilt','Inclinazione della falda','°',5,70,1)}</div></div>`,
 need:['tilt'],
 gives:D=>[['Esposizione',S.dir],['Inclinazione',D.tilt+'°']],
 figs:[{n:'La casa in 3D',f:D=>sceneHouse(D,{cut:false,dims:true,L:true})},{n:'Il sole sulla falda',f:D=>figSun3(D,true)}]},

{id:'pannello',grp:'I dati della traccia',t:'Il pannello',
 tutor:D=>({msg:'Il pannello del modello è il <b>Riello RPS 25/4</b>. Dalla sua scheda tecnica useremo solo <b>quattro numeri</b>, evidenziati qui sotto.',
  dove:'Nella scheda tecnica allegata al progetto: superficie del pannello, litri di liquido che contiene, perdita di carico (20 mm c.a. con 92 l/h).',
  perche:'La superficie serve per contare i pannelli, i litri per il vaso di espansione, la perdita per la pompa.'}),
 form:D=>`${optf('pan','Modello',[['rps254','Riello RPS 25/4','quello del modello'],['custom','Un altro pannello','copio i dati dalla sua scheda']])}
  ${S.pan==='custom'?`<div class="g3">${[['n','Nome','',0],['Ar','Superficie','m²',.01],['vol','Liquido contenuto','l',.1],['Gp','Portata di prova','l/h',1],['Hp','Perdita a quella portata','mm c.a.',1],['maxV','Massimo in fila','',1],['lung','Lunghezza','mm',1],['larg','Larghezza','mm',1]].map(([k,l,u,s])=>`<div class="ctrl"><label>${l} <span class="u">${u}</span></label><input type="text" ${k==='n'?'maxlength="40"':'inputmode="decimal"'} data-cp="${k}" class="${S.bad['cp_'+k]?'err':''}" value="${xesc(S.bad['cp_'+k]?S.bad['cp_'+k].raw:String(S.cp[k]).replace('.',k==='n'?'.':','))}" autocomplete="off"><div class="ferr" id="e_cp_${k}">${S.bad['cp_'+k]?'⚠ '+S.bad['cp_'+k].err:''}</div></div>`).join('')}</div>`:''}
  <div class="four">${[['Superficie',f2(D.P.Ar)+' m²'],['Liquido contenuto',f1(D.P.vol)+' l'],['Perdita di carico',`${f0(D.P.Hp)} mm c.a. con ${f0(D.P.Gp)} l/h`],['Tipo','piano vetrato']].map(([a,b],i)=>`<div><span>${i+1}</span><small>${a}</small><b>${b}</b></div>`).join('')}</div>`,
 gives:D=>[['Pannello',D.P.n],['Superficie',f2(D.P.Ar)+' m²']],
 figs:[{n:'Scheda tecnica',f:D=>figPanelSheet(D)},{n:'Com’è fatto',f:D=>figPanelType('piano',true)}]},

// ---------- PUNTO 1 ----------
{id:'numero',grp:'1 · Numero di pannelli',block:D=>D.N>40?`Servirebbero ${D.N} pannelli: troppi per una casa. Controlla la superficie inserita (${f0(D.A)} m²).`:'',t:'Quanti pannelli servono',need:['A','prov'],
 tutor:D=>({msg:'Usiamo la <b>tabella dei coefficienti</b>: dice quanti m² di pannello servono per ogni 10 m² di casa.',
  dove:'Tabella “Edifici ad uso abitativo – superfici nette pannelli piani” (letteratura tecnica). Riga = zona, colonna = dimensione dell’impianto.',
  perche:'Più sole c’è, meno superficie serve: infatti i valori del Sud sono i più bassi.'}),
 uses:D=>[['Superficie casa',f0(D.A)+' m²'],['Zona','Italia '+D.zona],['Un pannello',f2(D.Aref)+' m²']],
 tasks:[
  {id:'n1',kind:'cell',table:'coef',click:'cell',q:D=>`Nella tabella cerco la riga <b>Italia ${D.zona}</b> e la colonna <b>${D.size==='small'?'Piccole dimensioni':'Medio-grandi'}</b>.`,why:D=>`La riga è la zona della casa (${xesc(D.loc)} → Italia ${D.zona}). La colonna: una villetta è un impianto piccolo.`,target:D=>({r:ZIDX[D.zona],c:D.size==='small'?0:1}),show:D=>`La cella dice da ${f2(D.zr[0])} a ${f2(D.zr[1])} m² ogni 10 m² di casa.`},
  {id:'n2',kind:'pick',key:'coef',why:D=>`La tabella non dà un numero solo ma un intervallo: il progettista sceglie. <b>Scegli ${f2(D.zr[0])}</b>, il valore più basso, come nel modello: d’estate il sole è tanto e con meno pannelli l’impianto non si surriscalda; d’inverno ci pensa la caldaia. Valori più alti danno più acqua calda d’inverno ma più rischio di surriscaldamento d’estate.`,q:D=>`La cella dà un intervallo: <b>${f2(D.zr[0])} ÷ ${f2(D.zr[1])}</b>. Quale valore usi?`,opts:D=>[[D.zr[0],f2(D.zr[0]),'il più basso (come nel modello)'],[r1((D.zr[0]+D.zr[1])/2*10)/10,f2(r1((D.zr[0]+D.zr[1])/2*10)/10),'via di mezzo'],[D.zr[1],f2(D.zr[1]),'il più alto']],help:()=>'Nel modello si prende il valore più basso: d’estate l’impianto ha meno rischio di surriscaldarsi. Vanno bene tutti.'},
  {id:'n3',kind:'num',unit:'m²',q:D=>`Superficie di pannelli che serve: <b>S = ${f2(D.coef)} × ${f0(D.A)} / 10</b>`,why:D=>`Il coefficiente vale per ogni 10 m² di casa. Divido i ${f0(D.A)} m² per 10 (quanti “blocchi da 10 m²” ci sono) e moltiplico per ${f2(D.coef)} m².`,exp:D=>D.Sreq,show:D=>`S = ${f2(D.coef)} × ${f0(D.A)} / 10 = ${f2(D.Sreq)} m²`},
  {id:'n4',kind:'num',unit:'pannelli',abs:0.01,q:D=>`Numero di pannelli: <b>N = ${f2(D.Sreq)} / ${f2(D.Aref)}</b>, arrotondato per eccesso.`,why:D=>`Ogni pannello copre ${f2(D.Aref)} m². Divido la superficie che serve per quella di un pannello. I pannelli sono interi: arrotondo <b>sempre in su</b>, altrimenti la superficie non basta.`,exp:D=>D.N,show:D=>`N = ${f2(D.Sreq)} / ${f2(D.Aref)} = ${f2(D.Nraw)} → ${D.N} pannelli`}],
 gives:D=>[['Superficie necessaria',f2(D.Sreq)+' m²'],['Pannelli',D.N],['Superficie installata',f2(D.Snet)+' m²']],
 figs:[{n:'Tabella dei coefficienti',f:D=>figCoef(D,!done('n3'))},{n:'Dai m² ai pannelli',f:D=>done('n4')?figTiles(D.Sreq,D.N,D.Aref):figCoef(D,true)},{n:'I pannelli sul tetto',f:D=>sceneHouse(D,{cut:false,dims:false,L:true})}]},

// ---------- PUNTO 2 (tubi) ----------
{id:'tubi',grp:'2 · Tubi e isolamento',block:D=>D.pipeOver?`La portata (${f0(D.G)} l/h) è troppo grande per i tubi della Tab. 7A: controlla la superficie della casa.`:'',t:'Il tubo giusto · Tab. 7A',need:['A','prov'],
 tutor:D=>({msg:'Scegliamo il <b>materiale</b> e il <b>diametro</b> del tubo che porta il liquido dai pannelli al serbatoio. Prima calcoliamo quanta acqua ci passa (la portata), poi la cerchiamo nella <b>Tab. 7A</b>.',
  dove:'Tab. 7A “Tubi in acciaio – acqua a 50 °C – perdite di carico continue”. A sinistra la perdita r (mm c.a. per metro di tubo), in alto i diametri De/Di, nelle celle la portata in l/h.',
  perche:'Metodo delle perdite di carico lineari costanti: decidiamo noi quanto può “frenare” il tubo per ogni metro (12 mm c.a./m, come nel modello) e cerchiamo il tubo più piccolo che con quel freno porta tutta la nostra acqua.'}),
 uses:D=>[['Un pannello',f2(D.Aref)+' m²'],['Pannelli',D.N]],
 tasks:[
  {id:'g1',kind:'num',unit:'l/h',q:D=>`Portata di un pannello: <b>Gp = 40 × ${f2(D.Aref)}</b>`,why:()=>'Regola del manuale: <b>40 litri all’ora per ogni m²</b> di pannello. Un m² di pannello dà circa 400 kcal/h; se il liquido si scalda di 10 °C, servono 400 / 10 = 40 l/h.',exp:D=>D.Gp,show:D=>`Gp = 40 × ${f2(D.Aref)} = ${f0(D.Gp)} l/h`},
  {id:'g2',kind:'num',unit:'l/h',q:D=>`Portata totale nel tubo: <b>G = ${f0(D.Gp)} × ${D.N}</b>`,why:D=>`I ${D.N} pannelli sono collegati in fila (stringa): nel tubo principale passa l’acqua di <b>tutti</b> i pannelli, quindi moltiplico.`,exp:D=>D.G,show:D=>`G = ${f0(D.Gp)} × ${D.N} = ${f0(D.G)} l/h`},
  {id:'u1',kind:'pick',key:'pipeMat',why:()=>'Nel circuito dei pannelli il liquido supera spesso i 60 °C e d’estate arriva oltre i 100 °C. Il materiale deve reggere queste temperature e non rovinarsi.',q:()=>'Di che materiale è il tubo?',opts:()=>[['zinc','Acciaio zincato'],['nero','Acciaio non zincato'],['multi','Plastica multistrato']],correct:()=>'nero',help:()=>'Pensa al calore: d’estate il liquido dei pannelli supera i 100 °C.',bad:()=>S.pipeMat==='zinc'?'No: oltre 60 °C lo zinco si stacca dal tubo (dezincatura). Riprova.':'No: la plastica non regge le temperature dei pannelli. Riprova.'},
  {id:'u2',kind:'cell',table:'t7a',click:'row',q:()=>'Nella <b>prima colonna</b> (r) cerco la riga <b>12</b>.',why:()=>'12 mm c.a. per metro è la perdita che <b>imponiamo</b> (come nel modello). Valori più alti = tubo più piccolo ma pompa più grande; valori più bassi = il contrario. 12 è il compromesso usato negli impianti solari.',target:D=>({r:PIPE_R.indexOf(D.rimp),c:-1}),show:()=>'Riga r = 12 mm c.a./m'},
  {id:'u3',kind:'cell',thr:D=>D.G,table:'t7a',click:'cell',rowOn:D=>PIPE_R.indexOf(D.rimp),q:D=>`Sulla riga 12 vado verso destra e mi fermo alla <b>prima cella con un numero uguale o più grande di ${f0(D.G)}</b>.`,why:D=>`Ogni colonna è un tubo diverso, dal più piccolo al più grande. Il numero nella cella è quanta acqua porta quel tubo perdendo 12 mm per metro. Il primo che porta almeno ${f0(D.G)} l/h è <b>il tubo più piccolo che va bene</b>: più piccolo costa meno e contiene meno liquido.`,target:D=>({r:PIPE_R.indexOf(D.rimp),c:D.pipeIdx}),show:D=>`${D.pipeP.g[PIPE_R.indexOf(D.rimp)].toLocaleString('it-IT')} l/h ≥ ${f0(D.G)} l/h: è il tubo della colonna De ${f1(D.pipeP.de)}.`},
  {id:'u4',kind:'read',readAt:D=>[-1,D.pipeIdx],rowOn:D=>PIPE_R.indexOf(D.rimp),colOn:D=>D.pipeIdx,table:'t7a',q:()=>'Salgo in cima a quella colonna e leggo i due diametri: <b>De</b> (esterno) e <b>Di</b> (interno).',why:()=>'De serve per l’isolante (Legge 10 e Tab. 9). Di serve per calcolare i litri dentro il tubo (vaso di espansione).',show:D=>`De = ${f1(D.pipeP.de)} mm · Di = ${f1(D.pipeP.di)} mm`}],
 gives:D=>[['Portata',`Gp ${f0(D.Gp)} l/h · G ${f0(D.G)} l/h`],['Materiale','acciaio non zincato'],['Tubo',`De ${f1(D.pipeP.de)} / Di ${f1(D.pipeP.di)} mm`],['Perdita','12 mm c.a./m']],
 figs:[{n:'Tab. 7A',f:D=>figTab7A(D,!done('u4'))},{n:'Il tubo scelto',f:D=>done('u4')?figTube3D(D,true,true):figTab7A(D,true)}]},

// ---------- PUNTO 2 (isolamento) ----------
{id:'isola',grp:'2 · Tubi e isolamento',t:'L’isolante · Legge 10 e Tab. 9',need:['A','prov'],
 tutor:D=>({msg:`Il tubo va rivestito con una <b>guaina isolante</b>, così il calore arriva al serbatoio e non si perde per strada. Con la tabella della <b>Legge 10</b> troviamo lo spessore, con la <b>Tab. 9</b> la superficie esterna. Il nostro tubo ha <b>De ${f1(D.pipeP.de)} mm</b>.`,
  dove:'Legge 10 (DPR 412/93, all. B): righe = λ dell’isolante, colonne = diametro esterno del tubo. Tab. 9: righe = diametro esterno, colonne = spessore dell’isolante.',
  perche:'λ (lambda) dice quanto calore lascia passare l’isolante: più è piccolo, meglio isola e meno spessore serve. Il λ si legge sulla scheda dell’isolante.'}),
 uses:D=>[['Tubo',`De ${f1(D.pipeP.de)} mm`]],
 tasks:[
  {id:'i1',kind:'pick',key:'insMat',why:()=>'<b>Scegli la gomma nitrilica</b>, come nel modello (λ = 0,035). Ogni isolante ha il suo λ scritto sulla scheda: serve per trovare la riga nella tabella della Legge 10.',q:()=>'Scegli l’isolante:',opts:()=>Object.entries(INS_MAT).map(([k,m])=>[k,m.n,`λ = ${f3(m.l)} W/mK`]),help:()=>'Nel modello si usa la gomma nitrilica, λ = 0,035 W/mK. Va bene anche un altro: cambia solo la riga della tabella.'},
  {id:'i2',kind:'cell',table:'dpr',click:'row',q:D=>`Legge 10: cerco la riga di <b>λ = ${f3(D.lam)}</b>. Se non c’è, prendo la riga <b>subito più grande</b>.`,why:D=>`Le righe vanno a passi di 0,002. ${Math.abs(INS_L[D.lamRow]-D.lam)>1e-6?`${f3(D.lam)} sta tra due righe: prendo quella più grande (${f3(INS_L[D.lamRow])}), perché un isolante “peggiore” chiede più spessore e così sto dalla parte della sicurezza.`:'Il valore c’è nella tabella.'}`,target:D=>({r:D.lamRow,c:-1}),show:D=>`Riga λ = ${f3(INS_L[D.lamRow])}`},
  {id:'i3',kind:'cell',table:'dpr',click:'cell',rowOn:D=>D.lamRow,q:D=>`Sulla stessa riga vado nella colonna del tubo: De ${f1(D.pipeP.de)} mm sta nella colonna <b>${INS_C[D.insCol]} mm</b>.`,why:()=>'Le colonne non sono un solo diametro ma un intervallo: cerco quello che contiene il mio De.',target:D=>({r:D.lamRow,c:D.insCol}),show:D=>`Spessore minimo dell’isolante: ${D.insTab} mm`},
  {id:'i4',kind:'cell',table:'tab9',click:'row',q:D=>`Tab. 9: cerco la riga del tubo, <b>De ${f1(D.pipeP.de)}</b>.`,why:()=>'La Tab. 9 dice quanta superficie esterna ha 1 metro di tubo già rivestito: serve per sapere quanta guaina e quanta lamiera di protezione comprare.',target:D=>({r:D.tab9Row,c:-1}),show:D=>`Riga De ${f1(D.pipeP.de)}`},
  {id:'i5',kind:'cell',table:'tab9',click:'cell',rowOn:D=>D.tab9Row,q:D=>`Sulla stessa riga vado alla colonna dello spessore <b>${D.insComm} mm</b>${D.insComm!==D.insTab?` (${D.insTab} mm non c’è: prendo il primo spessore più grande)`:''}.`,why:D=>`Il valore è la circonferenza esterna: π × (De + 2 × spessore) = 3,14 × (${f1(D.pipeP.de)} + 2 × ${D.insComm}) / 1000.`,target:D=>({r:D.tab9Row,c:D.tab9Col}),show:D=>`${f3(D.Sext)} m² per ogni metro di tubo isolato`}],
 gives:D=>[['Isolante',`${D.im.n} λ ${f3(D.lam)}`],['Spessore',D.insComm+' mm'],['Superficie esterna',f3(D.Sext)+' m²/m']],
 figs:[{n:'Legge 10',f:D=>figDPR(D,!done('i3'))},{n:'Tab. 9',f:D=>figTab9(D,!done('i5'))},{n:'Tubo e guaina',f:D=>figTube3D(D,true)}]},

// ---------- PUNTO 3 ----------
{id:'gelo',grp:'3 · Antigelo',t:'Il fluido vettore',need:['prov'],
 tutor:D=>({msg:'D’inverno, di notte, il liquido nei pannelli non deve gelare. Lo mescoliamo con il <b>glicole</b>: scegliamo quale e quanto.',
  dove:`Temperatura da sopportare: dipende dalla zona. Al Sud (es. Sicilia) basta −8 °C, al Centro −15 °C, al Nord −20 °C. Qui: <b>Italia ${D.zona} → ${D.Tprot} °C</b>.`,
  perche:'Il glicole rende il liquido più denso e viscoso: la pompa fa più fatica. Per questo la tabella dà anche un “fattore di maggiorazione” delle perdite, che useremo per la pompa.'}),
 uses:D=>[['Zona',`Italia ${D.zona}`],['Da proteggere fino a',D.Tprot+' °C']],
 tasks:[
  {id:'a1',kind:'pick',key:'gtype',why:()=>'<b>Scegli il glicole etilico</b>, come nel modello. Il propilenico fa lo stesso lavoro ma non è tossico: costa di più e si usa quando si vuole la massima sicurezza per l’acqua di casa.',q:()=>'Che glicole usi?',opts:()=>[['etilico','Glicole etilico','come nel modello'],['propilenico','Glicole propilenico','non tossico']],help:()=>'Il modello usa il glicole etilico. Il propilenico non è tossico: si sceglie quando si teme un contatto con l’acqua sanitaria.'},
  {id:'a2',kind:'cell',table:'gly',click:'row',q:D=>`Scendo nella tabella fino alla <b>prima concentrazione</b> che protegge fino a <b>${D.Tprot} °C</b> o più in basso.`,why:()=>'Prendo la prima che basta: più glicole costa di più e fa faticare di più la pompa.',target:D=>({r:GLICOLE[D.gtype].pts.findIndex(([p])=>p===D.gMin),c:-1}),show:D=>`${D.gpct}% in volume: protegge fino a ${D.Tg} °C`},
  {id:'a3',kind:'read',table:'gly',readAt:D=>[GLICOLE[D.gtype].pts.findIndex(([p])=>p===D.gMin),1],rowOn:D=>GLICOLE[D.gtype].pts.findIndex(([p])=>p===D.gMin),q:()=>'Sulla stessa riga leggo il <b>fattore di maggiorazione</b> delle perdite di pressione.',why:()=>'Moltiplicheremo le perdite del circuito per questo numero quando sceglieremo la pompa.',show:D=>`Fattore = ${f2(D.fg)}`}],
 gives:D=>[['Fluido',`acqua + ${GLICOLE[D.gtype].n} ${D.gpct}%`],['Protezione',D.Tg+' °C'],['Fattore perdite',f2(D.fg)]],
 figs:[{n:'Curva del glicole',f:D=>figGlycol(D,!done('a2'))}]},

// ---------- PUNTO 4 ----------
{id:'pompa',grp:'4 · Pompa',t:'La pompa di circolazione',need:['A','prov'],
 tutor:D=>({msg:'Per scegliere la pompa servono due numeri: la <b>portata</b> (già trovata: '+f0(D.G)+' l/h) e la <b>prevalenza</b>, cioè quanta pressione deve dare per vincere tutte le resistenze del circuito. Le sommiamo una alla volta.',
  dove:`Pannello: perdita della scheda (${f0(D.P.Hp)} mm c.a. con ${f0(D.P.Gp)} l/h). Tubi: 12 mm c.a. per metro (Tab. 7A). Glicole: fattore ${f2(D.fg)}. Scambiatore: la traccia non lo dà, si usa <b>500 mm c.a.</b>, valore tipico di uno scambiatore a piastre.`,
  perche:'mm c.a. = millimetri di colonna d’acqua: è l’unità con cui si misurano le perdite. 1000 mm c.a. = 1 m c.a. ≈ 0,1 bar.'}),
 uses:D=>[['Portata G',f0(D.G)+' l/h'],['Pannelli in serie',D.N],['Fattore glicole',f2(D.fg)]],
 tasks:[
  {id:'h0',kind:'pick',key:'Lone',why:D=>`La traccia non dà questa misura: la stimiamo. Il tubo scende dal tetto al locale caldaia (circa 3 m per ogni piano) e fa ancora un tratto in orizzontale. Con ${S.piani||2} piani: ${S.piani||2} × 3 + 2 ≈ <b>${D.LoneSug} m</b>. <b>Scegli ${D.LoneSug} m</b>${D.LoneSug===8?', come nel modello':''}.`,q:()=>'Quanti metri di tubo ci sono dai pannelli al serbatoio in centrale termica (solo andata)?',opts:D=>[6,8,10,12,14].map(v=>[v,v+' m',v===D.LoneSug?'consigliato per la tua casa':''] ),help:D=>`La traccia non lo dice: si ipotizza. Il tubo scende dal tetto al piano terra (circa 3 m per piano) e fa un tratto in orizzontale. Con ${S.piani||2} piani: ${S.piani||2} × 3 + 2 ≈ <b>${D.LoneSug} m</b>. Nel modello si usano 8 m.`},
  {id:'h1',kind:'num',unit:'m',q:D=>`Lunghezza totale del tubo: <b>L = ${D.Lone} × 2</b>`,why:()=>'Il liquido va ai pannelli e torna indietro: andata + ritorno.',exp:D=>D.Ltot,show:D=>`L = ${D.Lone} × 2 = ${D.Ltot} m`},
  {id:'h2',kind:'num',unit:'mm c.a.',tol:0.02,abs:1,q:D=>`Perdita di un pannello: <b>H = (${f0(D.G)} / ${f0(D.P.Gp)})² × ${f0(D.P.Hp)}</b>`,why:D=>`La scheda dice che il pannello perde ${f0(D.P.Hp)} mm c.a. quando ci passano ${f0(D.P.Gp)} l/h. Nella stringa in serie in ogni pannello passa tutta la portata (${f0(D.G)} l/h). La perdita cresce con il <b>quadrato</b> della portata: per questo il rapporto è al quadrato.`,exp:D=>D.Hp1,show:D=>`H = (${f0(D.G)} / ${f0(D.P.Gp)})² × ${f0(D.P.Hp)} = ${f0(D.Hp1)} mm c.a.`},
  {id:'h3',kind:'num',unit:'mm c.a.',tol:0.02,abs:2,q:D=>`Perdita della stringa: <b>${f0(D.Hp1)} × ${D.N}</b>`,why:()=>'I pannelli sono uno dopo l’altro: il liquido li attraversa tutti, le perdite si sommano.',exp:D=>D.Hfield,show:D=>`${f0(D.Hp1)} × ${D.N} = ${f0(D.Hfield)} mm c.a.`},
  {id:'h4',kind:'num',unit:'mm c.a.',q:D=>`Perdita nei tubi: <b>r × L = 12 × ${D.Ltot}</b>`,why:()=>'Abbiamo scelto il tubo imponendo 12 mm c.a. per ogni metro: moltiplico per i metri di tubo.',exp:D=>D.Hcont,show:D=>`12 × ${D.Ltot} = ${f0(D.Hcont)} mm c.a.`},
  {id:'h5',kind:'num',unit:'mm c.a.',tol:0.03,abs:3,q:D=>`Prevalenza della pompa: <b>(${f0(D.Hfield)} + ${f0(D.Hcont)}) × ${f2(D.fg)} + 500</b>`,why:D=>`Sommo stringa e tubi, moltiplico per il fattore del glicole (il liquido è più denso dell’acqua) e aggiungo i 500 mm c.a. dello scambiatore.`,exp:D=>D.Htot,show:D=>`H = ${f0(D.Htot)} mm c.a. = ${f2(D.Htot/1000)} m c.a.`}],
 gives:D=>[['Portata pompa',`${f0(D.G)} l/h = ${f3(D.G/1000)} m³/h`],['Prevalenza',f2(D.Htot/1000)+' m c.a.']],
 figs:[{n:'Schema di stringa',f:D=>figString(D,true)},{n:'Le perdite sommate',f:D=>figLosses(D)},{n:'Scelta della pompa',f:D=>figPump3(D)}]},

// ---------- PUNTO 5 ----------
{id:'scamb',grp:'5 · Scambiatore',t:'Lo scambiatore di calore',need:['A','prov'],
 tutor:D=>({msg:'Lo scambiatore a piastre passa il calore dal liquido dei pannelli all’acqua del serbatoio, senza mescolarli. Calcoliamo la sua <b>potenza</b>.',
  dove:'Per i pannelli piani con copertura trasparente il manuale dà q = 400 kcal/h per ogni m² di pannello (potenza con il sole massimo).',
  perche:'Lo scambiatore deve riuscire a passare tutto il calore che i pannelli raccolgono nel momento migliore: per questo si usa la superficie di tutti i pannelli installati.'}),
 uses:D=>[['Superficie installata',`${D.N} × ${f2(D.Aref)} = ${f2(D.Snet)} m²`]],
 tasks:[
  {id:'q1',kind:'num',unit:'kcal/h',q:D=>`Potenza: <b>Q = 400 × ${f2(D.Snet)}</b>`,why:()=>'400 kcal/h per ogni m², moltiplicato per i m² di tutti i pannelli.',exp:D=>D.Q,show:D=>`Q = 400 × ${f2(D.Snet)} = ${f0(D.Q)} kcal/h`},
  {id:'q2',kind:'num',unit:'kW',q:D=>`In kW: <b>${f0(D.Q)} / 860</b>`,why:()=>'1 kW = 860 kcal/h: i cataloghi degli scambiatori usano i kW.',exp:D=>D.QkW,show:D=>`${f0(D.Q)} / 860 = ${f2(D.QkW)} kW`}],
 gives:D=>[['Potenza',`${f0(D.Q)} kcal/h = ${f2(D.QkW)} kW`],['Temperature','solare 50 → 40 °C · serbatoio 35 → 45 °C']],
 figs:[{n:'Scambiatore a piastre',f:D=>figHX(D,true)}]},

// ---------- PUNTI 6 e 7 ----------
{id:'vaso',grp:'6-7 · Vaso e valvola',block:D=>D.Pf<=D.Pi?`La pressione iniziale (${f1(D.Pi)} bar) non è più bassa di quella finale (${f1(D.Pf)} bar): scegli la valvola da 6 bar.`:'',t:'Vaso di espansione e valvola',need:['A','prov'],
 tutor:D=>({msg:'Scaldandosi il liquido si dilata. Il <b>vaso di espansione</b> accoglie il liquido in più, la <b>valvola di sicurezza</b> scarica se la pressione sale troppo. Formula del vaso: <b>Vn = Vu × (Pf + 1) / (Pf − Pi)</b>.',
  dove:'Litri nei pannelli: scheda del pannello. Litri nei tubi: Di dalla Tab. 7A e lunghezza scelta per la pompa. Litri nello scambiatore: sua scheda (24 ÷ 30 l).',
  perche:'Vu = volume utile (liquido che si dilata + liquido dei pannelli, che può diventare vapore). Pi = pressione di riempimento. Pf = pressione massima prima che apra la valvola.'}),
 uses:D=>[['Pannelli',`${D.N} × ${f1(D.P.vol)} l`],['Tubo',`Di ${f1(D.pipeP.di)} mm · ${D.Ltot} m`],['Altezza impianto',`${S.piani||2} piani → ${f1(D.Hst)} m`]],
 tasks:[
  {id:'v0',kind:'pick',key:'Pvs',why:()=>'La valvola si apre e scarica se la pressione supera questo valore, per proteggere i pannelli. Negli impianti solari si usa 5 o 6 bar. <b>Scegli 5 bar</b>, come nel modello.',q:()=>'Taratura della valvola di sicurezza:',opts:()=>[[5,'5 bar','come nel modello'],[6,'6 bar']],help:()=>'Negli impianti solari si usano 5 o 6 bar. Il modello usa 5 bar.'},
  {id:'v1',kind:'num',unit:'l',q:D=>`a) Litri nei pannelli: <b>${f1(D.P.vol)} × ${D.N}</b>`,why:D=>`Ogni pannello contiene ${f1(D.P.vol)} l (scheda tecnica).`,exp:D=>D.VP,show:D=>`VP = ${f1(D.VP)} l`},
  {id:'v2',kind:'num',unit:'l',tol:0.05,abs:0.3,q:D=>`b) Litri nei tubi: <b>3,14 × ${fmt(D.pipeP.di/1000,4)}² / 4 × ${D.Ltot} × 1000</b>`,why:()=>'Il tubo è un cilindro: area del cerchio interno (π × Di² / 4, con Di in metri) per la lunghezza = m³. Per 1000 diventano litri.',exp:D=>D.Vt,show:D=>`${f1(D.Vt)} l`},
  {id:'v3',kind:'pick',key:'Vsc',why:()=>'Anche lo scambiatore contiene un po’ di liquido. La sua scheda tecnica dà da 24 a 30 litri. <b>Scegli 24 l</b>, come nel modello.',q:()=>'c) Litri nello scambiatore:',opts:()=>VSC_OPZ.map(v=>[v,v+' l',v===24?'come nel modello':'']),help:()=>'La scheda dello scambiatore dà 24 ÷ 30 litri. Il modello usa 24 l.'},
  {id:'v4',kind:'num',unit:'l',tol:0.03,abs:0.3,q:D=>`Contenuto totale: <b>Vc = ${f1(D.VP)} + ${f1(D.Vt)} + ${f1(D.Vsc)}</b>`,why:()=>'Tutto il liquido del circuito solare: pannelli + tubi + scambiatore.',exp:D=>D.Vc,show:D=>`Vc = ${f1(D.Vc)} l`},
  {id:'v5',kind:'num',unit:'l',tol:0.03,abs:0.2,q:D=>`Volume utile: <b>Vu = (${f1(D.Vc)} × 0,07 + ${f1(D.VP)}) × 1,1</b>`,why:()=>'0,07 = il liquido con glicole si dilata del 7%. Si aggiunge il liquido dei pannelli perché d’estate, a impianto fermo, può bollire e uscire. 1,1 = 10% di sicurezza.',exp:D=>D.Vu,show:D=>`Vu = ${f1(D.Vu)} l`},
  {id:'v6',kind:'num',unit:'bar',abs:0.06,q:D=>`Pressione di riempimento: <b>Pi = ${f1(D.Hst)} / 10,2 + 0,5</b>`,why:D=>`Pressione statica = altezza del liquido sopra il vaso. Dal vaso (piano terra) ai pannelli: ${S.piani||2} piani × 3 m + 2 m di falda = ${f1(D.Hst)} m. 10,2 m d’acqua = 1 bar. Si aggiungono 0,5 bar perché il liquido arrivi in pressione anche in cima.`,exp:D=>D.Pi,show:D=>`Pi = ${f2(D.Pst)} + 0,5 ≈ ${f1(D.Pi)} bar`},
  {id:'v7',kind:'num',unit:'l',tol:0.05,abs:0.4,q:D=>`Volume del vaso: <b>Vn = ${f1(D.Vu)} × (${f1(D.Pf)} + 1) / (${f1(D.Pf)} − ${f1(D.Pi)})</b>`,why:D=>`Pf = taratura della valvola − 0,5 = ${f1(D.Pvs)} − 0,5 = ${f1(D.Pf)} bar: il vaso deve lavorare sotto la pressione di apertura della valvola.`,exp:D=>D.Vn,show:D=>`Vn = ${f1(D.Vn)} l`},
  {id:'v8',kind:'list',list:()=>VASI_COMM.slice(0,8),thr:D=>D.Vn,unit:'l',q:D=>`Tra i vasi in commercio prendo il primo <b>uguale o più grande</b> di ${f1(D.Vn)} l.`,why:()=>'I vasi si vendono solo in alcune misure: si prende quella subito sopra, mai sotto.',show:D=>`Vaso da ${D.vaso} l`}],
 gives:D=>[['Vaso di espansione',`${D.vaso} l`],['Valvola di sicurezza',`${f0(D.Pvs)} bar, scarico in tanica`]],
 figs:[{n:'Il vaso al lavoro',f:D=>figVaso3(D,120,true)},{n:'Valvola di sicurezza',f:D=>figValve(D,true)}]},

// ---------- PUNTO 8 ----------
{id:'serb',grp:'8 · Serbatoio',t:'Il serbatoio di accumulo',need:['A','prov'],
 tutor:D=>({msg:'Il serbatoio conserva l’acqua scaldata dal sole per quando serve. Formula: <b>V = (50 ÷ 60) × S</b>, con V in litri e S in m² di pannelli.',
  dove:'Regola del manuale: da 50 a 60 litri per ogni m² di pannello. Le misure dei serbatoi sono quelle dei cataloghi.',
  perche:'Troppo piccolo: si scalda subito e va in surriscaldamento. Troppo grande: non arriva mai in temperatura.'}),
 uses:D=>[['Superficie installata',f2(D.Snet)+' m²']],
 tasks:[
  {id:'s0',kind:'pick',key:'kV',why:()=>'La regola dice da 50 a 60 litri di serbatoio per ogni m² di pannello. <b>Scegli 55 l/m²</b>, la via di mezzo usata nel modello.',q:()=>'Quanti litri per m² usi?',opts:()=>[[50,'50 l/m²'],[55,'55 l/m²','come nel modello'],[60,'60 l/m²']],help:()=>'Il modello usa la via di mezzo, 55 l/m².'},
  {id:'s1',kind:'num',unit:'litri',tol:0.02,abs:1,q:D=>`Volume: <b>V = ${D.kV} × ${f2(D.Snet)}</b>`,why:()=>'Litri per m² × m² di tutti i pannelli.',exp:D=>D.Vcalc,show:D=>`V = ${f0(D.Vcalc)} l`},
  {id:'s2',kind:'list',list:()=>SERBATOI_COMM.slice(0,9),thr:D=>D.Vcalc,unit:'l',q:D=>`Tra le misure in commercio prendo il primo serbatoio <b>uguale o più grande</b> di ${f0(D.Vcalc)} l.`,why:()=>'Come per il vaso: si prende la misura di catalogo subito sopra.',show:D=>`Serbatoio da ${D.Vtank} l`},
  {id:'s3',kind:'pick',key:'tank',why:()=>'Il serpentino è il tubo a spirale dentro il serbatoio: ci passa il liquido caldo dei pannelli e scalda l’acqua intorno. <b>Scegli semplice serpentino</b>, come nel modello: c’è un solo circuito che scalda, quello solare.',q:()=>'Che tipo di serbatoio?',opts:()=>[['ss','Semplice serpentino','come nel modello'],['ds','Doppio serpentino','solare + caldaia'],['tit','Tank in tank','riscaldamento + ACS']],help:()=>'Il serpentino è il tubo a spirale dentro il serbatoio dove passa il liquido dei pannelli. Il modello usa il semplice serpentino.'}],
 gives:D=>[['Serbatoio',`${D.Vtank} l`],['Tipo',D.tankName]],
 figs:[{n:'Il serbatoio',f:D=>figTank3(D,true)}]},

// ---------- PUNTI 9, 10, 11 ----------
{id:'schemi',grp:'9-11 · Schemi',t:'Centrale termica e surriscaldamento',
 tutor:D=>({msg:'Ultimi tre punti: gli schemi della centrale termica e il surriscaldamento. Guarda i disegni (sono nella relazione) e scegli la regolazione della pompa.',
  dove:'Il termoregolatore differenziale si tara tra 5 e 8 °C.',
  perche:'Due sonde: una sui pannelli, una nel serbatoio. Se i pannelli sono più caldi del serbatoio di almeno ΔT, conviene far girare il liquido e la pompa parte; altrimenti resta ferma.'}),
 tasks:[{id:'c1',kind:'pick',key:'dton',why:()=>'La pompa parte solo se i pannelli sono più caldi del serbatoio di almeno ΔT gradi. Il modello dice di scegliere tra 5 e 8 °C. <b>Scegli 6 °C</b>: valore medio, la pompa non si accende e spegne di continuo e non spreca sole.',q:()=>'Con quale differenza di temperatura ΔT parte la pompa?',opts:()=>[[5,'5 °C'],[6,'6 °C'],[7,'7 °C'],[8,'8 °C']],help:()=>'Valori troppo bassi accendono e spengono la pompa di continuo; troppo alti sprecano sole. Vanno bene tutti tra 5 e 8.'}],
 gives:D=>[['Regolazione',`ΔT ${D.dton} °C`]],
 figs:[{n:'9 · Centrale solare',f:D=>figCentraleSol(D,{L:true,on:true})},{n:'10 · Impianto combinato',f:D=>figCentraleComb(D,{L:true,T1:55,T2:30})},{n:'11 · Tutto l’impianto',f:D=>figImpianto(D,{L:true})}]},

{id:'relazione',grp:'Fine',t:'La relazione Word',report:true,
 tutor:D=>({msg:'Fatto! Controlla la lista e scarica la relazione: 11 punti come nel modello, con i tuoi numeri e i disegni.'})}
];
const GROUPS=[...new Set(STEPS.map(s=>s.grp))];
const NEED_NAMES={nome:'il tuo nome',cognome:'il tuo cognome',A:'la superficie della casa',prov:'la provincia',tilt:'l’inclinazione del tetto'};
const NEED_STEP={nome:'copertina',cognome:'copertina',A:'casa',prov:'casa',tilt:'tetto'};
