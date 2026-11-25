// ===================== CALCOLI DEL PROGETTO =====================
// Tutti i risultati dipendono solo dai dati inseriti dallo studente (stato S).
const r1=x=>Math.round(x*10)/10;
const isNull=v=>v==null||v==='';
function suggestRoof(){const A=+S.A||120,pi=+S.piani||2,fp=A/pi,depth=Math.sqrt(fp/1.6),width=fp/depth,t=S.roof==='piano'?0:(+S.tilt||30);
  return {W:r1(width),L:S.roof==='piano'?r1(depth):r1(depth/2/Math.cos(rad(t))+0.3)}}
function layoutPanels(D){
  const flat=S.roof==='piano',N=D.N,rows=clamp(S.rows||1,1,N),per=Math.ceil(N/rows),V=S.orient==='V',P=D.P;
  const pw=(V?P.larg:P.lung)/1000,ph=(V?P.lung:P.larg)/1000,pitchX=pw+0.025;
  let depth=ph,dRow=0,rowPitch;if(flat){depth=ph*Math.cos(rad(S.flatTilt));const hR=ph*Math.sin(rad(S.flatTilt));dRow=hR*rowFactor(S.flatTilt);rowPitch=depth+dRow}else rowPitch=ph+0.3;
  const m=S.margin,W=D.roofW,Lr=D.roofL,blockW=(per-1)*pitchX+pw,blockH=(rows-1)*rowPitch+depth,freeX=W-2*m-blockW,freeY=Lr-2*m-blockH;
  const left=TH.chimney==='left',x0=m+Math.max(0,freeX)*(left?0.85:0.15),y0=m+Math.max(0,freeY)*0.5,panels=[];let k=0;
  for(let r=0;r<rows;r++){const n=Math.min(per,N-k);for(let c=0;c<n;c++){const x=x0+c*pitchX,y=y0+r*rowPitch,p={x,y,w:pw,h:depth,ok:true,why:''};
    if(x<m-1e-6||x+pw>W-m+1e-6||y<m-1e-6||y+depth>Lr-m+1e-6){p.ok=false;p.why='esce dal tetto'}
    for(const o of D.obs)if(x<o.x+o.w+.3&&x+pw>o.x-.3&&y<o.y+o.h+.3&&y+depth>o.y-.3){p.ok=false;p.why='tocca il camino'}
    panels.push(p);k++}}
  return {panels,rows,per,blockW,blockH,freeX,dRow,depth,bad:panels.filter(p=>!p.ok).length,whys:[...new Set(panels.filter(p=>!p.ok).map(p=>p.why))]};
}
// prova tutte le combinazioni montaggio/file e restituisce quelle in cui tutti i pannelli stanno sul tetto
function fitOptions(D){const so=S.orient,sr=S.rows,out=[];
  try{for(const o of ['V','O'])for(let r=1;r<=Math.min(4,D.N);r++){S.orient=o;S.rows=r;if(!layoutPanels(D).bad)out.push({o,r})}}finally{S.orient=so;S.rows=sr}
  return out}
function fitAdvice(D){const f=fitOptions(D),same=f.filter(x=>x.o===S.orient),oth=f.filter(x=>x.o!==S.orient),nm=o=>o==='V'?'verticale':'orizzontale',fl=r=>r===1?'una fila':r+' file';
  if(same.length)return {txt:`Prova con <b>${fl(same[0].r)}</b>.`,btn:''};
  if(oth.length)return {txt:`In ${nm(S.orient)} non ci stanno con nessun numero di file. In <b>${nm(oth[0].o)}</b> su ${fl(oth[0].r)} ci stanno tutti.`,btn:`<button class="btn sm" data-fixorient="${oth[0].o}">${ic('undo')} Monta in ${nm(oth[0].o)}</button>`};
  return {txt:`Il tetto (${f1(D.roofW)} × ${f1(D.roofL)} m) è troppo piccolo per ${D.N} pannelli${S.camino?' con il camino':''}. Torna alla fase “Il tetto” e controlla le misure della falda${S.camino?' o togli il camino se non c’è':''}.`,btn:`<button class="btn sm" data-goid="tetto">← Vai a “Il tetto”</button>`}}
function compute(){
  const D={},pv=PROVINCE[S.prov];
  D.zona=pv?pv.z:'Sud';D.lat=pv?pv.lat:38;D.loc=S.prov||'—';D.reg=pv?pv.reg:'';
  D.size=S.edificio==='palazzina'?'big':'small';D.zr=ZONE[D.zona][D.size];
  D.coef=isNull(S.coef)?D.zr[0]:clamp(+S.coef,D.zr[0],D.zr[1]);D.A=+S.A||0;D.Sreq=D.coef*D.A/10;
  D.P=S.pan==='custom'?{...PANNELLI.custom,...S.cp}:PANNELLI[S.pan||'rps254'];D.Aref=+D.P.Ar;
  D.Nraw=D.Sreq/D.Aref;D.N=Math.max(1,Math.ceil(D.Nraw-1e-6));D.Snet=D.N*D.Aref;
  D.tilt=+S.tilt||35;D.az=DIR_AZ[S.dir]??0;D.oLoss=orientLoss(D.az);D.noonW=90-D.lat-23.45;D.noonS=90-D.lat+23.45;D.ideal=Math.round(D.lat+10);
  // disposizione: una stringa in fila; se sono più di 6 si va su due file
  S.orient='V';S.rows=D.N>6?2:1;const sg=suggestRoof();D.roofW=Math.max(sg.W,(Math.ceil(D.N/S.rows))*1.25+1.2);D.roofL=Math.max(sg.L,S.rows*2.35+1);D.obs=[];
  D.layout=layoutPanels(D);D.conn='serie';D.per=D.N;D.lines=1;
  // portata (40 l/h per m² di pannello)
  D.qsp=40;D.Gp=D.qsp*D.Aref;D.G=D.Gp*D.N;D.Gline=D.G;
  // Tab. 7A: perdita imposta 12 mm c.a./m, primo tubo che porta almeno G
  D.rimp=12;D.r=12;const ri=PIPE_R.indexOf(D.rimp);D.rRow=ri;
  D.pipeIdx=PIPES.findIndex(p=>p.g[ri]!=null&&p.g[ri]>=D.G);D.pipeOver=D.pipeIdx<0;if(D.pipeIdx<0)D.pipeIdx=PIPES.length-1;D.pipeP=PIPES[D.pipeIdx];
  D.pipe={p:D.pipeP,r:D.r,v:vel(D.G,D.pipeP.di)};
  // Legge 10 (DPR 412/93): riga di λ uguale o subito più grande, colonna del diametro esterno
  D.im=INS_MAT[S.insMat||'nbr'];D.lam=D.im.l;D.lamRow=INS_L.findIndex(l=>l>=D.lam-1e-9);if(D.lamRow<0)D.lamRow=INS_L.length-1;
  D.insCol=insCol(D.pipeP.de);D.insTab=INS_T[D.lamRow][D.insCol];D.ins={s:D.insTab,i0:D.lamRow,i1:D.lamRow,c:D.insCol};
  // Tab. 9: colonna dello spessore uguale o subito più grande
  D.tab9Col=TAB9_S.findIndex(v=>v>=D.insTab);if(D.tab9Col<0)D.tab9Col=TAB9_S.length-1;D.insComm=TAB9_S[D.tab9Col];D.tab9Row=TAB9_DE.indexOf(D.pipeP.de);
  D.Sext=Math.PI*(D.pipeP.de+2*D.insComm)/1000;D.Dext=D.pipeP.de+2*D.insComm;
  // antigelo: temperatura minima della zona, prima concentrazione che protegge
  D.gtype=S.gtype||'etilico';const G=GLICOLE[D.gtype];D.Tprot=ZONA_GELO[D.zona];
  D.gMin=(G.pts.find(([p,t])=>t<=D.Tprot)||G.pts[G.pts.length-1])[0];D.gpct=D.gMin;
  D.Tg=(G.pts.find(([p])=>p===D.gpct))[1];D.gOk=D.Tg<=D.Tprot;D.fg=G.fm[D.gpct]||1.1;
  // pompa: stringa in serie, tubi andata e ritorno, scambiatore 500 mm c.a.
  D.Lone=isNull(S.Lone)?null:+S.Lone;D.LoneSug=Math.max(6,Math.round(((+S.piani||2)*3+2)/2)*2);D.Ltot=D.Lone==null?0:2*D.Lone;
  D.Hp1=D.P.Hp*(D.G/D.P.Gp)**2;D.Hfield=D.Hp1*D.N;D.Hcont=D.r*D.Ltot;D.Hloc=0;D.Hpipes=D.Hcont;
  D.Hsc=500;D.Hsum=D.Hfield+D.Hcont;D.Htot=D.Hsum*D.fg+D.Hsc;
  // scambiatore
  D.q=400;D.Q=D.q*D.Snet;D.QkW=D.Q/860;D.tsi=50;D.tso=40;D.tbi=35;D.tbo=45;
  // vaso e valvola
  D.VP=D.N*D.P.vol;D.Vt=D.Ltot*Math.PI*(D.pipeP.di/1000)**2/4*1000;D.Vsc=isNull(S.Vsc)?null:+S.Vsc;D.Vc=D.VP+D.Vt+(D.Vsc||0);
  D.e=0.07;D.k=1.1;D.Vu=(D.Vc*D.e+D.VP)*D.k;
  D.Hst=(+S.piani||2)*3+2;D.Pst=D.Hst/10.2;D.Pi=r1(D.Pst+0.5);D.Pvs=+S.Pvs||5;D.Pf=D.Pvs-0.5;D.Vn=D.Vu*(D.Pf+1)/(D.Pf-D.Pi);D.vaso=VASI_COMM.find(v=>v>=D.Vn)||150;
  // serbatoio
  D.kV=+S.kV||55;D.Vcalc=D.kV*D.Snet;D.Vtank=SERBATOI_COMM.find(v=>v>=D.Vcalc-1)||2000;D.tank=S.tank||'ss';
  D.tankName={ss:'Serbatoio a semplice serpentino',ds:'Serbatoio a doppio serpentino',tit:'Serbatoio combinato tank in tank'}[D.tank];
  D.dton=S.dton||6;D.tmax=S.tmax||85;
  return D;
}
function done(id){for(const s of STEPS)for(const t of (s.tasks||[]))if(t.id===id)return taskOk(t);return false}
