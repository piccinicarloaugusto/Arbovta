const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.dismiss());
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(600);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const o={};
 G.trees=[{id:'A',photos:[]},{id:'B',photos:[]}];G_projects=[];
 const cnt=async()=>(await localDBStatus()).snaps.length;
 const base=await cnt();
 await snapshotNow(true); const a1=await cnt();            // nuova
 await snapshotNow(true); const a2=await cnt();            // identica: saltata
 for(let i=0;i<12;i++){ G.trees.push({id:'X'+i,photos:[]}); await snapshotNow(true); await new Promise(r=>setTimeout(r,5)); }
 const st=await localDBStatus();
 o.base=base;o.afterFirst=a1;o.afterDuplicate=a2;o.afterManyOps=st.snaps.length;o.kinds=st.snaps.map(s=>s.kind).join(',');
 go('impostazioni',document.querySelectorAll('.nav-tab')[5]); await new Promise(r=>setTimeout(r,600));
 o.ui=document.getElementById('ldb-snaps').innerHTML.includes('prima di un');
 return o;}),null,1),errs);await b.close();})();
