const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));
let msgs=[];pg.on('dialog',d=>{msgs.push(d.message().slice(0,80));d.accept()});
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 document.body.insertAdjacentHTML('beforeend','<div id="dedupe-msg"></div>');
 const mk=(id,t,x)=>({id,specie:'Pinus',_savedAt:t,h:x,photos:[],vta:{}});
 G.trees=[mk('CLQ60','2026-11-04T10:00:00Z',1),mk('CLQ61','2026-11-04T11:00:00Z',1),mk('CLQ61','2026-11-04T11:05:00Z',2),mk('CLQ61','2026-11-04T11:10:00Z',3),mk('CLQ62','2026-11-04T12:00:00Z',1)];
 await dedupeArchive();
 const after=G.trees.map(t=>t.id+':'+t.h);
 // guard: save new with existing code
 G.form={codice:'CLQ61',specie:'Pinus',h:9,schedaMode:'speditiva',pericolosita_num:3,vta:{},photos:[]};
 saveRilievo();
 const after2=G.trees.filter(t=>t.id==='CLQ61').map(t=>t.h);
 return {after,after2,n:G.trees.length};}),null,0),msgs,errs);await b.close();})();
