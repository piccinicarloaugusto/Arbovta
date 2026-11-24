const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.dismiss());
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(600);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const out={};
 go('impostazioni',document.querySelectorAll('.nav-tab')[5]);
 out.buttons=['Scarica foto da Firebase','Invia foto mancanti a Firebase','Invia clienti e progetti a Firebase'].map(x=>document.getElementById('content').innerHTML.includes(x));
 const mkImg=(w)=>{const c=document.createElement('canvas');c.width=w;c.height=w;const x=c.getContext('2d');for(let i=0;i<300;i++){x.fillStyle='hsl('+(i*7%360)+',70%,50%)';x.fillRect(Math.random()*w,Math.random()*w,40,40);}return c.toDataURL('image/jpeg',0.95);};
 const cloudPh=new Map(), cloudTrees=new Map(); let saves=0;
 window._fb={
  saveTree:async t=>{cloudTrees.set(String(t.id),1);return true;},
  savePhoto:async(id,p)=>{saves++; if(p.dataUrl.length>1000000) return false; cloudPh.set(id+'__'+p.pid,{...p,treeId:id});return true;},
  listPhotoIds:async id=>(window.__deny?(window._fbLastErr='permission-denied',null):[...cloudPh.values()].filter(x=>x.treeId===id).map(x=>x.pid)),
  loadPhotos:async id=>[...cloudPh.values()].filter(x=>x.treeId===id),
  deletePhoto:async()=>{}, saveProjects:async()=>true, loadProjects:async()=>null
 };
 // dispositivo A: 3 rilievi con foto (una grande), una già in cloud
 G.trees=[1,2,3].map(i=>({id:'P'+i,photos:[{pid:'a'+i,type:'tronco',date:'2026-11-0'+i,dataUrl:mkImg(i===3?3000:300)},{pid:'b'+i,type:'chioma',date:'2026-11-0'+i,dataUrl:mkImg(300)}]}));
 out.bigLen=G.trees[2].photos[0].dataUrl.length;
 cloudPh.set('P1__a1',{treeId:'P1',pid:'a1'});
 lsSaveTrees(); await new Promise(r=>setTimeout(r,400));
 document.body.insertAdjacentHTML('beforeend','<div id="st"></div>'); const st=document.getElementById('fb-sync-status')||document.getElementById('st');
 await uploadMissingPhotos(st); out.up=st.textContent; out.cloudCount=cloudPh.size;
 // dispositivo B: nessuna immagine locale, solo metadati
 for(const t of G.trees){ await photoDBop('readwrite',s=>s.delete(String(t.id))); t.photos=t.photos.map(p=>({pid:p.pid,type:p.type,date:p.date})); }
 await downloadAllPhotos(st); out.down=st.textContent;
 out.hasData=G.trees.map(t=>hasPhotoData(t.photos));
 return out;}),null,1),errs);await b.close();})();
