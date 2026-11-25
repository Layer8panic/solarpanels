// ===================== APP: STATO, CONTROLLI, ANIMAZIONI, EVENTI =====================
const DEF={nome:'',cognome:'',classe:'V MAT 2026/2027',docente:'LILLO TIROLO',variant:0,step:0,vw:{},tk:{},bad:{},seen:{},fast:false,
 edificio:'villetta',A:null,piani:2,regione:null,prov:null,Tp:null,roof:'falda',dir:'Sud',tilt:null,flatTilt:40,roofW:null,roofL:null,camino:true,
 pan:'rps254',cp:{...PANNELLI.custom},coef:null,orient:'V',rows:1,margin:0.5,rimp:12,Lone:null,pipeMat:null,insMat:'nbr',lam:0.035,insPos:'est',
 gtype:'propilenico',Hsc:null,Vsc:null,Hst:null,Pvs:6,kV:55,tank:'ss',dton:6,tmax:85};
const KEY='solarpanels-v1';
const fresh=()=>JSON.parse(JSON.stringify(DEF));
let S=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY));return s?{...fresh(),...s}:fresh()}catch(e){return fresh()}})();
let D=null,RUNNING=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toastOnce('Il browser non permette di salvare: i dati andranno persi chiudendo la pagina.')}}
let _tw=false;function toastOnce(t){if(_tw)return;_tw=true;toast(t)}

// ---------- controllo degli inserimenti ----------
const VALID={A:[20,5000,'La superficie deve stare tra 20 e 5000 m².'],piani:[1,6,'I piani vanno da 1 a 6.',true],Tp:[-30,15,'In Italia la temperatura di progetto sta tra −30 e +15 °C.'],
 tilt:[5,70,'L’inclinazione del tetto va da 5° a 70°.'],roofW:[2,60,'La larghezza della falda va da 2 a 60 m.'],roofL:[2,40,'La lunghezza della falda va da 2 a 40 m.'],
 Lone:[1,100,'La distanza va da 1 a 100 m (solo andata).'],Hsc:[0,5000,'La perdita dello scambiatore va da 0 a 5000 mm c.a.'],Hst:[1,40,'L’altezza va da 1 a 40 m.'],Vsc:[0,200,'I litri dello scambiatore vanno da 0 a 200.']};
const VALID_CP={Ar:[0.5,5,'La superficie di un pannello sta tra 0,5 e 5 m².'],vol:[0.3,15,'Il liquido contenuto sta tra 0,3 e 15 litri.'],Gp:[10,600,'La portata di prova sta tra 10 e 600 l/h.'],Hp:[1,3000,'La perdita sta tra 1 e 3000 mm c.a.'],maxV:[1,20,'Da 1 a 20 pannelli in fila.',true],lung:[500,3500,'La lunghezza sta tra 500 e 3500 mm.'],larg:[400,3000,'La larghezza sta tra 400 e 3000 mm.']};
function parseNum(v){if(v==null)return NaN;const t=String(v).trim().replace(/\s/g,'');if(!t)return NaN;if(!/^[-−+]?\d+([.,]\d+)?$/.test(t))return NaN;return parseFloat(t.replace('−','-').replace(',','.'))}
function checkNum(rule,raw){const v=parseNum(raw);if(String(raw).trim()==='')return {v:null,err:''};if(isNaN(v))return {v:null,err:'Scrivi solo un numero, ad esempio 12 oppure 12,5.'};
  if(rule[3]&&!Number.isInteger(v))return {v:null,err:'Qui serve un numero intero.'};if(v<rule[0]||v>rule[1])return {v:null,err:rule[2]};return {v,err:''}}
function nameErr(t){t=String(t||'').trim();if(!t)return '';if(t.length<2)return 'Scrivi il nome completo.';if(/\d/.test(t))return 'Il nome non può contenere numeri.';if(!/^[A-Za-zÀ-ÿ' .-]+$/.test(t))return 'Usa solo lettere, spazi e apostrofi.';return ''}
function fieldBad(k){if(k==='nome'||k==='cognome')return isNull(S[k])||!!nameErr(S[k]);return isNull(S[k])||!!S.bad[k]}

// ---------- moduli ----------
function errDiv(k,msg){return `<div class="ferr" id="e_${k}">${msg?'⚠ '+msg:''}</div>`}
function txt(k,l){const e=(k==='nome'||k==='cognome')?nameErr(S[k]):'';return `<div class="ctrl"><label>${l}</label><input type="text" data-k="${k}" data-t="s" maxlength="40" value="${xesc(S[k]||'')}" class="${isNull(S[k])?'miss':''} ${e?'err':''}" autocomplete="off">${errDiv(k,e)}</div>`}
function numf(k,l,u,min,max,step,sug=''){const bad=S.bad[k],val=bad!=null?bad.raw:(isNull(S[k])?'':String(S[k]).replace('.',','));
  return `<div class="ctrl"><label>${l} <span class="u">${u}</span></label><input type="text" inputmode="decimal" data-k="${k}" value="${xesc(val)}" class="${bad?'err':isNull(S[k])&&!sug.startsWith('stima')?'miss':''}" autocomplete="off">${errDiv(k,bad?bad.err:'')}${sug?`<div class="sug">${sug}</div>`:''}</div>`}
function sel(k,l,list,ph=''){return `<div class="ctrl"><label>${l}</label><select data-k="${k}" class="${isNull(S[k])?'miss':''}">${ph?`<option value="">${ph}</option>`:''}${list.map(([v,t])=>`<option value="${xesc(v)}" ${String(S[k])===String(v)?'selected':''}>${t}</option>`).join('')}</select></div>`}
function rngf(k,l,min,max,step,u='',dec=0){const v=S[k]==null?min:S[k];return `<div class="ctrl"><label>${l}<b id="v_${k}">${fmt(v,dec)} ${u}</b></label><input type="range" data-k="${k}" data-dec="${dec}" data-unit="${u}" min="${min}" max="${max}" step="${step}" value="${v}"></div>`}
function optf(k,l,list){return `<div class="ctrl"><label>${l}</label><div class="opts">${list.map(([v,t,s])=>`<button class="opt ${String(S[k])===String(v)?'sel':''}" data-set="${k}" data-val="${v}">${t}${s?`<small>${s}</small>`:''}</button>`).join('')}</div></div>`}
function figBox(f,cap){return `<div class="fig">${f.svg}${cap?`<div class="cap">${cap}</div>`:''}</div>`}
const AV=`<svg width="30" height="30" viewBox="0 0 40 40"><circle cx="20" cy="17" r="8" fill="#ffd24a"/><g stroke="#ffd24a" stroke-width="2.4" stroke-linecap="round"><path d="M20 3v4M20 27v4M6 17h4M30 17h4M10 7l3 3M30 7l-3 3M10 27l3-3M30 27l-3-3"/></g><path d="M8 36q12-8 24 0" stroke="#9fc2ff" stroke-width="2.4" fill="none"/></svg>`;

// ---------- stato delle fasi ----------
function tkS(id){return S.tk[id]||(S.tk[id]={})}
const AUTO=['num','cell','read','list'];
function taskOk(t){const s=S.tk[t.id]||{};
  if(AUTO.includes(t.kind))return !!s.ran;
  if(t.kind==='pick'){if(s.v==null)return false;if(t.correct&&String(s.v)!==String(t.correct(D)))return false;if(t.check&&!t.check(D))return false;return true}
  return true}
function ownMissing(st){return (st.need||[]).filter(k=>NEED_STEP[k]===st.id&&fieldBad(k)&&!(k==='tilt'&&S.roof==='piano'))}
function otherMissing(st){return (st.need||[]).filter(k=>NEED_STEP[k]!==st.id&&fieldBad(k)&&!(k==='tilt'&&S.roof==='piano'))}
function stepBlock(st){return st.block&&!otherMissing(st).length?st.block(D):''}
const BADSTEP={A:'casa',piani:'casa',Tp:'casa',tilt:'tetto',roofW:'tetto',roofL:'tetto',Lone:'tubi',Hsc:'pompa',Hst:'vaso',Vsc:'vaso'};
function stepBad(st){return Object.keys(S.bad).filter(k=>BADSTEP[k]===st.id)}
function cpBad(){return S.pan==='custom'&&Object.keys(VALID_CP).some(k=>S.bad['cp_'+k])}
function stepDone(st){if(st.report)return false;if(otherMissing(st).length||ownMissing(st).length||stepBlock(st))return false;if(st.id==='pannello'&&cpBad())return false;if(stepBad(st).length)return false;
  return st.tasks?st.tasks.every(taskOk):!!S.seen[st.id]}
function firstOpen(){const i=STEPS.findIndex(s=>!s.report&&!stepDone(s));return i<0?STEPS.length-1:i}
function whyNotDone(st){const om=ownMissing(st);if(om.length){const wr=om.filter(k=>!isNull(S[k])||S.bad[k]);return wr.length?'Correggi '+wr.map(k=>NEED_NAMES[k]).join(', ')+': c’è un errore segnato in rosso.':'Prima inserisci '+om.map(k=>NEED_NAMES[k]).join(', ')+'.'}const b=stepBlock(st);if(b)return b;
  if(st.id==='pannello'&&cpBad())return 'Correggi i dati del pannello segnati in rosso.';if(stepBad(st).length)return 'Correggi il valore segnato in rosso: '+S.bad[stepBad(st)[0]].err;
  if(st.tasks){const t=st.tasks.find(x=>!taskOk(x));if(t)return t.kind==='pick'?'Prima fai la scelta del passo '+(st.tasks.indexOf(t)+1)+'.':'Prima completa il passo '+(st.tasks.indexOf(t)+1)+' premendo il pulsante giallo.'}
  return 'Completa questa fase per andare avanti.'}

// ---------- render ----------
function render(){
  TH=makeTheme();D=compute();S.step=clamp(S.step,0,STEPS.length-1);if(S.step>firstOpen())S.step=firstOpen();
  const st=STEPS[S.step];if(!ownMissing(st).length)S.seen[st.id]=1;
  $('#varN').textContent=(S.variant||0)+1;$('#sub').textContent=`Fase ${S.step+1} di ${STEPS.length} · ${st.t}`;
  const om=otherMissing(st),g=st.tutor(D);
  let html=`<div class="step"><div class="shead"><div><span class="k">${st.grp} · fase ${S.step+1} di ${STEPS.length}</span><h2>${st.t}</h2></div></div>${tutorHTML(g)}`;
  if(om.length)html+=`<div class="card"><p style="margin-top:0">Per questa fase mi servono ancora: <b>${om.map(k=>NEED_NAMES[k]).join(', ')}</b>.</p><button class="btn" data-goid="${NEED_STEP[om[0]]}">Vai a inserirli</button></div>`;
  else if(st.report)html+=reportUI();
  else html+=`<div class="work ${st.tasks?'':'figfirst'}"><div><div id="usesBox"></div>${st.form?`<div class="card" id="formBox">${st.form(D)}</div>`:''}<div id="dyn"></div></div>${st.figs?`<div class="figcard" id="figc"></div>`:''}</div>`;
  html+=`<div class="navb"><button class="btn ghost" data-nav="-1" ${S.step?'':'disabled'}>← Indietro</button>${S.step<STEPS.length-1?`<button class="btn" id="nextBtn" data-nav="1">Avanti →</button>`:''}</div></div>`;
  $('#main').innerHTML=html;
  $('#mnav').innerHTML=`<button class="btn ghost" data-nav="-1" ${S.step?'':'disabled'}>←</button><span class="ct">${S.step+1} / ${STEPS.length}</span>${S.step<STEPS.length-1?`<button class="btn" id="nextBtnM" data-nav="1">Avanti →</button>`:`<button class="btn sun" id="docBtn2">${ic('download')} Word</button>`}`;
  if(!om.length&&!st.report)refreshDyn();else{renderNav();updNext()}
  save();
}
function updNext(){const st=STEPS[S.step],ok=stepDone(st);['#nextBtn','#nextBtnM'].forEach(id=>{const b=$(id);if(b){b.classList.toggle('locked',!ok);b.innerHTML=ok?'Avanti →':ic('lock')+' Avanti'}});
  $('#prog').style.width=(STEPS.filter(stepDone).length/(STEPS.length-1)*100)+'%'}
function tutorHTML(g){const open=S.tipsOpen??(window.innerWidth>860);
  return `<div class="tutor"><div class="av">${AV}</div><div><div class="bub"><div class="who">Archimede</div><div class="msg">${g.msg}</div></div>
  <details class="more" ${open?'open':''}><summary>Dove lo trovo · Perché</summary><div class="tips" style="grid-template-columns:1fr 1fr"><div class="tip dove"><b>Dove lo trovi</b>${g.dove}</div><div class="tip rag"><b>Perché</b>${g.perche}</div></div></details></div></div>`}
let _rq=0;function queueDyn(){if(_rq)return;_rq=requestAnimationFrame(()=>{_rq=0;refreshDyn()})}
function refreshDyn(){if(_rq){cancelAnimationFrame(_rq);_rq=0}
  const st=STEPS[S.step];if(st.report||otherMissing(st).length){updNext();return}
  TH=makeTheme();D=compute();
  const ub=$('#usesBox');if(ub)ub.innerHTML=st.uses?`<div class="uses"><span>Ti servono</span>${st.uses(D).map(([a,b])=>`<span class="pill">${a} <b>${b}</b></span>`).join('')}</div>`:'';
  let h='';const om=ownMissing(st),blk=stepBlock(st);
  if(st.id==='pannello'&&cpBad())h+=`<div class="note red">Alcuni dati del pannello non sono validi: correggi i campi in rosso.</div>`;
  if(blk)h+=`<div class="note red"><b>Attenzione.</b> ${blk}</div>`;
  if(st.tasks){const cur=st.tasks.findIndex(t=>!taskOk(t));
    h+=`<div class="card"><div class="taskhead"><h4>Passo dopo passo</h4><label class="chk sm"><input type="checkbox" id="fastChk" ${S.fast?'checked':''}> animazioni veloci</label></div>`;
    st.tasks.forEach((t,i)=>{if(i<cur||cur<0)h+=doneTask(t);
      else if(i===cur)h+=om.length?`<div class="task next">Prima completa i dati qui sopra: ${om.map(k=>NEED_NAMES[k]).join(', ')}.</div>`:blk?`<div class="task next">Correggi il problema segnalato e poi riprendiamo da qui.</div>`:curTask(t,i,st.tasks.length);
      else h+=`<div class="task next">Passo ${i+1} · ${{num:'un calcolo',cell:'una ricerca in tabella',read:'una lettura in tabella',list:'una misura in commercio',pick:'una tua scelta'}[t.kind]}</div>`});
    h+='</div>'}
  const gv=st.gives&&!blk&&!om.length?st.gives(D):null;
  if(gv&&stepDone(st))h+=`<div class="result"><h4>✔ Risultato di questa fase</h4><div class="rg">${gv.map(([a,b])=>`<div><small>${a}</small><b>${b}</b></div>`).join('')}</div></div>`;
  $('#dyn').innerHTML=h;
  const fc=$('#figc');if(fc){const fh=figPanel(st);if(fc._h!==fh){fc.innerHTML=fh;fc._h=fh}}
  renderNav();updNext();save();
}
function doneTask(t){const s=S.tk[t.id]||{};let ans='';
  if(t.kind==='pick'){const o=t.opts(D).find(([v])=>String(v)===String(s.v));ans=o?o[1]:''}else if(t.show)ans=t.show(D);else if(t.kind==='list')ans=listPick(t)+' '+(t.unit||'');
  const chg=t.kind==='pick'?`<button class="btn sm ghost chg" data-tredo="${t.id}" title="Torna a questa scelta e cambiala">${ic('pencil')} Cambia</button>`:'';
  return `<div class="task done"><span class="ck">✔</span><div class="tdx"><div>${strip(t.q(D))}</div>${ans?`<div class="ans">${ans}</div>`:''}</div>${chg}</div>`}
// riapre una scelta già fatta: azzera quel passo e i passi successivi della stessa fase (dipendono da lei)
function redoTask(id){const st=STEPS.find(s=>(s.tasks||[]).some(t=>t.id===id));if(!st)return;const i=st.tasks.findIndex(t=>t.id===id);
  st.tasks.slice(i).forEach(t=>{S.tk[t.id]={}});if(STEPS[S.step]!==st){S.step=STEPS.indexOf(st);render()}else refreshDyn();
  const c=document.querySelector('.task.cur');if(c)try{c.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'})}catch(e){}}
function listPick(t){const thr=t.thr(D),L=t.list(D);return L.find(v=>v>=thr-1e-9)??L[L.length-1]}
function tblFor(t){return TABLES[t.table](D,{rowOn:t.rowOn?t.rowOn(D):undefined,colOn:t.colOn?t.colOn(D):undefined})}
function curTask(t,i,n){const s=tkS(t.id);let body='';
  const runBtn=(lbl)=>`<div class="tact"><button class="btn sun" data-run="${t.id}">${ic('play')} ${lbl}</button></div>`;
  if(t.kind==='num')body=`<div class="board" id="bd-${t.id}"><span class="ph">Premi il pulsante: inserisco i numeri nella formula e faccio il conto.</span></div>${runBtn('Calcola')}`;
  if(t.kind==='cell')body=`<div id="tb-${t.id}">${tblFor(t)}</div><div class="narr" id="nr-${t.id}">Premi il pulsante e segui il cursore giallo nella tabella.</div>${runBtn('Cerca nella tabella')}`;
  if(t.kind==='read')body=`<div id="tb-${t.id}">${tblFor(t)}</div><div class="narr" id="nr-${t.id}">La riga e la colonna giuste sono già evidenziate.</div>${runBtn('Leggi il valore')}`;
  if(t.kind==='list')body=`<div class="chips" id="ls-${t.id}">${t.list(D).map(v=>`<span class="chipv" data-v="${v}">${fmt(v,0)} ${t.unit||''}</span>`).join('')}</div><div class="narr" id="nr-${t.id}">Valore da raggiungere: <b>${fmt(t.thr(D),1)} ${t.unit||''}</b></div>${runBtn('Trova la misura')}`;
  if(t.kind==='pick'){body=`<div class="opts">${t.opts(D).map(([v,l,sm])=>`<button class="opt ${String(s.v)===String(v)?'sel':''}" data-topt="${t.id}" data-val="${v}">${l}${sm?`<small>${sm}</small>`:''}</button>`).join('')}</div>`;
    if(s.v!=null&&!taskOk(t))body+=`<div class="fb no">${t.bad?t.bad(D):'Non è la scelta giusta, riprova.'}</div>`;
    if(s.help&&t.help)body+=`<div class="fb help">${ic('bulb')} ${t.help(D)}</div>`;
    if(t.help)body+=`<div class="tact"><button class="btn sm ghost" data-thelp="${t.id}">${ic('bulb')} Aiutami a scegliere</button></div>`}
  return `<div class="task cur"><span class="tn">Passo ${i+1} di ${n}</span><div class="tq">${t.q(D)}</div>${body}</div>`}
function figPanel(st){const vs=st.figs,i=clamp(S.vw[st.id]||0,0,vs.length-1),v=vs[i];
  return `${vs.length>1?`<div class="vtabs">${vs.map((x,j)=>`<button class="${j===i?'on':''}" data-view="${j}">${x.n}</button>`).join('')}</div>`:''}${figBox(v.f(D),v.n)}`}
function renderNav(){let h='',g='';const fo=firstOpen();
  STEPS.forEach((s,i)=>{if(s.grp!==g){g=s.grp;h+=`<div class="g">${g}</div>`}const dn=stepDone(s),lock=i>fo;
    h+=`<button class="${i===S.step?'cur':''} ${dn?'done':''} ${lock?'lock':''}" data-go="${i}"><span class="d">${lock?ic('lock'):dn&&i!==S.step?'✓':i+1}</span>${s.t}</button>`});
  const rows=[];STEPS.forEach(s=>{if(s.gives&&stepDone(s))s.gives(D).forEach(r=>rows.push(r))});
  if(rows.length)h+=`<div class="qnb"><h5>Il tuo quaderno</h5>${rows.slice(0,26).map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('')}</div>`;
  h+=`<div class="qnb"><button data-reset="1"><span class="d">${ic('undo')}</span>Nuovo progetto</button></div>`;
  $('#nav').innerHTML=h}
function go(i,noHist){if(RUNNING)return;i=clamp(i,0,STEPS.length-1);const fo=firstOpen();
  if(i>fo){const st=STEPS[fo];toast(fo===S.step?whyNotDone(st):`Prima completa la fase ${fo+1}: ${st.t}`);if(fo!==S.step)i=fo;else return}
  S.step=i;render();if(!noHist&&history.state?.step!==S.step)history.pushState({step:S.step},'','#fase-'+(S.step+1));window.scrollTo({top:0,behavior:RM?'auto':'smooth'});$('#nav').classList.remove('open')}
window.addEventListener('popstate',e=>{const n=e.state?.step;if(n==null)return;if(RUNNING){SKIP=true;history.pushState({step:S.step},'','#fase-'+(S.step+1));return}go(n,true)});
function toast(t){document.querySelectorAll('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),3200)}

// ---------- animazioni dei passi ----------
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function boxScroll(el){const sc=el&&el.closest('.scroll');if(!sc)return;const a=sc.getBoundingClientRect(),b=el.getBoundingClientRect(),pad=24;
  let dx=0,dy=0;if(b.left<a.left+pad)dx=b.left-a.left-pad;else if(b.right>a.right-pad)dx=b.right-a.right+pad;if(b.top<a.top+pad)dy=b.top-a.top-pad;else if(b.bottom>a.bottom-pad)dy=b.bottom-a.bottom+pad;
  if(dx||dy)sc.scrollBy({left:dx,top:dy,behavior:RM?'auto':'smooth'})}
function showBox(el){if(!el)return;const r=el.getBoundingClientRect(),vh=window.innerHeight;if(r.top<70||r.bottom>vh-20)try{el.scrollIntoView({block:r.height>vh-120?'start':'center',behavior:RM?'auto':'smooth'})}catch(e){}}
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let SKIP=false;const T_=ms=>RM||SKIP?0:ms*(S.fast?0.35:1);
function itNum(str){const m=String(str).match(/-?[\d.]+(,\d+)?/);if(!m)return null;const dec=m[1]?m[1].length-1:0;return {v:parseFloat(m[0].replace(/\./g,'').replace(',','.')),dec,txt:m[0],i:m.index}}
function flashPill(tok){const n=tok.replace(/[^\d,]/g,'');if(!n)return;document.querySelectorAll('.pill b').forEach(b=>{if(b.textContent.replace(/\./g,'').includes(n)){const p=b.parentElement;p.classList.remove('flash');void p.offsetWidth;p.classList.add('flash')}})}
async function animCalc(t){const bd=$('#bd-'+t.id);const q=t.q(D),m=q.match(/<b>(.*?)<\/b>/);const formula=strip(m?m[1]:q);
  const show=t.show?t.show(D):'',res=show.includes('=')?show.slice(show.lastIndexOf('=')+1).trim():show;
  bd.innerHTML='<div class="l1"></div><div class="l2"></div>';const l1=bd.querySelector('.l1'),l2=bd.querySelector('.l2');
  for(const tok of formula.split(/\s+/)){const sp=document.createElement('span');sp.textContent=tok;sp.style.marginRight='.4em';if(/\d/.test(tok)){sp.className='n';flashPill(tok)}else if(/^[×\/+−\-()=²]+$/.test(tok))sp.className='op';l1.appendChild(sp);await sleep(T_(/\d/.test(tok)?420:200))}
  await sleep(T_(300));const eq=document.createElement('span');eq.className='op';eq.textContent='=';eq.style.marginRight='.4em';l2.appendChild(eq);
  const num=itNum(res),out=document.createElement('span');out.className='res';l2.appendChild(out);
  if(num&&!RM&&!SKIP){const steps=18;for(let k=1;k<=steps;k++){out.textContent=fmt(num.v*k/steps,num.dec);await sleep(T_(45))}}
  out.textContent=num?res.slice(0,num.i)+num.txt:res;if(num){const rest=document.createElement('span');rest.className='res2';rest.textContent=' '+res.slice(num.i+num.txt.length).trim();l2.appendChild(rest)}
  bd.classList.add('fin');await sleep(T_(700))}
async function animScan(t){const box=$('#tb-'+t.id),nr=$('#nr-'+t.id),g=t.target(D);let seq=[];showBox(box);await sleep(T_(250));
  if(t.click==='row')for(let r=0;r<=g.r;r++)seq.push([r,-1]);
  else if(t.rowOn)for(let c=0;c<=g.c;c++)seq.push([t.rowOn(D),c]);
  else if(t.colOn)for(let r=0;r<=g.r;r++)seq.push([r,t.colOn(D)]);
  else{for(let r=0;r<=g.r;r++)seq.push([r,-1]);for(let c=0;c<=g.c;c++)seq.push([g.r,c])}
  let prev=null;const thr=t.thr?t.thr(D):null;
  for(let k=0;k<seq.length;k++){const [r,c]=seq[k],el=box.querySelector(`[data-pos="${r},${c}"]`);if(!el)continue;
    if(prev){prev.classList.remove('scan');prev.classList.add('seen')}el.classList.add('scan');prev=el;
    boxScroll(el);
    const last=k===seq.length-1,txtv=el.textContent.trim();
    if(thr!=null&&c>=0){const v=parseNum(txtv.replace(/\./g,''));nr.innerHTML=last?`<b>${txtv}</b> ≥ ${f0(thr)} ✔ trovato!`:`${txtv} è meno di ${f0(thr)}: vado avanti…`}
    else nr.innerHTML=last?`Trovato: <b>${txtv}</b>`:`Controllo: ${txtv}…`;
    await sleep(T_(last?300:330))}
  if(prev){prev.classList.remove('scan');prev.classList.add('pk','pop')}
  nr.innerHTML+=t.show?`<div class="nres">${t.show(D)}</div>`:'';await sleep(T_(1100))}
async function animRead(t){const box=$('#tb-'+t.id),nr=$('#nr-'+t.id),[r,c]=t.readAt(D),el=box.querySelector(`[data-pos="${r},${c}"]`);showBox(box);
  nr.textContent='Seguo la riga e la colonna evidenziate…';await sleep(T_(600));
  if(el){boxScroll(el);for(let k=0;k<3;k++){el.classList.add('scan');await sleep(T_(220));el.classList.remove('scan');await sleep(T_(160))}el.classList.add('pk','pop')}
  nr.innerHTML=`Leggo: <b>${el?el.textContent.trim():''}</b><div class="nres">${t.show?t.show(D):''}</div>`;await sleep(T_(1200))}
async function animList(t){const box=$('#ls-'+t.id),nr=$('#nr-'+t.id),thr=t.thr(D),pick=listPick(t);
  for(const ch of box.querySelectorAll('.chipv')){const v=+ch.dataset.v;ch.classList.add('scan');
    nr.innerHTML=v>=thr-1e-9?`<b>${fmt(v,0)} ${t.unit}</b> ≥ ${fmt(thr,1)} ✔ è la misura giusta`:`${fmt(v,0)} ${t.unit} è meno di ${fmt(thr,1)}: troppo piccolo`;
    await sleep(T_(450));ch.classList.remove('scan');if(v===pick){ch.classList.add('pk','pop');break}ch.classList.add('seen')}
  await sleep(T_(1000))}
async function runTask(id){if(RUNNING)return;const st=STEPS[S.step],t=st.tasks.find(x=>x.id===id);if(!t||taskOk(t))return;RUNNING=true;SKIP=false;
  document.querySelectorAll('[data-run],[data-nav],[data-go]').forEach(b=>b.disabled=true);
  const rb=document.querySelector(`[data-run="${id}"]`);if(rb){rb.removeAttribute('data-run');rb.dataset.skip='1';rb.disabled=false;rb.classList.add('ghost');rb.classList.remove('sun');rb.innerHTML=ic('skip')+' Salta l’animazione'}
  try{if(t.kind==='num')await animCalc(t);else if(t.kind==='cell')await animScan(t);else if(t.kind==='read')await animRead(t);else if(t.kind==='list')await animList(t);tkS(id).ran=true}
  catch(e){console.error(e);tkS(id).ran=true}
  RUNNING=false;SKIP=false;refreshDyn();document.querySelectorAll('[data-nav],[data-go]').forEach(b=>b.disabled=false);if(!S.step)$('[data-nav="-1"]')?.setAttribute('disabled','');
  const nx=document.querySelector('[data-run]');if(nx)try{nx.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'})}catch(e){}
  if(stepDone(st))toast('Fase completata! Premi “Avanti”.')}

// ---------- relazione ----------
function reportUI(){const L=makeLayout(),todo=STEPS.filter(s=>!s.report&&!stepDone(s)),ok=!todo.length;
  return `<div class="rep"><div class="card"><h4 style="margin-top:0">Copertina</h4><div class="g2">${txt('nome','Nome')}${txt('cognome','Cognome')}</div><div class="g2">${txt('classe','Classe')}${txt('docente','Docente di riferimento')}</div>
   <h4>Fasi completate</h4><ul class="checklist">${STEPS.filter(s=>!s.report).map(s=>`<li><i style="color:${stepDone(s)?'#14965c':'#d98a0b'}">${stepDone(s)?'✔':'•'}</i><span>${s.t}</span></li>`).join('')}</ul>
   ${ok?'<div class="note green">Tutte le fasi sono fatte: la relazione è pronta.</div>':`<div class="note red">Mancano ${todo.length} fasi: torna a “${todo[0].t}”.</div>`}
   <div class="opts" style="margin-top:14px"><button class="btn sun" id="docBtn" ${ok?'':'disabled'}>${ic('download')} Scarica la relazione Word</button><button class="btn ghost" id="varBtn2">${ic('shuffle')} Nuova versione</button></div>
   <p class="hint">Versione ${(S.variant||0)+1} · impaginazione: ${layoutName(L)}.</p></div>
   <div class="card"><h4 style="margin-top:0">Anteprima della copertina</h4><img class="logo-img" alt="I.I.S.S. Archimede" src="assets/logo.png" onerror="this.src='data:image/png;base64,'+LOGO_B64"><p style="text-align:center;font-weight:800;margin:10px 0">PROGETTO IMPIANTO A PANNELLI SOLARI PER UN SERVIZIO COMBINATO</p>
   ${figBox(sceneHouse(D,{cut:true,L:true,title:V('ct',['Progetto impianto a pannelli solari','Impianto solare termico combinato','Pannelli solari per ACS e riscaldamento','Energia dal sole per la casa']),sub:D.loc}),'')}
   <p style="font-weight:800;margin:10px 0 0">ALUNNO: ${xesc((S.cognome+' '+S.nome).toUpperCase())}<br>CLASSE: ${xesc(S.classe)}<br>DOCENTE DI RIFERIMENTO: ${xesc(S.docente)}</p></div></div>`}
async function exportDocx(){
  if(STEPS.some(s=>!s.report&&!stepDone(s))){toast('Completa tutte le fasi prima di scaricare la relazione.');return}
  if(nameErr(S.nome)||nameErr(S.cognome)||isNull(S.nome)||isNull(S.cognome)){toast('Controlla nome e cognome.');return}
  const bx=document.createElement('div');bx.className='busy';bx.innerHTML='<div class="bx"><div class="spinner"></div><div id="bmsg">Preparo la relazione…</div></div>';document.body.appendChild(bx);
  try{const doc=await buildReport();const blob=await buildDocx(doc,m=>{const e=$('#bmsg');if(e)e.textContent=m});window.__lastDocx=blob;
    const nm=`${S.cognome}_${S.nome}`.trim().replace(/\s+/g,'_').replace(/[^\wÀ-ÿ_-]/g,'');
    download(blob,`Progetto_impianto_solare${nm&&nm!=='_'?'_'+nm:''}_v${(S.variant||0)+1}.docx`);toast('Relazione pronta: la trovi nei download.')}
  catch(e){console.error(e);toast('Non sono riuscito a creare il file. Riprova; se succede ancora, ricarica la pagina.')}
  bx.remove()}

// ---------- eventi ----------
document.addEventListener('input',e=>{const t=e.target;if(RUNNING&&!t.id)return;
  if(t.id==='fastChk'){S.fast=t.checked;save();return}
  if(t.dataset.cp){const k=t.dataset.cp;if(k==='n'){S.cp.n=t.value.slice(0,40);save();return}
    const r=checkNum(VALID_CP[k],t.value);if(r.err||r.v==null){S.bad['cp_'+k]={raw:t.value,err:r.err||'Questo dato serve.'};t.classList.add('err')}else{delete S.bad['cp_'+k];S.cp[k]=r.v;t.classList.remove('err')}
    const ed=$('#e_cp_'+k);if(ed)ed.textContent=S.bad['cp_'+k]?'⚠ '+S.bad['cp_'+k].err:'';queueDyn();return}
  if(t.dataset.k&&t.tagName!=='SELECT'&&t.type!=='checkbox'){const k=t.dataset.k;
    if(t.dataset.t==='s'){S[k]=t.value;const er=(k==='nome'||k==='cognome')?nameErr(t.value):'';t.classList.toggle('miss',!t.value.trim());t.classList.toggle('err',!!er);const ed=$('#e_'+k);if(ed)ed.textContent=er?'⚠ '+er:'';
      if(!ownMissing(STEPS[S.step]).length)S.seen[STEPS[S.step].id]=1;STEPS[S.step].report?(save(),updNext()):queueDyn();return}
    if(t.type==='range'){const v=parseFloat(t.value);S[k]=v;const lb=$('#v_'+k);if(lb)lb.textContent=fmt(v,+t.dataset.dec||0)+' '+(t.dataset.unit||'');queueDyn();return}
    const r=VALID[k]?checkNum(VALID[k],t.value):{v:parseNum(t.value),err:''};
    if(r.err){S.bad[k]={raw:t.value,err:r.err};S[k]=null}else{delete S.bad[k];S[k]=r.v}
    t.classList.toggle('err',!!r.err);t.classList.toggle('miss',!r.err&&r.v==null);const ed=$('#e_'+k);if(ed)ed.textContent=r.err?'⚠ '+r.err:'';
    if(!ownMissing(STEPS[S.step]).length)S.seen[STEPS[S.step].id]=1;queueDyn()}});
document.addEventListener('change',e=>{const t=e.target;if(RUNNING)return;
  if(t.tagName==='SELECT'&&t.dataset.k){const k=t.dataset.k;S[k]=t.value===''?null:t.value;
    if(k==='regione'){S.prov=null;S.Tp=null;S.coef=null;delete S.bad.Tp}if(k==='prov'&&S.regione&&S.prov){S.Tp=REGIONI[S.regione].p[S.prov];delete S.bad.Tp}return render()}
  if(t.dataset.k&&t.type==='checkbox'){S[t.dataset.k]=t.checked;return refreshDyn()}});
document.addEventListener('toggle',e=>{if(e.target.classList&&e.target.classList.contains('more')){S.tipsOpen=e.target.open;save()}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('.lbox')?.remove();if(e.key==='Enter'&&e.target.tagName==='INPUT')e.target.blur()});
document.addEventListener('click',e=>{
  if(e.target.closest('.lb-x')){document.querySelector('.lbox')?.remove();return}
  const fz=e.target.closest('.fig');if(fz&&!e.target.closest('button')){const sv=fz.querySelector('svg');if(sv){const o=document.createElement('div');o.className='lbox';o.innerHTML=`<div class="lb-top"><span>${fz.querySelector('.cap')?.textContent||'Figura'}</span><button class="tbtn lb-x">✕ Chiudi</button></div><div class="lb-in">${sv.outerHTML}</div>`;document.body.appendChild(o);return}}
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.skip){SKIP=true;b.disabled=true;return}
  if(RUNNING&&!b.classList.contains('lb-x')){toast('Aspetta: sto finendo il passo, oppure premi “Salta l’animazione”.');return}
  if(b.id==='menuBtn'){$('#nav').classList.toggle('open');return}
  if(b.id==='brand')return go(0);
  if(b.id==='varBtn'||b.id==='varBtn2'){S.variant=(S.variant||0)+1;render();toast(`Versione ${S.variant+1}: nuova impaginazione, nuovi disegni e frasi`);return}
  if(b.dataset.reset){if(confirm('Vuoi iniziare un progetto nuovo? I dati inseriti verranno cancellati (nome e classe restano).')){const keep={nome:S.nome,cognome:S.cognome,classe:S.classe,docente:S.docente,seen:{copertina:1}};S=Object.assign(fresh(),keep);go(1)}return}
  if(b.dataset.go!=null)return go(+b.dataset.go);
  if(b.dataset.goid)return go(STEPS.findIndex(s=>s.id===b.dataset.goid));
  if(b.dataset.nav){const n=+b.dataset.nav;if(n>0&&!stepDone(STEPS[S.step])){toast(whyNotDone(STEPS[S.step]));const c=document.querySelector('.err,.miss,[data-run],.task.cur');if(c)try{c.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}return}return go(S.step+n)}
  if(b.id==='docBtn'||b.id==='docBtn2')return exportDocx();
  if(b.dataset.view!=null){S.vw[STEPS[S.step].id]=+b.dataset.view;const f=$('#figc');if(f){f._h=figPanel(STEPS[S.step]);f.innerHTML=f._h}save();return}
  if(b.dataset.run)return runTask(b.dataset.run);
  if(b.dataset.tredo)return redoTask(b.dataset.tredo);
  if(b.dataset.fixorient){S.orient=b.dataset.fixorient;S.tk.p1={v:S.orient};S.tk.p2={};if(b.dataset.rows)S.rows=+b.dataset.rows;refreshDyn();toast(S.orient==='V'?'Ora i pannelli sono in verticale.':'Ora i pannelli sono in orizzontale.');return}
  if(b.dataset.thelp){const s=tkS(b.dataset.thelp);s.help=!s.help;return refreshDyn()}
  if(b.dataset.topt){const id=b.dataset.topt,t=STEPS[S.step].tasks.find(x=>x.id===id);let v=b.dataset.val;if(v!==''&&!isNaN(+v))v=+v;tkS(id).v=v;
    if(!t.key.startsWith('_')){S[t.key]=v;if(t.key==='insMat')S.lam=INS_MAT[v].l}
    refreshDyn();if(taskOk(t))toast(V('okp'+id+v,['Fatto.','Bene.','Ok, avanti.']));return}
  if(b.dataset.set){const k=b.dataset.set;let v=b.dataset.val;if(v!==''&&!isNaN(+v))v=+v;S[k]=v;if(k==='roof'){S.roofW=null;S.roofL=null;delete S.bad.roofW;delete S.bad.roofL;delete S.bad.tilt}return render()}
});
window.addEventListener('error',e=>{console.error(e);toastOnce('Qualcosa non ha funzionato: ricarica la pagina, i tuoi dati sono salvati.')});
window.addEventListener('load',()=>{const h=location.hash.match(/^#fase-(\d+)$/);if(h)S.step=+h[1]-1;
  try{render()}catch(e){console.error(e);localStorage.removeItem(KEY);S=fresh();render()}
  history.replaceState({step:S.step},'','#fase-'+(S.step+1));
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{})});
