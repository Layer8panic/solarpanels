// ===================== INFOGRAFICHE =====================
function figCompass(az,loss){
  const c=110,r=82,a=rad(az),vx=-Math.sin(a),vy=Math.cos(a),col=loss<2.6?'#1f9d63':loss<4?'#d98a0b':'#d23c3c';let s='';
  [[45,'#fde3c4'],[30,'#d7f0e2']].forEach(([d,cl])=>{s+=`<path d="M${c},${c} L${c-Math.sin(rad(d))*r},${c+Math.cos(rad(d))*r} A${r},${r} 0 0 0 ${c+Math.sin(rad(d))*r},${c+Math.cos(rad(d))*r} Z" fill="${cl}"/>`});
  const t=(x,y,z,o='middle')=>`<text x="${x}" y="${y}" font-size="13" font-weight="bold" fill="#33405a" text-anchor="${o}">${z}</text>`;
  return svgWrap(420,230,`<rect width="420" height="230" fill="#f6f9fd"/><circle cx="${c}" cy="${c}" r="${r}" fill="#fff" stroke="#c9c1ad" stroke-width="2"/>${s}${t(c,20,'N')}${t(c,c+r+20,'S')}${t(c+r+12,c+5,'E')}${t(c-r-12,c+5,'O')}<line x1="${c}" y1="${c}" x2="${c+vx*r*.9}" y2="${c+vy*r*.9}" stroke="${col}" stroke-width="6" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="7" fill="${col}"/>`
   +Lbl(310,70,`falda verso ${S.dir||'Sud'}`,{s:13})+Lbl(310,110,`perdita ≈ ${f1(loss)}%`,{s:13,stroke:col})+`<rect x="236" y="138" width="14" height="14" fill="#d7f0e2"/><text x="256" y="150" font-size="12" fill="#33405a">entro ±30°: ottimo</text><rect x="236" y="162" width="14" height="14" fill="#fde3c4"/><text x="256" y="174" font-size="12" fill="#33405a">entro ±45°: buono</text>`);
}
// fasce di latitudine e zona della tabella
function figLat(D){
  const W=640,H=360;let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/>`;
  const zs=[['Nord',47,44,'#7fb3e6'],['Centro',44,41.5,'#9fd3a8'],['Sud',41.5,36.5,'#ffd27a']],Y=l=>30+(47-l)/10.5*290;
  zs.forEach(([z,a,c,col])=>{b+=`<rect x="40" y="${Y(a)}" width="250" height="${Y(c)-Y(a)}" fill="${col}" opacity="${z===D.zona?1:.45}" stroke="#fff" stroke-width="3"/><text x="165" y="${(Y(a)+Y(c))/2+6}" font-size="18" font-weight="bold" fill="#1d2433" text-anchor="middle">Italia ${z}</text>`});
  for(let l=37;l<=47;l+=2)b+=`<text x="300" y="${Y(l)+4}" font-size="11" fill="#5d6a80">${l}° N</text>`;
  const y=Y(clamp(D.lat,36.6,46.9));b+=`<line x1="30" x2="330" y1="${y}" y2="${y}" stroke="${TH.hot}" stroke-width="2" stroke-dasharray="6 4"/><circle cx="165" cy="${y}" r="9" fill="${TH.hot}" stroke="#fff" stroke-width="3"/>`;
  b+=Lbl(480,70,`${S.prov||'la tua provincia'}`,{s:15,stroke:TH.hot})+Lbl(480,112,`latitudine ≈ ${f1(D.lat)}° N`,{s:12})+Lbl(480,150,`zona: Italia ${D.zona}`,{s:12,stroke:TH.accent})+Lbl(480,188,`antigelo fino a ${D.Tprot} °C`,{s:12,stroke:TH.cold});
  b+=`<text x="480" y="250" font-size="12" fill="#33405a" text-anchor="middle">più a Sud = più sole</text><text x="480" y="268" font-size="12" fill="#33405a" text-anchor="middle">= meno pannelli per m² di casa</text>`;
  return svgWrap(W,H,b);
}
// catena dei calcoli: dove sei arrivato
function figFlow(D,upto=99){
  const items=[['Superficie casa',f0(D.A)+' m²'],['Pannelli',`${f2(D.Sreq)} m² → ${D.N}`],['Portata',f0(D.G)+' l/h'],['Tubo',`De ${f1(D.pipeP.de)} mm`],['Isolante',D.insComm+' mm'],['Antigelo',D.gpct+'%'],['Pompa',f2(D.Htot/1000)+' m'],['Vaso',D.vaso+' l'],['Serbatoio',D.Vtank+' l']];
  const W=760,H=200,n=items.length,w=(W-40)/n;let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/>`;
  items.forEach(([a,v],i)=>{const x=20+i*w,on=i<=upto,cx=x+w/2;
    if(i<n-1)b+=`<line x1="${cx+28}" y1="90" x2="${cx+w-28}" y2="90" stroke="${on&&i<upto?TH.accent:'#cfd8e6'}" stroke-width="4" stroke-dasharray="${on&&i<upto?'0':'6 5'}"/>`;
    b+=`<circle cx="${cx}" cy="90" r="26" fill="${on?TH.accent:'#e8edf5'}" stroke="#fff" stroke-width="3"/><text x="${cx}" y="96" font-size="15" font-weight="bold" fill="${on?'#fff':'#9aa6b8'}" text-anchor="middle">${i+1}</text>`;
    b+=`<text x="${cx}" y="140" font-size="11" font-weight="bold" fill="#33405a" text-anchor="middle">${xesc(a)}</text><text x="${cx}" y="158" font-size="11" fill="${on?TH.accent:'#9aa6b8'}" text-anchor="middle">${on?xesc(v):'…'}</text>`});
  b+=`<text x="${W/2}" y="34" font-size="14" font-weight="bold" fill="#1d2433" text-anchor="middle">Ogni risultato serve al passo dopo</text>`;
  return svgWrap(W,H,b);
}
// barre delle perdite di carico
function figLosses(D){
  const parts=[['Tubi',D.Hcont*D.fg,TH.cold],['Curve e valvole',D.Hloc*D.fg,'#7c8ea8'],['Pannelli',D.Hfield*D.fg,TH.accent],['Scambiatore',D.Hsc,TH.hot]],tot=parts.reduce((a,p)=>a+p[1],0),W=680,H=260,bw=560;
  let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/><text x="40" y="40" font-size="14" font-weight="bold" fill="#1d2433">Prevalenza della pompa = somma delle perdite (glicole compreso)</text>`;let x=40;
  parts.forEach(([n,v,c])=>{const w=Math.max(2,v/tot*bw);b+=`<rect x="${x}" y="70" width="${w}" height="56" fill="${c}" class="grow"/>`;if(w>60)b+=`<text x="${x+w/2}" y="104" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">${f0(v)} mm</text>`;x+=w});
  parts.forEach(([n,v,c],i)=>{b+=`<rect x="${40+i*150}" y="150" width="14" height="14" rx="3" fill="${c}"/><text x="${60+i*150}" y="162" font-size="12" fill="#33405a">${n}: ${f0(v)} mm</text>`});
  b+=Lbl(W/2,222,`Totale ${f0(D.Htot)} mm c.a. = ${f2(D.Htot/1000)} m c.a. · portata ${f3(D.G/1000)} m³/h`,{s:13});
  return svgWrap(W,H,b);
}
// il progetto in una pagina
function figDash(D){
  const W=820,H=470,id=++UID;let b=`<rect width="${W}" height="${H}" fill="#f6f9fd"/><rect x="20" y="20" width="${W-40}" height="70" rx="14" fill="${TH.accent}"/><text x="40" y="52" font-size="20" font-weight="bold" fill="#fff">Impianto solare combinato · ${xesc(S.prov||'')}</text><text x="40" y="76" font-size="13" fill="#e8f0ff">${xesc(EDIFICI[S.edificio]||'')} di ${f0(D.A)} m² · tetto ${S.roof==='piano'?'piano':`a ${D.tilt}°`} verso ${xesc(S.dir||'Sud')}</text>`;
  const cards=[['☀','Pannelli',`${D.N} × ${f2(D.Aref)} m²`,`${f2(D.Snet)} m² installati`],['💧','Portata',`${f0(D.G)} l/h`,`${f1(D.Gp)} l/h per pannello`],['⌀','Tubo',`De ${f1(D.pipeP.de)} mm`,`r = ${D.r} mm/m`],['▦','Isolante',`${D.insComm} mm`,`${f3(D.Sext)} m²/m`],['❄','Antigelo',`${D.gpct}%`,`fino a ${D.Tg} °C`],['⟳','Pompa',`${f2(D.Htot/1000)} m c.a.`,`${f3(D.G/1000)} m³/h`],['⇄','Scambiatore',`${f2(D.QkW)} kW`,`${f0(D.Q)} kcal/h`],['◍','Vaso',`${D.vaso} l`,`precarica ${f1(D.Pi)} bar`],['▮','Serbatoio',`${D.Vtank} l`,D.tankName.replace('Serbatoio ','')]];
  cards.forEach(([ic,t,v,s],i)=>{const x=20+(i%3)*262,y=110+Math.floor(i/3)*118;
    b+=`<rect x="${x}" y="${y}" width="250" height="104" rx="14" fill="#fff" stroke="#e1e7f0"/><circle cx="${x+34}" cy="${y+34}" r="18" fill="${shade(TH.accent,.8)}"/><text x="${x+34}" y="${y+40}" font-size="16" text-anchor="middle" fill="${TH.accent}">${ic}</text><text x="${x+62}" y="${y+30}" font-size="12" fill="#5d6a80">${t}</text><text x="${x+62}" y="${y+56}" font-size="19" font-weight="bold" fill="#1d2433">${xesc(v)}</text><text x="${x+62}" y="${y+80}" font-size="11.5" fill="#5d6a80">${xesc(s)}</text>`});
  return svgWrap(W,H,b);
}
