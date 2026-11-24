const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.accept());
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 G.trees=[{id:'A1',specie:'x',cpc:'A',lat:44.03,lng:10.07,photos:[],vta:{}}];
 G_projects=[{id:'c1',nome:'C',progetti:[{id:'p1',nome:'P',rilievi:['A1']}]}];
 const tabs=document.querySelectorAll('.nav-tab');const o={};
 tabs[4].click();let h=document.getElementById('content').innerHTML;
 o.map={hasMap:h.includes('Esporta mappa'),noReport:!h.includes('Genera PDF selezionati'),noSeg:!h.includes('seg-b')};
 tabs[5].click();h=document.getElementById('content').innerHTML;
 o.sett={seg:(h.match(/seg-b/g)||[]).length,imp:h.includes('Rimuovi rilievi duplicati'),rep:h.includes('Genera PDF selezionati'),xls:h.includes('Export Excel — Rilievi')};
 document.querySelectorAll('#content .seg-b')[1].click();
 o.vis=['impostazioni','report','excel'].map(i=>document.getElementById('sv-'+i).style.display).join(',');
 return o;}),null,0),errs);await b.close();})();
