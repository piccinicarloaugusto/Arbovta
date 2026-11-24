const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.dismiss());
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 go('impostazioni',document.querySelectorAll('.nav-tab')[5]);
 G.trees=[{id:'T1',h:1,_savedAt:'2026-11-01',photos:[]},{id:'T2',h:2,_savedAt:'2026-11-20',photos:[]}];
 G_projects=[];
 const cloud=[{id:'T1',h:10,_savedAt:'2026-11-05',photos:[]},{id:'T2',h:20,_savedAt:'2026-11-05',photos:[]},{id:'T3',h:3,photos:[]},{id:'T4',h:4,photos:[]}];
 window._fb={saveProjects:async()=>true,loadAll:async()=>cloud,loadProjects:async()=>[{id:'c1',nome:'Camping',progetti:[{id:'p1',nome:'cens',rilievi:['T1','T3','T4']}]}]};
 await downloadFromFirebase(document.getElementById('fb-sync-status'));
 return {msg:document.getElementById('fb-sync-status').textContent,trees:G.trees.map(t=>t.id+':'+t.h),proj:G_projects.length,btn:document.getElementById('content').innerHTML.includes('Scarica da Firebase su questo dispositivo')};}),null,1),errs);await b.close();})();
