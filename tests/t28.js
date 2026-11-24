const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.dismiss());
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(500);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const out={};
 const ids=n=>Array.from({length:n},(_,i)=>'CLQ'+(i+1));
 G.trees=[...ids(10).map(id=>({id,photos:[],_savedAt:'2026-11-01'})),{id:'3211',photos:[]}];
 G_projects=[{id:'seedTV',nome:'Tommaso Villirillo',progetti:[{id:'s1',nome:'Via Scassicarli',rilievi:['3211']}]}];
 initBaseSigs();
 const pushes=[];
 window._fb={saveTree:async t=>true,saveProjects:async p=>{pushes.push(JSON.parse(JSON.stringify(p)));return true;},
   loadProjects:async()=>[{id:'tabTV',nome:'tommaso villirillo',progetti:[{id:'x1',nome:'via scassicarli',rilievi:['3211','3212']}]},{id:'cq',nome:'Camping La Quiete',progetti:[{id:'cp',nome:'censimento',rilievi:ids(6)}]}],
   listenAll:cb=>{setTimeout(()=>cb(G.trees.map(t=>({...t}))),30);return()=>{}}};
 window._fbReady=true;
 saveProjects(); out.pushBeforeMerge=pushes.length;   // deve essere 0
 autoSyncStart(); await new Promise(r=>setTimeout(r,600));
 out.clients=G_projects.map(c=>c.nome+':'+c.progetti.map(p=>p.nome+'('+p.rilievi.length+')').join('|'));
 out.pushes=pushes.length;
 // errore nel caricamento progetti: nessuna scrittura
 return out;}),null,1),errs);
// scenario errore loadProjects
console.log(JSON.stringify(await pg.evaluate(async()=>{
 window._projPushOK=false;_projMerged=false;_autoSyncOn=false;
 const pushes=[];window._fb.loadProjects=async()=>undefined;window._fb.saveProjects=async p=>{pushes.push(1);};
 autoSyncStart(); await new Promise(r=>setTimeout(r,500)); saveProjects();
 return {pushesOnError:pushes.length};})),errs);
await b.close();})();
