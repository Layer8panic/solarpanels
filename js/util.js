// ===================== UTILITÀ =====================
const $=s=>document.querySelector(s);
const ICP={lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',shuffle:'<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',bulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',pencil:'<path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2 2.5 21.5l5.3-1.3z"/>',play:'<path d="M6 3l14 9-14 9z" fill="currentColor"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',skip:'<path d="M5 4l10 8-10 8z" fill="currentColor"/><path d="M19 5v14"/>',undo:'<path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8"/><path d="M3 3v5h5"/>'};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICP[n]}</svg>`;
const fmt=(x,d=2)=>x==null||isNaN(x)?'-':Number(x).toLocaleString('it-IT',{minimumFractionDigits:d,maximumFractionDigits:d});
const f0=x=>fmt(x,0),f1=x=>fmt(x,1),f2=x=>fmt(x,2),f3=x=>fmt(x,3);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const rad=d=>d*Math.PI/180, deg=r=>r*180/Math.PI;
const xesc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const strip=s=>String(s).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ');
function tcol(T){const t=clamp((T-10)/80,0,1),a=[47,127,216],b=[240,180,60],c=[224,60,40];
  const m=t<.5?a.map((v,i)=>lerp(v,b[i],t*2)):b.map((v,i)=>lerp(v,c[i],(t-.5)*2));return `rgb(${m.map(Math.round).join(',')})`}

// ===================== ZIP (store) =====================
const CRCT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(u){let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRCT[(c^u[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
function makeZip(files,mime){
  const enc=new TextEncoder(),parts=[],cd=[];let off=0;
  for(const f of files){
    const name=enc.encode(f.name),data=typeof f.data==='string'?enc.encode(f.data):f.data,crc=crc32(data);
    const lh=new DataView(new ArrayBuffer(30));
    lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(8,0,true);lh.setUint16(10,0,true);lh.setUint16(12,0x21,true);
    lh.setUint32(14,crc,true);lh.setUint32(18,data.length,true);lh.setUint32(22,data.length,true);lh.setUint16(26,name.length,true);lh.setUint16(28,0,true);
    parts.push(new Uint8Array(lh.buffer),name,data);
    const ch=new DataView(new ArrayBuffer(46));
    ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(10,0,true);ch.setUint16(12,0,true);ch.setUint16(14,0x21,true);
    ch.setUint32(16,crc,true);ch.setUint32(20,data.length,true);ch.setUint32(24,data.length,true);ch.setUint16(28,name.length,true);ch.setUint32(38,0,true);ch.setUint32(42,off,true);
    cd.push(new Uint8Array(ch.buffer),name);off+=30+name.length+data.length;
  }
  const cds=cd.reduce((a,b)=>a+b.length,0),end=new DataView(new ArrayBuffer(22));
  end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cds,true);end.setUint32(16,off,true);
  return new Blob([...parts,...cd,new Uint8Array(end.buffer)],{type:mime});
}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000)}

// ===================== SVG -> PNG =====================
function svgToPng(fig,scale=2){
  return new Promise((res,rej)=>{
    const img=new Image();
    img.onload=()=>{const c=document.createElement('canvas');c.width=fig.w*scale;c.height=fig.h*scale;const x=c.getContext('2d');
      x.fillStyle='#ffffff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);
      c.toBlob(b=>b.arrayBuffer().then(ab=>res({bytes:new Uint8Array(ab),w:fig.w,h:fig.h})),'image/png')};
    img.onerror=e=>rej(e);
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(fig.svg);
  });
}

