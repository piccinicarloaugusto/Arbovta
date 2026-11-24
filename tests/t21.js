const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true});const pg=await ctx.newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.accept());
await pg.route('**/*',r=>{const u=r.request().url();
 if(u.startsWith('file:'))return r.continue();
 if(u.includes('jspdf.umd'))return r.fulfill({path:'node_modules/jspdf/dist/jspdf.umd.min.js',contentType:'text/javascript'});
 r.abort();});
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
await pg.evaluate(()=>{
 window.fetch=async(u)=>{window.__url=String(u);const c=document.createElement('canvas');c.width=2400;c.height=1600;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,2400,1600);g.addColorStop(0,'#3a5a2a');g.addColorStop(1,'#8aa070');x.fillStyle=g;x.fillRect(0,0,2400,1600);
  const bl=await new Promise(r=>c.toBlob(r,'image/png'));return {ok:true,blob:async()=>bl,status:200};};
 const mk=(id,dlat,dlng,cpc)=>({id,specie:'Pinus pinea',cpc,lat:44.0320+dlat,lng:10.0688+dlng,h:20,dbh:50,photos:[],vta:{}});
 G.trees=[mk('CLQ12',0,0,'C'),mk('CLQ13',.00001,.00001,'B'),mk('CLQ14',.000015,.00002,'A'),mk('CLQ26',.0001,.0004,'B'),mk('CLQ34',-.0001,.0006,'A'),mk('CLQ99',0,0,'D')];
 G.trees[5].lat=0;G.trees[5].lng=0;
 G_projects=[{id:'c1',nome:'Camping La Quiete',progetti:[{id:'p1',nome:'censimento',rilievi:['CLQ12','CLQ13','CLQ14','CLQ26','CLQ34','CLQ99']}]}];
 render('mappa');
});
await pg.waitForTimeout(500);
const info=await pg.evaluate(()=>({n:document.getElementById('map-sel-n').textContent,cbs:document.querySelectorAll('.map-cb').length,dis:document.querySelectorAll('.map-cb:disabled').length}));
console.log(info);
// deselect CLQ34, export PDF
await pg.evaluate(()=>{document.querySelector('.map-cb[data-id="CLQ34"]').click();});
const [dl]=await Promise.all([pg.waitForEvent('download'),pg.evaluate(()=>exportMapPDF())]);
await dl.saveAs('/tmp/claude-0/-home-claude/f9cba818-0b62-5027-9a2b-d220f5afa252/scratchpad/mp/out.pdf');
console.log(await pg.evaluate(()=>({url:window.__url.replace(/access_token=.*/,''),st:document.getElementById('map-export-status').textContent})));
// close cluster only (3 trees)
await pg.evaluate(()=>{mapSelAll(false);['CLQ12','CLQ13','CLQ14'].forEach(i=>document.querySelector('.map-cb[data-id="'+i+'"]').click());});
const [d2]=await Promise.all([pg.waitForEvent('download'),pg.evaluate(()=>exportMapPDF())]);
await d2.saveAs('/tmp/claude-0/-home-claude/f9cba818-0b62-5027-9a2b-d220f5afa252/scratchpad/mp/out2.pdf');
console.log(await pg.evaluate(()=>window.__url.replace(/access_token=.*/,'')),errs);
await b.close();})();
