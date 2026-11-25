// ===================== GENERATORE WORD (.docx) CON IMPAGINAZIONI VARIABILI =====================
class Doc{
  constructor(name,L){this.name=name;this.L=L;this.b=[];this.nf=0}
  h1(t){this.b.push({k:'h',s:'Heading1',t});return this}
  h2(t){this.b.push({k:'h',s:'Heading2',t});return this}
  p(t,o={}){this.b.push({k:'p',t,o});return this}
  bul(items){items.forEach(t=>this.b.push({k:'p',t:this.L.bullet+' '+t,o:{style:'Elenco'}}));return this}
  num(items){items.forEach((t,i)=>this.b.push({k:'p',t:(i+1)+'. '+t,o:{style:'Elenco'}}));return this}
  cp(t){this.b.push({k:'cp',t});return this}
  fig(f,cap,o={}){if(!o.nocap)this.nf++;this.b.push({k:'img',f,cap:o.nocap?'':this.L.cap(this.nf,cap),o});return this}
  pair(f1,c1,f2,c2){if(!this.L.pairs){this.fig(f1,c1,{width:13});this.fig(f2,c2,{width:13});return this}
    this.nf++;const a=this.L.cap(this.nf,c1);this.nf++;const b=this.L.cap(this.nf,c2);this.b.push({k:'pair',f1,f2,c1:a,c2:b});return this}
  raw(bytes,w,h,width){this.b.push({k:'raw',bytes,w,h,width});return this}
  table(rows,o={}){this.b.push({k:'tbl',rows,o});return this}
  box(inner){this.b.push({k:'box',inner});return this}
  pb(){this.b.push({k:'pb'});return this}
}
function runs(t,extra=''){return String(t).split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(s=>{const b=s.startsWith('**');const x=b?s.slice(2,-2):s;return `<w:r><w:rPr>${b?'<w:b/>':''}${extra}</w:rPr><w:t xml:space="preserve">${xesc(x)}</w:t></w:r>`}).join('')}
function drawing(id,cx,cy){return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Immagine ${id}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="image${id}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rImg${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`}
async function buildDocx(doc,onProg){
  const L=doc.L,media=[],pageW=11906-2*L.margin;let body='',id=0;
  const sizeOf=(png,wcm)=>{let cx=Math.round(Math.min(wcm,pageW/567)*360000),cy=Math.round(cx*png.h/png.w);const mx=L.maxH*360000;if(cy>mx){cx=Math.round(cx*mx/cy);cy=mx}return [cx,cy]};
  const capP=t=>t?`<w:p><w:pPr><w:pStyle w:val="Didascalia"/>${L.capAbove?'<w:keepNext/>':''}</w:pPr>${runs(t)}</w:p>`:'';
  const B=c=>`<w:top w:val="single" w:sz="4" w:color="${c}"/><w:left w:val="single" w:sz="4" w:color="${c}"/><w:bottom w:val="single" w:sz="4" w:color="${c}"/><w:right w:val="single" w:sz="4" w:color="${c}"/><w:insideH w:val="single" w:sz="4" w:color="${c}"/><w:insideV w:val="single" w:sz="4" w:color="${c}"/>`;
  const NB='<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/>';
  const blocks=[];for(const bl of doc.b){if(bl.k==='cp'&&blocks.length&&blocks[blocks.length-1].k==='cpg')blocks[blocks.length-1].lines.push(bl.t);else if(bl.k==='cp')blocks.push({k:'cpg',lines:[bl.t]});else blocks.push(bl)}
  let nImg=blocks.filter(b=>b.k==='img'||b.k==='pair').length,done=0,alt=0;
  for(const bl of blocks){
    if(bl.k==='h')body+=`<w:p><w:pPr><w:pStyle w:val="${bl.s}"/></w:pPr>${runs(L.hUpper&&bl.s==='Heading1'?bl.t.toUpperCase():bl.t)}</w:p>`;
    else if(bl.k==='p')body+=`<w:p><w:pPr><w:pStyle w:val="${bl.o.style||'Normal'}"/>${bl.o.center?'<w:jc w:val="center"/>':''}</w:pPr>${runs(bl.t)}</w:p>`;
    else if(bl.k==='pb')body+='<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    else if(bl.k==='cpg'){
      if(L.calc==='box')body+=`<w:tbl><w:tblPr><w:tblW w:w="${Math.round(pageW*0.86)}" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders>${B(L.accent)}</w:tblBorders><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="160" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="${Math.round(pageW*0.86)}"/></w:tblGrid><w:tr><w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="${L.soft}"/></w:tcPr>${bl.lines.map(t=>`<w:p><w:pPr><w:pStyle w:val="Calcolo"/></w:pPr>${runs(t)}</w:p>`).join('')}</w:tc></w:tr></w:tbl><w:p><w:pPr><w:pStyle w:val="Vuoto"/></w:pPr></w:p>`;
      else body+=bl.lines.map(t=>`<w:p><w:pPr><w:pStyle w:val="Calcolo"/></w:pPr>${runs(t)}</w:p>`).join('');
    }
    else if(bl.k==='tbl'){
      const rows=bl.rows,nc=rows[0].length,tot=Math.round(pageW*(bl.o.w||1)),w=bl.o.widths||Array(nc).fill(1),ws=w.reduce((a,b)=>a+b,0),cw=w.map(x=>Math.round(x/ws*tot));
      body+=`<w:tbl><w:tblPr><w:tblW w:w="${tot}" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders>${bl.o.noBorder?NB:B('B8B2A2')}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${cw.map(x=>`<w:gridCol w:w="${x}"/>`).join('')}</w:tblGrid>`;
      rows.forEach((r,ri)=>{const hd=ri===0&&bl.o.header!==false;body+=`<w:tr><w:trPr><w:cantSplit/>${hd?'<w:tblHeader/>':''}</w:trPr>${r.map((c,ci)=>`<w:tc><w:tcPr><w:tcW w:w="${cw[ci]}" w:type="dxa"/>${hd?`<w:shd w:val="clear" w:color="auto" w:fill="${L.accent}"/>`:ri%2===0&&bl.o.zebra!==false?`<w:shd w:val="clear" w:color="auto" w:fill="${L.soft}"/>`:''}</w:tcPr><w:p><w:pPr><w:pStyle w:val="Cella"/><w:jc w:val="${ci===0||String(c).length>24?'left':'center'}"/></w:pPr>${runs(c,hd?'<w:b/><w:color w:val="FFFFFF"/>':'')}</w:p></w:tc>`).join('')}</w:tr>`});
      body+='</w:tbl><w:p><w:pPr><w:pStyle w:val="Vuoto"/></w:pPr></w:p>';
    }
    else if(bl.k==='img'||bl.k==='raw'){
      let png;if(bl.k==='raw')png={bytes:bl.bytes,w:bl.w,h:bl.h};else{done++;onProg&&onProg(`Disegno le figure… ${done} di ${nImg}`);png=await svgToPng(bl.f)}
      id++;media.push(png.bytes);const wcm=bl.k==='raw'?bl.width:(bl.o.width||L.figW)*L.figScale;const [cx,cy]=sizeOf(png,wcm);
      let jc='center';if(bl.k==='img'&&!bl.o.nocap&&L.figAlign==='alt'&&wcm<14){jc=alt++%2?'right':'left'}
      const pic=`<w:p><w:pPr><w:pStyle w:val="Figura"/><w:keepNext/><w:jc w:val="${jc}"/></w:pPr>${drawing(id,cx,cy)}</w:p>`;
      if(bl.k==='img'&&L.frame&&!bl.o.nocap){body+=`<w:tbl><w:tblPr><w:tblW w:w="${Math.round(cx/635)+300}" w:type="dxa"/><w:jc w:val="${jc}"/><w:tblBorders>${B(L.accent)}</w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="${Math.round(cx/635)+300}"/></w:tblGrid><w:tr><w:tc>${L.capAbove?capP(bl.cap):''}${pic}${L.capAbove?'':capP(bl.cap)}</w:tc></w:tr></w:tbl><w:p><w:pPr><w:pStyle w:val="Vuoto"/></w:pPr></w:p>`}
      else body+=(L.capAbove?capP(bl.cap):'')+pic+(L.capAbove?'':capP(bl.cap));
    }
    else if(bl.k==='pair'){
      const half=Math.round(pageW/2);let cells='';
      for(const [f,c] of [[bl.f1,bl.c1],[bl.f2,bl.c2]]){done++;onProg&&onProg(`Disegno le figure… ${done} di ${nImg}`);const png=await svgToPng(f);id++;media.push(png.bytes);const [cx,cy]=sizeOf(png,(half-200)/567);
        cells+=`<w:tc><w:tcPr><w:tcW w:w="${half}" w:type="dxa"/><w:vAlign w:val="top"/></w:tcPr>${L.capAbove?capP(c):''}<w:p><w:pPr><w:pStyle w:val="Figura"/><w:jc w:val="center"/></w:pPr>${drawing(id,cx,cy)}</w:p>${L.capAbove?'':capP(c)}</w:tc>`}
      body+=`<w:tbl><w:tblPr><w:tblW w:w="${pageW}" w:type="dxa"/><w:tblBorders>${NB}</w:tblBorders><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid><w:gridCol w:w="${half}"/><w:gridCol w:w="${half}"/></w:tblGrid><w:tr>${cells}</w:tr></w:tbl><w:p><w:pPr><w:pStyle w:val="Vuoto"/></w:pPr></w:p>`;
    }
  }
  const NS='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  const docXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}<w:sectPr><w:footerReference w:type="default" r:id="rFoot"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="${L.margin}" w:right="${L.margin}" w:bottom="${L.margin}" w:left="${L.margin}" w:header="567" w:footer="567" w:gutter="0"/><w:titlePg/></w:sectPr></w:body></w:document>`;
  const footer=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${NS}><w:p><w:pPr><w:pStyle w:val="PiePagina"/><w:jc w:val="${L.footAlign}"/></w:pPr>${L.footText?runs(L.footText+'   '):''}<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
  const F=L.font,st=(id,name,ppr,rpr,extra='')=>`<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/>${extra}<w:qFormat/><w:pPr>${ppr}</w:pPr><w:rPr>${rpr}</w:rPr></w:style>`;
  const hp={plain:['',`<w:color w:val="1D2433"/>`],bar:[`<w:shd w:val="clear" w:color="auto" w:fill="${L.accent}"/><w:ind w:left="0"/>`,'<w:color w:val="FFFFFF"/>'],under:[`<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="3" w:color="${L.accent}"/></w:pBdr>`,`<w:color w:val="${L.accent}"/>`],side:[`<w:pBdr><w:left w:val="single" w:sz="36" w:space="8" w:color="${L.accent}"/></w:pBdr><w:ind w:left="200"/>`,'<w:color w:val="1D2433"/>'],color:['',`<w:color w:val="${L.accent}"/>`]}[L.hStyle];
  const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${F}" w:hAnsi="${F}" w:eastAsia="${F}" w:cs="${F}"/><w:sz w:val="${L.size}"/><w:szCs w:val="${L.size}"/><w:lang w:val="it-IT"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="${L.after}" w:line="${L.line}" w:lineRule="auto"/><w:jc w:val="${L.justify?'both':'left'}"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
${st('Heading1','heading 1',`<w:keepNext/>${L.h1PageBreak?'<w:pageBreakBefore/>':''}<w:spacing w:before="${L.h1Before}" w:after="160"/><w:jc w:val="left"/>${hp[0]}<w:outlineLvl w:val="0"/>`,`<w:rFonts w:ascii="${L.hFont}" w:hAnsi="${L.hFont}"/><w:b/>${hp[1]}<w:sz w:val="${L.h1Size}"/>`)}
${st('Heading2','heading 2','<w:keepNext/><w:spacing w:before="200" w:after="80"/><w:jc w:val="left"/><w:outlineLvl w:val="1"/>',`<w:rFonts w:ascii="${L.hFont}" w:hAnsi="${L.hFont}"/><w:b/><w:color w:val="${L.h2Color}"/><w:sz w:val="${L.size+2}"/>`)}
${st('TitoloCop','Titolo copertina',`<w:jc w:val="center"/><w:spacing w:before="${L.coverTitleBefore}" w:after="320"/>${L.cover==='B'?`<w:shd w:val="clear" w:color="auto" w:fill="${L.accent}"/>`:''}`,`<w:rFonts w:ascii="${L.hFont}" w:hAnsi="${L.hFont}"/><w:b/><w:color w:val="${L.cover==='B'?'FFFFFF':'1D2433'}"/><w:sz w:val="${L.coverSize}"/>`)}
${st('TitoloSez','Titolo pagina','<w:keepNext/><w:jc w:val="center"/><w:spacing w:before="120" w:after="240"/>',`<w:rFonts w:ascii="${L.hFont}" w:hAnsi="${L.hFont}"/><w:b/><w:color w:val="1D2433"/><w:sz w:val="${L.size+4}"/>`)}
${st('Copertina','Dati copertina',`<w:jc w:val="${L.cover==='C'?'center':'left'}"/><w:spacing w:after="140"/>`,`<w:b/><w:color w:val="1D2433"/><w:sz w:val="${L.size+3}"/>`)}
${st('Spazio','Spazio',`<w:spacing w:before="${L.coverGap}" w:after="0"/>`,'')}
${st('Vuoto','Vuoto','<w:spacing w:before="0" w:after="80"/>','<w:sz w:val="12"/>')}
${st('Elenco','Elenco','<w:ind w:left="454" w:hanging="227"/><w:spacing w:after="60"/>','')}
${st('Calcolo','Calcolo',`<w:jc w:val="${L.calc==='mono'?'left':'center'}"/><w:spacing w:before="40" w:after="60"/>${L.calc==='mono'?'<w:ind w:left="567"/>':''}`,`${L.calc==='mono'?'<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>':''}<w:b/><w:color w:val="${L.calcColor}"/><w:sz w:val="${L.size+1}"/>`)}
${st('Figura','Figura','<w:keepNext/><w:spacing w:before="140" w:after="40"/>','')}
${st('Didascalia','caption',`<w:jc w:val="${L.capAlign}"/><w:spacing w:before="40" w:after="200"/>`,`${L.capItalic?'<w:i/>':''}${L.capBold?'<w:b/>':''}<w:color w:val="5F6878"/><w:sz w:val="${L.size-3}"/>`)}
${st('Cella','Cella','<w:spacing w:after="0" w:line="240" w:lineRule="auto"/>',`<w:sz w:val="${L.size-2}"/>`)}
${st('PiePagina','footer','<w:spacing w:after="0"/>','<w:color w:val="8A8F99"/><w:sz w:val="16"/>')}
</w:styles>`;
  const rels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rFoot" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>${media.map((m,i)=>`<Relationship Id="rImg${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${i+1}.png"/>`).join('')}</Relationships>`;
  return makeZip([
    {name:'[Content_Types].xml',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`},
    {name:'_rels/.rels',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`},
    {name:'docProps/core.xml',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xesc(doc.name)}</dc:title><dc:creator>${xesc((S.nome+' '+S.cognome).trim())}</dc:creator></cp:coreProperties>`},
    {name:'word/document.xml',data:docXml},{name:'word/styles.xml',data:styles},{name:'word/footer1.xml',data:footer},{name:'word/_rels/document.xml.rels',data:rels},
    ...media.map((m,i)=>({name:`word/media/image${i+1}.png`,data:m}))
  ],'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}
