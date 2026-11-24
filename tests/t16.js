const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const out={};
 document.body.insertAdjacentHTML('beforeend','<div id="ir-v-sp"></div><div id="fd-v"></div><div id="fd-num-v"></div>');
 // Excel samples: [H, DBH cm, crown, expected]
 for(const [k,h,d,c,exp] of [['3211',10,41,8,3.758],['3212',10,35,6,3.077],['3213',10,45,5,3.857],['3214',15,45,7,5.458],['NUOVO',6,58,2,'~3.5 (FD=3 nel foglio)']]){
   G.form={...G.form,schedaMode:'speditiva',h:h,dbh:d,cw:c,cd:null,fattoreContattoNum:1,pericolosita_num:1,vta:{},_editingId:null,fattoreDimensionale:0};
   updateRisk(true); out[k]=[document.getElementById('fd-v').textContent,exp];
 }
 return out;}),null,0),errs);await b.close();})();
