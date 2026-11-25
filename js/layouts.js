// ===================== IMPAGINAZIONE DELLA RELAZIONE =====================
// Un punto per pagina; font, colori, titoli, riquadri e didascalie cambiano da alunno ad alunno.
// Coppie di font professionali presenti in Word, con la dimensione giusta per ciascuno (mezzi punti).
const FONTS=[['Helvetica','Helvetica',22],['Arial','Arial',22],['Calibri','Calibri',23],['Calibri','Cambria',23],['Cambria','Calibri',22],['Georgia','Helvetica',21],['Garamond','Garamond',24],['Segoe UI','Segoe UI',21],['Verdana','Verdana',20],['Book Antiqua','Arial',22],['Palatino Linotype','Helvetica',22],['Trebuchet MS','Trebuchet MS',21],['Franklin Gothic Book','Franklin Gothic Demi',22],['Century Gothic','Century Gothic',20],['Constantia','Corbel',22]];
const CAPS=[(n,t)=>`Figura ${n} – ${t}`,(n,t)=>`Fig. ${n}: ${t}`,(n,t)=>`Figura ${n}. ${t}`,(n,t)=>`Immagine ${n} – ${t}`,(n,t)=>`Fig. ${n} – ${t}`];
function makeLayout(){
  const R=rngFrom(hashStr(seedStr()+'#layout')),pk=a=>a[Math.floor(R()*a.length)];
  const accent=pk(['13294B','1F3A5F','2A3D66','1E4D6B','3B2F5C','244A3A','5A2A27','23395D','2F4858','1D3557']);
  const [font,hFont,size]=pk(FONTS);
  return {font,hFont,size,hStyle:pk(['under','bar','side','plain','color']),accent,soft:pk(['EEF2F8','F1F5F9','F3F6FB','F4F2EE','EEF5F1','F5F1F8']),
    h1Size:pk([25,26,27,28]),h1Before:0,h2Color:pk(['1D2433',accent]),hUpper:true,h1PageBreak:true,
    line:pk([264,270,276,288]),after:pk([100,120,140]),justify:R()<.75,margin:pk([1077,1134,1191,1247]),
    figW:15,figScale:pk([.94,1,1,1.04]),maxH:15.5,figAlign:'center',frame:R()<.25,
    cap:pk(CAPS),capAbove:R()<.2,capItalic:R()<.65,capBold:R()<.25,capAlign:pk(['center','center','left']),
    calc:pk(['box','box','center']),calcColor:pk(['13294B','1D2433',accent]),pairs:false,
    cover:'A',coverSize:pk([28,30,32]),coverTitleBefore:pk([240,360,480]),coverGap:600,coverFig:pk([14.5,15,15.5]),
    bullet:pk(['•','–','›','·']),footAlign:pk(['center','right','left']),
    footText:pk(['Progetto impianto a pannelli solari per un servizio combinato','Impianto solare termico combinato','Progetto impianto solare – servizio combinato','Relazione tecnica – impianto a pannelli solari'])};
}
function layoutName(L){return `${L.font}${L.hFont!==L.font?' + '+L.hFont:''}, titoli ${{plain:'semplici',bar:'su fascia colorata',under:'sottolineati',side:'con barra laterale',color:'colorati'}[L.hStyle]}, calcoli ${L.calc==='box'?'in riquadro':'centrati'}`}
