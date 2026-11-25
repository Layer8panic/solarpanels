// Figure: funzioni di base
// ===================== FIGURE (SVG valide sia animate sia per il Word) =====================
let UID=0;
function SV(w,h,body,bg='#ffffff'){return {w,h,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial, Helvetica, sans-serif">${bg?`<rect width="${w}" height="${h}" fill="${bg}"/>`:''}${body}</svg>`}}
const T=(x,y,t,o={})=>`<text x="${x}" y="${y}" font-size="${o.s||11}" fill="${o.c||'#33405a'}" font-weight="${o.w||'bold'}" text-anchor="${o.a||'start'}"${o.tr?` transform="${o.tr}"`:''}>${xesc(t)}</text>`;
const LN=(d,col,on,L,w=5,cls='')=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" opacity="${on?1:0.28}"${L&&on?` class="flow ${cls}"`:''}/>`;
function sunG(x,y,r=14,L=false){let s='';for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=`<line x1="${x+Math.cos(a)*(r+4)}" y1="${y+Math.sin(a)*(r+4)}" x2="${x+Math.cos(a)*(r+10)}" y2="${y+Math.sin(a)*(r+10)}"/>`}
  return `<g${L?' class="pulse"':''} stroke="#f5a524" stroke-width="2.5" stroke-linecap="round">${s}</g><circle cx="${x}" cy="${y}" r="${r}" fill="#ffcf5c" stroke="#f5a524" stroke-width="2"/>`}
function panelRect(x,y,w,h,col='#1d3d73',vert=true){let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${col}" stroke="#a9c4ef" stroke-width="1.2"/>`;
  for(let k=1;k<6;k++) s+=vert?`<line x1="${x+w*k/6}" y1="${y+3}" x2="${x+w*k/6}" y2="${y+h-3}" stroke="#4d6fa6" stroke-width=".8"/>`:`<line x1="${x+3}" y1="${y+h*k/6}" x2="${x+w-3}" y2="${y+h*k/6}" stroke="#4d6fa6" stroke-width=".8"/>`;return s}

// ---------- casa in sezione con altezze del sole ----------
function figPanelType(type='piano',L=false){
  const W=460,H=250;let b=`<rect width="${W}" height="${H}" fill="#eef4fb"/>`+sunG(42,38,13,L);
  for(let i=0;i<4;i++)b+=`<line x1="${62+i*12}" y1="${52+i*4}" x2="${170+i*45}" y2="96" stroke="#f5a524" stroke-width="2.5"${L?` class="ray" style="animation-delay:${i*.3}s"`:''}/>`;
  if(type==='piano'){
    b+=`<rect x="130" y="96" width="300" height="10" fill="#bfe3ff" stroke="#6aa9d6"/>`+T(134,91,'Vetro solare temprato 3,2 mm');
    b+=`<rect x="130" y="128" width="300" height="8" fill="#1d2a44"/>`+T(134,123,'Assorbitore selettivo: α 95%, ε 4%');
    for(let i=0;i<7;i++)b+=`<circle cx="${150+i*42}" cy="140" r="5" fill="#e0482f" stroke="#7d1c10"/>`;
    b+=`<rect x="130" y="162" width="300" height="24" fill="#e9d7a6" stroke="#b49a5b"/>`+T(134,157,'Isolante in lana minerale 40 mm');
    b+=`<rect x="124" y="190" width="312" height="10" fill="#9aa3ad"/>`+T(134,218,'Telaio e fondo in alluminio');
    b+=T(10,236,'Fino a 90-95 °C · i più usati negli impianti civili',{c:'#5f6878',w:'normal'});
  } else if(type==='vuoto'){
    for(let i=0;i<7;i++){const x=140+i*42;b+=`<rect x="${x}" y="96" width="30" height="120" rx="15" fill="#d8ecfa" stroke="#6aa9d6" stroke-width="2"/><rect x="${x+8}" y="104" width="14" height="104" rx="7" fill="#1d2a44"/><line x1="${x+15}" y1="104" x2="${x+15}" y2="208" stroke="#e0482f" stroke-width="3"/>`}
    b+=`<rect x="130" y="84" width="310" height="12" fill="#9aa3ad"/>`+T(134,78,'Collettore di testa');
    b+=T(140,236,'Tubi di vetro sottovuoto: dispersioni minime, fino a 115-120 °C',{c:'#5f6878',w:'normal'});
  } else {
    b+=`<rect x="130" y="110" width="300" height="50" fill="#262626"/>`;for(let i=0;i<12;i++)b+=`<line x1="${140+i*24}" y1="112" x2="${140+i*24}" y2="158" stroke="#555" stroke-width="6"/>`;
    b+=T(134,104,'Assorbitore in plastica senza vetro')+T(140,236,'Non superano 40-45 °C: usati per piscine',{c:'#5f6878',w:'normal'});
  }
  return SV(W,H,b,null);
}
function figTiles(Sreq,N,A){
  const W=560,H=200;let b='';const n=Math.ceil(Sreq),full=Math.floor(Sreq),part=Sreq-full;
  for(let i=0;i<Math.min(n,40);i++){const x=14+(i%8)*30,y=28+Math.floor(i/8)*30,fw=i<full?26:26*part;
    b+=`<rect x="${x}" y="${y}" width="26" height="26" fill="#fff" stroke="#c9c1ad"/><rect x="${x}" y="${y}" width="${fw}" height="26" fill="#2a5aa0"/>`}
  b+=T(14,18,`Superficie necessaria: ${f2(Sreq)} m² (1 quadrato = 1 m²)`);
  b+=`<path d="M262,100 l30,0 m-10,-8 l10,8 l-10,8" stroke="#33405a" stroke-width="3" fill="none"/>`;
  const pw=Math.min(52,230/N);for(let i=0;i<N;i++)b+=panelRect(306+i*(pw+4),40,pw,88);
  b+=T(306,18,`${N} pannelli RPS 25/4`)+T(306,152,`${N} × ${f2(A)} m² = ${f2(N*A)} m²`,{s:13,c:'#16325c'});
  return SV(W,H,b,'#f7f3ea');
}
// ---------- tetto in pianta ----------
