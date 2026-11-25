// ===================== DATI TECNICI =====================

// Caleffi Idraulica 29, pag. 19 - impianti combinati, m² ogni 10 m² di superficie abitata
const ZONE = {
  Nord:{small:[0.70,0.90],big:[0.60,0.75]},
  Centro:{small:[0.60,0.75],big:[0.50,0.60]},
  Sud:{small:[0.50,0.65],big:[0.40,0.50]}
};
// Riello RPS 25/4 (scheda 05/2018)
const PANEL = {n:'Riello RPS 25/4',Alorda:2.301,Aap:2.152,Aass:2.14,lungh:2.004,larg:1.195,sp:0.085,peso:44,vol:1.6,
  eta0:0.802,a1:4.28,a2:0.0064,tstag:197,maxV:10,maxO:6,pV:1.20,pO:2.10};
// Tab. 7A - perdite di carico continue, tubi in acciaio, acqua 50°C (G in l/h)
const PIPE_R = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,35,40,45,50,60,70,80,90,100,150,200];
const PIPES = [
 {de:30,di:25.4,g:[303,439,545,636,717,790,858,921,981,1038,1092,1144,1195,1243,1290,1400,1504,1602,1695,1868,2029,2179,2320,2455,3049,3556]},
 {de:33.7,di:29.1,g:[436,632,785,916,1032,1137,1235,1326,1413,1494,1573,1648,1720,1789,1856,2016,2165,2306,2439,2689,2920,3136,3340,3534,4390,5120]},
 {de:38,di:32.8,g:[601,871,1082,1262,1422,1567,1702,1828,1947,2059,2167,2270,2370,2465,2558,2778,2984,3177,3362,3706,4024,4322,4603,4870,6049,7055]},
 {de:42.4,di:37.2,g:[842,1220,1516,1768,1992,2196,2384,2561,2727,2885,3036,3181,3320,3454,3584,3892,4180,4452,4710,5192,5638,6056,6450,6823,8475,9885]},
 {de:44.5,di:39.3,g:[976,1414,1756,2048,2307,2544,2762,2967,3160,3343,3518,3685,3846,4002,4152,4509,4843,5158,5457,6015,6532,7016,7472,7905,9819,11452]},
 {de:48.3,di:43.1,g:[1250,1810,2248,2622,2955,3257,3537,3799,4046,4281,4504,4719,4925,5124,5317,5774,6201,6605,6987,7703,8365,8984,9568,10122,12573,14664]},
 {de:54,di:48.8,g:[1743,2525,3136,3658,4121,4543,4934,5299,5644,5971,6283,6582,6870,7148,7416,8054,8650,9212,9746,10744,11667,12531,13346,14119,17538,20454]},
 {de:57,di:51.2,g:[1982,2871,3567,4160,4687,5167,5611,6026,6418,6790,7145,7486,7813,8129,8434,9159,9837,10477,11084,12219,13269,14251,15177,16057,19945,23262]},
 {de:60.3,di:54.5,g:[2343,3395,4216,4918,5541,6108,6633,7124,7587,8027,8447,8849,9236,9610,9971,10828,11629,12385,13103,14445,15686,16847,17942,18982,23578,27499]},
 {de:70,di:64.2,g:[3634,5265,6539,7627,8594,9474,10288,11049,11767,12450,13101,13724,14325,14904,15464,16793,18036,19208,20321,22403,24328,26128,27827,29440,36568,42649]},
 {de:76.1,di:70.3,g:[4635,6714,8340,9727,10959,12082,13120,14091,15007,15887,16707,17503,18268,19007,19721,21416,23001,24496,25916,28570,31025,33321,35488,37545,46635,54391]},
 {de:88.9,di:82.5,g:[7115,10308,12804,14933,16826,18549,20143,21634,23041,24376,25651,26872,28048,29181,30278,32880,35314,37609,39789,43864,47633,51159,54485,57642,71599,null]}
];
// DPR 412/93 All. B - spessori minimi isolante (mm)
const INS_L = [0.030,0.032,0.034,0.036,0.038,0.040,0.042,0.044,0.046,0.048,0.050];
const INS_C = ['< 20','20–39','40–59','60–79','80–99','≥ 100'];
const INS_T = [[13,19,26,33,37,40],[14,21,29,36,40,44],[15,23,31,39,44,48],[17,25,34,43,47,52],[18,28,37,46,51,56],[20,30,40,50,55,60],[22,32,43,54,59,64],[24,35,46,58,63,69],[26,38,50,62,68,74],[28,41,54,66,72,79],[30,44,58,71,77,84]];
const INS_MAT = {
  nbr:{n:'Gomma nitrilica (NBR)',l:0.035,tmax:105,d:'Scelta della traccia. Ottima flessibilità, ma regge ~105 °C: va bene sui tratti interni lontani dai collettori.'},
  epdm:{n:'EPDM alta temperatura',l:0.040,tmax:175,d:'Specifico per il solare: resiste a 150–175 °C, adatto vicino ai collettori dove si arriva in stagnazione.'},
  lana:{n:'Lana di roccia + lamierino',l:0.040,tmax:250,d:'Resiste a temperature altissime, richiede rivestimento rigido (alluminio) per esterno.'},
  pu:{n:'Poliuretano espanso',l:0.030,tmax:110,d:'Molto isolante, ma limite termico basso per il circuito solare.'}
};
const INS_POS = {
  est:{n:'All’esterno (tetto, sottotetto freddo)',k:1,d:'Spessore pieno + protezione da UV, acqua e animali (lamiera zincata o alluminio).'},
  loc:{n:'In locali non riscaldati',k:1,d:'Spessore pieno della tabella.'},
  mont:{n:'Montanti verticali entro l’isolamento dell’edificio',k:0.5,d:'Spessore × 0,5 (nota tabella DPR 412).'},
  corr:{n:'Correnti in strutture interne non affacciate all’esterno',k:0.3,d:'Spessore × 0,3 (nota tabella DPR 412).'}
};
const INS_COMM = [6,9,13,19,25,32,40,50,60,70,80];
const GLYCOL = [{p:30,t:-13,rho:1.029},{p:40,t:-21,rho:1.037},{p:50,t:-32,rho:1.045}];
const TANKS = [200,300,400,500,600,750,800,1000,1250,1500,2000];
const VASI = [8,12,18,24,25,35,50,80,100];

function rFromG(p,G){
  const g=p.g; if(G<=g[0]) return PIPE_R[0]*(G/g[0])**1.8; // estrapolazione ~G^1.8
  for(let i=1;i<g.length;i++){ if(g[i]==null) return null; if(G<=g[i]){const t=(G-g[i-1])/(g[i]-g[i-1]);return lerp(PIPE_R[i-1],PIPE_R[i],t)} }
  return null;
}
function vel(G,di){return G/3.6e6/(Math.PI*(di/1000)**2/4)}
function insCol(de){return de<20?0:de<40?1:de<60?2:de<80?3:de<100?4:5}
function insThick(lam,de){
  const c=insCol(de); lam=clamp(lam,0.030,0.050);
  let i=INS_L.findIndex(v=>v>=lam-1e-9); if(i<0) i=INS_L.length-1; if(Math.abs(INS_L[i]-lam)<1e-6||i===0) return {s:INS_T[i][c],i0:i,i1:i,c};
  const t=(lam-INS_L[i-1])/(INS_L[i]-INS_L[i-1]);
  if(t<1e-6) return {s:INS_T[i-1][c],i0:i-1,i1:i-1,c};
  return {s:lerp(INS_T[i-1][c],INS_T[i][c],t),i0:i-1,i1:i,c,t};
}
function orientLoss(az){const a=Math.abs(az);if(a<=15)return a/15*0.5;if(a<=30)return lerp(0.5,2.5,(a-15)/15);if(a<=45)return lerp(2.5,3.5,(a-30)/15);return lerp(3.5,12,(a-45)/45)}
function collLoss(G){return 20*(G/500)**2} // mbar, approssimazione curva Riello

const TAB9_DE=[30,33.7,38,42.4,44.5,48.3,54,57,60.3,70,76.1,88.9,101.6,108,114.3,133,139.7,159,168.3,193.7,219.1,244.5,273,323.9],TAB9_S=[25,30,40,50,60,70,80];
function rowFactor(a){if(a<=30)return 2.6;if(a<=45)return lerp(2.6,3.2,(a-30)/15);return lerp(3.2,3.5,Math.min(1,(a-45)/15))}

// ===================== DATI GENERALI DEL PROGETTO =====================
// zona per la tabella Caleffi, latitudine indicativa; province con T esterna di progetto indicativa (UNI 5364, da verificare sul manuale)
const REGIONI={
 "Piemonte":{z:'Nord',lat:45.0,p:{"Torino":-8,"Vercelli":-7,"Novara":-5,"Cuneo":-10,"Asti":-8,"Alessandria":-8,"Biella":-7,"Verbano-Cusio-Ossola":-5}},
 "Valle d'Aosta":{z:'Nord',lat:45.7,p:{"Aosta":-10}},
 "Lombardia":{z:'Nord',lat:45.6,p:{"Milano":-5,"Bergamo":-5,"Brescia":-7,"Como":-5,"Cremona":-5,"Lecco":-5,"Lodi":-5,"Mantova":-5,"Monza e Brianza":-5,"Pavia":-5,"Sondrio":-10,"Varese":-5}},
 "Trentino-Alto Adige":{z:'Nord',lat:46.3,p:{"Trento":-12,"Bolzano":-15}},
 "Veneto":{z:'Nord',lat:45.5,p:{"Venezia":-5,"Verona":-5,"Padova":-5,"Vicenza":-5,"Treviso":-5,"Rovigo":-5,"Belluno":-10}},
 "Friuli-Venezia Giulia":{z:'Nord',lat:46.0,p:{"Trieste":-5,"Udine":-5,"Gorizia":-5,"Pordenone":-5}},
 "Liguria":{z:'Nord',lat:44.4,p:{"Genova":0,"La Spezia":0,"Savona":0,"Imperia":0}},
 "Emilia-Romagna":{z:'Nord',lat:44.5,p:{"Bologna":-5,"Ferrara":-5,"Forlì-Cesena":-5,"Modena":-5,"Parma":-5,"Piacenza":-5,"Ravenna":-5,"Reggio Emilia":-5,"Rimini":-5}},
 "Toscana":{z:'Centro',lat:43.4,p:{"Firenze":0,"Arezzo":0,"Grosseto":0,"Livorno":0,"Lucca":0,"Massa-Carrara":0,"Pisa":0,"Pistoia":0,"Prato":0,"Siena":-2}},
 "Umbria":{z:'Centro',lat:42.9,p:{"Perugia":-2,"Terni":-2}},
 "Marche":{z:'Centro',lat:43.3,p:{"Ancona":-2,"Ascoli Piceno":-2,"Fermo":-2,"Macerata":-2,"Pesaro e Urbino":-2}},
 "Lazio":{z:'Centro',lat:41.9,p:{"Roma":0,"Frosinone":0,"Latina":2,"Rieti":-3,"Viterbo":-2}},
 "Abruzzo":{z:'Centro',lat:42.3,p:{"L'Aquila":-5,"Chieti":0,"Pescara":2,"Teramo":0}},
 "Molise":{z:'Centro',lat:41.6,p:{"Campobasso":-4,"Isernia":-4}},
 "Campania":{z:'Sud',lat:40.9,p:{"Napoli":2,"Avellino":-2,"Benevento":-2,"Caserta":0,"Salerno":2}},
 "Puglia":{z:'Sud',lat:41.0,p:{"Bari":0,"Barletta-Andria-Trani":0,"Brindisi":0,"Foggia":0,"Lecce":0,"Taranto":0}},
 "Basilicata":{z:'Sud',lat:40.6,p:{"Potenza":-3,"Matera":-2}},
 "Calabria":{z:'Sud',lat:38.9,p:{"Catanzaro":-2,"Cosenza":-3,"Crotone":0,"Reggio Calabria":3,"Vibo Valentia":0}},
 "Sicilia":{z:'Sud',lat:37.5,p:{"Palermo":5,"Agrigento":3,"Caltanissetta":0,"Catania":5,"Enna":-3,"Messina":5,"Ragusa":0,"Siracusa":5,"Trapani":5}},
 "Sardegna":{z:'Sud',lat:39.6,p:{"Cagliari":3,"Nuoro":0,"Oristano":3,"Sassari":2,"Sud Sardegna":3}}
};
const EDIFICI={villetta:'villetta unifamiliare',schiera:'villetta a schiera',bifam:'casa bifamiliare',palazzina:'piccola palazzina',agri:'casa rurale'};
// pannelli: Riello RPS 25/4 dalla scheda tecnica (05/2018); Gp/Hp come letti nell'esercizio di classe
const PANNELLI={
 rps254:{n:'Riello RPS 25/4',tipo:'piano vetrato',Al:2.301,Aa:2.152,Ar:2.3,lung:2004,larg:1195,sp:85,vol:1.6,peso:44,Gp:92,Hp:20,maxV:10,maxO:6,tstag:197,eta0:0.802,a1:4.28,a2:0.0064},
 custom:{n:'Pannello dalla scheda tecnica',tipo:'piano vetrato',Al:2.0,Aa:1.9,Ar:2.0,lung:2000,larg:1000,sp:90,vol:1.5,peso:40,Gp:80,Hp:20,maxV:8,maxO:5,tstag:190,eta0:0.78,a1:3.9,a2:0.012}
};
// glicole: % in volume -> T di congelamento (valori indicativi); fattore di maggiorazione delle perdite di carico nei tubi d'acciaio
const GLICOLE={
 etilico:{n:'glicole etilico',pts:[[10,-4],[20,-8],[25,-11],[30,-15],[35,-20],[40,-24],[50,-36]],fm:{10:1.04,20:1.08,25:1.10,30:1.12,35:1.15,40:1.18,50:1.25},tox:true},
 propilenico:{n:'glicole propilenico',pts:[[10,-3],[20,-7],[25,-10],[30,-13],[35,-17],[40,-21],[50,-32]],fm:{10:1.05,20:1.10,25:1.13,30:1.16,35:1.20,40:1.24,50:1.33},tox:false}
};
const SERBATOI_COMM=[150,200,300,400,500,600,750,800,1000,1250,1500,2000];
const VASI_COMM=[8,12,18,24,25,35,50,80,100,150];
const DIR_AZ={'Sud':0,'Sud-Sud-Ovest':22,'Sud-Ovest':45,'Ovest':90,'Sud-Sud-Est':-22,'Sud-Est':-45,'Est':-90};

// ===================== SEME E VARIANTI =====================
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^h>>>16)>>>0}
function rngFrom(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function seedStr(){return `${(S.nome||'').trim().toLowerCase()}|${(S.cognome||'').trim().toLowerCase()}|${S.variant||0}`}
// sceglie in modo stabile una delle varianti di testo per una chiave
function V(key,arr){return arr[hashStr(seedStr()+'#'+key)%arr.length]}
let TH=null;
function makeTheme(){
  const R=rngFrom(hashStr(seedStr())),pk=a=>a[Math.floor(R()*a.length)];
  const skies=[['#9fd0ff','#e9f5ff','mattino'],['#7fb8f0','#dff0ff','mezzogiorno'],['#ffcf9e','#fff1dd','pomeriggio'],['#a8c8f0','#f7efe2','primavera'],['#8ec5e8','#f2f8ff','estate']];
  const t={
    sky:pk(skies),roof:pk(['#b5523b','#9c4130','#6b7380','#a65a3a','#7c3a2c','#8a4b38']),wall:pk(['#f4ead7','#f8f3ea','#efdcbf','#f2ddd2','#e6eef0','#f1e6c8']),
    wall2:null,grass:pk(['#8fbf5a','#7aae4f','#a2c66f','#94b866']),accent:pk(['#2a5aa0','#1f7a6d','#5b4a9e','#b4521f','#0e7490','#9d2f5e']),
    frame:pk(['#c7ccd4','#2b2f36','#9aa3ad']),hot:pk(['#e0482f','#e4572e','#d9412b']),cold:pk(['#2f7fd8','#2b6cb0','#1c7ed6']),
    sunX:0.08+R()*0.2,clouds:Math.floor(R()*4),trees:1+Math.floor(R()*3),treeSeed:R(),chimney:R()<.5?'left':'right',garage:R()<.4,fence:R()<.5,
    windows:2+Math.floor(R()*2),door:R()<.5,label:pk(['pill','box','tag']),grid:pk(['grid','dots','plain']),tankCol:pk([['#e94b35','#f4a259','#3a86ff'],['#d62828','#f77f00','#277da1'],['#e63946','#ffb703','#219ebc']]),
    hand:R()<.5, view:Math.floor(R()*3)
  };
  t.wall2=shade(t.wall,-0.12);t.roof2=shade(t.roof,-0.18);t.accent2=shade(t.accent,0.35);
  return t;
}
function shade(hex,p){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=x=>Math.round(clamp(p<0?x*(1+p):x+(255-x)*p,0,255));return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1)}
