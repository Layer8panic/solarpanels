// ===================== STILI DI IMPAGINAZIONE DELLA RELAZIONE =====================
// Ogni alunno/versione riceve una combinazione diversa ma sempre ordinata e leggibile.
const FONTS=[['Calibri','Calibri'],['Arial','Arial'],['Cambria','Cambria'],['Georgia','Georgia'],['Verdana','Verdana'],['Times New Roman','Times New Roman'],['Calibri','Cambria'],['Arial','Georgia']];
const CAPS=[(n,t)=>`Figura ${n}: ${t}`,(n,t)=>`Fig. ${n} - ${t}`,(n,t)=>`Immagine ${n}. ${t}`,(n,t)=>`${t} (fig. ${n})`,(n,t)=>`Figura ${n} - ${t}`];
function makeLayout(){
  const R=rngFrom(hashStr(seedStr()+'#layout')),pk=a=>a[Math.floor(R()*a.length)];
  const [font,hFont]=pk(FONTS),hStyle=pk(['plain','bar','under','side','color']),accent=TH.accent.replace('#','').toUpperCase();
  const size=font==='Verdana'?20:font==='Times New Roman'?24:pk([21,22,22,23]);
  return {font,hFont,size,hStyle,accent,soft:shade(TH.accent,.9).replace('#','').toUpperCase(),
    h1Size:size+pk([4,5,6]),h1Before:pk([360,420,480]),h2Color:pk(['1D2433',accent]),hUpper:true,
    line:pk([264,276,288]),after:pk([100,120,140]),justify:R()<.7,margin:pk([1134,1134,1247,1361,1021]),
    figW:pk([15.5,14.5,13.5,16]),figScale:1,maxH:pk([18,19,20]),figAlign:pk(['center','center','alt']),frame:(R(),false),
    cap:pk(CAPS),capAbove:R()<.25,capItalic:R()<.6,capBold:R()<.3,capAlign:pk(['center','center','left']),
    calc:pk(['center','box','mono','center']),calcColor:pk(['16325C','1D2433',accent]),pairs:R()<.6,
    cover:pk(['A','A','B','C']),coverSize:pk([28,30,32]),coverTitleBefore:pk([240,360,480]),coverGap:pk([600,900,1200]),coverFig:pk([15.5,16,14.5]),
    bullet:pk(['•','–','▪','►']),footAlign:pk(['right','center','left']),footText:pk(['','Progetto impianto solare combinato','Impianto a pannelli solari'])};
}
function layoutName(L){return `${L.font}, titoli ${{plain:'semplici',bar:'su fascia colorata',under:'sottolineati',side:'con barra laterale',color:'colorati'}[L.hStyle]}, calcoli ${{center:'centrati',box:'in riquadro',mono:'in colonna'}[L.calc]}, copertina ${L.cover}`}
