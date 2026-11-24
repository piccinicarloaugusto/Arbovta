const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.dismiss());
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(500);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const out={};
 // "cloud" in memoria, con ordine chiavi diverso e 3 rilievi; locale ha T1 (stesso, più vecchio), T9 (solo locale)
 const cloud=new Map();
 const put=o=>cloud.set(String(o.id),JSON.parse(JSON.stringify(o)));
 put({id:'T1',specie:'Quercus',h:10,_savedAt:'2026-11-10T10:00:00Z',photos:[]});
 put({id:'T2',specie:'Pinus',h:20,_savedAt:'2026-11-12T10:00:00Z',photos:[]});
 put({id:'T3',specie:'Acer',h:30,_savedAt:'2026-11-12T11:00:00Z',photos:[]});
 G.trees=[{id:'T1',specie:'Quercus',h:5,_savedAt:'2026-11-01T10:00:00Z',photos:[]},{id:'T9',specie:'Tilia',h:9,_savedAt:'2026-11-15T10:00:00Z',photos:[]},{id:'T3',h:99,specie:'Acer',_savedAt:'2026-11-14T10:00:00Z',photos:[]}];
 G_projects=[]; initBaseSigs();
 let listeners=[]; const writes=[];
 window._fb={saveTree:async t=>{writes.push(t.id);put(t);markSynced(t);listeners.forEach(f=>f([...cloud.values()]));return true;},
   saveProjects:async()=>true,loadProjects:async()=>[{id:'c1',nome:'Camping',progetti:[{id:'p1',nome:'cens',rilievi:['T1','T2']}]}],
   listenAll:cb=>{listeners.push(cb);setTimeout(()=>cb([...cloud.values()]),50);return()=>{}}};
 window._fbReady=true;
 autoSyncStart();
 await new Promise(r=>setTimeout(r,800));
 out.ids=G.trees.map(t=>t.id+':'+t.h).sort();
 out.writes=writes.slice().sort();
 out.cloudT9=cloud.has('T9'); out.cloudT3h=cloud.get('T3').h;
 out.proj=G_projects.length; out.dot=window._syncMsg;
 // modifica locale -> timestamp e push
 writes.length=0;
 const t=G.trees.find(x=>x.id==='T2'); t.h=21; lsSaveTrees(); saveTrees();
 await new Promise(r=>setTimeout(r,300));
 out.stamp=t._savedAt>'2026-11-16'; out.pushedAfterEdit=writes.slice();
 // modifica remota (altro device)
 const rem=cloud.get('T2'); rem.h=77; rem._savedAt='2099-01-01T00:00:00Z'; listeners.forEach(f=>f([...cloud.values()]));
 await new Promise(r=>setTimeout(r,300));
 out.remoteApplied=G.trees.find(x=>x.id==='T2').h;
 // riavvio senza modifiche: nessuna scrittura
 writes.length=0; listeners.forEach(f=>f([...cloud.values()])); await new Promise(r=>setTimeout(r,300));
 out.idleWrites=writes.length;
 return out;}),null,1),errs);await b.close();})();
