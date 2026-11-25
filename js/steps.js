// ===================== IL PERCORSO GUIDATO =====================
// Ogni fase: tutor (cosa facciamo, dove lo trovi, perché), dati che servono, compiti passo passo, risultato.
const ZIDX={Nord:0,Centro:1,Sud:2};
const vOf=(f,d=2)=>v=>fmt(v,d);
const STEPS=[
{id:'copertina',grp:'Inizio',t:'Chi sei',
 tutor:D=>({msg:'Ciao! Io sono Archimede e ti accompagno fino alla relazione finale. Per cominciare scrivi <b>nome e cognome</b>: andranno sulla copertina.',dove:'Classe e docente sono già scritti. Cambiali solo se servono altri dati.',perche:'Con il tuo nome preparo anche disegni e frasi solo tuoi: due compagni con gli stessi dati avranno relazioni giuste ma diverse.'}),
 form:D=>`<img class="logo-img" alt="I.I.S.S. Archimede Cammarata" src="assets/logo.png" style="margin-bottom:12px"><div class="g2">${txt('nome','Nome')}${txt('cognome','Cognome')}</div><div class="g2">${txt('classe','Classe')}${txt('docente','Docente di riferimento')}</div>`,
 need:['nome','cognome'],
 figs:[{n:'La tua copertina',f:D=>sceneHouse(D,{cut:true,L:true,title:'Impianto solare combinato',sub:'acqua calda sanitaria + riscaldamento'})}]},

{id:'casa',grp:'I dati',t:'La casa e il luogo',
 tutor:D=>({msg:'Copia dalla traccia la <b>superficie della casa</b> e il <b>luogo</b>. Poi controlla la temperatura minima della zona.',dove:'Superficie e luogo sono scritti nella traccia. La temperatura esterna di progetto la trovi nella tabella delle temperature del manuale: io ti propongo un valore, tu verificalo.',perche:'Il luogo ci dice due cose: quanto sole c’è (Italia Nord, Centro o Sud) e quanto freddo può fare (per l’antigelo).'}),
 form:D=>{const reg=REGIONI[S.regione];return `<div class="g2"><div>${numf('A','Superficie abitata','m²',20,5000,1)}${sel('edificio','Tipo di edificio',Object.entries(EDIFICI))}${numf('piani','Piani','',1,6,1)}</div>
  <div>${sel('regione','Regione',Object.keys(REGIONI).map(r=>[r,r]),'Scegli…',true)}${reg?sel('prov','Provincia',Object.keys(reg.p).map(p=>[p,p]),'Scegli…',true):''}${S.prov?numf('Tp','Temperatura esterna di progetto','°C',-30,15,1,`valore indicativo: ${reg.p[S.prov]} °C`):''}</div></div>`},
 need:['A','regione','prov','Tp'],
 gives:D=>[['Zona',`Italia ${D.zona}`],['T di progetto',D.Tp==null?'-':D.Tp+' °C']],
 figs:[{n:'L’Italia del sole',f:D=>figLat(D)},{n:'Il sole sulla casa',f:D=>figSun3(D,true)}]},

{id:'tetto',grp:'I dati',t:'Il tetto',
 tutor:D=>({msg:'Dimmi com’è il tetto: verso dove guarda e quanto è inclinato. Le misure della falda sono facoltative.',dove:'Orientamento e inclinazione sono nella traccia. Se mancano le misure della falda le stimo io dalla superficie della casa.',perche:`D’inverno il sole è basso (${f0(D.noonW)}° a mezzogiorno): un tetto verso Sud e ben inclinato lo prende meglio.`}),
 form:D=>`<div class="g2"><div>${optf('roof','Tipo di tetto',[['falda','A falda'],['piano','Piano']])}${sel('dir','Il tetto guarda verso',Object.keys(DIR_AZ).map(k=>[k,k]))}${S.roof==='falda'?numf('tilt','Inclinazione','°',5,70,1):rngf('flatTilt','Inclinazione dei supporti',20,60,5,'°')}</div>
  <div>${numf('roofW','Larghezza della falda (facoltativa)','m',2,60,0.1,D.roofEst?`stima: ${f1(suggestRoof().W)} m`:'')}${numf('roofL','Lunghezza della falda (facoltativa)','m',2,40,0.1,D.roofEst?`stima: ${f1(suggestRoof().L)} m`:'')}<label class="chk"><input type="checkbox" data-k="camino" ${S.camino?'checked':''}> C’è un camino sul tetto</label></div></div>`,
 need:['tilt'],
 gives:D=>[['Inclinazione',D.tilt+'°'],['Orientamento',S.dir],['Perdita per orientamento','≈ '+f1(D.oLoss)+'%']],
 figs:[{n:'La casa in 3D',f:D=>sceneHouse(D,{cut:false,dims:true,L:true})},{n:'Sezione con il sole',f:D=>figSun3(D,true)},{n:'Bussola',f:D=>figCompass(D.az,D.oLoss)}]},

{id:'pannello',grp:'I dati',t:'Il pannello',
 tutor:D=>({msg:'Scegli il pannello. Dalla sua scheda tecnica ti servono solo <b>quattro numeri</b>: te li evidenzio.',dove:'Nella scheda tecnica del pannello: superficie, litri di liquido contenuti, perdita di carico (grafico) e quanti se ne possono mettere in fila.',perche:'Questi quattro numeri tornano nei calcoli dopo: numero di pannelli, pompa e vaso.'}),
 form:D=>`${optf('pan','Modello',[['rps254','Riello RPS 25/4','piano vetrato'],['custom','Un altro pannello','copio i dati dalla scheda']])}
  ${S.pan==='custom'?`<div class="g3">${[['n','Nome','',0],['Ar','Superficie','m²',.01],['vol','Liquido contenuto','l',.1],['Gp','Portata di prova','l/h',1],['Hp','Perdita a quella portata','mm c.a.',1],['maxV','Massimo in fila','',1],['lung','Lunghezza','mm',1],['larg','Larghezza','mm',1]].map(([k,l,u,s])=>`<div class="ctrl"><label>${l} <span class="u">${u}</span></label><input type="text" ${k==='n'?'maxlength="40"':'inputmode="decimal"'} data-cp="${k}" class="${S.bad['cp_'+k]?'err':''}" value="${xesc(S.bad['cp_'+k]?S.bad['cp_'+k].raw:String(S.cp[k]).replace('.',k==='n'?'.':','))}" autocomplete="off"><div class="ferr" id="e_cp_${k}">${S.bad['cp_'+k]?'⚠ '+S.bad['cp_'+k].err:''}</div></div>`).join('')}</div>`:''}
  <div class="four">${[['Superficie',f2(D.P.Ar)+' m²'],['Liquido',f1(D.P.vol)+' l'],['Perdita',`${f0(D.P.Hp)} mm c.a. a ${f0(D.P.Gp)} l/h`],['In fila','max '+D.P.maxV]].map(([a,b],i)=>`<div><span>${i+1}</span><small>${a}</small><b>${b}</b></div>`).join('')}</div>`,
 gives:D=>[['Pannello',D.P.n],['Superficie',f2(D.P.Ar)+' m²']],
 figs:[{n:'Scheda tecnica',f:D=>figPanelSheet(D)},{n:'Com’è fatto',f:D=>figPanelType('piano',true)}]},

{id:'numero',grp:'I calcoli',block:D=>D.N>40?`Servirebbero ${D.N} pannelli: troppi per una casa. Controlla la superficie inserita (${f0(D.A)} m²).`:'',t:'Quanti pannelli servono',need:['A','regione','prov'],
 tutor:D=>({msg:'Usiamo la <b>tabella dei coefficienti</b>: ci dice quanti m² di pannello servono ogni 10 m² di casa.',dove:'Tabella “Edifici ad uso abitativo, impianti combinati” del manuale (Caleffi).',perche:'Più sole c’è, meno pannelli servono: per questo i valori del Sud sono più bassi.'}),
 uses:D=>[['Superficie casa',f0(D.A)+' m²'],['Zona','Italia '+D.zona],['Superficie pannello',f2(D.Aref)+' m²']],
 tasks:[
  {id:'n1',kind:'cell',table:'coef',click:'cell',q:D=>`Cerco nella tabella la riga <b>Italia ${D.zona}</b> e la colonna <b>${D.size==='small'?'Piccole dimensioni':'Medio-grandi'}</b>.`,target:D=>({r:ZIDX[D.zona],c:D.size==='small'?0:1}),help:D=>`Una casa singola è un impianto di piccole dimensioni. Cerca la riga “Italia ${D.zona}”.`,show:D=>`La cella è ${f2(D.zr[0])} ÷ ${f2(D.zr[1])}.`},
  {id:'n2',kind:'pick',key:'coef',q:D=>`La cella dà un intervallo: <b>${f2(D.zr[0])} ÷ ${f2(D.zr[1])}</b>. Quale valore scegli?`,opts:D=>[[D.zr[0],f2(D.zr[0]),'il più basso: meno caldo d’estate'],[r1((D.zr[0]+D.zr[1])/2*10)/10,f2(r1((D.zr[0]+D.zr[1])/2*10)/10),'via di mezzo'],[D.zr[1],f2(D.zr[1]),'il più alto: più aiuto d’inverno']],help:()=>'Vanno bene tutti. Di solito si prende il più basso, così d’estate l’impianto non si surriscalda.'},
  {id:'n3',kind:'num',unit:'m²',q:D=>`Calcoliamo la superficie dei pannelli: <b>S = ${f2(D.coef)} × ${f0(D.A)} / 10</b>`,exp:D=>D.Sreq,help:D=>`Moltiplica ${f2(D.coef)} per ${f0(D.A)} e poi dividi per 10.`,show:D=>`S = ${f2(D.coef)} × ${f0(D.A)} / 10 = ${f2(D.Sreq)} m²`},
  {id:'n4',kind:'num',unit:'pannelli',abs:0.01,q:D=>`Ogni pannello è ${f2(D.Aref)} m². Numero di pannelli: <b>N = ${f2(D.Sreq)} / ${f2(D.Aref)}</b>, arrotondato per eccesso.`,exp:D=>D.N,help:D=>`Viene ${f2(D.Nraw)}: i pannelli sono interi, quindi si arrotonda sempre in su.`,show:D=>`N = ${f2(D.Sreq)} / ${f2(D.Aref)} = ${f2(D.Nraw)} → ${D.N} pannelli`}],
 gives:D=>[['Superficie necessaria',f2(D.Sreq)+' m²'],['Pannelli',D.N],['Superficie installata',f2(D.Snet)+' m²']],
 figs:[{n:'Tabella coefficienti',f:D=>figCoef(D,!done('n3'))},{n:'Dai m² ai pannelli',f:D=>done('n4')?figTiles(D.Sreq,D.N,D.Aref):figCoef(D,true)},{n:'Il percorso dei calcoli',f:D=>figFlow(D,1)}]},

{id:'posa',grp:'I calcoli',t:'I pannelli sul tetto',need:['A','regione','prov','tilt'],
 tutor:D=>({msg:'Mettiamo i pannelli sul tetto. Scegli come montarli: io controllo che ci stiano.',dove:'Le misure del pannello sono nella scheda tecnica; quelle del tetto le hai inserite prima.',perche:'In verticale i pannelli lavorano “affiancati” (in parallelo) e l’acqua si divide tra loro: è il montaggio più semplice.'}),
 uses:D=>[['Pannelli',D.N],['Falda',`${f1(D.roofW)} × ${f1(D.roofL)} m`]],
 tasks:[
  {id:'p1',kind:'pick',key:'orient',q:()=>'Come li monti?',opts:D=>[['V','In verticale','collegati in parallelo'],['O','In orizzontale','collegati in serie']],help:()=>'In verticale si collegano in parallelo e servono meno perdite: è la scelta più comune.'},
  {id:'p2',kind:'pick',key:'rows',q:D=>`Su quante file?`,opts:D=>[[1,'Una fila'],[2,'Due file'],[3,'Tre file'],[4,'Quattro file']].slice(0,Math.min(4,D.N)),help:D=>{const a=fitAdvice(D);return 'Una fila sola è più semplice da collegare. '+a.txt+(a.btn?' '+a.btn:'')},check:D=>!D.layout.bad,bad:D=>{const a=fitAdvice(D);return `Così ${D.layout.bad} pannelli ${D.layout.whys.map(w=>w.replace('esce','escono').replace('tocca','toccano')).join(' o ')}. ${a.txt} ${a.btn}`}}],
 gives:D=>[['Montaggio',S.orient==='V'?'verticale, in parallelo':'orizzontale, in serie'],['File',D.layout.rows],['Ingombro',`${f2(D.layout.blockW)} × ${f2(D.layout.blockH)} m`]],
 figs:[{n:'Pianta del tetto',f:D=>figPlan3(D)},{n:'Vista 3D',f:D=>sceneHouse(D,{cut:false,dims:true,L:true})},{n:'Collegamento',f:D=>figString(D,true)}]},

{id:'portata',grp:'I calcoli',t:'Quanta acqua deve girare',need:['A','regione','prov'],
 tutor:D=>({msg:'Calcoliamo la <b>portata</b>: i litri all’ora che la pompa deve far passare nei pannelli.',dove:'Regola del manuale: 40 litri all’ora per ogni m² di pannello.',perche:'Un m² di pannello dà circa 400 kcal/h. Se l’acqua si scalda di 10 °C servono 400 / 10 = 40 litri all’ora.'}),
 uses:D=>[['Superficie pannello',f2(D.Aref)+' m²'],['Pannelli',D.N]],
 tasks:[
  {id:'g1',kind:'num',unit:'l/h',q:D=>`Portata di un pannello: <b>Gp = 40 × ${f2(D.Aref)}</b>`,exp:D=>D.Gp,help:()=>'40 litri all’ora per ogni m²: moltiplica per la superficie di un pannello.',show:D=>`Gp = 40 × ${f2(D.Aref)} = ${f1(D.Gp)} l/h`},
  {id:'g2',kind:'num',unit:'l/h',q:D=>`Portata totale: <b>G = ${f1(D.Gp)} × ${D.N}</b>`,exp:D=>D.G,help:()=>'Ogni pannello vuole la sua portata: moltiplica per il numero di pannelli.',show:D=>`G = ${f1(D.Gp)} × ${D.N} = ${f0(D.G)} l/h`}],
 gives:D=>[['Portata per pannello',f1(D.Gp)+' l/h'],['Portata totale',f0(D.G)+' l/h']],
 figs:[{n:'La portata nei pannelli',f:D=>figString(D,true)},{n:'Il percorso dei calcoli',f:D=>figFlow(D,2)}]},

{id:'tubi',grp:'Le tabelle',block:D=>D.pipeOver?`La portata (${f0(D.G)} l/h) è troppo grande per i tubi di questa tabella: controlla la superficie della casa e il numero di pannelli.`:'',t:'Il tubo giusto · Tabella 1',need:['A','regione','prov'],
 tutor:D=>({msg:`Ora usiamo la <b>Tabella 1</b> (sul libro: Tab. 7A, perdite di carico nei tubi d’acciaio). Ci serve un solo numero: la portata <b>G = ${f0(D.G)} l/h</b>.`,dove:'È la tabella “Perdite di carico continue, tubi in acciaio, acqua a 50 °C”: a sinistra la perdita r, in alto i diametri, nelle celle le portate.',perche:'Si sceglie il tubo più piccolo che porta la nostra acqua senza perdere troppa pressione (r tra 10 e 15 mm per metro: noi usiamo 12).'}),
 form:D=>numf('Lone','Distanza tra pannelli e locale caldaia (solo andata)','m',2,80,0.5,'dalla traccia, oppure misurala sul disegno'),
 uses:D=>[['Portata G',f0(D.G)+' l/h']],
 tasks:[
  {id:'u1',kind:'pick',key:'pipeMat',q:()=>'Prima di tutto: di che materiale è il tubo?',opts:()=>[['zinc','Acciaio zincato'],['nero','Acciaio non zincato'],['multi','Plastica multistrato']],correct:()=>'nero',help:()=>'Pensa al calore: d’estate il circuito supera i 100 °C e contiene antigelo.',bad:D=>S.pipeMat==='zinc'?'No: oltre 60 °C lo zinco si stacca (dezincatura). Riprova.':'No: la plastica non regge le temperature dei pannelli. Riprova.'},
  {id:'u2',kind:'cell',table:'t7a',click:'row',q:()=>'Nella <b>prima colonna</b> (r) cerco la riga <b>12</b>.',target:D=>({r:PIPE_R.indexOf(D.rimp),c:-1}),help:()=>'La prima colonna va da 2 in giù: 2, 4, 6, 8, 10, 12…',show:()=>'È la riga r = 12 mm c.a./m.'},
  {id:'u3',kind:'cell',thr:D=>D.G,table:'t7a',click:'cell',rowOn:D=>PIPE_R.indexOf(D.rimp),q:D=>`Resto sulla riga 12 e vado verso destra: mi fermo alla <b>prima cella</b> con un numero <b>uguale o più grande di ${f0(D.G)}</b>.`,target:D=>({r:PIPE_R.indexOf(D.rimp),c:D.pipeIdx}),help:D=>`Leggi i numeri da sinistra: il primo che supera ${f0(D.G)} indica il tubo.`,show:D=>`È ${D.pipeP.g[PIPE_R.indexOf(D.rimp)].toLocaleString('it-IT')} l/h, nella colonna De ${f1(D.pipeP.de)}.`},
  {id:'u4',kind:'read',readAt:D=>[-1,D.pipeIdx],rowOn:D=>PIPE_R.indexOf(D.rimp),colOn:D=>D.pipeIdx,table:'t7a',q:()=>'Salgo in cima a quella colonna e leggo il <b>diametro esterno De</b>.',help:()=>'È il numero grande in alto nella colonna evidenziata.',show:D=>`De = ${f1(D.pipeP.de)} mm (diametro interno Di = ${f1(D.pipeP.di)} mm)`},
  {id:'u5',kind:'cell',thr:D=>D.G,table:'t7a',click:'cell',colOn:D=>D.pipeIdx,q:D=>`Ora scendo nella colonna De ${f1(D.pipeP.de)} partendo dall’alto: mi fermo alla <b>prima cella</b> con un numero <b>uguale o più grande di ${f0(D.G)}</b>.`,target:D=>({r:D.rRow,c:D.pipeIdx}),help:()=>'Così trovi la perdita vera del tuo tubo, che è più bassa di 12.',show:D=>`È la riga r = ${D.r}.`},
  {id:'u6',kind:'read',readAt:D=>[D.rRow,-1],table:'t7a',rowOn:D=>D.rRow,colOn:D=>D.pipeIdx,q:()=>'Leggo a sinistra di quella riga la <b>perdita r</b> del tubo.',help:()=>'È il numero nella prima colonna, sulla riga evidenziata.',show:D=>`r = ${D.r} mm c.a. per metro`}],
 gives:D=>[['Materiale','acciaio non zincato'],['Tubo',`De ${f1(D.pipeP.de)} / Di ${f1(D.pipeP.di)} mm`],['Perdita r',D.r+' mm c.a./m'],['Tubo totale',D.Ltot?D.Ltot+' m':'-']],
 figs:[{n:'Tabella 1',f:D=>figTab7A(D,!done('u6'))},{n:'Il tubo in 3D',f:D=>done('u6')?figTube3D(D,true):figTab7A(D,true)}]},

{id:'isola',grp:'Le tabelle',t:'L’isolante · Tabelle 2 e 3',need:['A','regione','prov'],
 tutor:D=>({msg:`Il tubo va rivestito di isolante. Usiamo la <b>Tabella 2</b> (Legge 10) per lo spessore e la <b>Tabella 3</b> (sul libro: Tab. 9) per la superficie esterna. Ci serve il diametro del tubo: <b>De ${f1(D.pipeP.de)} mm</b>.`,dove:'Tabella 2: “Isolamento delle reti di distribuzione del calore” (Legge 10, DPR 412/93). Tabella 3: “Superficie esterna riferita a un metro di tubo isolato”.',perche:'λ (lambda) dice quanto l’isolante lascia passare il calore: più è piccolo, meglio isola.'}),
 uses:D=>[['Diametro tubo',`De ${f1(D.pipeP.de)} mm`]],
 tasks:[
  {id:'i1',kind:'pick',key:'insMat',q:()=>'Scegli l’isolante (il λ lo trovi sulla sua scheda):',opts:()=>Object.entries(INS_MAT).map(([k,m])=>[k,m.n,`λ = ${f3(m.l)}`]),help:()=>'Va bene qualsiasi isolante: cambia solo il λ.'},
  {id:'i2',kind:'cell',table:'dpr',click:'row',q:D=>`Tabella 2: cerco la riga di <b>λ = ${f3(D.lam)}</b>. Se non c’è, prendo la riga <b>subito più grande</b>.`,target:D=>({r:D.lamRow,c:-1}),help:D=>`I valori vanno a passi di 0,002: ${f3(D.lam)} sta tra due righe? Scegli quella più grande.`,show:D=>`Riga λ = ${f3(INS_L[D.lamRow])}`},
  {id:'i3',kind:'cell',table:'dpr',click:'cell',rowOn:D=>D.lamRow,q:D=>`Sulla stessa riga vado alla colonna del tubo: De ${f1(D.pipeP.de)} mm sta nella colonna <b>${INS_C[D.insCol]}</b>.`,target:D=>({r:D.lamRow,c:D.insCol}),help:()=>'Le colonne sono intervalli di diametro esterno del tubo.',show:D=>`Lo spessore minimo è ${D.insTab} mm.`},
  {id:'i4',kind:'list',list:()=>INS_COMM.slice(0,9),thr:D=>D.insTab,unit:'mm',q:D=>`La tabella dà ${D.insTab} mm. Tra gli spessori in commercio prendo il primo <b>uguale o più grande</b>.`,help:()=>'Il primo spessore in commercio uguale o più grande.',show:D=>`Spessore commerciale ${D.insComm} mm`},
  {id:'i5',kind:'cell',table:'tab9',click:'row',q:D=>`Tabella 3: cerco la riga del tubo, <b>De ${f1(D.pipeP.de)}</b>.`,target:D=>({r:TAB9_DE.indexOf(D.pipeP.de),c:-1}),help:()=>'La prima colonna elenca i diametri esterni.',show:D=>`Riga De ${f1(D.pipeP.de)}`},
  {id:'i6',kind:'cell',table:'tab9',click:'cell',rowOn:D=>TAB9_DE.indexOf(D.pipeP.de),q:D=>`Sulla stessa riga vado alla colonna dello spessore <b>${D.insComm} mm</b>.`,target:D=>({r:TAB9_DE.indexOf(D.pipeP.de),c:D.tab9Col}),help:()=>'In alto ci sono gli spessori dell’isolante.',show:D=>`${f3(D.Sext)} m² per metro`},
  {id:'i7',kind:'read',table:'tab9',readAt:D=>[TAB9_DE.indexOf(D.pipeP.de),D.tab9Col],rowOn:D=>TAB9_DE.indexOf(D.pipeP.de),colOn:D=>D.tab9Col,q:()=>'Leggo nella cella la <b>superficie esterna</b> di 1 m di tubo isolato.',help:()=>'È il numero nella cella che hai toccato.',show:D=>`${f3(D.Sext)} m² per ogni metro di tubo`}],
 gives:D=>[['Isolante',D.im.n],['Spessore',D.insComm+' mm'],['Superficie esterna',f3(D.Sext)+' m²/m']],
 figs:[{n:'Tabella 2',f:D=>figDPR(D,!done('i4'))},{n:'Tabella 3',f:D=>figTab9(D,!done('i7'))},{n:'Il tubo isolato',f:D=>figTube3D(D,true)}]},

{id:'gelo',grp:'Le tabelle',block:D=>D.Tprot!=null&&!D.gOk?`Nessuna concentrazione della tabella protegge fino a ${D.Tprot} °C: controlla la temperatura di progetto nella fase “La casa e il luogo”.`:'',t:'L’antigelo',need:['Tp'],
 tutor:D=>({msg:'D’inverno l’acqua nei pannelli non deve gelare. Aggiungiamo glicole: scegliamo quanto.',dove:'Tabella della concentrazione del glicole (manuale o scheda del fluido).',perche:'Di notte il pannello si raffredda più dell’aria. Per sicurezza si protegge fino a 10 °C sotto la temperatura di progetto.'}),
 uses:D=>[['T di progetto',D.Tp+' °C']],
 tasks:[
  {id:'a1',kind:'pick',key:'gtype',q:()=>'Che glicole usi?',opts:()=>[['propilenico','Propilenico','non tossico'],['etilico','Etilico','tossico']],help:()=>'Con l’acqua sanitaria in casa è meglio quello non tossico.'},
  {id:'a2',kind:'num',unit:'°C',abs:0.01,q:D=>`Temperatura da cui proteggere il circuito: <b>${D.Tp} − 10</b>`,exp:D=>D.Tprot,help:()=>'Togli 10 alla temperatura di progetto. Attenzione ai segni meno.',show:D=>`${D.Tp} − 10 = ${D.Tprot} °C`},
  {id:'a3',kind:'cell',table:'gly',click:'row',q:D=>`Nella tabella scendo fino alla <b>prima concentrazione</b> che protegge fino a <b>${D.Tprot} °C</b> o più in basso.`,target:D=>({r:GLICOLE[D.gtype].pts.findIndex(([p])=>p===D.gMin),c:-1}),help:()=>'Scendi finché la temperatura è uguale o più fredda di quella richiesta.',show:D=>`${D.gMin}%, protegge fino a ${D.Tg} °C`}],
 gives:D=>[['Glicole',`${GLICOLE[D.gtype].n} ${D.gpct}%`],['Protezione',D.Tg+' °C'],['Fattore perdite',f2(D.fg)]],
 figs:[{n:'Curva del glicole',f:D=>figGlycol(D,!done('a3'))}]},

{id:'pompa',grp:'I componenti',t:'La pompa',need:['A','regione','prov','Tp','Lone'],
 tutor:D=>({msg:'La pompa deve vincere tutte le resistenze del circuito. Le sommiamo una alla volta.',dove:`Tubi: r dalla Tabella 1. Pannelli: perdita della scheda tecnica (${f0(D.P.Hp)} mm a ${f0(D.P.Gp)} l/h). Scambiatore: sua scheda (se non c’è, 500 mm).`,perche:'Il glicole rende il fluido più “denso”: le perdite aumentano del fattore trovato prima.'}),
 form:D=>numf('Hsc','Perdita dello scambiatore (se la traccia la dà)','mm c.a.',0,5000,10,'se manca uso 500 mm c.a.'),
 uses:D=>[['Portata',f0(D.G)+' l/h'],['r del tubo',D.r+' mm/m'],['Tubo totale',D.Ltot+' m'],['Fattore glicole',f2(D.fg)]],
 tasks:[
  {id:'h1',kind:'num',unit:'mm c.a.',q:D=>`Perdite nei tubi: <b>r × lunghezza = ${D.r} × ${D.Ltot}</b>`,exp:D=>D.Hcont,help:()=>'La lunghezza è andata più ritorno.',show:D=>`${D.r} × ${D.Ltot} = ${f0(D.Hcont)} mm c.a.`},
  {id:'h2',kind:'num',unit:'mm c.a.',tol:0.06,abs:1,q:D=>`Curve, valvole e raccordi valgono il 30% delle perdite nei tubi: <b>${f0(D.Hcont)} × 0,3</b>`,exp:D=>D.Hloc,help:()=>'Moltiplica per 0,3.',show:D=>`${f0(D.Hcont)} × 0,3 = ${f0(D.Hloc)} mm c.a.`},
  {id:'h3',kind:'num',unit:'mm c.a.',tol:0.05,abs:0.6,q:D=>D.conn==='serie'?`Pannelli in serie: <b>${D.per} × ${f0(D.P.Hp)} × (${f0(D.Gline)} / ${f0(D.P.Gp)})²</b>`:`Pannelli in parallelo: ognuno ha la sua portata. <b>${f0(D.P.Hp)} × (${f1(D.Gp)} / ${f0(D.P.Gp)})²</b>`,exp:D=>D.Hfield,help:()=>'Se la portata cambia, la perdita cambia col quadrato.',show:D=>`${f0(D.Hfield)} mm c.a.`},
  {id:'h4',kind:'num',unit:'mm c.a.',tol:0.04,abs:3,q:D=>`Prevalenza totale: <b>(${f0(D.Hcont)} + ${f0(D.Hloc)} + ${f0(D.Hfield)}) × ${f2(D.fg)} + ${f0(D.Hsc)}</b>`,exp:D=>D.Htot,help:()=>'Prima la somma tra parentesi, poi per il fattore del glicole, infine aggiungi lo scambiatore.',show:D=>`${f0(D.Htot)} mm c.a. = ${f2(D.Htot/1000)} m c.a.`}],
 gives:D=>[['Portata pompa',f3(D.G/1000)+' m³/h'],['Prevalenza',f2(D.Htot/1000)+' m c.a.']],
 figs:[{n:'Scelta della pompa',f:D=>figPump3(D)},{n:'Le perdite sommate',f:D=>figLosses(D)}]},

{id:'scamb',grp:'I componenti',t:'Lo scambiatore',need:['A','regione','prov'],
 tutor:D=>({msg:'Lo scambiatore passa il calore dal circuito dei pannelli all’acqua del serbatoio. Calcoliamo la sua potenza.',dove:'Per i pannelli piani vetrati il manuale dà 400 kcal/h per m².',perche:'I due liquidi non si mescolano: scorrono vicini, in senso opposto, e si scambiano solo il calore.'}),
 uses:D=>[['Superficie installata',f2(D.Snet)+' m²']],
 tasks:[
  {id:'q1',kind:'num',unit:'kcal/h',q:D=>`Potenza: <b>Q = 400 × ${f2(D.Snet)}</b>`,exp:D=>D.Q,help:()=>'Usa la superficie di tutti i pannelli installati.',show:D=>`Q = 400 × ${f2(D.Snet)} = ${f0(D.Q)} kcal/h`},
  {id:'q2',kind:'num',unit:'kW',q:D=>`In kW: <b>${f0(D.Q)} / 860</b>`,exp:D=>D.QkW,help:()=>'1 kW = 860 kcal/h.',show:D=>`${f0(D.Q)} / 860 = ${f2(D.QkW)} kW`}],
 gives:D=>[['Potenza',`${f0(D.Q)} kcal/h = ${f2(D.QkW)} kW`],['Temperature','solare 50→40 °C · serbatoio 35→45 °C']],
 figs:[{n:'Scambiatore a piastre',f:D=>figHX(D,true)}]},

{id:'vaso',grp:'I componenti',block:D=>D.Pf<=D.Pi?`Con ${f1(D.Hst)} m di altezza la pressione iniziale (${f1(D.Pi)} bar) non è più bassa di quella finale (${f1(D.Pf)} bar): scegli la valvola da 6 bar o controlla l’altezza.`:'',t:'Vaso e valvola di sicurezza',need:['A','regione','prov','Lone'],
 tutor:D=>({msg:'Il vaso di espansione accoglie il liquido che si dilata col caldo. Facciamo il conto insieme, un passo alla volta.',dove:'Litri nei pannelli: scheda tecnica. Litri nei tubi: diametro interno dalla Tabella 1. Litri nello scambiatore: sua scheda.',perche:'Quando i pannelli sono fermi al sole il liquido può bollire: il vaso deve contenere anche tutto il liquido dei pannelli.'}),
 form:D=>`<div class="g2">${numf('Hst','Altezza dal vaso al punto più alto','m',1,40,0.5,`stima: ${f1(D.HstSug)} m`)}${numf('Vsc','Litri nello scambiatore','l',0,200,0.5,`stima: ${Math.round(D.Snet*2.5)} l`)}</div>`,
 uses:D=>[['Pannelli',`${D.N} × ${f1(D.P.vol)} l`],['Tubo',`Di ${f1(D.pipeP.di)} mm · ${D.Ltot} m`]],
 tasks:[
  {id:'v0',kind:'pick',key:'Pvs',q:()=>'Taratura della valvola di sicurezza:',opts:()=>[[5,'5 bar'],[6,'6 bar']],help:()=>'Negli impianti solari si usano 5 o 6 bar.'},
  {id:'v1',kind:'num',unit:'l',q:D=>`Litri nei pannelli: <b>VP = ${D.N} × ${f1(D.P.vol)}</b>`,exp:D=>D.VP,show:D=>`VP = ${f1(D.VP)} l`},
  {id:'v2',kind:'num',unit:'l',tol:0.05,abs:0.3,q:D=>`Litri nei tubi: <b>3,14 × ${fmt(D.pipeP.di/1000,4)}² / 4 × ${D.Ltot} × 1000</b>`,exp:D=>D.Vt,help:()=>'Area del cerchio (in m²) per la lunghezza: ottieni m³, poi per 1000 diventano litri.',show:D=>`${f1(D.Vt)} l`},
  {id:'v3',kind:'num',unit:'l',tol:0.03,abs:0.3,q:D=>`Contenuto totale: <b>Vc = ${f1(D.VP)} + ${f1(D.Vt)} + ${f1(D.Vsc)}</b>`,exp:D=>D.Vc,show:D=>`Vc = ${f1(D.Vc)} l`},
  {id:'v4',kind:'num',unit:'l',tol:0.03,abs:0.2,q:D=>`Volume utile: <b>Vu = (${f1(D.Vc)} × 0,07 + ${f1(D.VP)}) × 1,1</b>`,exp:D=>D.Vu,help:()=>'0,07 è la dilatazione dell’acqua con glicole, 1,1 è un margine di sicurezza.',show:D=>`Vu = ${f1(D.Vu)} l`},
  {id:'v5',kind:'num',unit:'bar',abs:0.06,q:D=>`Pressione iniziale: <b>Pi = ${f1(D.Hst)} / 10,2 + 0,5</b>`,exp:D=>D.Pi,help:()=>'10,2 metri d’acqua fanno 1 bar.',show:D=>`Pi = ${f1(D.Pi)} bar`},
  {id:'v6',kind:'num',unit:'l',tol:0.05,abs:0.4,q:D=>`Volume del vaso: <b>Vn = ${f1(D.Vu)} × (${f1(D.Pf)} + 1) / (${f1(D.Pf)} − ${f1(D.Pi)})</b> (Pf = ${f1(D.Pvs)} − 0,5)`,exp:D=>D.Vn,show:D=>`Vn = ${f1(D.Vn)} l`},
  {id:'v7',kind:'list',list:()=>VASI_COMM.slice(0,8),thr:D=>D.Vn,unit:'l',q:D=>`Tra i vasi in commercio prendo il primo <b>uguale o più grande</b> di ${f1(D.Vn)} l.`,show:D=>`Vaso da ${D.vaso} l`}],
 gives:D=>[['Vaso',`${D.vaso} l, precarica ${f1(D.Pi)} bar`],['Valvola',`${f1(D.Pvs)} bar + tanica`]],
 figs:[{n:'Il vaso al lavoro',f:D=>figVaso3(D,120,true)},{n:'Valvola di sicurezza',f:D=>figValve(D,true)}]},

{id:'serb',grp:'I componenti',t:'Il serbatoio',need:['A','regione','prov'],
 tutor:D=>({msg:'Il serbatoio conserva il calore del giorno. Regola: da 50 a 60 litri per ogni m² di pannello.',dove:'Regola pratica del manuale; le taglie sono nel catalogo del produttore.',perche:'Troppo piccolo si surriscalda, troppo grande non arriva mai in temperatura.'}),
 uses:D=>[['Superficie installata',f2(D.Snet)+' m²']],
 tasks:[
  {id:'s0',kind:'pick',key:'kV',q:()=>'Quanti litri per m² usi?',opts:()=>[[50,'50 l/m²'],[55,'55 l/m²'],[60,'60 l/m²']]},
  {id:'s1',kind:'num',unit:'litri',tol:0.02,abs:1,q:D=>`Volume: <b>V = ${D.kV} × ${f2(D.Snet)}</b>`,exp:D=>D.Vcalc,show:D=>`V = ${f0(D.Vcalc)} l`},
  {id:'s2',kind:'list',list:()=>SERBATOI_COMM.slice(0,9),thr:D=>D.Vcalc,unit:'l',q:D=>`Tra le taglie in commercio prendo il primo serbatoio <b>uguale o più grande</b> di ${f0(D.Vcalc)} l.`,show:D=>`Serbatoio da ${D.Vtank} l`},
  {id:'s3',kind:'pick',key:'tank',q:()=>'Che tipo di serbatoio?',opts:()=>[['ss','Semplice serpentino','accumulo solare'],['ds','Doppio serpentino','solare + caldaia'],['tit','Tank in tank','riscaldamento + ACS']]}],
 gives:D=>[['Serbatoio',`${D.Vtank} l`],['Tipo',D.tankName]],
 figs:[{n:'Il serbatoio',f:D=>figTank3(D,true)}]},

{id:'schemi',grp:'Gli schemi',t:'Come funziona tutto insieme',
 tutor:D=>({msg:'Ultimo passo tecnico: guarda gli schemi e scegli quando deve partire la pompa.',dove:'La centralina differenziale si regola tra 5 e 8 °C.',perche:'Due sonde: una sul pannello, una in basso nel serbatoio. Se il pannello è più caldo di almeno ΔT, la pompa parte.'}),
 tasks:[{id:'c1',kind:'pick',key:'dton',q:()=>'Con quale differenza di temperatura parte la pompa?',opts:()=>[[5,'5 °C'],[6,'6 °C'],[7,'7 °C'],[8,'8 °C']]}],
 gives:D=>[['Regolazione',`ΔT ${D.dton} °C, T max ${D.tmax} °C`]],
 figs:[{n:'Centrale solare',f:D=>figCentraleSol(D,{L:true,on:true})},{n:'Impianto combinato',f:D=>figCentraleComb(D,{L:true,T1:55,T2:30})},{n:'Surriscaldamento',f:D=>figSurr(D,{L:true,stag:true})},{n:'Il progetto in una pagina',f:D=>figDash(D)}]},

{id:'relazione',grp:'Fine',t:'La relazione Word',report:true,
 tutor:D=>({msg:'Ci siamo! Controlla la lista e scarica la relazione. Ogni volta che premi “Nuova versione” cambiano impaginazione, disegni e frasi; i calcoli restano gli stessi.',dove:'Il file .docx si apre con Word, Google Documenti o LibreOffice.',perche:'Le figure sono fatte con i tuoi numeri.'})}
];
const GROUPS=[...new Set(STEPS.map(s=>s.grp))];
const NEED_NAMES={nome:'il tuo nome',cognome:'il tuo cognome',A:'la superficie della casa',regione:'la regione',prov:'la provincia',Tp:'la temperatura di progetto',tilt:'l’inclinazione del tetto',Lone:'la distanza tra pannelli e locale caldaia'};
const NEED_STEP={nome:'copertina',cognome:'copertina',A:'casa',regione:'casa',prov:'casa',Tp:'casa',tilt:'tetto',Lone:'tubi'};
