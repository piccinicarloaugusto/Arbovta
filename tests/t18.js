const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const out={}; document.body.insertAdjacentHTML('beforeend','<div id="ir-v-sp"></div><div id="fd-v"></div>');
 const fdForm=(sp,h,d,c)=>{G.form={...G.form,specie:sp,schedaMode:'speditiva',h,dbh:d,cw:c,cd:null,fattoreContattoNum:1,pericolosita_num:1,vta:{},_editingId:null,fattoreDimensionale:0};updateRisk(true);return document.getElementById('fd-v').textContent;};
 out.excel1707=[fdForm('Populus alba ',12,38,6),'excel 3.396'];
 out.pinoStessiDati=fdForm('Pinus pinea',12,38,6);
 out.bulk=riskForTree({specie:'Populus alba',schedaMode:'speditiva',pericolosita_num:5,fattoreContattoNum:6,h:12,dbh:38,cw:6}).FD.toFixed(3);
 out.pinoBulk=riskForTree({specie:'Pinus pinea',schedaMode:'speditiva',pericolosita_num:5,fattoreContattoNum:6,h:12,dbh:38,cw:6}).FD.toFixed(3);
 out.mid=[crownMid('Pinus pinea'),crownMid('pino domestico'),crownMid('Populus alba'),crownMid(''),crownMid('Quercus ilex')];
 return out;}),null,0),errs);await b.close();})();
