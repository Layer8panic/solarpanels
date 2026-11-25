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
  const D={},reg=REGIONI[S.regione];
  D.zona=reg?reg.z:'Sud';D.lat=reg?reg.lat:40;D.loc=S.prov||'località';D.Tp=isNull(S.Tp)?null:+S.Tp;
  D.size=S.edificio==='palazzina'?'big':'small';D.zr=ZONE[D.zona][D.size];
  D.coef=isNull(S.coef)?D.zr[0]:clamp(+S.coef,D.zr[0],D.zr[1]);D.A=+S.A||0;D.Sreq=D.coef*D.A/10;
  D.P=S.pan==='custom'?{...PANNELLI.custom,...S.cp}:PANNELLI[S.pan||'rps254'];D.Aref=+D.P.Ar;
  D.Nraw=D.Sreq/D.Aref;D.N=Math.max(1,Math.ceil(D.Nraw-1e-6));D.Snet=D.N*D.Aref;
  D.tilt=S.roof==='piano'?S.flatTilt:(+S.tilt||30);D.az=DIR_AZ[S.dir]??0;D.oLoss=orientLoss(D.az);D.noonW=90-D.lat-23.45;D.noonS=90-D.lat+23.45;D.ideal=Math.round(D.lat+10);
  const sg=suggestRoof();D.roofW=isNull(S.roofW)?sg.W:+S.roofW;D.roofL=isNull(S.roofL)?sg.L:+S.roofL;D.roofEst=isNull(S.roofW)||isNull(S.roofL);
  D.obs=S.camino?[{t:'camino',x:TH.chimney==='left'?Math.min(1.2,D.roofW*0.12):Math.max(0.4,D.roofW*0.86-0.3),y:Math.max(0.3,D.roofL*0.3),w:.6,h:.6}]:[];
  D.layout=layoutPanels(D);D.conn=S.orient==='V'?'parallelo':'serie';D.maxLine=S.orient==='V'?D.P.maxV:D.P.maxO;
  D.lines=Math.max(D.layout.rows,Math.ceil(D.N/(D.conn==='serie'?Math.min(D.maxLine,5):D.maxLine)));D.per=Math.ceil(D.N/D.lines);
  // portata
  D.qsp=40;D.Gp=D.qsp*D.Aref;D.G=D.Gp*D.N;D.Gline=D.G/D.lines;
  // Tabella 7A: riga r imposta, primo tubo con portata >= G; poi r reale = riga dove la colonna supera G
  D.rimp=S.rimp||12;const ri=PIPE_R.indexOf(D.rimp);
  D.pipeIdx=PIPES.findIndex(p=>p.g[ri]!=null&&p.g[ri]>=D.G);D.pipeOver=D.pipeIdx<0||D.pipeIdx>8;if(D.pipeIdx<0)D.pipeIdx=PIPES.length-1;D.pipeP=PIPES[D.pipeIdx];
  D.rRow=D.pipeP.g.findIndex(g=>g!=null&&g>=D.G);if(D.rRow<0)D.rRow=PIPE_R.length-1;D.r=PIPE_R[D.rRow];
  D.pipe={p:D.pipeP,r:D.r,v:vel(D.G,D.pipeP.di)};
  D.Lone=isNull(S.Lone)?null:+S.Lone;D.Ltot=D.Lone==null?0:2*D.Lone;
  // Legge 10: lambda arrotondata alla riga superiore della tabella
  D.im=INS_MAT[S.insMat||'nbr'];D.lam=+S.lam||D.im.l;D.lamRow=INS_L.findIndex(l=>l>=D.lam-1e-9);if(D.lamRow<0)D.lamRow=INS_L.length-1;
  D.insCol=insCol(D.pipeP.de);D.insTab=INS_T[D.lamRow][D.insCol];D.insComm=INS_COMM.find(v=>v>=D.insTab-0.01)||80;
  D.ins={s:D.insTab,i0:D.lamRow,i1:D.lamRow,c:D.insCol};D.insK=1;D.insReq=D.insTab;
  D.Dext=D.pipeP.de+2*D.insComm;D.Sext=Math.PI*D.Dext/1000;D.tab9Col=TAB9_S.indexOf(D.insComm);
  // antigelo
  D.gtype=S.gtype||'propilenico';const G=GLICOLE[D.gtype];D.Tprot=D.Tp==null?null:D.Tp-10;
  D.gMin=(G.pts.find(([p,t])=>D.Tprot!=null&&t<=D.Tprot)||G.pts[G.pts.length-1])[0];D.gpct=D.gMin;
  D.Tg=(G.pts.find(([p])=>p===D.gpct))[1];D.gOk=D.Tprot!=null&&D.Tg<=D.Tprot;D.fg=G.fm[D.gpct]||1.1;
  // pompa
  D.Hcont=D.r*D.Ltot;D.Hloc=Math.round(D.Hcont*0.3);D.Hdist=D.Hcont;D.Hpipes=D.Hcont+D.Hloc;
  D.Hp1=D.P.Hp*(D.Gp/D.P.Gp)**2;D.Hfield=D.conn==='serie'?D.per*D.P.Hp*(D.Gline/D.P.Gp)**2:D.Hp1;
  D.Hsc=isNull(S.Hsc)?500:+S.Hsc;D.Htot=(D.Hpipes+D.Hfield)*D.fg+D.Hsc;D.locPct=30;
  // scambiatore
  D.q=400;D.Q=D.q*D.Snet;D.QkW=D.Q/860;D.tsi=50;D.tso=40;D.tbi=35;D.tbo=45;D.dtml=5;
  // vaso e valvola
  D.VP=D.N*D.P.vol;D.Vt=D.Ltot*Math.PI*(D.pipeP.di/1000)**2/4*1000;D.Vsc=isNull(S.Vsc)?Math.round(D.Snet*2.5):+S.Vsc;D.Vc=D.VP+D.Vt+D.Vsc;
  D.e=0.07;D.k=1.1;D.Vu=(D.Vc*D.e+D.VP)*D.k;D.HstSug=r1((+S.piani||2)*3+(S.roof==='piano'?1.5:D.roofL*Math.sin(rad(D.tilt))));D.Hst=isNull(S.Hst)?D.HstSug:+S.Hst;
  D.Pi=r1(D.Hst/10.2+0.5);D.Pvs=+S.Pvs||6;D.Pf=D.Pvs-0.5;D.Vn=D.Vu*(D.Pf+1)/(D.Pf-D.Pi);D.vaso=VASI_COMM.find(v=>v>=D.Vn)||150;
  // serbatoio
  D.kV=+S.kV||55;D.Vcalc=D.kV*D.Snet;D.Vtank=SERBATOI_COMM.find(v=>v>=D.Vcalc-1)||2000;D.tank=S.tank||'ss';
  D.tankName={ss:'Serbatoio a semplice serpentino',ds:'Serbatoio a doppio serpentino',tit:'Serbatoio combinato tank in tank'}[D.tank];
  D.dton=S.dton||6;D.tmax=S.tmax||85;
  return D;
}
function done(id){for(const s of STEPS)for(const t of (s.tasks||[]))if(t.id===id)return taskOk(t);return false}
