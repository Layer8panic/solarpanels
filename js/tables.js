// ===================== TABELLE INTERATTIVE =====================
// opzioni: rowOn (riga evidenziata), colOn (colonna evidenziata), pick {r,c} cella scelta, click: 'row'|'cell'|'colhead'|null
function tblWrap(title,sub,inner,cls=''){return `<div class="ttab ${cls}"><div class="ttab-h"><b>${title}</b>${sub?`<span>${sub}</span>`:''}</div><div class="scroll">${inner}</div></div>`}
function cellAttr(o,r,c){const cl=[];if(o.rowOn===r)cl.push('rowon');if(o.colOn===c)cl.push('colon');if(o.pick&&o.pick.r===r&&o.pick.c===c)cl.push('pk');if(o.wrong&&o.wrong.r===r&&o.wrong.c===c)cl.push('wr');
  return `class="${cl.join(' ')}" data-pos="${r},${c}"`}
function tabCoef(D,o={}){
  const rows=['Nord','Centro','Sud'],cols=[['small','Piccole dimensioni'],['big','Medio-grandi']];
  const h=`<table class="tt"><tr><th></th>${cols.map(([k,t],j)=>`<th class="${o.colOn===j?'colon':''}" data-pos="-1,${j}">${t}</th>`).join('')}</tr>${rows.map((z,i)=>`<tr><th ${cellAttr(o,i,-1)}>Italia ${z}</th>${cols.map(([k],j)=>`<td ${cellAttr(o,i,j)}>${f2(ZONE[z][k][0])} ÷ ${f2(ZONE[z][k][1])}</td>`).join('')}</tr>`).join('')}</table>`;
  return tblWrap('Tabella dei coefficienti · impianti combinati','m² di pannello ogni 10 m² di superficie abitata',h,'yel');
}
function tab7A(D,o={}){
  const cols=PIPES.slice(0,9),rows=PIPE_R.slice(0,20);
  const h=`<table class="tt"><tr><th class="${o.click==='row'?'hint-col':''}">r<br><small>mm c.a./m</small></th>${cols.map((p,j)=>`<th class="${o.colOn===j?'colon':''}" data-pos="-1,${j}">De ${f1(p.de)}<br><small>Di ${f1(p.di)}</small></th>`).join('')}</tr>
   ${rows.map((r,i)=>`<tr><th ${cellAttr(o,i,-1)}>${r}</th>${cols.map((p,j)=>`<td ${cellAttr(o,i,j)}>${p.g[i].toLocaleString('it-IT')}</td>`).join('')}</tr>`).join('')}</table>`;
  return tblWrap('Tab. 7A · Tubi in acciaio, acqua a 50 °C · perdite di carico continue','r = perdita in mm c.a. per metro (a sinistra) · De/Di = diametri in mm (in alto) · nelle celle: portata G in l/h',h,'grn');
}
function tabDPR(D,o={}){
  const h=`<table class="tt"><tr><th>λ<br><small>W/(m·K)</small></th>${INS_C.map((c,j)=>`<th class="${o.colOn===j?'colon':''}" data-pos="-1,${j}">De ${xesc(c)} mm</th>`).join('')}</tr>
   ${INS_L.map((l,i)=>`<tr><th ${cellAttr(o,i,-1)}>${f3(l)}</th>${INS_T[i].map((v,j)=>`<td ${cellAttr(o,i,j)}>${v}</td>`).join('')}</tr>`).join('')}</table>`;
  return tblWrap('Legge 10 (DPR 412/93) · Isolamento delle reti di distribuzione del calore','righe: λ dell’isolante · colonne: diametro esterno del tubo · nelle celle: spessore minimo in mm',h,'blu');
}
function tab9(D,o={}){
  const rows=TAB9_DE.slice(0,12);
  const h=`<table class="tt"><tr><th>De<br><small>mm</small></th>${TAB9_S.map((s,j)=>`<th class="${o.colOn===j?'colon':''}" data-pos="-1,${j}">${s} mm</th>`).join('')}</tr>
   ${rows.map((de,i)=>`<tr><th ${cellAttr(o,i,-1)}>${f1(de)}</th>${TAB9_S.map((s,j)=>`<td ${cellAttr(o,i,j)}>${f3(Math.PI*(de+2*s)/1000)}</td>`).join('')}</tr>`).join('')}</table>`;
  return tblWrap('Tab. 9 · Superficie esterna di 1 m di tubo isolato (tubi in acciaio)','nelle celle: m² per metro · colonne: spessore dell’isolante',h,'org');
}
function tabGly(D,o={}){
  const g=GLICOLE[D.gtype];
  const h=`<table class="tt"><tr><th>Concentrazione</th><th>Protegge fino a</th><th>Fattore perdite</th></tr>${g.pts.map(([p,t],i)=>`<tr><th ${cellAttr(o,i,-1)}>${p}%</th><td data-pos="${i},0">${t} °C</td><td data-pos="${i},1">${f2(g.fm[p])}</td></tr>`).join('')}</table>`;
  return tblWrap(`Tabella del ${g.n}`,'concentrazione in volume',h,'cy');
}
const TABLES={coef:tabCoef,t7a:tab7A,dpr:tabDPR,tab9:tab9,gly:tabGly};
