const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)), out={};
 G.trees=[]; G.form={...G.form,codice:'S9',specie:'Q',schedaMode:'speditiva',h:15,dbh:40,cw:10,cd:4,fattoreContattoNum:5,vta:{},_editingId:null,pericolosita:'',pericolosita_num:0};
 render('scheda'); await sleep(50);
 const sel=[...document.querySelectorAll('#content select')].find(s=>[...s.options].some(o=>o.value==='BASSO'));
 out.pairInit=document.getElementById('peric-pair').innerHTML==='';
 sel.value='BASSO'; sel.dispatchEvent(new Event('change',{bubbles:true})); await sleep(30);
 const ir=()=>document.getElementById('ir-v-sp').textContent;
 out.basso_lo=[G.form.pericolosita_num,ir(),[...document.querySelectorAll('#peric-pair button')].map(b=>b.textContent)];
 document.querySelectorAll('#peric-pair button')[1].click(); await sleep(30);
 out.basso_hi=[G.form.pericolosita_num,G.form.pericolosita,ir(),G.form.cpc];
 sel.value='MODERATO'; sel.dispatchEvent(new Event('change',{bubbles:true})); await sleep(30);
 out.mod=[G.form.pericolosita_num,[...document.querySelectorAll('#peric-pair button')].map(b=>b.textContent)];
 document.querySelectorAll('#peric-pair button')[1].click(); await sleep(30);
 out.mod_hi=[G.form.pericolosita_num,ir()];
 // save and reopen
 saveRilievo(); await sleep(50);
 const t=G.trees.find(x=>x.id==='S9'); out.saved=[t.pericolosita_num,t.pericolosita,t.indiceRischio];
 openTree('S9'); render('scheda'); await sleep(60);
 out.reopen=[[...document.querySelectorAll('#peric-pair button')].map(b=>b.textContent+(b.style.background.includes('rgb')||b.style.background.includes('var')?'*':'')),document.getElementById('ir-v-sp').textContent];
 return out;}),null,0),errs);await b.close();})();
