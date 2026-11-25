// ===================== DISEGNI PRINCIPALI (rifatti sul modello della relazione) =====================
// Sostituiscono le versioni precedenti: questo file è caricato dopo gli altri disegni.
const HOT=()=>(TH&&TH.hot)||'#e0482f',COLD=()=>(TH&&TH.cold)||'#2f7fd8';
function wrapT(x,y,txt,max,o={}){const fs=o.s||12,lh=o.lh||fs*1.3,words=String(txt).split(' ');let lines=[],cur='';
  for(const w of words){if((cur+' '+w).trim().length>max){lines.push(cur.trim());cur=w}else cur+=' '+w}if(cur.trim())lines.push(cur.trim());
  return {svg:`<text x="${x}" y="${y}" font-size="${fs}" fill="${o.c||'#1d2433'}" font-weight="${o.w||'normal'}" text-anchor="${o.a||'start'}">${lines.map((l,i)=>`<tspan x="${x}" dy="${i?lh:0}">${xesc(l)}</tspan>`).join('')}</text>`,h:lines.length*lh}}
function pipeP(d,col,w=7,L=false){w*=(TH&&TH.pipeK)||1;return `<path d="${d}" fill="none" stroke="#2b3442" stroke-width="${w+3}" stroke-linejoin="round" stroke-linecap="round" opacity=".25"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${L?' class="flow"':''}/>`}
function pumpS(x,y,r=13){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#2b3442" stroke-width="2.4"/><path d="M${x-r*.45},${y-r*.6} L${x+r*.65},${y} L${x-r*.45},${y+r*.6}z" fill="#2b3442"/>`}
function tankS(x,y,w,h,id,o={}){const k=(TH&&TH.tankK)||1;x+=w*(1-k)/2;w*=k;const r=w/2;let s=`<g filter="url(#sh${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r*TH.tankR}" fill="url(#tg${id})" stroke="${shade(TH.hot,-.45)}" stroke-width="1.5"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r*TH.tankR}" fill="url(#ts${id})"/></g>`;
  s+=`<rect x="${x+w*.2}" y="${y+h}" width="6" height="12" fill="#6b7380"/><rect x="${x+w*.8-6}" y="${y+h}" width="6" height="12" fill="#6b7380"/>`;
  if(o.coil){const cy0=y+h*(o.coilTop||.5),cy1=y+h*.9,n=o.turns||7;let d='';for(let k=0;k<=n;k++){const yy=cy0+(cy1-cy0)*k/n;d+=`${k?'L':'M'}${x+8},${yy} L${x+w-8},${yy+(cy1-cy0)/n/2}`}s+=`<path d="${d}" fill="none" stroke="${TH.coil}" stroke-width="3.2" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#f0b06a" stroke-width="1.2"/>`}
  return s}
function tankDefs(id){return `<linearGradient id="tg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${TH.hot}"/><stop offset=".45" stop-color="${TH.hotMid}"/><stop offset=".75" stop-color="${shade(TH.hotMid,.3)}"/><stop offset="1" stop-color="${TH.cold}"/></linearGradient><linearGradient id="ts${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".3" stop-color="#fff" stop-opacity=".28"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient><linearGradient id="pv${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${TH.panel[0]}"/><stop offset=".6" stop-color="${TH.panel[1]}"/><stop offset="1" stop-color="${TH.panel[2]}"/></linearGradient>${SHF(id)}`}
function hxS(x,y,w,h){let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#c9d0d9" stroke="#5d6774" stroke-width="1.6"/>`;const np=(TH&&TH.plates||6)+1;for(let k=1;k<np;k++)s+=`<line x1="${x+k*w/np}" y1="${y+4}" x2="${x+k*w/np}" y2="${y+h-4}" stroke="#7d8794" stroke-width="1.4"/>`;
  return s+`<rect x="${x-4}" y="${y-6}" width="${w+8}" height="8" rx="2" fill="#5d6774"/><rect x="${x-4}" y="${y+h-2}" width="${w+8}" height="8" rx="2" fill="#5d6774"/>`}
function collS(pts,id){const [a,b,c,d]=pts;let s=`<polygon points="${P2(pts)}" fill="url(#pv${id})" stroke="#c7ccd4" stroke-width="2.4"/>`;
  for(let k=1;k<5;k++){const t=k/5;s+=`<line x1="${a[0]+(b[0]-a[0])*t}" y1="${a[1]+(b[1]-a[1])*t}" x2="${d[0]+(c[0]-d[0])*t}" y2="${d[1]+(c[1]-d[1])*t}" stroke="#6f8fc7" stroke-width=".9"/>`}
  return s+`<polygon points="${P2([a,[a[0]+(b[0]-a[0])*.3,a[1]+(b[1]-a[1])*.3],[d[0]+(c[0]-d[0])*.1,d[1]+(c[1]-d[1])*.1],d])}" fill="#fff" opacity=".13"/>`}
function infoBox(x,y,w,title,col,items,o={}){const hh=26;let s=`<rect x="${x}" y="${y}" width="${w}" height="${o.h||100}" rx="10" fill="#fff" stroke="${col}" stroke-width="1.6"/><path d="M${x} ${y+10} a10 10 0 0 1 10 -10 h${w-20} a10 10 0 0 1 10 10 v${hh-10} h${-w}z" fill="${col}"/>`;
  s+=`<text x="${x+12}" y="${y+18}" font-size="13.5" font-weight="bold" fill="#fff">${xesc(title)}</text>`;let yy=y+hh+16;
  items.forEach((it,i)=>{const mk=o.num?`<circle cx="${x+18}" cy="${yy-4}" r="8" fill="${col}"/><text x="${x+18}" y="${yy}" font-size="10.5" font-weight="bold" fill="#fff" text-anchor="middle">${i+1}</text>`:o.check?`<circle cx="${x+18}" cy="${yy-4}" r="7" fill="#14965c"/><path d="M${x+14.5},${yy-4} l2.5,2.6 l4.5,-5" stroke="#fff" stroke-width="2" fill="none"/>`:`<circle cx="${x+18}" cy="${yy-4}" r="3.2" fill="${col}"/>`;
    const t=wrapT(x+32,yy,it,o.chars||34,{s:11.5});s+=mk+t.svg;yy+=t.h+5});return s}

// ---------- PUNTO 11 e copertina: tutto l'impianto ----------
function figImpianto(D,o={}){
  const id=++UID,mini=!!o.mini,L=!!o.L,W=mini?740:1040,H=mini?600:760,hot=HOT(),cold=COLD();
  let defs=tankDefs(id)+`<linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${TH.sky[0]}"/><stop offset="1" stop-color="${TH.sky[1]}"/></linearGradient><linearGradient id="rf${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(TH.roof,.12)}"/><stop offset="1" stop-color="${TH.roof2}"/></linearGradient><pattern id="tl${id}" width="18" height="10" patternUnits="userSpaceOnUse">${TH.roofTex==='tile'?`<path d="M0 10 Q9 2 18 10" fill="none" stroke="${shade(TH.roof,-.4)}" stroke-width="1.1" opacity=".55"/>`:TH.roofTex==='lines'?`<path d="M0 9 H18" stroke="${shade(TH.roof,-.35)}" stroke-width="1.2" opacity=".5"/>`:`<path d="M6 0 V10" stroke="${shade(TH.roof,-.3)}" stroke-width="1.4" opacity=".45"/>`}</pattern>`;
  let b=`<rect width="${W}" height="${H}" fill="#ffffff"/>`;
  if(!mini){b+=`<rect x="0" y="0" width="${W}" height="62" fill="${TH.ink}"/><text x="${W/2}" y="28" font-size="22" font-weight="bold" fill="#fff" text-anchor="middle">IMPIANTO SOLARE TERMICO PER SERVIZIO COMBINATO</text><text x="${W/2}" y="50" font-size="14" fill="#ffd27a" text-anchor="middle">acqua calda sanitaria + riscaldamento a pannelli radianti · ${xesc(D.loc)}</text>`}
  const oy=mini?0:62,gx=0;
  let sc='';
  // cielo, sole, prato
  sc+=`<rect x="0" y="${oy}" width="${mini?W:740}" height="${H-oy-(mini?0:150)}" fill="url(#sky${id})"/>`;
  sc+=sunRays(40+TH.sunX*400,oy+62,TH.sunR,L);
  const gY=oy+470;sc+=`<rect x="0" y="${gY}" width="${mini?W:740}" height="${(mini?H:H-150)-gY}" fill="${TH.grass}"/><rect x="0" y="${gY}" width="${mini?W:740}" height="6" fill="${shade(TH.grass,-.2)}"/>`;
  // casa in sezione
  const x0=70,x1=680,yT=oy+215,yB=gY;
  sc+=`<rect x="${x0}" y="${yT}" width="${x1-x0}" height="${yB-yT}" fill="${TH.wall}"/><rect x="${x0+14}" y="${yT+12}" width="${x1-x0-28}" height="${yB-yT-26}" fill="${shade(TH.wall,.6)}"/>`;
  sc+=`<rect x="${x0}" y="${yT}" width="14" height="${yB-yT}" fill="${shade(TH.wall,-.15)}"/><rect x="${x1-14}" y="${yT}" width="14" height="${yB-yT}" fill="${shade(TH.wall,-.15)}"/><rect x="${x0}" y="${yB-14}" width="${x1-x0}" height="14" fill="${shade(TH.wall,-.25)}"/>`;
  // pavimento radiante
  let dz='';const fy=yB-22;for(let k=0;k<14;k++){const xx=x0+300+k*20;dz+=`${k?'L':'M'}${xx},${fy-10} L${xx},${fy+4} L${xx+10},${fy+4} L${xx+10},${fy-10}`}
  sc+=`<path d="${dz}" fill="none" stroke="${hot}" stroke-width="3" opacity=".9"${L?' class="flow slow"':''}/>`;
  // tetto a due falde, falda sinistra con i pannelli
  const pk=[(x0+x1)/2-40,oy+70],eL=[x0-34,yT+6],eR=[x1+34,yT+6];
  sc+=`<polygon points="${P2([[x0,yT],[pk[0],pk[1]+20],[x1,yT]])}" fill="${shade(TH.wall,-.05)}"/><line x1="${x0}" y1="${yT}" x2="${x1}" y2="${yT}" stroke="${shade(TH.wall,-.25)}" stroke-width="10"/>`;
  sc+=`<polygon points="${P2([eL,pk,eR,[eR[0]-10,eR[1]+16],[pk[0],pk[1]+20],[eL[0]+10,eL[1]+16]])}" fill="url(#rf${id})" stroke="${shade(TH.roof,-.45)}" stroke-width="2"/><polygon points="${P2([eL,pk,eR,[eR[0]-10,eR[1]+16],[pk[0],pk[1]+20],[eL[0]+10,eL[1]+16]])}" fill="url(#tl${id})"/>`;
  const along=(t,off=0)=>{const x=eL[0]+(pk[0]-eL[0])*t,y=eL[1]+(pk[1]-eL[1])*t;const nx=(pk[1]-eL[1]),ny=-(pk[0]-eL[0]),n=Math.hypot(nx,ny);return [x+nx/n*off,y+ny/n*off]};
  const nP=Math.min(D.N||4,6),t0=.2,t1=.88,pw=(t1-t0)/nP;const pts=[];
  for(let k=0;k<nP;k++){const a=t0+k*pw+.006,c=t0+(k+1)*pw-.006;pts.push([along(a,3),along(c,3),along(c,26),along(a,26)])}
  pts.forEach(p=>sc+=collS(p,id));
  if(L)sc+=`<g class="pulse" opacity=".3">${pts.map(p=>`<polygon points="${P2(p)}" fill="#cfe8ff"/>`).join('')}</g>`;
  const pIn=along(t0-.02,12),pOut=along(t1+.02,12);
  // componenti
  const fl=yB-26,tS={x:x0+70,y:fl-180,w:92,h:180},hx={x:x0+200,y:fl-118,w:36,h:70},tC={x:x0+270,y:fl-186,w:92,h:186},cal={x:x0+450,y:yT+34,w:84,h:112},cen={x:x0+176,y:yT+26,w:62,h:40};
  // tubi circuito solare
  const rx=tS.x+tS.w+22;
  sc+=pipeP(`M${pOut[0]},${pOut[1]} L${rx+70},${yT+20} L${rx},${yT+20} L${rx},${tS.y+tS.h*.55} L${tS.x+tS.w-6},${tS.y+tS.h*.55}`,hot,6,L);
  sc+=pipeP(`M${tS.x+8},${tS.y+tS.h*.9} L${x0+30},${tS.y+tS.h*.9} L${x0+30},${yT+30} L${pIn[0]},${pIn[1]}`,cold,6,L);
  sc+=pumpS(x0+30,tS.y+tS.h*.72,12);
  // accumulo solare -> scambiatore -> accumulo combinato -> caldaia -> pavimento
  sc+=pipeP(`M${tS.x+tS.w-4},${tS.y+30} L${hx.x+hx.w/2-8},${tS.y+30} L${hx.x+hx.w/2-8},${hx.y}`,hot,5,L);
  sc+=pipeP(`M${hx.x+hx.w/2-8},${hx.y+hx.h} L${hx.x+hx.w/2-8},${hx.y+hx.h+24} L${tS.x+tS.w-4},${hx.y+hx.h+24}`,cold,5,L);
  sc+=pipeP(`M${hx.x+hx.w/2+8},${hx.y} L${hx.x+hx.w/2+8},${tC.y+70} L${tC.x+4},${tC.y+70}`,hot,5,L);
  sc+=pipeP(`M${tC.x+4},${tC.y+tC.h-30} L${hx.x+hx.w/2+8},${tC.y+tC.h-30} L${hx.x+hx.w/2+8},${hx.y+hx.h}`,cold,5,L);
  sc+=pipeP(`M${tC.x+tC.w-4},${tC.y+28} L${cal.x+20},${tC.y+28} L${cal.x+20},${cal.y+cal.h}`,hot,5,L);
  sc+=pipeP(`M${cal.x+cal.w-20},${cal.y+cal.h} L${cal.x+cal.w-20},${fy-3} L${x0+300},${fy-3}`,hot,5,L);
  sc+=pipeP(`M${x1-24},${fy-3} L${x1-24},${tC.y+tC.h-12} L${tC.x+tC.w-4},${tC.y+tC.h-12}`,cold,5,L);
  sc+=pumpS(cal.x-20,tC.y+28,11)+pumpS(tC.x+tC.w+40,tC.y+tC.h-12,11);
  // acqua sanitaria: fredda dall'acquedotto, calda al rubinetto
  sc+=pipeP(`M${x0-30},${tS.y+tS.h-14} L${tS.x+6},${tS.y+tS.h-14}`,cold,5,L);
  sc+=pipeP(`M${tS.x+30},${tS.y+4} L${tS.x+30},${tS.y-22} L${x0-20},${tS.y-22} L${x0-20},${tS.y+10}`,hot,5,L);
  sc+=`<path d="M${x0-28},${tS.y+10} h16 v10 h-6 v6 h-4 v-6 h-6z" fill="#8a929d"/><path d="M${x0-22},${tS.y+30} q-4,8 0,12 q4,-4 0,-12z" fill="#5aa7ff"${L?' class="pulse"':''}/>`;
  // apparecchi
  sc+=tankS(tS.x,tS.y,tS.w,tS.h,id,{coil:true,coilTop:.48})+hxS(hx.x,hx.y,hx.w,hx.h)+tankS(tC.x,tC.y,tC.w,tC.h,id,{coil:true,coilTop:.2,turns:5});
  sc+=`<g filter="url(#sh${id})"><rect x="${cal.x}" y="${cal.y}" width="${cal.w}" height="${cal.h}" rx="8" fill="#f7f8fa" stroke="#8a929d" stroke-width="1.6"/></g><rect x="${cal.x+14}" y="${cal.y+16}" width="${cal.w-28}" height="20" rx="3" fill="#1d2433"/><circle cx="${cal.x+cal.w/2}" cy="${cal.y+70}" r="14" fill="none" stroke="#f5a524" stroke-width="3"/>`;
  sc+=`<g filter="url(#sh${id})"><rect x="${cen.x}" y="${cen.y}" width="${cen.w}" height="${cen.h}" rx="6" fill="#33405a"/></g><rect x="${cen.x+8}" y="${cen.y+8}" width="${cen.w-16}" height="14" rx="2" fill="#9fe0b0"/>`;
  sc+=`<path d="M${cen.x},${cen.y+cen.h/2} L${pOut[0]-30},${cen.y+cen.h/2} L${pOut[0]-30},${pOut[1]+40}" stroke="#33405a" stroke-dasharray="5 4" fill="none" stroke-width="1.5"/><path d="M${cen.x+cen.w/2},${cen.y+cen.h} L${cen.x+cen.w/2},${tS.y+tS.h*.8} L${tS.x+tS.w},${tS.y+tS.h*.8}" stroke="#33405a" stroke-dasharray="5 4" fill="none" stroke-width="1.5"/>`;
  // vaso e valvola
  const vx=x0+30,vy=tS.y+tS.h*.72+18;sc+=`<rect x="${vx-11}" y="${vy}" width="22" height="34" rx="11" fill="#d62828" stroke="#7a1a1a"/><rect x="${vx-2}" y="${vy-12}" width="4" height="12" fill="#6b7380"/>`;
  // etichette
  // specchiatura: metà degli alunni ha l'impianto disegnato al contrario (testi sempre dritti)
  const SW=mini?W:740,fl2=!!TH.flip,X=x=>fl2?SW-x:x,ofs=(!mini&&fl2)?W-SW:0,XX=x=>X(x)+ofs,sw2=a=>fl2?(a==='start'?'end':a==='end'?'start':a):a;
  const lb=(px,py,tx,ty,t,a='middle')=>lead(XX(px),py,XX(tx),ty)+Lbl(XX(tx),ty-6,t,{s:mini?11:12,a:sw2(a),stroke:TH.ink});
  b+=fl2?`<g transform="translate(${SW+ofs},0) scale(-1,1)">${sc}</g>`:sc;
  b+=`<text x="${XX(cal.x+cal.w/2)}" y="${cal.y+31}" font-size="12" font-weight="bold" fill="#7dfca0" text-anchor="middle">${D.tmax||85}°</text><text x="${XX(cen.x+cen.w/2)}" y="${cen.y+19}" font-size="10" font-weight="bold" fill="${TH.ink}" text-anchor="middle">ΔT ${D.dton||6}°C</text>`;
  const g1=yB+30,g2=yB+60,att=yT-22;
  b+=lb(pts[Math.floor(nP/2)][2][0],pts[Math.floor(nP/2)][2][1],pts[Math.floor(nP/2)][2][0]-10,oy+40,`${D.N||4} pannelli ${D.P?D.P.n:''}`);
  b+=lb(tS.x+tS.w/2,tS.y+8,tS.x+tS.w/2-10,att,`Accumulo solare ${D.Vtank||''} l`);
  b+=lb(cen.x+cen.w,cen.y+cen.h/2,cen.x+cen.w+70,att-34,`Centralina ΔT ${D.dton||6} °C`);
  b+=lb(tC.x+tC.w/2,tC.y+8,tC.x+tC.w/2+40,att+4,'Accumulo riscaldamento');
  b+=lb(cal.x+cal.w/2,cal.y,cal.x+cal.w/2+20,att-26,'Caldaia di supporto');
  b+=lb(hx.x+hx.w/2,hx.y+hx.h+8,hx.x+hx.w/2+40,g1,`Scambiatore ${D.QkW?f1(D.QkW)+' kW':''}`);
  b+=lb(x0+470,fy,x0+500,g1,'Riscaldamento a pavimento');
  b+=lb(x0-20,tS.y+42,x0+20,g1,'Utenze ACS');
  b+=lb(vx+11,vy+17,x0+120,g2,`Vaso di espansione ${D.vaso||''} l · valvola di sicurezza ${D.Pvs||5} bar`,'start');
  if(!mini){
    const sw=278,sx=fl2?10:752;
    b+=infoBox(sx,oy+12,sw,'Come funziona',TH.infoA,['I pannelli scaldano il liquido del circuito primario (acqua + glicole).','Il calore passa all’accumulo solare con il serpentino.','L’acqua calda va ai rubinetti (ACS) e, con lo scambiatore, al riscaldamento.','La caldaia interviene solo quando il sole non basta.'],{num:true,h:236});
    b+=infoBox(sx,oy+260,sw,'Il surriscaldamento',TH.infoW,['Il sole dà più calore di quanto serve: il liquido supera i 90 °C, la pressione sale.','Cause: tanto sole, poca acqua calda usata, accumulo già caldo, pompa ferma.'],{h:150});
    b+=infoBox(sx,oy+422,sw,'Come si previene',TH.infoG,[`Valvola di sicurezza (${D.Pvs||5} bar)`,`Vaso di espansione (${D.vaso||''} l)`,`Centralina che ferma la pompa a ${D.tmax||85} °C`,'Raffreddamento dell’accumulo'],{check:true,h:146});
    const by=H-140,bw=(W-40)/3;
    b+=infoBox(10,by,bw,'Vantaggi',TH.infoG,['Energia rinnovabile e gratuita','Acqua calda e riscaldamento','Meno combustibile e meno CO₂'],{check:true,h:128,chars:36});
    b+=infoBox(20+bw,by,bw,'Componenti principali',TH.infoP,['Pannelli solari termici','Accumuli: solare e riscaldamento','Scambiatore, pompa, centralina, caldaia'],{h:128,chars:36});
    b+=infoBox(30+2*bw,by,bw,'I numeri del progetto',TH.ink,[`${D.N} pannelli = ${f2(D.Snet)} m²`,`Portata ${f0(D.G)} l/h · prevalenza ${f2((D.Htot||0)/1000)} m c.a.`,`Serbatoio ${D.Vtank} l · vaso ${D.vaso} l`],{h:128,chars:38});
  }
  return svgWrap(W,H,b,defs);
}

// ---------- PUNTO 2: tubo, guaina e sezione quotata ----------
function figTube3D(D,L=false,bare=false){
  const id=++UID,W=800,H=420,de=D.pipeP.de,di=D.pipeP.di,s=bare?0:D.insComm,R=de/2+s;
  const k=92/R,Ro=R*k,Rp=de/2*k,Ri=di/2*k,cy=170,ry=.34,xa=60,xi=170,xb=430;
  const ins=bare?'':({nbr:'#2a2d33',epdm:'#24303c',lana:'#d9c58f',pu:'#e7d48a'}[S.insMat]||'#2a2d33');
  let defs=`<linearGradient id="st${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2e6ea"/><stop offset=".45" stop-color="#9aa3ad"/><stop offset="1" stop-color="#555d67"/></linearGradient><linearGradient id="in${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bare?'#fff':shade(ins,.35)}"/><stop offset=".5" stop-color="${ins||'#fff'}"/><stop offset="1" stop-color="${bare?'#fff':shade(ins,-.35)}"/></linearGradient><linearGradient id="fl${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc6ff"/><stop offset="1" stop-color="#2f7fd8"/></linearGradient>${SHF(id)}`;
  let b=`<rect width="${W}" height="${H}" fill="#fbfcfe"/>`;
  const cyl=(r,x1,x2,f)=>`<path d="M${x1},${cy-r} L${x2},${cy-r} A${r*ry},${r} 0 0 1 ${x2},${cy+r} L${x1},${cy+r} A${r*ry},${r} 0 0 1 ${x1},${cy-r}z" fill="${f}"/>`;
  const ring=(x,r1,r2,f)=>`<ellipse cx="${x}" cy="${cy}" rx="${r1*ry}" ry="${r1}" fill="${f}"/>`+(r2?`<ellipse cx="${x}" cy="${cy}" rx="${r2*ry}" ry="${r2}" fill="#000" opacity="0"/>`:'');
  // 3D: guaina tagliata a metà lunghezza per far vedere il tubo dentro
  if(!bare)b+=`<g filter="url(#sh${id})">${cyl(Ro,xi,xb,`url(#in${id})`)}</g>`;
  b+=`<g filter="url(#sh${id})">${cyl(Rp,xa,bare?xb:xi+2,`url(#st${id})`)}</g>`;
  if(!bare){b+=ring(xi,Ro,0,shade(ins,.18))+ring(xi,Rp,0,'#8b949e')}
  b+=ring(bare?xb:xb,bare?Rp:Ro,0,bare?'#8b949e':shade(ins,.18))+(bare?'':ring(xb,Rp,0,'#8b949e'))+ring(xb,Ri,0,`url(#fl${id})`);
  b+=ring(xa,Rp,0,'#8b949e')+ring(xa,Ri,0,`url(#fl${id})`);
  if(L)b+=`<path d="M${xa-40},${cy} L${xa-4},${cy}" stroke="#2f7fd8" stroke-width="5" class="flow" stroke-linecap="round"/>`;
  // etichette 3D
  b+=lead(xa+40,cy-Rp+4,xa+20,40)+Lbl(xa+20,36,`Tubo in acciaio non zincato`,{s:12,a:'start',stroke:'#5d6774'});
  b+=lead(xa,cy+Ri*.4,xa-6,H-112)+Lbl(xa-14,H-106,'Liquido: acqua + glicole',{s:12,a:'start',stroke:'#2f7fd8'});
  if(!bare)b+=lead((xi+xb)/2,cy+Ro-8,(xi+xb)/2+20,H-80)+Lbl((xi+xb)/2+20,H-74,`Guaina isolante: ${D.im.n.toLowerCase()}, ${s} mm`,{s:12,stroke:'#1d2433'});
  // sezione quotata a destra
  const cx=640,sk=96/R,so=R*sk,sp=de/2*sk,si=di/2*sk;
  b+=`<text x="${cx}" y="34" font-size="13" font-weight="bold" fill="${TH.ink}" text-anchor="middle">SEZIONE</text>`;
  if(!bare)b+=`<circle cx="${cx}" cy="${cy}" r="${so}" fill="${ins}" stroke="#111" stroke-width="1"/>`;
  b+=`<circle cx="${cx}" cy="${cy}" r="${sp}" fill="#9aa3ad" stroke="#555d67" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${si}" fill="url(#fl${id})"/>`;
  const dim=(y,r,t,c=TH.ink)=>`<line x1="${cx-r}" y1="${y}" x2="${cx+r}" y2="${y}" stroke="${c}" stroke-width="1.6" marker-start="url(#ar${id})" marker-end="url(#ar${id})"/><text x="${cx}" y="${y-5}" font-size="12" font-weight="bold" fill="${c}" text-anchor="middle">${t}</text>`;
  defs+=`<marker id="ar${id}" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8z" fill="${TH.ink}"/></marker>`;
  b+=dim(cy-4,si,`Di ${f1(di)}`,'#fff');
  b+=`<line x1="${cx-sp}" y1="${cy+so+(bare?18:20)}" x2="${cx+sp}" y2="${cy+so+(bare?18:20)}" stroke="${TH.ink}" stroke-width="1.6" marker-start="url(#ar${id})" marker-end="url(#ar${id})"/><line x1="${cx-sp}" y1="${cy}" x2="${cx-sp}" y2="${cy+so+24}" stroke="${TH.ink}" stroke-dasharray="3 3"/><line x1="${cx+sp}" y1="${cy}" x2="${cx+sp}" y2="${cy+so+24}" stroke="${TH.ink}" stroke-dasharray="3 3"/><text x="${cx}" y="${cy+so+(bare?34:38)}" font-size="12" font-weight="bold" fill="${TH.ink}" text-anchor="middle">De ${f1(de)} mm</text>`;
  if(!bare){b+=`<line x1="${cx+sp}" y1="${cy-sp*.0}" x2="${cx+so}" y2="${cy}" stroke="#ffd24a" stroke-width="2.2" marker-start="url(#ar${id})" marker-end="url(#ar${id})"/><text x="${cx+(sp+so)/2}" y="${cy-8}" font-size="12" font-weight="bold" fill="#ffd24a" text-anchor="middle">${s} mm</text>`;
    b+=`<rect x="150" y="${H-56}" width="${W-300}" height="46" rx="8" fill="#eef2f8"/><text x="${W/2}" y="${H-38}" font-size="12.5" fill="#1d2433" text-anchor="middle">Diametro esterno con guaina: ${f1(de)} + 2 × ${s} = <tspan font-weight="bold">${f1(de+2*s)} mm</tspan></text><text x="${W/2}" y="${H-18}" font-size="12.5" fill="#1d2433" text-anchor="middle">1 m di tubo isolato = <tspan font-weight="bold">${f3(D.Sext)} m²</tspan> (Tab. 9)</text>`}
  return svgWrap(W,H,b,defs);
}

// ---------- PUNTO 4: schema di stringa ----------
function figString(D,L=false){
  const id=++UID,n=Math.min(D.N||4,8),W=820,H=360,pw=Math.min(120,560/n-14),ph=150,gap=14,x0=150,y0=110,tot=n*pw+(n-1)*gap,hot=HOT(),cold=COLD();
  let defs=`<linearGradient id="pv${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${TH.panel[0]}"/><stop offset="1" stop-color="${TH.panel[2]}"/></linearGradient><marker id="ar${id}" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8z" fill="${TH.ink}"/></marker>`;
  let b=`<rect width="${W}" height="${H}" fill="#fbfcfe"/>`;
  for(let k=0;k<n;k++){const x=x0+k*(pw+gap);b+=`<rect x="${x}" y="${y0}" width="${pw}" height="${ph}" rx="4" fill="url(#pv${id})" stroke="#c7ccd4" stroke-width="2"/>`;for(let j=1;j<5;j++)b+=`<line x1="${x+j*pw/5}" y1="${y0+4}" x2="${x+j*pw/5}" y2="${y0+ph-4}" stroke="#6f8fc7" stroke-width=".8"/>`;
    if(k<n-1)b+=pipeP(`M${x+pw},${y0+ph-20} L${x+pw+gap},${y0+20}`,'#e3a23a',4,L)}
  b+=pipeP(`M60,${y0+ph+60} L110,${y0+ph+60} L110,${y0+ph-20} L${x0},${y0+ph-20}`,cold,6,L);
  b+=pipeP(`M${x0+tot},${y0+20} L${x0+tot+30},${y0+20} L${x0+tot+30},${y0-40} L80,${y0-40} L80,${y0+ph+30} L60,${y0+ph+30}`,hot,6,L);
  b+=`<text x="54" y="${y0+ph+64}" font-size="12" font-weight="bold" fill="${cold}" text-anchor="end">ritorno</text><text x="54" y="${y0+ph+34}" font-size="12" font-weight="bold" fill="${hot}" text-anchor="end">mandata</text>`;
  const q=(x1,x2,y,t)=>`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${TH.ink}" stroke-width="1.4" marker-start="url(#ar${id})" marker-end="url(#ar${id})"/><line x1="${x1}" y1="${y-8}" x2="${x1}" y2="${y+8}" stroke="${TH.ink}"/><line x1="${x2}" y1="${y-8}" x2="${x2}" y2="${y+8}" stroke="${TH.ink}"/><text x="${(x1+x2)/2}" y="${y-6}" font-size="12.5" font-weight="bold" fill="${TH.ink}" text-anchor="middle">${t}</text>`;
  b+=q(x0,x0+tot,y0-14,`Δt = 10 °C · G = ${f0(D.G)} l/h in ogni pannello`);
  b+=q(x0,x0+pw,y0+ph+26,`1 pannello: ${f0(D.Hp1)}`);
  b+=q(x0,x0+tot,y0+ph+60,`stringa: ${f0(D.Hp1)} × ${D.N} = ${f0(D.Hfield)} mm c.a.`);
  b+=`<text x="${W/2}" y="${H-14}" font-size="12" fill="#5f6878" text-anchor="middle">${D.N} pannelli ${D.P.n} collegati in serie (perdite in mm c.a.)</text>`;
  return svgWrap(W,H,b,defs);
}

// ---------- PUNTO 9: centrale termica dell'impianto solare ----------
function figCentraleSol(D,o={}){
  const id=++UID,W=860,H=680,L=!!o.L,hot=HOT(),cold=COLD();
  let defs=tankDefs(id)+`<linearGradient id="rf${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(TH.roof,.12)}"/><stop offset="1" stop-color="${TH.roof2}"/></linearGradient>`;
  let b=`<rect width="${W}" height="${H}" fill="#ffffff"/>`+sunRays(90,80,28,L);
  // tetto e collettore
  const eL=[150,250],pk=[520,70],eR=[800,190];
  b+=`<polygon points="${P2([eL,pk,eR,[eR[0],eR[1]+20],[pk[0],pk[1]+22],[eL[0],eL[1]+22]])}" fill="url(#rf${id})" stroke="#6d2a1d" stroke-width="2"/>`;
  const at=t=>[eL[0]+(pk[0]-eL[0])*t,eL[1]+(pk[1]-eL[1])*t],c0=at(.28),c1=at(.78),nx=(pk[1]-eL[1]),ny=-(pk[0]-eL[0]),nn=Math.hypot(nx,ny),off=(p,d)=>[p[0]+nx/nn*d,p[1]+ny/nn*d];
  b+=collS([off(c0,6),off(c1,6),off(c1,40),off(c0,40)],id);
  const pBot=off(c0,24),pTop=off(c1,24),xR=600,xLp=250;
  // mandata calda (destra) e ritorno freddo (sinistra) con i componenti
  const tk={x:640,y:330,w:130,h:230};
  b+=pipeP(`M${pTop[0]},${pTop[1]} L${xR},${pTop[1]} L${xR},${tk.y+tk.h*.45} L${tk.x+8},${tk.y+tk.h*.45}`,hot,7,L);
  b+=pipeP(`M${tk.x+8},${tk.y+tk.h*.88} L${xR-40},${tk.y+tk.h*.88} L${xR-40},${505} L${xLp},505 L${xLp},${pBot[1]} L${pBot[0]},${pBot[1]}`,cold,7,L);
  b+=tankS(tk.x,tk.y,tk.w,tk.h,id,{coil:true,coilTop:.42,turns:8});
  // sonde e centralina
  b+=`<circle cx="${pTop[0]-6}" cy="${pTop[1]-14}" r="7" fill="#33405a"/><circle cx="${tk.x+tk.w-14}" cy="${tk.y+tk.h*.78}" r="7" fill="#33405a"/>`;
  b+=`<rect x="290" y="250" width="90" height="56" rx="7" fill="#33405a"/><rect x="300" y="260" width="70" height="18" rx="2" fill="#9fe0b0"/><text x="335" y="274" font-size="11" font-weight="bold" fill="${TH.ink}" text-anchor="middle">ΔT ${D.dton||6} °C</text><text x="335" y="296" font-size="10" fill="#fff" text-anchor="middle">centralina</text>`;
  b+=`<path d="M380,268 L${pTop[0]-6},268 L${pTop[0]-6},${pTop[1]-8}" stroke="#33405a" stroke-dasharray="6 4" fill="none" stroke-width="1.6"/><path d="M335,306 L335,330 L${tk.x+tk.w+20},330 L${tk.x+tk.w+20},${tk.y+tk.h*.78} L${tk.x+tk.w-8},${tk.y+tk.h*.78}" stroke="#33405a" stroke-dasharray="6 4" fill="none" stroke-width="1.6"/><path d="M335,306 L335,330 L${xLp},330" stroke="#33405a" stroke-dasharray="6 4" fill="none" stroke-width="1.2"/>`;
  // componenti sul ritorno (dall'alto)
  const comp=[],y=v=>v;
  const thermo=(cy)=>`<circle cx="${xLp}" cy="${cy}" r="10" fill="#fff" stroke="#2b3442" stroke-width="2"/><line x1="${xLp}" y1="${cy}" x2="${xLp+5}" y2="${cy-6}" stroke="#d62828" stroke-width="2"/>`;
  const valve=(cy)=>`<path d="M${xLp-9},${cy-8} L${xLp+9},${cy+8} L${xLp+9},${cy-8} L${xLp-9},${cy+8}z" fill="#fff" stroke="#2b3442" stroke-width="2"/>`;
  b+=valve(318)+thermo(350)+thermo(384)+pumpS(xLp,420,13)+`<rect x="${xLp-8}" y="448" width="16" height="22" fill="#a4adb8" stroke="#2b3442"/>`;
  comp.push([318,'Valvola di intercettazione'],[350,'Termometro'],[384,'Manometro'],[420,'Pompa di circolazione'],[459,'Filtro di separazione']);
  comp.forEach(([cy,t])=>{b+=`<line x1="${xLp-14}" y1="${cy}" x2="${xLp-50}" y2="${cy}" stroke="#33405a" stroke-width="1.1"/>`+Lbl(xLp-54,cy+5,t,{s:11.5,a:'end',stroke:TH.ink})});
  // vaso, valvola di sicurezza, tanica
  const vx=400;b+=pipeP(`M${vx},505 L${vx},540`,cold,5)+`<rect x="${vx-16}" y="540" width="32" height="48" rx="16" fill="#d62828" stroke="#7a1a1a"/>`;
  const sx=500;b+=pipeP(`M${sx},505 L${sx},470`,cold,5)+`<path d="M${sx-9},460 h18 v-24 l-9,-8 l-9,8z" fill="#f2c14e" stroke="#7a5a12"/><path d="M${sx+9},450 L${sx+30},450 L${sx+30},560" stroke="#7a8696" stroke-width="3" fill="none"/><rect x="${sx+12}" y="560" width="40" height="40" rx="4" fill="#e9f1fb" stroke="#5d6774"/><rect x="${sx+12}" y="578" width="40" height="22" fill="#7cc6ff" opacity=".7"/>`;
  b+=lead(vx-16,565,vx-90,600)+Lbl(vx-90,606,`Vaso di espansione ${D.vaso||''} l`,{s:11.5,stroke:TH.ink});
  b+=lead(sx,436,sx+70,410)+Lbl(sx+70,404,`Valvola di sicurezza ${D.Pvs||5} bar`,{s:11.5,stroke:TH.ink});
  b+=lead(sx+52,590,sx+110,624)+Lbl(sx+110,630,'Tanica miscela antigelo',{s:11.5,stroke:TH.ink});
  b+=lead((c0[0]+c1[0])/2,(c0[1]+c1[1])/2-20,330,40)+Lbl(330,36,`Collettore solare (${D.N} × ${D.P.n})`,{s:12,stroke:TH.ink});
  b+=lead(pTop[0]-6,pTop[1]-20,640,40)+Lbl(660,36,'Sonda pannelli',{s:11.5,stroke:TH.ink});
  b+=lead(tk.x+tk.w,tk.y+40,810,300)+Lbl(840,294,`Serbatoio di accumulo ${D.Vtank||''} l`,{s:11.5,a:'end',stroke:TH.ink});
  b+=`<rect x="250" y="${H-26}" width="360" height="22" rx="11" fill="${TH.ink}"/><text x="430" y="${H-11}" font-size="12.5" font-weight="bold" fill="#fff" text-anchor="middle">Circolazione forzata</text>`;
  return svgWrap(W,H,b,defs);
}

// ---------- PUNTO 10: centrale termica dell'impianto combinato ----------
function figCentraleComb(D,o={}){
  const id=++UID,W=900,H=560,L=!!o.L,hot=HOT(),cold=COLD(),T1=o.T1||55,T2=o.T2||30;
  let defs=tankDefs(id);let b=`<rect width="${W}" height="${H}" fill="#ffffff"/>`+sunRays(60,60,24,L);
  const coll=[[100,170],[230,90],[252,108],[122,188]];b+=collS(coll,id);
  const t1={x:150,y:250,w:110,h:220},t2={x:430,y:250,w:110,h:220},hx={x:320,y:330,w:40,h:90},cal={x:700,y:340,w:130,h:130};
  // collettore -> accumulo 1 (serpentino)
  b+=pipeP(`M241,99 L280,99 L280,${t1.y+t1.h*.55} L${t1.x+t1.w-6},${t1.y+t1.h*.55}`,hot,6,L);
  b+=pipeP(`M${t1.x+6},${t1.y+t1.h*.9} L110,${t1.y+t1.h*.9} L110,179`,cold,6,L);
  // acquedotto -> accumulo 1
  b+=pipeP(`M20,${t1.y+t1.h-10} L${t1.x+6},${t1.y+t1.h-10}`,cold,5,L)+`<text x="20" y="${t1.y+t1.h+12}" font-size="11.5" font-weight="bold" fill="${cold}">acquedotto</text>`;
  // accumulo 1 -> scambiatore (recupero solare)
  b+=pipeP(`M${t1.x+t1.w-4},${t1.y+40} L${hx.x+10},${t1.y+40} L${hx.x+10},${hx.y}`,hot,5,L)+pipeP(`M${hx.x+10},${hx.y+hx.h} L${hx.x+10},${hx.y+hx.h+30} L${t1.x+t1.w-4},${hx.y+hx.h+30}`,cold,5,L);
  // ritorno pannelli radianti -> scambiatore -> caldaia
  b+=pipeP(`M${hx.x+30},${hx.y+hx.h} L${hx.x+30},500 L${cal.x+30},500 L${cal.x+30},${cal.y+cal.h}`,cold,5,L);
  b+=pipeP(`M${cal.x+cal.w-30},${cal.y} L${cal.x+cal.w-30},120 L640,120`,hot,6,L);
  // circuito a pavimento in alto
  let dz='';for(let k=0;k<12;k++){const xx=420+k*18;dz+=`${k?'L':'M'}${xx},96 L${xx},134 L${xx+9},134 L${xx+9},96`}
  b+=`<rect x="410" y="80" width="240" height="66" rx="8" fill="#fff4f0" stroke="#e7b3a6"/>`+`<path d="${dz}" fill="none" stroke="${hot}" stroke-width="2.6"${L?' class="flow slow"':''}/>`;
  b+=pipeP(`M410,134 L${hx.x+30},134 L${hx.x+30},${hx.y}`,cold,5,L);
  // caldaia -> accumulo 2 (ACS)
  b+=pipeP(`M${cal.x},${cal.y+40} L${t2.x+t2.w-6},${cal.y+40}`,hot,5,L)+pipeP(`M${t2.x+t2.w-6},${t2.y+t2.h-30} L${cal.x},${t2.y+t2.h-30}`,cold,5,L);
  b+=pumpS(640,t2.y+t2.h-30,12)+pumpS(hx.x+30,300,11);
  // ACS -> valvola miscelatrice
  b+=pipeP(`M${t2.x+t2.w/2},${t2.y} L${t2.x+t2.w/2},210 L780,210`,hot,5,L)+`<path d="M780,200 l18,10 l-18,10z M816,200 l-18,10 l18,10z" fill="#e3a23a" stroke="#7a5a12"/>`+`<text x="798" y="240" font-size="11.5" font-weight="bold" fill="#1d2433" text-anchor="middle">valvola miscelatrice</text><text x="824" y="214" font-size="12" font-weight="bold" fill="${hot}">ACS →</text>`;
  b+=tankS(t1.x,t1.y,t1.w,t1.h,id,{coil:true,coilTop:.45})+hxS(hx.x,hx.y,hx.w,hx.h)+tankS(t2.x,t2.y,t2.w,t2.h,id,{coil:true,coilTop:.25,turns:6});
  b+=`<g filter="url(#sh${id})"><rect x="${cal.x}" y="${cal.y}" width="${cal.w}" height="${cal.h}" rx="10" fill="#e9edf2" stroke="#6b7380" stroke-width="1.8"/></g><path d="M${cal.x+cal.w/2},${cal.y+40} l22,40 h-44z" fill="#f5c84c" stroke="#7a5a12"/><text x="${cal.x+cal.w/2}" y="${cal.y+76}" font-size="16" font-weight="bold" fill="#7a5a12" text-anchor="middle">!</text>`;
  // sonde T1 e T2
  const tag=(x,y,t,c)=>`<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="${TH.ink}" stroke-width="2"/><text x="${x}" y="${y+4.5}" font-size="12" font-weight="bold" fill="${TH.ink}" text-anchor="middle">${t}</text>`;
  b+=tag(t1.x+t1.w/2,t1.y-20,'T1')+tag(hx.x+30,170,'T2');
  b+=`<text x="${t1.x+t1.w/2}" y="${t1.y-40}" font-size="11.5" font-weight="bold" fill="${hot}" text-anchor="middle">${T1} °C</text><text x="${hx.x+60}" y="174" font-size="11.5" font-weight="bold" fill="${cold}">${T2} °C</text>`;
  // numeri del racconto
  const nb=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="12" fill="#c2410c"/><text x="${x}" y="${y+4.5}" font-size="12.5" font-weight="bold" fill="#fff" text-anchor="middle">${n}</text>`;
  b+=nb(60,t1.y+t1.h-30,1)+nb(t1.x+t1.w/2,t1.y+t1.h*.7,2)+nb(hx.x-14,hx.y-14,3)+nb(cal.x+cal.w/2,cal.y-18,4)+nb(t2.x+t2.w/2,t2.y+t2.h*.7,5);
  const lb=(px,py,tx,ty,t,a='middle')=>lead(px,py,tx,ty)+Lbl(tx,ty+18,t,{s:11.5,a,stroke:TH.ink});
  b+=lb(t1.x+t1.w/2,t1.y+t1.h+12,t1.x+t1.w/2,520,'Accumulo solare (n.1)');
  b+=lb(t2.x+t2.w/2,t2.y+t2.h+12,t2.x+t2.w/2,520,'Accumulo combinato (n.2)');
  b+=lb(hx.x+hx.w/2,hx.y+hx.h/2,hx.x+hx.w/2+10,300-40,'Scambiatore','start').replace('','');
  b+=lb(cal.x+cal.w/2,cal.y+cal.h,cal.x+cal.w/2,520,'Caldaia');
  b+=Lbl(530,70,'Riscaldamento a pannelli radianti',{s:11.5,stroke:TH.ink})+Lbl(176,60+120,'Collettore',{s:11.5,stroke:TH.ink});
  return svgWrap(W,H,b,defs);
}
