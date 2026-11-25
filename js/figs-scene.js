// ===================== FIGURE PERSONALIZZATE (parte 1) =====================
function svgWrap(w,h,body,defs=''){return {w,h,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial, Helvetica, sans-serif"><defs>${defs}</defs>${body}</svg>`}}
const P2=(a)=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
function Lbl(x,y,t,o={}){
  const fs=o.s||12,w=String(t).length*fs*0.56+18,h=fs+11,a=o.a||'middle',x0=a==='middle'?x-w/2:a==='end'?x-w:x,st=o.st||TH.label;
  const fill=o.fill||'#ffffff',stroke=o.stroke||TH.accent,col=o.c||'#1d2433',r=st==='pill'?h/2:st==='box'?3:6;
  let s=`<rect x="${x0}" y="${y-h+5}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.4"${o.f?` filter="url(#${o.f})"`:''}/>`;
  if(st==='tag')s+=`<rect x="${x0}" y="${y-h+5}" width="5" height="${h}" rx="2" fill="${stroke}"/>`;
  return s+`<text x="${x0+w/2+(st==='tag'?2:0)}" y="${y}" font-size="${fs}" font-weight="bold" fill="${col}" text-anchor="middle">${xesc(t)}</text>`;
}
function lead(x1,y1,x2,y2){return `<path d="M${x1},${y1} L${x2},${y2}" stroke="#33405a" stroke-width="1.2" fill="none"/><circle cx="${x2}" cy="${y2}" r="3" fill="#33405a"/>`}
function bgPanel(w,h,id){
  const g=TH.grid;let d='',b=`<rect width="${w}" height="${h}" fill="#fbfcfe"/>`;
  if(g==='grid'){d=`<pattern id="g${id}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#e7edf5" stroke-width="1"/></pattern>`;b+=`<rect width="${w}" height="${h}" fill="url(#g${id})"/>`}
  if(g==='dots'){d=`<pattern id="g${id}" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#dbe3ee"/></pattern>`;b+=`<rect width="${w}" height="${h}" fill="url(#g${id})"/>`}
  return {d,b};
}
const SHF=id=>`<filter id="sh${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0b1a33" flood-opacity=".22"/></filter>`;
function sunRays(x,y,r,L){let s='';for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=`<line x1="${x+Math.cos(a)*(r+6)}" y1="${y+Math.sin(a)*(r+6)}" x2="${x+Math.cos(a)*(r+16)}" y2="${y+Math.sin(a)*(r+16)}"/>`}
  return `<g stroke="#f7b733" stroke-width="3" stroke-linecap="round"${L?' class="pulse"':''}>${s}</g><circle cx="${x}" cy="${y}" r="${r+5}" fill="#ffe08a" opacity=".5"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd24a" stroke="#f5a524" stroke-width="2"/>`}
function cloud(x,y,s){return `<g opacity=".92" transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#fff"/><ellipse cx="-16" cy="-8" rx="18" ry="14" fill="#fff"/><ellipse cx="12" cy="-12" rx="20" ry="16" fill="#fff"/></g>`}
function tree(x,y,s,k){const c=['#4f8a3a','#5c9a45','#3f7a34'][k%3];return k%2?`<g transform="translate(${x},${y}) scale(${s})"><rect x="-4" y="-30" width="8" height="30" fill="#7a5233"/><circle cx="0" cy="-48" r="24" fill="${c}"/><circle cx="-14" cy="-36" r="16" fill="${c}"/><circle cx="14" cy="-38" r="17" fill="${c}"/></g>`:`<g transform="translate(${x},${y}) scale(${s})"><rect x="-4" y="-22" width="8" height="22" fill="#7a5233"/><polygon points="0,-90 -26,-18 26,-18" fill="${c}"/><polygon points="0,-110 -20,-55 20,-55" fill="${shade(c,.12)}"/></g>`}
function panelPoly(pts,id,frame){const [a,b,c,d]=pts;let s=`<polygon points="${P2(pts)}" fill="url(#pg${id})" stroke="${frame}" stroke-width="2.2"/>`;
  for(let k=1;k<6;k++){const t=k/6;s+=`<line x1="${a[0]+(b[0]-a[0])*t}" y1="${a[1]+(b[1]-a[1])*t}" x2="${d[0]+(c[0]-d[0])*t}" y2="${d[1]+(c[1]-d[1])*t}" stroke="#5f7fb5" stroke-width=".7" opacity=".8"/>`}
  return s+`<polygon points="${P2([a,[a[0]+(b[0]-a[0])*.35,a[1]+(b[1]-a[1])*.35],[d[0]+(c[0]-d[0])*.15,d[1]+(c[1]-d[1])*.15],d])}" fill="#fff" opacity=".10"/>`}

// ---------- scena 3D della casa (copertina, tetto, quote) ----------
function sceneHouse(D,o={}){
  const id=++UID,W=900,H=560,L=o.L,cut=o.cut!==false,dims=!!o.dims,piani=clamp(Math.round(+S.piani||2),1,6);
  const yB=478,wallH=cut&&piani>1?Math.min(300,195+(piani-1)*55):piani===1?140:piani===2?205:Math.min(300,245+(piani-3)*22),yT=yB-wallH,fh=wallH/piani,
   g0=cut&&piani>1?195:fh,up=piani>1?(wallH-g0)/(piani-1):0,slabY=p=>yB-g0-(p-1)*up,x0=200,x1=680,dx=120,dy=-74;
  const tilt=D.tilt||30,h=clamp(Math.tan(rad(tilt))*70,20,120),ov=18,flat=S.roof==='piano';
  const E1=[x0-ov,yT+6],E2=[x1+ov,yT+6],R1=[x0-ov+dx/2,yT+dy/2-h],R2=[x1+ov+dx/2,yT+dy/2-h];
  let defs=SHF(id)+`<linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${TH.sky[0]}"/><stop offset="1" stop-color="${TH.sky[1]}"/></linearGradient>
   <linearGradient id="pg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#244a8f"/><stop offset=".55" stop-color="#14305e"/><stop offset="1" stop-color="#0d2247"/></linearGradient>
   <linearGradient id="rf${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${TH.roof}"/><stop offset="1" stop-color="${TH.roof2}"/></linearGradient>
   <pattern id="tl${id}" width="16" height="9" patternUnits="userSpaceOnUse"><path d="M0 9 Q8 2 16 9" fill="none" stroke="${shade(TH.roof,-.3)}" stroke-width="1" opacity=".55"/></pattern>`;
  const tc=TH.tankCol;
  defs+=`<linearGradient id="tk${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tc[0]}"/><stop offset=".55" stop-color="${tc[1]}"/><stop offset="1" stop-color="${tc[2]}"/></linearGradient><linearGradient id="tks${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".35" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>`;
  let b=`<rect width="${W}" height="${H}" fill="url(#sky${id})"/>`;
  const sx=W*(0.7+TH.sunX),sy=70;b+=sunRays(sx,sy,26,L);
  const R=rngFrom(hashStr(seedStr()+'cl'));for(let i=0;i<TH.clouds;i++)b+=cloud(360+R()*300,40+R()*70,0.7+R()*0.6);
  b+=`<rect y="${yB-6}" width="${W}" height="${H-yB+6}" fill="${TH.grass}"/><path d="M0 ${yB-6} Q ${W/2} ${yB-22} ${W} ${yB-6}" fill="${shade(TH.grass,.1)}"/>`;
  const RT=rngFrom(hashStr(seedStr()+'tr'));for(let i=0;i<TH.trees;i++){const left=i%2===0;b+=tree(left?40+RT()*110:830+RT()*50,yB+4,0.8+RT()*0.5,i+Math.floor(RT()*3))}
  if(TH.garage)b+=`<polygon points="${P2([[x0-120,yB],[x0,yB],[x0,yB-90],[x0-120,yB-90]])}" fill="${TH.wall2}" stroke="#9b8c70"/><polygon points="${P2([[x0-130,yB-90],[x0+6,yB-90],[x0+6,yB-100],[x0-130,yB-100]])}" fill="${TH.roof2}"/><rect x="${x0-105}" y="${yB-66}" width="88" height="66" fill="#d9dde3" stroke="#8a929d"/>${[1,2,3,4].map(k=>`<line x1="${x0-105}" x2="${x0-17}" y1="${yB-66+k*13}" y2="${yB-66+k*13}" stroke="#aab1bb"/>`).join('')}`;
  // pareti
  b+=`<polygon points="${P2([[x1,yT],[x1+dx,yT+dy],[x1+dx,yB+dy],[x1,yB]])}" fill="${TH.wall2}" stroke="#8d7f66" stroke-width="1.5"/>`;
  if(!flat)b+=`<polygon points="${P2([[x1,yT],[x1+dx,yT+dy],[x1+dx/2,yT+dy/2-h]])}" fill="${shade(TH.wall2,-.05)}" stroke="#8d7f66" stroke-width="1.5"/>`;
  const ix=x0+12,iy=yT+12;
  if(!cut){b+=`<polygon points="${P2([[x0,yT],[x1,yT],[x1,yB],[x0,yB]])}" fill="${TH.wall}"/>`;for(let p=1;p<piani;p++){const y=slabY(p);b+=`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${shade(TH.wall,-.18)}" stroke-width="3"/><line x1="${x1}" y1="${y}" x2="${x1+dx}" y2="${y+dy}" stroke="${shade(TH.wall2,-.15)}" stroke-width="2"/>`}}
  if(cut){
    b+=`<polygon points="${P2([[x0,yT],[x0+dx,yT+dy],[x1+dx,yT+dy],[x1+dx,yB+dy],[x0+dx,yB+dy],[x0,yB]])}" fill="${shade(TH.wall,.35)}"/>`;
    b+=`<polygon points="${P2([[x0,yT],[x0+dx,yT+dy],[x0+dx,yB+dy],[x0,yB]])}" fill="${shade(TH.wall,-.06)}"/>`;
    b+=`<polygon points="${P2([[x0,yB],[x0+dx,yB+dy],[x1+dx,yB+dy],[x1,yB]])}" fill="#d9c9a8"/>`;
    for(let p=1;p<piani;p++){const y=slabY(p);b+=`<polygon points="${P2([[x0,y],[x0+dx,y+dy],[x1+dx,y+dy],[x1,y],[x1,y+7],[x0,y+7]])}" fill="${shade(TH.wall,-.22)}" opacity=".55"/><line x1="${x0}" y1="${y+3}" x2="${x1}" y2="${y+3}" stroke="#7d6f56" stroke-width="7"/>`}
    // pavimento radiante
    const fp=(u,v)=>[x0+u*(x1-x0)+v*dx,yB+v*dy];let d='';
    for(let k=0;k<9;k++){const u1=0.55+k*0.05;d+=`${k?'L':'M'}${fp(u1,0.12)} L${fp(u1,0.88)} L${fp(u1+0.025,0.88)} L${fp(u1+0.025,0.12)}`}
    b+=`<path d="${d}" fill="none" stroke="${TH.hot}" stroke-width="2.6" opacity=".9"${L?' class="flow slow"':''}/>`;
  }
  // tetto
  if(flat){b+=`<polygon points="${P2([[x0-10,yT],[x1+10,yT],[x1+dx+10,yT+dy],[x0+dx-10,yT+dy]])}" fill="#c9c3b6" stroke="#8a8170" stroke-width="2"/>`}
  else{b+=`<polygon points="${P2([E1,E2,R2,R1])}" fill="url(#rf${id})" stroke="${shade(TH.roof,-.35)}" stroke-width="2"/><polygon points="${P2([E1,E2,R2,R1])}" fill="url(#tl${id})"/>`;
    b+=`<line x1="${R1[0]}" y1="${R1[1]}" x2="${R2[0]}" y2="${R2[1]}" stroke="${shade(TH.roof,-.4)}" stroke-width="5" stroke-linecap="round"/>`}
  // camino
  if(S.camino!==false&&!flat){const cu=TH.chimney==='left'?0.12:0.86,cv=0.62,P=(u,v)=>[E1[0]+u*(E2[0]-E1[0])+v*(R1[0]-E1[0]),E1[1]+v*(R1[1]-E1[1])],p=P(cu,cv);
    b+=`<rect x="${p[0]-12}" y="${p[1]-46}" width="24" height="50" fill="${shade(TH.wall2,-.15)}" stroke="#6d5f48"/><rect x="${p[0]-15}" y="${p[1]-52}" width="30" height="8" fill="#6d5f48"/>`}
  // pannelli sulla falda
  const N=D.N||4,Ly=D.layout,rows=Ly?Ly.rows:1,per=Ly?Ly.per:N,frame=TH.frame;
  const pwR=(S.orient==='O'?D.P.lung:D.P.larg)/1000,phR=(S.orient==='O'?D.P.larg:D.P.lung)/1000;
  const rw=D.roofW||10,rl=D.roofL||5,wu=clamp(pwR/rw,0.03,0.25),hv=clamp(phR/rl,0.12,0.6),gapu=0.008,gapv=0.04;
  const totU=per*wu+(per-1)*gapu,u0=TH.chimney==='left'?0.86-totU:0.14,v0=0.12;let k=0;const panelsPts=[];
  for(let r=0;r<rows;r++){for(let c=0;c<per&&k<N;c++,k++){
    let pts;if(flat){const bx=x0+40+c*((x1-x0-80)/Math.max(per,1)),by=yT-6+r*(-24),w=(x1-x0-100)/Math.max(per,1)*0.8;pts=[[bx,by],[bx+w,by],[bx+w+18,by-34],[bx+18,by-34]];}
    else{const u=u0+c*(wu+gapu),v=v0+r*(hv+gapv),P=(uu,vv)=>[E1[0]+uu*(E2[0]-E1[0])+vv*(R1[0]-E1[0]),E1[1]+vv*(R1[1]-E1[1])];pts=[P(u,v),P(u+wu,v),P(u+wu,v+hv),P(u,v+hv)];}
    panelsPts.push(pts);b+=panelPoly(pts,id,frame);}}
  if(L&&!flat)b+=`<g class="pulse" opacity=".35">${panelsPts.map(p=>`<polygon points="${P2(p)}" fill="#bfe1ff"/>`).join('')}</g>`;
  // finestre e porta (se non sezione)
  if(!cut){for(let p=0;p<piani;p++)for(let i=0;i<TH.windows+1;i++){const wx=x0+40+i*((x1-x0-80)/(TH.windows+0.6)),wh=Math.min(40,fh*.55),wy=yB-p*fh-fh/2-wh/2-(p?0:8);if(!p&&TH.door&&Math.abs(wx+17-(x0+x1)/2)<46)continue;b+=`<rect x="${wx}" y="${wy}" width="34" height="${wh}" fill="#cfe5f7" stroke="#55606f" stroke-width="2"/><line x1="${wx+17}" y1="${wy}" x2="${wx+17}" y2="${wy+wh}" stroke="#55606f"/>`}
    if(TH.door)b+=`<rect x="${(x0+x1)/2-20}" y="${yB-64}" width="40" height="64" fill="#8b5e3c" stroke="#5c3b22"/>`;
    b+=`<rect x="${x0}" y="${yT}" width="${x1-x0}" height="${yB-yT}" fill="none" stroke="#8d7f66" stroke-width="2"/>`}
  else{b+=`<path d="M${x0},${yB} L${x0},${yT} L${x1},${yT} L${x1},${yB}" fill="none" stroke="#7d6f56" stroke-width="7"/>`}
  // impianto in sezione
  let lab='';
  if(cut){
    const fl=yB-8,t1x=x0+70,t2x=x0+250,hx=x0+165,cx=x0+400;
    const tank=(x,w,hh,txt)=>`<g filter="url(#sh${id})"><rect x="${x-w/2}" y="${fl-hh}" width="${w}" height="${hh}" rx="${w/2.4}" fill="url(#tk${id})"/><rect x="${x-w/2}" y="${fl-hh}" width="${w}" height="${hh}" rx="${w/2.4}" fill="url(#tks${id})"/></g>`;
    const top=panelsPts.length?panelsPts[panelsPts.length-1]:[[x0+200,yT-40]];const pOut=top[2]||top[0],pIn=panelsPts[0]?panelsPts[0][0]:[x0+150,yT];
    b+=LN(`M${pOut[0]},${pOut[1]} L${pOut[0]+20},${pOut[1]} L${t1x+30},${yT+30} L${t1x+30},${fl-110}`,TH.hot,1,L,4);
    b+=LN(`M${t1x-30},${fl-60} L${t1x-40},${fl-60} L${t1x-40},${yT+40} L${pIn[0]},${pIn[1]}`,TH.cold,1,L,4);
    b+=tank(t1x,64,150)+tank(t2x,60,140);
    b+=`<rect x="${hx-14}" y="${fl-82}" width="28" height="56" rx="3" fill="#aab3c0" stroke="#5d6774"/>${[0,1,2,3,4].map(i=>`<line x1="${hx-10+i*5}" y1="${fl-78}" x2="${hx-10+i*5}" y2="${fl-30}" stroke="#5d6774"/>`).join('')}`;
    b+=LN(`M${t1x+32},${fl-90} L${hx-14},${fl-70}`,TH.hot,1,L,3)+LN(`M${hx+14},${fl-40} L${t2x-30},${fl-40}`,TH.hot,1,L,3);
    b+=`<g filter="url(#sh${id})"><rect x="${cx}" y="${fl-150}" width="60" height="82" rx="6" fill="#f6f7f9" stroke="#8a929d"/><rect x="${cx+10}" y="${fl-138}" width="40" height="12" rx="2" fill="#1d2433"/><circle cx="${cx+30}" cy="${fl-100}" r="9" fill="none" stroke="#f5a524" stroke-width="3"/></g>`;
    b+=LN(`M${t2x+30},${fl-120} L${cx},${fl-120}`,TH.hot,1,L,3)+LN(`M${cx+60},${fl-90} L${cx+120},${fl-90} L${cx+120},${fl-12}`,TH.hot,1,L,3);
    b+=`<rect x="${x0+300}" y="${fl-178}" width="34" height="26" rx="3" fill="#33405a"/><rect x="${x0+304}" y="${fl-174}" width="26" height="9" fill="#9fe0b0"/>`;
    b+=`<path d="M${x0+20},${fl-40} l0,-24 l16,0" stroke="#7a8696" stroke-width="4" fill="none"/><path d="M${x0+36} ${fl-64} q4,8 0,14" stroke="${TH.cold}" stroke-width="2" fill="none"/>`;
    const B1=yB+32,B2=yB+62;
    lab+=lead(t1x-20,fl-140,x0-70,fl-170)+Lbl(x0-70,fl-176,`Accumulo solare ${D.Vtank||''} l`,{f:'sh'+id,s:11.5});
    lab+=lead(x0+317,fl-165,x1+60,fl-215)+Lbl(890,fl-221,'Centralina differenziale',{f:'sh'+id,s:11,a:'end'});
    lab+=lead(cx+60,fl-120,x1+60,fl-140)+Lbl(890,fl-146,'Caldaia di integrazione',{f:'sh'+id,s:11,a:'end'});
    lab+=lead(t2x,fl,t2x,B1-14)+Lbl(t2x,B1,'Accumulo combinato',{f:'sh'+id,s:11});
    lab+=lead(hx,fl-26,hx-40,B2-14)+Lbl(hx-60,B2,'Scambiatore di calore',{f:'sh'+id,s:11});
    lab+=Lbl(x0-60,B1,'Utenze ACS',{f:'sh'+id,s:11})+lead(x1-80,fl-20,x1-40,B2-14)+Lbl(x1-40,B2,'Riscaldamento a pavimento',{f:'sh'+id,s:11});
  }
  if(panelsPts.length){const p=panelsPts[Math.floor(panelsPts.length/2)][3];lab+=lead(p[0],p[1],p[0]-40,p[1]-56)+Lbl(p[0]-40,p[1]-62,`${N} pannelli ${D.P.n.replace('Pannello dalla scheda tecnica','solari termici')}`,{f:'sh'+id})}
  // quote
  if(dims&&!flat){
    const off=20,a=[E1[0],E1[1]+off],c2=[E2[0],E2[1]+off];
    b+=`<line x1="${a[0]}" y1="${a[1]}" x2="${c2[0]}" y2="${c2[1]}" stroke="#1d2433" stroke-width="1.4" marker-start="url(#ar${id})" marker-end="url(#ar${id})"/>`;
    defs+=`<marker id="ar${id}" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8z" fill="#1d2433"/></marker>`;
    lab+=Lbl((a[0]+c2[0])/2,a[1]+24,`larghezza falda ${f2(D.roofW)} m`,{s:12});
    lab+=`<line x1="${E1[0]-14}" y1="${E1[1]}" x2="${R1[0]-14}" y2="${R1[1]}" stroke="#1d2433" stroke-width="1.4" marker-start="url(#ar${id})" marker-end="url(#ar${id})"/>`+Lbl(E1[0]-40,(E1[1]+R1[1])/2,`falda ${f2(D.roofL)} m`,{s:11,a:'end'});
    {const ax=x1+dx/2,ay=yT+dy/2-h,a1=Math.atan2(dy,dx),a2=Math.atan2(ay-yT,ax-x1),r=40;lab+=`<path d="M${x1+r*Math.cos(a1)},${yT+r*Math.sin(a1)} A${r} ${r} 0 0 0 ${x1+r*Math.cos(a2)},${yT+r*Math.sin(a2)}" fill="none" stroke="#1d2433" stroke-width="2"/>`+lead(x1+30,yT-22,x1+70,yT-70)+Lbl(x1+90,yT-76,`inclinazione ${tilt}°`,{s:12,stroke:TH.hot})}
    const cx=80,cy=90,az=rad(D.az||0);lab+=`<g transform="translate(${cx},${cy})"><circle r="34" fill="#fff" stroke="#c9c1ad" stroke-width="2"/><text y="-20" text-anchor="middle" font-size="11" font-weight="bold" fill="#33405a">N</text><text y="30" text-anchor="middle" font-size="11" font-weight="bold" fill="#33405a">S</text><line x1="0" y1="0" x2="${-Math.sin(az)*26}" y2="${Math.cos(az)*26}" stroke="${TH.hot}" stroke-width="4" stroke-linecap="round"/><circle r="4" fill="${TH.hot}"/></g>`+Lbl(cx,cy+60,`falda verso ${S.dir||'Sud'}`,{s:11});
  }
  if(o.title){const t1=o.title,t2=o.sub||'';const w=Math.max(t1.length*9.2,t2.length*7)+40;
    lab+=`<g filter="url(#sh${id})"><rect x="22" y="18" width="${w}" height="${t2?62:40}" rx="10" fill="${TH.accent}"/></g><text x="${22+w/2}" y="44" font-size="17" font-weight="bold" fill="#fff" text-anchor="middle">${xesc(t1)}</text>${t2?`<text x="${22+w/2}" y="66" font-size="12.5" fill="#e8f0ff" text-anchor="middle">${xesc(t2)}</text>`:''}`}
  return svgWrap(W,H,b+lab,defs);
}

// ---------- altezza del sole ----------
function figSun3(D,L=false){
  const id=++UID,W=640,H=370,gy=330,lat=D.lat;let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/><rect y="${gy}" width="${W}" height="${H-gy}" fill="${TH.grass}"/>`;
  const px=420,py=gy-120,tilt=D.tilt||30,len=120;
  b+=`<rect x="${px-40}" y="${gy-110}" width="200" height="110" fill="${TH.wall}" stroke="#9b8c70"/>`;
  if(S.roof!=='piano')b+=`<polygon points="${P2([[px-60,gy-110],[px+60,gy-110-Math.tan(rad(tilt))*120],[px+180,gy-110]])}" fill="${TH.roof}" stroke="${shade(TH.roof,-.3)}"/>`;
  const a=rad(tilt),ax=px-40,ay=gy-120;b+=`<line x1="${ax}" y1="${ay}" x2="${ax+len*Math.cos(a)}" y2="${ay-len*Math.sin(a)}" stroke="#14305e" stroke-width="9" stroke-linecap="round"/>`;
  const P=[ax+len*Math.cos(a)/2,ay-len*Math.sin(a)/2];
  const legend=[];[[D.noonW,'21 dicembre',TH.cold,330],[90-lat,'equinozi','#f08a3c',270],[D.noonS,'21 giugno',TH.hot,200]].forEach(([al,lb,c,R])=>{
    const Rm=Math.min(R,(P[0]-40)/Math.cos(rad(al)),(P[1]-40)/Math.sin(rad(al)));const X=P[0]-Rm*Math.cos(rad(al)),Y=P[1]-Rm*Math.sin(rad(al));
    b+=`<line x1="${X}" y1="${Y}" x2="${P[0]}" y2="${P[1]}" stroke="${c}" stroke-width="2.4" stroke-dasharray="7 6"${L?' class="flow slow"':''}/><circle cx="${X}" cy="${Y}" r="13" fill="#ffd24a" stroke="#f5a524" stroke-width="2"/>`+`<circle cx="30" cy="${0}" r="0"/>`;legend.push([lb,al,c])});
  legend.forEach(([lb,al,c],i)=>{b+=`<circle cx="28" cy="${gy-84+i*26}" r="7" fill="#ffd24a" stroke="${c}" stroke-width="3"/><text x="42" y="${gy-79+i*26}" font-size="12.5" font-weight="bold" fill="${c}">${lb}: sole alto ${f1(al)}°</text>`});
  b+=`<path d="M ${ax+34} ${ay} A 34 34 0 0 0 ${ax+34*Math.cos(a)} ${ay-34*Math.sin(a)}" fill="none" stroke="#1d2433"/>`+`<text x="${ax+40}" y="${ay-6}" font-size="12" font-weight="bold" fill="#1d2433">${tilt}°</text>`;
  b+=`<text x="14" y="${gy+26}" font-size="12" font-weight="bold" fill="#fff">SUD</text><text x="${W-14}" y="${gy+26}" text-anchor="end" font-size="12" font-weight="bold" fill="#fff">NORD</text>`+Lbl(W-110,30,`${D.loc} · lat. ${f1(lat)}° N`,{s:11});
  return svgWrap(W,H,b);
}
// ---------- pianta della falda ----------
function figPlan3(D){
  const id=++UID,Ly=D.layout,W=D.roofW,Lr=D.roofL,sc=Math.min(600/W,300/Lr),ox=40,oy=46,w=W*sc,h=Lr*sc,flat=S.roof==='piano';
  let defs=`<linearGradient id="pg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#244a8f"/><stop offset="1" stop-color="#0d2247"/></linearGradient><pattern id="tp${id}" width="18" height="11" patternUnits="userSpaceOnUse"><rect width="18" height="11" fill="${TH.roof}"/><path d="M0 11 Q9 3 18 11" fill="none" stroke="${shade(TH.roof,-.3)}" stroke-width="1.2"/></pattern>`;
  let b=`<rect width="${w+110}" height="${h+110}" fill="#f6f9fd"/><rect x="${ox}" y="${oy}" width="${w}" height="${h}" fill="${flat?'#d9d4c7':`url(#tp${id})`}" stroke="${shade(TH.roof,-.4)}" stroke-width="2.5"/>`;
  b+=`<rect x="${ox+S.margin*sc}" y="${oy+S.margin*sc}" width="${(W-2*S.margin)*sc}" height="${(Lr-2*S.margin)*sc}" fill="none" stroke="#fff" stroke-dasharray="7 5" stroke-width="1.6"/>`;
  b+=`<text x="${ox}" y="${oy-12}" font-size="12" font-weight="bold" fill="#33405a">${flat?'LATO NORD':'COLMO'}</text><text x="${ox}" y="${oy+h+20}" font-size="12" font-weight="bold" fill="#33405a">${flat?'LATO SUD':'GRONDA'} · larghezza ${f2(W)} m</text><text x="${ox+w+18}" y="${oy+h/2}" font-size="12" font-weight="bold" fill="#33405a" text-anchor="middle" transform="rotate(90 ${ox+w+18} ${oy+h/2})">${flat?'profondità':'lunghezza falda'} ${f2(Lr)} m</text>`;
  D.obs.forEach(o=>{b+=`<rect x="${ox+o.x*sc}" y="${oy+o.y*sc}" width="${o.w*sc}" height="${o.h*sc}" fill="#7a6f66" stroke="#333"/><rect x="${ox+(o.x-.3)*sc}" y="${oy+(o.y-.3)*sc}" width="${(o.w+.6)*sc}" height="${(o.h+.6)*sc}" fill="none" stroke="#fff" stroke-dasharray="3 3"/>`});
  Ly.panels.forEach((p,i)=>{const x=ox+p.x*sc,y=oy+p.y*sc,pw=p.w*sc,ph=p.h*sc;
    b+=`<rect x="${x}" y="${y}" width="${pw}" height="${ph}" rx="2" fill="${p.ok?`url(#pg${id})`:'#d23c3c'}" stroke="${p.ok?TH.frame:'#fff'}" stroke-width="2"/>`;
    for(let k=1;k<6;k++)b+=S.orient==='V'?`<line x1="${x+pw*k/6}" y1="${y+3}" x2="${x+pw*k/6}" y2="${y+ph-3}" stroke="#5f7fb5" stroke-width=".7"/>`:`<line x1="${x+3}" y1="${y+ph*k/6}" x2="${x+pw-3}" y2="${y+ph*k/6}" stroke="#5f7fb5" stroke-width=".7"/>`;
    b+=`<text x="${x+pw/2}" y="${y+ph/2+5}" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">${i+1}</text>`});
  const bx=ox+(Ly.panels[0]?Ly.panels[0].x:0)*sc,bw=Ly.blockW*sc,by=oy+h+38;
  b+=`<line x1="${bx}" y1="${by}" x2="${bx+bw}" y2="${by}" stroke="${TH.accent}" stroke-width="1.6"/><line x1="${bx}" y1="${by-6}" x2="${bx}" y2="${by+6}" stroke="${TH.accent}" stroke-width="1.6"/><line x1="${bx+bw}" y1="${by-6}" x2="${bx+bw}" y2="${by+6}" stroke="${TH.accent}" stroke-width="1.6"/><text x="${bx+bw/2}" y="${by+18}" font-size="12" font-weight="bold" fill="${TH.accent}" text-anchor="middle">campo ${f2(Ly.blockW)} m</text>`;
  return svgWrap(w+110,h+110,b,defs);
}
// ---------- tabella coefficienti (Caleffi) ----------
function figCoef(D,hide=false){
  const W=560,H=250,id=++UID;let b=`<rect width="${W}" height="${H}" rx="10" fill="#fff8d6" stroke="#e6cf6b"/>`;
  b+=`<text x="${W/2}" y="30" font-size="14" font-weight="bold" fill="#5a4a10" text-anchor="middle">EDIFICI AD USO ABITATIVO · IMPIANTI COMBINATI</text><text x="${W/2}" y="48" font-size="11.5" fill="#7a6a30" text-anchor="middle">m² di pannello ogni 10 m² di superficie abitata (pannelli piani)</text>`;
  const cols=[['small','Piccole dimensioni'],['big','Medio-grandi']],rows=['Nord','Centro','Sud'];
  cols.forEach(([k,t],j)=>{b+=`<text x="${250+j*170}" y="78" font-size="12" font-weight="bold" fill="#5a4a10" text-anchor="middle">${t}</text>`});
  rows.forEach((z,i)=>{const y=106+i*36;b+=`<text x="40" y="${y}" font-size="13" font-weight="bold" fill="#5a4a10">Italia ${z}</text>`;
    cols.forEach(([k],j)=>{const r=ZONE[z][k],sel=z===D.zona&&k===D.size,x=250+j*170;
      if(sel)b+=`<rect x="${x-72}" y="${y-19}" width="144" height="28" rx="6" fill="${TH.accent}"/>`;
      b+=`<text x="${x}" y="${y}" font-size="14" font-weight="bold" fill="${sel?'#fff':'#5a4a10'}" text-anchor="middle">${f2(r[0])} ÷ ${f2(r[1])}</text>`})});
  b+=`<text x="${W/2}" y="${H-38}" font-size="12.5" font-weight="bold" fill="${TH.accent}" text-anchor="middle">Scelto: ${f2(D.coef)} m² / 10 m²  →  S = ${f2(D.coef)} × ${f0(S.A)} / 10 = ${hide?'?':f2(D.Sreq)+' m²'}</text>`;
  b+=`<text x="${W/2}" y="${H-16}" font-size="10.5" fill="#7a6a30" text-anchor="middle">Fonte: Idraulica Caleffi n. 29, pag. 19 · con pannelli sottovuoto ridurre di circa il 20%</text>`;
  return svgWrap(W,H,b);
}
// ---------- scheda del pannello ----------
function figPanelSheet(D){
  const P=D.P,id=++UID,W=640,H=330,sc=200/Math.max(P.lung,P.larg)*1.2,pw=P.larg*sc*0.65,ph=P.lung*sc*0.65,x=70,y=50;
  let defs=`<linearGradient id="pg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#244a8f"/><stop offset="1" stop-color="#0d2247"/></linearGradient>`+SHF(id);
  let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/><g filter="url(#sh${id})"><rect x="${x}" y="${y}" width="${pw}" height="${ph}" rx="4" fill="url(#pg${id})" stroke="${TH.frame}" stroke-width="5"/></g>`;
  for(let k=1;k<8;k++)b+=`<line x1="${x+pw*k/8}" y1="${y+6}" x2="${x+pw*k/8}" y2="${y+ph-6}" stroke="#5f7fb5"/>`;
  b+=`<line x1="${x+3}" y1="${y+10}" x2="${x+pw-3}" y2="${y+10}" stroke="${TH.hot}" stroke-width="4"/><line x1="${x+3}" y1="${y+ph-10}" x2="${x+pw-3}" y2="${y+ph-10}" stroke="${TH.cold}" stroke-width="4"/>`;
  b+=`<line x1="${x}" y1="${y+ph+18}" x2="${x+pw}" y2="${y+ph+18}" stroke="#1d2433"/><text x="${x+pw/2}" y="${y+ph+34}" font-size="12" font-weight="bold" text-anchor="middle" fill="#1d2433">${P.larg} mm</text>`;
  b+=`<line x1="${x-18}" y1="${y}" x2="${x-18}" y2="${y+ph}" stroke="#1d2433"/><text x="${x-24}" y="${y+ph/2}" font-size="12" font-weight="bold" text-anchor="middle" fill="#1d2433" transform="rotate(-90 ${x-24} ${y+ph/2})">${P.lung} mm</text>`;
  const rows=[['Modello',P.n],['Tipo',P.tipo],['Superficie lorda',f3(P.Al)+' m²'],['Superficie di apertura',f3(P.Aa)+' m²'],['Area usata nei calcoli',f2(D.Aref)+' m²'],['Contenuto di liquido',f1(P.vol)+' l'],['Perdita di carico',`${f0(P.Hp)} mm c.a. a ${f0(P.Gp)} l/h`],['Collettori in linea',`${P.maxV} verticali · ${P.maxO} orizzontali`],['Stagnazione',P.tstag+' °C'],['Peso a vuoto',P.peso+' kg']];
  rows.forEach(([a,v],i)=>{const yy=40+i*27;b+=`<rect x="290" y="${yy-17}" width="330" height="25" fill="${i%2?'#fff':'#eef3fb'}"/><text x="300" y="${yy}" font-size="12" fill="#5f6878">${a}</text><text x="610" y="${yy}" font-size="12" font-weight="bold" text-anchor="end" fill="#1d2433">${xesc(v)}</text>`});
  return svgWrap(W,H,b,defs);
}
// ---------- schema di stringa ----------
function figString(D,L=false){
  const N=D.N,lines=D.lines,per=Math.ceil(N/lines),ser=D.conn==='serie',pw=54,ph=86,gap=ser?26:10,W=Math.max(620,per*(pw+gap)+260),lh=ph+100,H=lines*lh+90;
  let defs=`<linearGradient id="pg${++UID}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#244a8f"/><stop offset="1" stop-color="#0d2247"/></linearGradient>`;const id=UID;
  let b=bgPanel(W,H,id).b;defs+=bgPanel(W,H,id).d;let k=0;
  for(let l=0;l<lines;l++){const y0=84+l*lh,x0=130,n=Math.min(per,N-k);
    for(let i=0;i<n;i++,k++){const x=x0+i*(pw+gap);b+=`<rect x="${x}" y="${y0}" width="${pw}" height="${ph}" rx="3" fill="url(#pg${id})" stroke="${TH.frame}" stroke-width="2.5"/>`;
      for(let j=1;j<5;j++)b+=`<line x1="${x+pw*j/5}" y1="${y0+8}" x2="${x+pw*j/5}" y2="${y0+ph-8}" stroke="${shade(TH.hot,.2)}" stroke-width="2"${L?' class="flow"':''}/>`;
      if(ser&&i<n-1)b+=LN(`M${x+pw},${y0+8} C${x+pw+gap/2},${y0+8} ${x+pw+gap/2},${y0+ph-8} ${x+pw+gap},${y0+ph-8}`,tcol(40+(i+1)/n*10),1,L,3.5);
      b+=`<text x="${x+pw/2}" y="${y0+ph+18}" font-size="11" font-weight="bold" fill="#33405a" text-anchor="middle">${ser?f0(D.Gline):f0(D.Gp)} l/h</text>`;}
    const xe=x0+n*(pw+gap)-gap;
    if(!ser)b+=LN(`M${x0-6},${y0+ph-6} L${xe},${y0+ph-6}`,TH.cold,1,L,4)+LN(`M${x0},${y0+6} L${xe+6},${y0+6}`,TH.hot,1,L,4);
    b+=LN(`M30,${y0+ph-6} L${x0-6},${y0+ph-6}`,TH.cold,1,L,5)+LN(`M${ser?xe:xe+6},${ser?y0+8:y0+6} L${xe+90},${ser?y0+8:y0+6}`,TH.hot,1,L,5);
    b+=Lbl(70,y0+ph+40,`ritorno 40 °C · ${f0(D.Gline)} l/h`,{s:11,stroke:TH.cold})+Lbl(xe+70,y0-14,`mandata 50 °C`,{s:11,stroke:TH.hot});
  }
  b+=Lbl(W/2,28,`Δt = 10 °C · ${ser?'collegamento in serie':'collegamento in parallelo'} · ${N} pannelli`,{s:13});
  b+=`<text x="${W/2}" y="${H-14}" font-size="12" font-weight="bold" fill="#33405a" text-anchor="middle">Perdita della stringa ≈ ${f0(D.Hfield)} mm c.a. · portata totale ${f0(D.G)} l/h</text>`;
  return svgWrap(W,H,b,defs);
}
// ---------- tabelle evidenziate ----------
function figTab7A(D,hide=false){
  const cols=PIPES.slice(0,9),rows=PIPE_R.slice(0,20),cw=62,rh=21,lx=70,ty=72,W=lx+cols.length*cw+16,H=ty+rows.length*rh+40,de=hide?-1:D.pipe.p.de,pr=PIPE_R.findIndex(x=>x>=D.pipe.r-1e-9);
  let b=`<rect width="${W}" height="${H}" fill="#fff"/><rect x="12" y="10" width="300" height="26" rx="4" fill="#2e8b57"/><text x="22" y="28" font-size="13" font-weight="bold" fill="#fff">TAB. 7A · TUBI IN ACCIAIO · acqua 50 °C</text><text x="${W-14}" y="28" font-size="11" fill="#5f6878" text-anchor="end">G = portata l/h · r = mm c.a./m</text>`;
  b+=`<text x="${lx-8}" y="${ty-10}" font-size="11" font-weight="bold" fill="#33405a" text-anchor="end">De / Di</text>`;
  cols.forEach((p,j)=>{const x=lx+j*cw,sel=p.de===de;if(sel)b+=`<rect x="${x}" y="${ty-38}" width="${cw}" height="${rows.length*rh+38}" fill="${TH.accent}" opacity=".12"/>`;
    b+=`<text x="${x+cw/2}" y="${ty-22}" font-size="12" font-weight="bold" fill="${sel?TH.accent:'#1d2433'}" text-anchor="middle">${f1(p.de)}</text><text x="${x+cw/2}" y="${ty-8}" font-size="10.5" fill="#5f6878" text-anchor="middle">${f1(p.di)}</text>`});
  rows.forEach((r,i)=>{const y=ty+i*rh,band=r===D.rimp;b+=`<rect x="12" y="${y}" width="${W-24}" height="${rh}" fill="${band?'#fff1c2':i%2?'#f7f9fc':'#fff'}"/><text x="${lx-10}" y="${y+15}" font-size="11.5" font-weight="bold" fill="#33405a" text-anchor="end">${r}</text>`;
    cols.forEach((p,j)=>{const x=lx+j*cw,g=p.g[i],pick=p.de===de&&i===pr;if(pick)b+=`<rect x="${x+3}" y="${y+2}" width="${cw-6}" height="${rh-4}" rx="4" fill="${TH.accent}"/>`;
      b+=`<text x="${x+cw/2}" y="${y+15}" font-size="11" fill="${pick?'#fff':'#1d2433'}" font-weight="${pick?'bold':'normal'}" text-anchor="middle">${g.toLocaleString('it-IT')}</text>`})});
  b+=`<text x="14" y="${H-14}" font-size="11.5" font-weight="bold" fill="${TH.accent}">Portata ${f0(D.G)} l/h · r imposta ${D.rimp} mm c.a./m (riga gialla) ${hide?'· segui i passi per trovare il tubo':`· tubo scelto De ${f1(de)} mm, r effettiva ${D.pipe.r} mm c.a./m`}</text>`;
  return svgWrap(W,H,b);
}
function figDPR(D,hide=false){
  const I=hide?{c:-1,i0:-1,i1:-1,s:0}:D.ins,cw=80,rh=22,lx=92,ty=86,W=lx+6*cw+16,H=ty+11*rh+40;
  let b=`<rect width="${W}" height="${H}" fill="#fff"/><text x="${W/2}" y="26" font-size="13" font-weight="bold" fill="#1d2433" text-anchor="middle">ISOLAMENTO DELLE RETI DI DISTRIBUZIONE (DPR 412/93, ALL. B)</text><text x="${W/2}" y="44" font-size="11" fill="#5f6878" text-anchor="middle">spessore minimo dell’isolante in mm</text>`;
  b+=`<text x="${lx-8}" y="${ty-12}" font-size="10.5" font-weight="bold" fill="#33405a" text-anchor="end">λ W/(m·K)</text>`;
  INS_C.forEach((c,j)=>{const x=lx+j*cw,sel=j===I.c;if(sel)b+=`<rect x="${x}" y="${ty-30}" width="${cw}" height="${11*rh+30}" fill="${TH.accent}" opacity=".12"/>`;b+=`<text x="${x+cw/2}" y="${ty-12}" font-size="11" font-weight="bold" fill="${sel?TH.accent:'#1d2433'}" text-anchor="middle">De ${xesc(c)}</text>`});
  INS_L.forEach((l,i)=>{const y=ty+i*rh,on=i===I.i0||i===I.i1;b+=`<rect x="12" y="${y}" width="${W-24}" height="${rh}" fill="${on?'#fff1c2':i%2?'#f7f9fc':'#fff'}"/><text x="${lx-10}" y="${y+15}" font-size="11.5" font-weight="bold" fill="#33405a" text-anchor="end">${f3(l)}</text>`;
    INS_T[i].forEach((v,j)=>{const x=lx+j*cw,pick=on&&j===I.c;if(pick)b+=`<rect x="${x+8}" y="${y+2}" width="${cw-16}" height="${rh-4}" rx="4" fill="${TH.accent}"/>`;b+=`<text x="${x+cw/2}" y="${y+15}" font-size="11.5" fill="${pick?'#fff':'#1d2433'}" font-weight="${pick?'bold':'normal'}" text-anchor="middle">${v}</text>`})});
  b+=`<text x="14" y="${H-14}" font-size="11.5" font-weight="bold" fill="${TH.accent}">${hide?'Riga: λ del tuo isolante · colonna: diametro esterno del tubo':`λ = ${f3(D.lam)} · De ${f1(D.pipe.p.de)} mm → ${I.s} mm → commerciale ${D.insComm} mm`}</text>`;
  return svgWrap(W,H,b);
}
function figTab9(D,hide=false){
  const de=hide?-1:D.pipe.p.de,ri=Math.max(0,TAB9_DE.indexOf(D.pipe.p.de)),rs=TAB9_DE.slice(Math.max(0,ri-3),Math.max(0,ri-3)+8),cw=70,rh=24,lx=86,ty=80,W=lx+TAB9_S.length*cw+16,H=ty+rs.length*rh+40;
  let b=`<rect width="${W}" height="${H}" fill="#fff"/><text x="${W/2}" y="26" font-size="13" font-weight="bold" fill="#1d2433" text-anchor="middle">TAB. 9 · SUPERFICIE ESTERNA (m²) PER 1 m DI TUBO ISOLATO</text><text x="${W/2}" y="44" font-size="11" fill="#5f6878" text-anchor="middle">tubi in acciaio · spessore dell’isolante in mm</text>`;
  TAB9_S.forEach((s,j)=>{const x=lx+j*cw,sel=!hide&&s===D.insComm;if(sel)b+=`<rect x="${x}" y="${ty-26}" width="${cw}" height="${rs.length*rh+26}" fill="${TH.accent}" opacity=".12"/>`;b+=`<text x="${x+cw/2}" y="${ty-8}" font-size="12" font-weight="bold" fill="${sel?TH.accent:'#1d2433'}" text-anchor="middle">${s}</text>`});
  rs.forEach((r,i)=>{const y=ty+i*rh,on=r===de;b+=`<rect x="12" y="${y}" width="${W-24}" height="${rh}" fill="${on?'#fff1c2':i%2?'#f7f9fc':'#fff'}"/><text x="${lx-10}" y="${y+16}" font-size="11.5" font-weight="bold" fill="#33405a" text-anchor="end">${f1(r)}</text>`;
    TAB9_S.forEach((s,j)=>{const x=lx+j*cw,pick=on&&s===D.insComm;if(pick)b+=`<rect x="${x+6}" y="${y+3}" width="${cw-12}" height="${rh-6}" rx="4" fill="${TH.accent}"/>`;b+=`<text x="${x+cw/2}" y="${y+16}" font-size="11.5" fill="${pick?'#fff':'#1d2433'}" font-weight="${pick?'bold':'normal'}" text-anchor="middle">${f3(Math.PI*(r+2*s)/1000)}</text>`})});
  b+=`<text x="14" y="${H-14}" font-size="11.5" font-weight="bold" fill="${TH.accent}">${hide?'Riga: De del tubo · colonna: spessore dell’isolante':`De ${f1(de)} mm con ${D.insComm} mm di isolante → ${f3(D.Sext)} m² per metro di tubo`}</text>`;
  return svgWrap(W,H,b);
}
