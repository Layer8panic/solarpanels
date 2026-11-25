// ===================== IMPAGINAZIONE DELLA RELAZIONE =====================
// Un solo stile, ordinato e uguale al modello: Helvetica, ogni punto inizia su una pagina nuova.
function makeLayout(){
  const accent='13294B';
  return {font:'Helvetica',hFont:'Helvetica',size:22,hStyle:'under',accent,soft:'EEF2F8',
    h1Size:26,h1Before:0,h2Color:'13294B',hUpper:true,h1PageBreak:true,
    line:276,after:120,justify:true,margin:1134,
    figW:15,figScale:1,maxH:15.5,figAlign:'center',frame:false,
    cap:(n,t)=>`Figura ${n} – ${t}`,capAbove:false,capItalic:true,capBold:false,capAlign:'center',
    calc:'box',calcColor:'13294B',pairs:false,
    cover:'A',coverSize:30,coverTitleBefore:360,coverGap:600,coverFig:15.5,
    bullet:'•',footAlign:'center',footText:'Progetto impianto a pannelli solari per un servizio combinato'};
}
function layoutName(){return 'Helvetica, un punto per pagina'}
