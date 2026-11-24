const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
const out=await pg.evaluate(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const res={};
 for(const mode of ['ordinaria','speditiva']){
   G.trees=[]; newRilievo&&0;
   G.form={...G.form,codice:'T1',specie:'Populus alba',schedaMode:mode,fattoreContattoNum:6,pericolosita_num:1,vta:{},h:null,dbh:null,cw:null,cd:null,_editingId:null};
   render('scheda'); await sleep(50);
   res[mode+'_before']=[document.getElementById('fd-v')?.textContent,document.getElementById('fd-num-v')?.textContent];
   const inputs=[...document.querySelectorAll('#content input[type=number]')];
   const byLabel=l=>inputs.find(i=>i.closest('.field')?.querySelector('label')?.textContent.trim().startsWith(l));
   const set=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
   const H=byLabel('Altezza'), D=byLabel('Diametro')||byLabel('DBH'), CW=byLabel('Choma L')||byLabel('Largh'), CD=byLabel('Chioma P')||byLabel('Prof');
   set(H,'4');set(D,'8');set(CW,'2');set(CD,'2');
   await sleep(50);
   res[mode+'_after']=[document.getElementById('fd-v')?.textContent,document.getElementById('fd-num-v')?.textContent,(document.getElementById('risk-v')||document.getElementById('ir-v-sp'))?.textContent, G.form.indiceRischio, G.form.dbh];
   // big tree
   set(H,'20');set(D,'70');set(CW,'12');set(CD,'12'); await sleep(50);
   res[mode+'_big']=[document.getElementById('fd-v')?.textContent,document.getElementById('fd-num-v')?.textContent];
   // opening an existing tree shows value without altering it
   const t={id:'X1',specie:'Q',schedaMode:mode,h:15,dbh:40,cw:10,cd:4,cpc:'D',indiceRischio:999,fattoreContattoNum:5,pericolosita_num:6,vta:{},photos:[]};
   G.trees=[t]; openTree('X1'); render('scheda'); await sleep(60);
   res[mode+'_open']=[document.getElementById('fd-num-v')?.textContent, G.trees[0].cpc, G.trees[0].indiceRischio];
 }
 return res;});
console.log(JSON.stringify(out,null,1),errs);await b.close();})();
