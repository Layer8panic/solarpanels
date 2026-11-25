// ===================== FIGURE PERSONALIZZATE (parte 2) =====================
// ---------- tubo isolato in 3D ----------
function figTube3D(D,L=false){
  const id=++UID,W=640,H=350,de=D.pipe.p.de,di=D.pipe.p.di,s=D.insComm,ext=S.insPos==='est';
  const sc=Math.min(2.2,110/(de/2+s+(ext?2:0))),Ro=(de/2+s)*sc,Rp=de/2*sc,Ri=di/2*sc,cy=150,x1=150,x2=520,ry=0.38;
  const insCol={nbr:'#2a2a2a',epdm:'#1f2933',lana:'#e9dcb0',pu:'#f0e2a0'}[S.insMat]||'#2a2a2a';
  let defs=`<linearGradient id="st${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd5dc"/><stop offset=".5" stop-color="#8a939e"/><stop offset="1" stop-color="#5b636d"/></linearGradient><linearGradient id="in${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(insCol,.25)}"/><stop offset=".5" stop-color="${insCol}"/><stop offset="1" stop-color="${shade(insCol,-.3)}"/></linearGradient><linearGradient id="cl${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".5" stop-color="#b9c1ca"/><stop offset="1" stop-color="#8e98a3"/></linearGradient>`+SHF(id);
  const bg=bgPanel(W,H,id);defs+=bg.d;let b=bg.b;
  const cyl=(R,xa,xb,fill)=>`<path d="M${xa},${cy-R} L${xb},${cy-R} A${R*ry},${R} 0 0 1 ${xb},${cy+R} L${xa},${cy+R} A${R*ry},${R} 0 0 1 ${xa},${cy-R}z" fill="${fill}"/>`;
  if(ext)b+=`<g filter="url(#sh${id})">${cyl(Ro+3,x1+40,x2,`url(#cl${id})`)}</g>`;
  b+=`<g filter="url(#sh${id})">${cyl(Ro,x1+20,ext?x1+40+1:x2,`url(#in${id})`)}</g>`;if(ext)b+=cyl(Ro,x1+20,x1+41,`url(#in${id})`);
  b+=cyl(Rp,x1-30,x1+21,`url(#st${id})`);
  b+=`<ellipse cx="${x1-30}" cy="${cy}" rx="${Rp*ry}" ry="${Rp}" fill="#9aa3ad" stroke="#5b636d"/><ellipse cx="${x1-30}" cy="${cy}" rx="${Ri*ry}" ry="${Ri}" fill="${tcol(50)}"/>`;
  b+=`<ellipse cx="${x1+20}" cy="${cy}" rx="${Ro*ry}" ry="${Ro}" fill="${shade(insCol,.1)}" stroke="${shade(insCol,-.3)}"/><ellipse cx="${x1+20}" cy="${cy}" rx="${Rp*ry}" ry="${Rp}" fill="#9aa3ad"/>`;
  if(L)b+=`<line x1="${x1-60}" y1="${cy}" x2="${x1-30}" y2="${cy}" stroke="${tcol(50)}" stroke-width="${Math.max(3,Ri*0.8)}" class="flow"/>`;
  const q=(x,y,t,a='start')=>`<text x="${x}" y="${y}" font-size="12.5" font-weight="bold" fill="#1d2433" text-anchor="${a}">${xesc(t)}</text>`;
  b+=lead(x1-30,cy-Rp,x1-70,40)+Lbl(x1-70,36,`tubo acciaio De ${f1(de)} / Di ${f1(di)} mm`,{s:11,a:'start'});
  b+=lead(x1+70,cy+Ro-6,x1+40,H-62)+Lbl(x1+20,H-56,`isolante ${D.im.n.split(' ')[0].toLowerCase()} ${s} mm · λ ${f3(D.lam)}`,{s:11,a:'start'});
  if(ext)b+=lead(x2-60,cy+Ro+2,x2-60,H-62)+Lbl(x2-10,H-56,'rivestimento in lamierino',{s:11,a:'end'});
  b+=`<line x1="${x2+24}" y1="${cy-Ro}" x2="${x2+24}" y2="${cy+Ro}" stroke="#1d2433"/><line x1="${x2+18}" y1="${cy-Ro}" x2="${x2+30}" y2="${cy-Ro}" stroke="#1d2433"/><line x1="${x2+18}" y1="${cy+Ro}" x2="${x2+30}" y2="${cy+Ro}" stroke="#1d2433"/>`+q(x2+36,cy+4,`Ø ${f0(D.Dext)} mm`);
  b+=Lbl(W/2,H-14,`1 m di tubo isolato = ${f3(D.Sext)} m² di superficie esterna`,{s:12,stroke:TH.accent});
  return svgWrap(W,H,b,defs);
}
// ---------- glicole ----------
function figGlycol(D,hide=false){
  const W=600,H=300,px=60,py=30,pw=W-px-30,ph=H-py-56,X=p=>px+p/55*pw,Y=t=>py+(t-10)/(-50)*ph,g=GLICOLE[D.gtype];
  let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/><rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#fff" stroke="#d6dde8"/>`;
  for(let t=10;t>=-40;t-=10)b+=`<line x1="${px}" x2="${px+pw}" y1="${Y(t)}" y2="${Y(t)}" stroke="#eef1f6"/><text x="${px-8}" y="${Y(t)+4}" font-size="11" text-anchor="end" fill="#5f6878">${t} °C</text>`;
  for(let p=0;p<=50;p+=10)b+=`<text x="${X(p)}" y="${py+ph+16}" font-size="11" text-anchor="middle" fill="#5f6878">${p}%</text>`;
  b+=`<text x="${px+pw/2}" y="${H-14}" font-size="12" font-weight="bold" text-anchor="middle" fill="#33405a">concentrazione di ${g.n} (% in volume)</text>`;
  const pts=[[0,0],...g.pts];b+=`<polyline fill="none" stroke="${TH.cold}" stroke-width="3" points="${pts.map(([p,t])=>`${X(p)},${Y(t)}`).join(' ')}"/>`;
  pts.slice(1).forEach(([p,t])=>b+=`<circle cx="${X(p)}" cy="${Y(t)}" r="3.5" fill="${TH.cold}"/>`);
  b+=`<line x1="${px}" x2="${px+pw}" y1="${Y(D.Tp)}" y2="${Y(D.Tp)}" stroke="#f08a3c" stroke-dasharray="6 5" stroke-width="2"/><text x="${px+pw-6}" y="${Y(D.Tp)-6}" font-size="11.5" font-weight="bold" text-anchor="end" fill="#c2410c">T esterna di progetto ${D.Tp} °C</text>`;
  b+=`<line x1="${px}" x2="${px+pw}" y1="${Y(D.Tprot)}" y2="${Y(D.Tprot)}" stroke="${TH.hot}" stroke-dasharray="3 4" stroke-width="2"/><text x="${px+pw-6}" y="${Y(D.Tprot)+15}" font-size="11.5" font-weight="bold" text-anchor="end" fill="${TH.hot}">protezione richiesta ${D.Tprot} °C</text>`;
  if(!hide)b+=`<circle cx="${X(D.gpct)}" cy="${Y(D.Tg)}" r="9" fill="${D.gOk?'#1f9d63':'#d23c3c'}" stroke="#fff" stroke-width="3"/>`+Lbl(X(D.gpct)+10,Y(D.Tg)+30,`${D.gpct}% → ${D.Tg} °C`,{s:12,a:'start',stroke:D.gOk?'#1f9d63':'#d23c3c'});
  return svgWrap(W,H,b);
}
// ---------- pompa ----------
function figPump3(D){
  const W=600,H=320,px=64,py=26,pw=W-px-24,ph=H-py-60,Gm=D.G/1000,Hm=D.Htot/1000,Qmax=Math.max(0.3,Gm*2.4),Hmax=Math.max(1,Hm*2.4),X=q=>px+q/Qmax*pw,Y=h=>py+ph-h/Hmax*ph,kk=Hm/(Gm*Gm);
  let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/><rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#fff" stroke="#d6dde8"/>`;
  for(let i=0;i<=4;i++){b+=`<line x1="${px}" x2="${px+pw}" y1="${Y(Hmax*i/4)}" y2="${Y(Hmax*i/4)}" stroke="#eef1f6"/><text x="${px-8}" y="${Y(Hmax*i/4)+4}" font-size="11" text-anchor="end" fill="#5f6878">${f2(Hmax*i/4)}</text><text x="${X(Qmax*i/4)}" y="${py+ph+16}" font-size="11" text-anchor="middle" fill="#5f6878">${f2(Qmax*i/4)}</text>`}
  b+=`<text x="${px+pw/2}" y="${H-24}" font-size="12" font-weight="bold" text-anchor="middle" fill="#33405a">portata (m³/h)</text><text x="16" y="${py+ph/2}" font-size="12" font-weight="bold" text-anchor="middle" fill="#33405a" transform="rotate(-90 16 ${py+ph/2})">prevalenza (m c.a.)</text>`;
  const h0=Hm*1.9,q0=Gm*2.1;let d='';for(let i=0;i<=40;i++){const q=q0*i/40;d+=`${i?'L':'M'}${X(q)},${Y(h0*(1-(q/q0)**2))}`}
  b+=`<path d="${d}" fill="none" stroke="${TH.accent}" stroke-width="3"/>`+Lbl(X(q0*0.18),Y(h0)-4,'curva del circolatore',{s:11,stroke:TH.accent});
  d='';for(let i=0;i<=40;i++){const q=Qmax*i/40,h=kk*q*q;if(h>Hmax)break;d+=`${i?'L':'M'}${X(q)},${Y(h)}`}
  b+=`<path d="${d}" fill="none" stroke="${TH.hot}" stroke-width="2.6"/>`;const qe=Qmax*0.86;b+=Lbl(X(Math.min(qe,Math.sqrt(Hmax*0.85/kk))),Y(Math.min(Hmax*0.85,kk*qe*qe))+22,'curva dell’impianto',{s:11,stroke:TH.hot,a:'end'});
  const qo=Math.sqrt(h0/(kk+h0/q0**2));b+=`<circle cx="${X(qo)}" cy="${Y(kk*qo*qo)}" r="6" fill="${TH.accent}" stroke="#fff" stroke-width="2"/>`;
  b+=`<circle cx="${X(Gm)}" cy="${Y(Hm)}" r="7" fill="#f5a524" stroke="#1d2433" stroke-width="1.5"/>`+Lbl(X(Gm)+12,Y(Hm)+30,`progetto: ${f2(Gm)} m³/h · ${f2(Hm)} m c.a.`,{s:11.5,a:'start'});
  return svgWrap(W,H,b);
}
// ---------- scambiatore a piastre ----------
function figHX(D,L=false){
  const id=++UID,W=760,H=320,cx=380,cy=160;const bg=bgPanel(W,H,id);let defs=bg.d+SHF(id),b=bg.b;
  b+=`<g filter="url(#sh${id})"><rect x="${cx-70}" y="${cy-110}" width="140" height="220" rx="8" fill="#c3cad3" stroke="#5d6774" stroke-width="2"/></g>`;
  for(let i=0;i<11;i++){const x=cx-58+i*11.6;b+=`<rect x="${x}" y="${cy-100}" width="6" height="200" rx="2" fill="${i%2?shade(TH.hot,.45):shade(TH.cold,.5)}"/>`}
  b+=`<path d="M${cx-58},${cy-96} L${cx+58},${cy+96} M${cx+58},${cy-96} L${cx-58},${cy+96}" stroke="#5d6774" stroke-width="1.5" opacity=".5"/>`;
  const ports=[[cx-70,cy-80,'in',D.tsi,TH.hot,'Circuito solare entrata'],[cx-70,cy+80,'out',D.tso,shade(TH.hot,.3),'Circuito solare uscita'],[cx+70,cy+80,'in',D.tbi,TH.cold,'Circuito serbatoio entrata'],[cx+70,cy-80,'out',D.tbo,shade(TH.hot,.15),'Circuito serbatoio uscita']];
  ports.forEach(([x,y,io,t,c,lb],i)=>{const left=i<2,xe=left?x-170:x+170;b+=LN(io==='in'?`M${xe},${y} L${x},${y}`:`M${x},${y} L${xe},${y}`,tcol(t),1,L,9);
    b+=Lbl(left?xe+48:xe-48,y-12,`${t} °C`,{s:13,stroke:tcol(t)})+`<text x="${left?xe:xe}" y="${y+26}" font-size="11" fill="#33405a" font-weight="bold" text-anchor="${left?'start':'end'}">${lb}</text>`});
  b+=Lbl(cx,30,`Scambiatore a piastre · ${f2(D.QkW)} kW (${f0(D.Q)} kcal/h)`,{s:13});
  b+=`<text x="${cx}" y="${H-12}" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#33405a">i due fluidi scorrono in controcorrente e non si mescolano · ΔT medio logaritmico ${f1(D.dtml)} K</text>`;
  return svgWrap(W,H,b,defs);
}
// ---------- vaso di espansione ----------
function figVaso3(D,T_=70,L=false){
  const id=++UID,W=600,H=300,fr=clamp((T_-20)/130,0,1),mem=50+fr*80,p=D.Pi+(D.Pf-D.Pi)*fr,ang=Math.PI*(1.25-p/(D.Pvs+1)*1.5);
  let defs=SHF(id)+`<linearGradient id="vs${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b71c1c"/><stop offset=".4" stop-color="#e53935"/><stop offset="1" stop-color="#8e1414"/></linearGradient>`;
  let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/><g filter="url(#sh${id})"><rect x="200" y="30" width="150" height="210" rx="62" fill="url(#vs${id})"/></g>`;
  b+=`<rect x="208" y="${234-mem}" width="134" height="${mem}" rx="30" fill="${tcol(clamp(T_,20,95))}" opacity=".95"/><path d="M208,${234-mem} Q275,${214-mem} 342,${234-mem}" fill="none" stroke="#1d2433" stroke-width="3"/>`;
  b+=`<text x="275" y="70" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">azoto</text><text x="275" y="${226-mem/2}" font-size="12.5" font-weight="bold" fill="#1d2433" text-anchor="middle">fluido</text><rect x="268" y="240" width="14" height="30" fill="#8892a0"/>`;
  b+=`<circle cx="470" cy="100" r="54" fill="#fff" stroke="#33405a" stroke-width="3"/>`;for(let i=0;i<=8;i++){const a=Math.PI*(1.25-i/8*1.5);b+=`<line x1="${470+44*Math.cos(a)}" y1="${100-44*Math.sin(a)}" x2="${470+50*Math.cos(a)}" y2="${100-50*Math.sin(a)}" stroke="#33405a"/>`}
  b+=`<line x1="470" y1="100" x2="${470+40*Math.cos(ang)}" y2="${100-40*Math.sin(ang)}" stroke="#d23c3c" stroke-width="3.5"/><circle cx="470" cy="100" r="5" fill="#33405a"/><text x="470" y="140" font-size="13" font-weight="bold" text-anchor="middle" fill="#1d2433">${f1(p)} bar</text>`;
  b+=Lbl(100,60,`Vn = ${f1(D.Vn)} l → ${D.vaso} l`,{s:13})+Lbl(100,100,`precarica ${f1(D.Pi)} bar`,{s:12,stroke:TH.cold})+Lbl(100,138,`Pf = ${f1(D.Pf)} bar`,{s:12,stroke:TH.hot})+Lbl(100,176,`fluido a ${T_} °C`,{s:12,stroke:tcol(T_)});
  b+=`<text x="${W/2}" y="${H-10}" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#33405a">montato sul ritorno, attacco in basso, senza isolamento</text>`;
  return svgWrap(W,H,b,defs);
}
// ---------- valvola di sicurezza ----------
function figValve(D,L=false){
  const id=++UID,W=560,H=280;let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/>`;let defs=SHF(id);
  b+=LN(`M40,120 L230,120`,TH.cold,1,L,12)+`<g filter="url(#sh${id})"><rect x="230" y="92" width="70" height="56" rx="8" fill="#c9a227" stroke="#7a6111" stroke-width="2"/><rect x="246" y="40" width="38" height="54" rx="6" fill="#d23c3c"/><rect x="252" y="30" width="26" height="14" rx="3" fill="#8e1414"/></g>`;
  b+=`<text x="265" y="72" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">${f1(D.Pvs)}</text><text x="265" y="86" font-size="9" fill="#fff" text-anchor="middle">bar</text>`;
  b+=`<path d="M265,148 L265,190 L400,190 L400,205" stroke="#8892a0" stroke-width="10" fill="none"/>`;
  b+=`<g filter="url(#sh${id})"><rect x="350" y="200" width="104" height="66" rx="8" fill="#7cb342" stroke="#33691e" stroke-width="2"/><rect x="380" y="192" width="40" height="12" rx="3" fill="#33691e"/></g><rect x="356" y="${232}" width="92" height="30" rx="5" fill="${shade('#2f7fd8',.25)}" opacity=".8"/><text x="402" y="226" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">tanica</text>`;
  if(L)b+=[0,1,2].map(i=>`<circle cx="400" cy="${196+i*3}" r="3" fill="${TH.cold}" class="pulse" style="animation-delay:${i*.35}s"/>`).join('');
  b+=Lbl(120,60,`taratura ${f1(D.Pvs)} bar`,{s:13,stroke:'#d23c3c'})+Lbl(150,240,'scarico del glicole in tanica',{s:12})+Lbl(420,40,'vietato lo scarico in fogna',{s:12,stroke:'#d23c3c'});
  return svgWrap(W,H,b,defs);
}
// ---------- serbatoio ----------
function figTank3(D,L=false){
  const id=++UID,W=560,H=420,type=D.tank,cx=280,w=170,h=300,x=cx-w/2,y=50,tc=TH.tankCol;
  let defs=SHF(id)+`<linearGradient id="tg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tc[0]}"/><stop offset=".5" stop-color="${tc[1]}"/><stop offset="1" stop-color="${tc[2]}"/></linearGradient><linearGradient id="ts${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".3" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>`;
  let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/><g filter="url(#sh${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="60" fill="url(#tg${id})"/></g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="60" fill="url(#ts${id})"/>`;
  b+=`<rect x="${x+20}" y="${y+h}" width="10" height="26" fill="#5b636d"/><rect x="${x+w-30}" y="${y+h}" width="10" height="26" fill="#5b636d"/><rect x="${cx-5}" y="${y+h}" width="10" height="26" fill="#5b636d"/>`;
  const coil=(y1,y2,col,on)=>{let d=`M${x-60},${y1} L${x+16},${y1}`;let yy=y1,k=0;while(yy<y2-12){yy+=13;d+=` L${k%2?x+16:x+w-16},${yy}`;k++}d+=` L${x+16},${y2} L${x-60},${y2}`;return LN(d,col,on,L,4.5)};
  if(type==='tit'){b+=`<rect x="${cx-48}" y="${y+30}" width="96" height="150" rx="40" fill="${shade(tc[0],.15)}" stroke="#fff" stroke-width="3"/><text x="${cx}" y="${y+110}" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">ACS</text>`}
  b+=coil(y+h-110,y+h-24,'#ffb199',1);
  if(type==='ds')b+=coil(y+50,y+120,'#ffd29a',1);
  b+=`<text x="${x-66}" y="${y+h-116}" font-size="12" font-weight="bold" fill="${TH.hot}" text-anchor="end">dal solare</text><text x="${x-66}" y="${y+h-12}" font-size="12" font-weight="bold" fill="${TH.cold}" text-anchor="end">al solare</text>`;
  b+=LN(`M${cx},${y} L${cx},${y-28} L${x+w+90},${y-28}`,TH.hot,1,L,5)+`<text x="${x+w+92}" y="${y-34}" font-size="12" font-weight="bold" fill="${TH.hot}" text-anchor="end">acqua calda</text>`;
  b+=LN(`M${x+w+90},${y+h-30} L${x+w},${y+h-30}`,TH.cold,1,L,5)+`<text x="${x+w+92}" y="${y+h-38}" font-size="12" font-weight="bold" fill="${TH.cold}" text-anchor="end">acqua fredda</text>`;
  if(type==='ds')b+=`<text x="${x+w+8}" y="${y+86}" font-size="12" font-weight="bold" fill="#c2410c">caldaia</text>`;
  b+=`<circle cx="${x+w-10}" cy="${y+h-60}" r="7" fill="#fff" stroke="#33405a"/><text x="${x+w+6}" y="${y+h-56}" font-size="11" font-weight="bold" fill="#33405a">sonda S2</text>`;
  b+=Lbl(cx,y+h+60,`${D.tankName} · ${D.Vtank} litri`,{s:13});
  return svgWrap(W,H,b,defs);
}
// ---------- centrale termica solare ----------
function figCentraleSol(D,o={}){
  const id=++UID,W=860,H=520,L=o.L,on=o.on!==false;const bg=bgPanel(W,H,id);let defs=bg.d+SHF(id)+`<linearGradient id="pg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#244a8f"/><stop offset="1" stop-color="#0d2247"/></linearGradient>`,b=bg.b;
  b+=sunRays(70,62,22,L)+`<polygon points="${P2([[150,190],[430,60],[460,60],[180,200]])}" fill="${TH.roof}" opacity=".85"/>`;
  b+=`<g transform="translate(190,170) rotate(-24.5)">${[0,1,2,3].slice(0,Math.min(4,D.N)).map(i=>`<rect x="${i*62}" y="-46" width="58" height="40" rx="2" fill="url(#pg${id})" stroke="${TH.frame}" stroke-width="2"/>`).join('')}</g>`;
  const tk=[600,240];b+=`<g filter="url(#sh${id})"><rect x="${tk[0]}" y="${tk[1]}" width="140" height="230" rx="56" fill="${TH.tankCol[1]}"/></g><rect x="${tk[0]}" y="${tk[1]}" width="140" height="230" rx="56" fill="${tcol(on?60:45)}" opacity=".55"/>`;
  let d=`M600,330`;for(let i=0;i<6;i++)d+=` L${i%2?612:728},${336+i*14}`;b+=LN(d+' L600,420','#ffd0c2',on,L,4);
  b+=LN('M420,112 L470,112 L470,330 L600,330',TH.hot,on,L,6)+LN('M600,420 L330,420 L330,250 L196,174',TH.cold,on,L,6);
  // gruppo idraulico
  b+=`<rect x="290" y="236" width="80" height="210" rx="10" fill="none" stroke="#9aa3ad" stroke-dasharray="6 5"/>`;
  const comp=(x,y,t)=>Lbl(x,y,t,{s:11,f:'sh'+id});
  b+=`<g transform="translate(330,380)"><circle r="16" fill="${TH.accent}" stroke="#fff" stroke-width="2"/><g${L&&on?' class="spin"':''}><path d="M0,-10 L0,10 M-10,0 L10,0" stroke="#fff" stroke-width="3"/></g></g>`;
  b+=`<rect x="320" y="300" width="20" height="34" rx="4" fill="#fff" stroke="#33405a"/><rect x="324" y="${on?308:322}" width="12" height="4" fill="${TH.accent}"/>`;
  b+=`<circle cx="330" cy="268" r="9" fill="#ccc" stroke="#555"/><path d="M325,262 L330,274 L335,262z" fill="#d23c3c"/>`;
  b+=`<line x1="330" y1="355" x2="252" y2="355" stroke="#8892a0" stroke-width="3"/><rect x="236" y="342" width="16" height="22" fill="#d23c3c"/><rect x="226" y="372" width="34" height="40" rx="4" fill="#7cb342"/>`;
  b+=`<circle cx="372" cy="300" r="10" fill="#fff" stroke="#33405a"/><line x1="372" y1="300" x2="378" y2="294" stroke="#d23c3c" stroke-width="2"/>`;
  b+=`<line x1="330" y1="420" x2="330" y2="440" stroke="${TH.cold}" stroke-width="4"/><path d="M330,440 L250,440 L250,452" stroke="${TH.cold}" stroke-width="4" fill="none"/><ellipse cx="250" cy="476" rx="24" ry="28" fill="#d23c3c"/>`;
  b+=`<rect x="466" y="92" width="10" height="14" fill="#c9a227"/><circle cx="471" cy="88" r="4" fill="#999"/>`;
  // centralina
  b+=`<g filter="url(#sh${id})"><rect x="470" y="160" width="92" height="56" rx="7" fill="#33405a"/></g><rect x="478" y="168" width="76" height="22" fill="${on?'#9fe0b0':'#f4d58d'}"/><text x="516" y="184" font-size="12" font-weight="bold" fill="#1d2433" text-anchor="middle">ΔT ${D.dton} K</text><text x="516" y="208" font-size="10" fill="#fff" text-anchor="middle">pompa ${on?'ON':'OFF'}</text>`;
  b+=`<path d="M470,180 Q430,140 420,118" stroke="#9aa" stroke-dasharray="4 4" fill="none"/><path d="M562,200 Q620,300 728,390" stroke="#9aa" stroke-dasharray="4 4" fill="none"/><circle cx="418" cy="114" r="6" fill="#ffd24a" stroke="#333"/><circle cx="728" cy="392" r="6" fill="#ffd24a" stroke="#333"/>`;
  b+=comp(100,250,'Collettori solari')+lead(140,240,210,170)+comp(520,60,'Sfiato con rubinetto')+lead(500,68,474,92)+comp(565,140,'Termoregolatore differenziale')+comp(420,140,'Sonda S1')+comp(790,380,'Sonda S2')+comp(670,505,`Serbatoio ${D.Vtank} l`);
  b+=comp(150,300,'Valvola di ritegno')+lead(195,300,320,268)+comp(150,330,'Regolatore di portata')+lead(205,330,320,316)+comp(440,300,'Manometro')+lead(418,300,382,300)+comp(150,390,'Valvola di sicurezza')+lead(200,390,236,356)+comp(150,420,'Tanica di raccolta')+comp(130,490,'Vaso di espansione')+lead(190,490,226,478)+comp(420,385,'Pompa di circolazione')+lead(380,385,346,380);
  b+=Lbl(W/2,28,'Centrale termica dell’impianto solare: circolazione forzata',{s:14,fill:TH.accent,stroke:TH.accent,c:'#fff'});
  return svgWrap(W,H,b,defs);
}
// ---------- centrale termica impianto combinato ----------
function figCentraleComb(D,o={}){
  const id=++UID,W=900,H=600,L=o.L,T1=o.T1??55,T2=o.T2??30,sol=T1>T2;const bg=bgPanel(W,H,id);
  let defs=bg.d+SHF(id)+`<linearGradient id="pg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#244a8f"/><stop offset="1" stop-color="#0d2247"/></linearGradient>`,b=bg.b;
  const tank=(x,y,w,h,Tt,Tb,lab)=>{const g='tg'+id+x;defs+=`<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tcol(Tt)}"/><stop offset="1" stop-color="${tcol(Tb)}"/></linearGradient>`;return `<g filter="url(#sh${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/2.5}" fill="url(#${g})"/></g>`+Lbl(x+w/2,y+h+32,lab,{s:11.5})};
  b+=sunRays(64,64,20,L)+`<g transform="translate(70,190) rotate(-35)"><rect x="0" y="-44" width="100" height="40" rx="3" fill="url(#pg${id})" stroke="${TH.frame}" stroke-width="2"/></g>`+Lbl(150,110,'Collettori',{s:11});
  b+=tank(160,250,110,200,T1,25,'Accumulo solare (n. 1)');
  let d='M160,350';for(let i=0;i<6;i++)d+=` L${i%2?172:258},${356+i*13}`;b+=LN(d+' L160,440','#ffd0c2',1,L,3.5);
  b+=LN('M152,150 L120,150 L120,350 L160,350',TH.hot,1,L,5)+LN('M160,440 L96,440 L96,186',TH.cold,1,L,5);
  b+=`<circle cx="270" cy="290" r="11" fill="#fff" stroke="#33405a" stroke-width="2"/><text x="270" y="294" font-size="11" font-weight="bold" text-anchor="middle" fill="#1d2433">T1</text>`+Lbl(270,252,`T1 = ${T1} °C`,{s:11,stroke:tcol(T1)});
  // scambiatore a piastre
  b+=`<rect x="320" y="330" width="44" height="90" rx="5" fill="#c3cad3" stroke="#5d6774" stroke-width="2"/>${[0,1,2,3,4,5].map(i=>`<line x1="${326+i*6.5}" y1="336" x2="${326+i*6.5}" y2="414" stroke="#5d6774"/>`).join('')}`+Lbl(342,456,'Scambiatore a piastre',{s:11});
  b+=LN('M270,330 L320,340',TH.hot,sol,L,4)+LN('M320,410 L270,420',TH.cold,sol,L,4);
  // accumulo 2 e caldaia
  b+=tank(450,230,110,220,62,34,'Accumulo combinato (n. 2)');let d2='M450,280';for(let i=0;i<5;i++)d2+=` L${i%2?462:548},${286+i*13}`;b+=LN(d2+' L450,350','#ffd29a',1,L,3.5);
  b+=`<g filter="url(#sh${id})"><rect x="640" y="380" width="100" height="90" rx="8" fill="#f4f5f7" stroke="#8a929d" stroke-width="2"/></g><path d="M690,452 q-14,-14 0,-32 q14,18 0,32z" fill="#f5a524" opacity="${sol?.35:1}"/><text x="690" y="398" font-size="12" font-weight="bold" fill="#33405a" text-anchor="middle">Caldaia</text>`;
  b+=`<g transform="translate(600,430)"><circle r="14" fill="${TH.accent}" stroke="#fff" stroke-width="2"/><g${L?' class="spin"':''}><path d="M0,-9 L0,9 M-9,0 L9,0" stroke="#fff" stroke-width="3"/></g></g>`;
  b+=LN('M640,430 L614,430',TH.hot,1,L,4)+LN('M586,430 L560,430 L560,350',TH.hot,1,L,4)+LN('M450,286 L430,286 L430,500 L700,500 L700,470',TH.cold,1,L,3);
  // circuiti radianti e deviatrice
  let rd='M560,140 L780,140 L780,200';for(let i=0;i<6;i++){rd+=` L${770-i*26},200 L${770-i*26},${i%2?170:200}`}rd+=' L600,200 L600,240';
  b+=`<rect x="580" y="120" width="220" height="100" rx="10" fill="#fff" stroke="#c9d3e1"/>`+LN(rd,'#f08a3c',1,L,3)+Lbl(690,108,'Circuiti di riscaldamento a pavimento',{s:11});
  b+=`<g transform="translate(800,330)"><path d="M-12,-12 L12,12 M12,-12 L-12,12" stroke="#33405a" stroke-width="3"/><circle r="9" fill="#c9a227" stroke="#7a6111"/></g>`+Lbl(860,300,`Valvola deviatrice`,{s:11,a:'end'});
  b+=`<circle cx="760" cy="250" r="11" fill="#fff" stroke="#33405a" stroke-width="2"/><text x="760" y="254" font-size="11" font-weight="bold" text-anchor="middle" fill="#1d2433">T2</text>`+Lbl(886,250,`T2 = ${T2} °C`,{s:11,stroke:tcol(T2),a:'end'});
  b+=LN('M780,200 L780,330 L800,330',TH.cold,1,L,4);
  b+=LN('M800,342 L800,410 L740,410',TH.cold,!sol,L,4)+LN('M788,330 L364,330',TH.cold,sol,L,4)+LN('M364,420 L400,420 L400,520 L760,520 L760,470',TH.warm||'#f08a3c',sol,L,4);
  b+=LN('M690,380 L690,250 L600,250 L600,240','#f08a3c',1,L,4);
  b+=`<rect x="500" y="196" width="22" height="18" fill="#c9a227"/>`+LN('M505,230 L505,214',TH.hot,1,L,3)+LN('M522,205 L560,205 L560,175',TH.hot,1,L,3)+Lbl(470,180,'Valvola miscelatrice ACS',{s:10.5,a:'end'});
  b+=`<rect x="20" y="${H-58}" width="${W-40}" height="42" rx="10" fill="${sol?'#eaf7f0':'#fff4e5'}" stroke="${sol?'#1f9d63':'#d98a0b'}"/><text x="${W/2}" y="${H-32}" font-size="13" font-weight="bold" fill="${sol?'#1f7a4d':'#9a5b00'}" text-anchor="middle">${sol?`T1 (${T1} °C) > T2 (${T2} °C): la deviatrice manda il ritorno del pavimento allo scambiatore e recupera il calore solare`:`T1 (${T1} °C) ≤ T2 (${T2} °C): il solare non serve al riscaldamento, il ritorno va direttamente in caldaia`}</text>`;
  b+=Lbl(W/2,30,'Centrale termica dell’impianto combinato e sua regolazione',{s:14,fill:TH.accent,stroke:TH.accent,c:'#fff'});
  return svgWrap(W,H,b,defs);
}
// ---------- surriscaldamento ----------
function figSurr(D,o={}){
  const id=++UID,W=880,H=500,L=o.L,stag=o.stag!==false;let defs=SHF(id)+`<linearGradient id="hs${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf9e"/><stop offset="1" stop-color="#fff3e3"/></linearGradient><linearGradient id="pg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#244a8f"/><stop offset="1" stop-color="#0d2247"/></linearGradient>`;
  let b=`<rect width="${W}" height="${H}" fill="url(#hs${id})"/>`+sunRays(90,80,34,L)+`<rect y="430" width="${W}" height="70" fill="${TH.grass}"/>`;
  b+=`<polygon points="${P2([[180,300],[520,300],[560,240],[220,240]])}" fill="${TH.roof}"/><rect x="200" y="300" width="300" height="130" fill="${TH.wall}" stroke="#9b8c70"/>`;
  b+=`<g transform="translate(260,288) rotate(-12)">${[0,1,2,3].map(i=>`<rect x="${i*58}" y="-38" width="54" height="34" rx="2" fill="${stag?'#7a2d2d':`url(#pg${id})`}" stroke="${TH.frame}" stroke-width="2"/>`).join('')}</g>`;
  if(stag)b+=[0,1,2,3].map(i=>`<path d="M${290+i*58},${232-i*12} q-10,-14 0,-28 q10,-14 0,-28" fill="none" stroke="#fff" stroke-width="4"${L?' class="pulse"':''} style="animation-delay:${i*.3}s"/>`).join('');
  b+=`<rect x="380" y="330" width="60" height="90" rx="24" fill="#e53935"/><text x="410" y="380" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">${stag?95:60}°</text>`;
  b+=`<rect x="250" y="340" width="20" height="80" rx="10" fill="#fff" stroke="#33405a"/><rect x="254" y="${stag?346:380}" width="12" height="${stag?70:36}" rx="6" fill="#e53935"/>`;
  const card=(x,y,w,title,items,col)=>{let s=`<g filter="url(#sh${id})"><rect x="${x}" y="${y}" width="${w}" height="${36+items.length*24}" rx="12" fill="#fff"/></g><rect x="${x}" y="${y}" width="${w}" height="30" rx="12" fill="${col}"/><rect x="${x}" y="${y+18}" width="${w}" height="12" fill="${col}"/><text x="${x+14}" y="${y+21}" font-size="13" font-weight="bold" fill="#fff">${title}</text>`;
    items.forEach((t,i)=>s+=`<circle cx="${x+18}" cy="${y+48+i*24}" r="4" fill="${col}"/><text x="${x+30}" y="${y+52+i*24}" font-size="12" fill="#1d2433">${xesc(t)}</text>`);return s};
  b+=card(590,40,270,'Cause',['Sole forte e prolungato','Poco prelievo di acqua calda','Accumulo già tutto caldo','Pompa ferma o guasta'],'#d23c3c');
  b+=card(590,210,270,'Protezioni',[`Valvola di sicurezza ${f1(D.Pvs)} bar`,`Vaso di espansione ${D.vaso} l`,`Centralina: T max ${D.tmax} °C`,'Dissipatore o raffreddamento notturno','Fluido che regge la stagnazione'],'#1f9d63');
  b+=Lbl(300,40,stag?`Stagnazione: collettori fino a ${D.P.tstag} °C`:'Funzionamento normale',{s:13,stroke:stag?'#d23c3c':'#1f9d63'});
  return svgWrap(W,H,b,defs);
}
