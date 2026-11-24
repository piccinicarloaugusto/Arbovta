const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.accept());
await pg.route('**/*',r=>{const u=r.request().url();
 if(u.startsWith('file:'))return r.continue();
 if(u.includes('leaflet.js'))return r.fulfill({path:'node_modules/leaflet/dist/leaflet.js',contentType:'text/javascript'});
 if(u.includes('leaflet.css'))return r.fulfill({path:'node_modules/leaflet/dist/leaflet.css',contentType:'text/css'});
 r.abort();});
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(600);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const o={};
 const cloudTrees=new Map(), cloudDel={}; 
 window._fb={deleteTree:async id=>{cloudTrees.delete(String(id));},saveTree:async t=>{cloudTrees.set(String(t.id),JSON.parse(JSON.stringify(t)));markSynced(t);return true;},
  loadDeleted:async()=>JSON.parse(JSON.stringify(cloudDel)),saveDeleted:async d=>{Object.assign(cloudDel,d);return true;},
  loadProjects:async()=>null,saveProjects:async()=>true,listenAll:()=>()=>{}};
 window._fbReady=true;
 const mk=(id,sa)=>({id,specie:'Pinus',cpc:'B',lat:44.03+Math.random()*0.001,lng:10.07,_savedAt:sa,photos:[]});
 G.trees=[mk('T1','2026-11-01T00:00:00Z'),mk('T2','2026-11-01T00:00:00Z'),mk('T3','2026-11-01T00:00:00Z')];
 G_projects=[{id:'c',nome:'C',progetti:[{id:'p',nome:'P',rilievi:['T1','T2','T3']}]}];
 G_nav={view:'rilievi',clienteId:'c',progettoId:'p'};
 render('lista');
 o.archiveBtn=document.querySelectorAll('#content button[title="Elimina rilievo"]').length;
 // elimina T2 dall'archivio
 deleteTree('T2'); await new Promise(r=>setTimeout(r,300));
 o.afterArchiveDelete=G.trees.map(t=>t.id).join(','); o.inProject=G_projects[0].progetti[0].rilievi.join(','); o.tombCloud=Object.keys(cloudDel).join(',');
 // elimina T3 dalla mappa
 go('mappa',document.querySelectorAll('.nav-tab')[4]); await new Promise(r=>setTimeout(r,1500));
 o.mapBtn=document.querySelectorAll('.leaflet-marker-icon').length;
 const m=treeMarkers.find(x=>x.id==='T3'); m.marker.openPopup(); await new Promise(r=>setTimeout(r,300));
 document.querySelector('.leaflet-popup button[data-action="delete"]').click(); await new Promise(r=>setTimeout(r,400));
 o.afterMapDelete=G.trees.map(t=>t.id).join(','); o.markersLeft=treeMarkers.length;
 // altro dispositivo: ha ancora T2 e T3 (non modificati) + T1 modificato dopo
 G.trees=[mk('T1','2026-11-01T00:00:00Z'),mk('T2','2026-11-01T00:00:00Z'),mk('T3','2026-11-01T00:00:00Z'),mk('T4','2026-11-01T00:00:00Z')];
 _tomb={}; cloudTrees.set('T2',{id:'T2',_savedAt:'2026-11-01T00:00:00Z'});
 G.trees.find(t=>t.id==='T3')._savedAt=new Date(Date.now()+1000).toISOString();   // ricreato dopo l'eliminazione
 await onCloudSnapshot([...cloudTrees.values()]); await new Promise(r=>setTimeout(r,300));
 o.otherDevice=G.trees.map(t=>t.id).join(',');
 return o;}),null,1),errs);await b.close();})();
