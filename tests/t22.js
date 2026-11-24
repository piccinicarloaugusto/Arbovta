const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.accept());
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const out={};
 // 1) simulate stored string coords (old bug)
 G.trees=[{id:'A1',specie:'x',cpc:'A',lat:'44.032109',lng:'10.068803',photos:[],vta:{}},{id:'A2',specie:'y',cpc:'B',lat:44.03,lng:10.07,photos:[],vta:{}}];
 try{ go('mappa',document.querySelectorAll('.nav-tab')[4]); out.mapOk=document.getElementById('content').innerHTML.includes('Elenco piante georeferenziate'); }catch(e){out.mapErr=e.message}
 out.types=G.trees.map(t=>typeof t.lat);
 // 2) autosaveField with string
 G.form._editingId='A2'; autosaveField('lat','44.5'); out.afType=typeof G.trees[1].lat;
 // 3) settings tab
 const tabs=document.querySelectorAll('.nav-tab'); out.ntabs=tabs.length;
 tabs[5].click(); out.settings=document.getElementById('content').innerHTML.includes('Ricalcola FD')&&document.getElementById('content').innerHTML.includes('Rimuovi rilievi duplicati');
 out.active=[...tabs].map(t=>t.classList.contains('active')?1:0).join('');
 return out;}),null,0),errs);await b.close();})();
