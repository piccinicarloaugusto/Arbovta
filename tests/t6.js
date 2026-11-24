const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
const r=await pg.evaluate(()=>{
 const out={};
 out.avg=[crownAvg(8,4),crownAvg(8,0),crownAvg(0,5),crownAvg(null,null)];
 // FD by hand: h=15,dbh=40,cw=10,cd=4 -> dc=7
 const fd=(h,dbh,dc)=>{const circ=(dbh/100)*Math.PI;return (10/(1+Math.exp(-0.4*(h-12)))+10/(1+Math.exp(-0.04*(circ-100)))+10/(1+Math.exp(-0.7*(dc-6))))/3;};
 // speditiva form
 G.form={...G.form,schedaMode:'speditiva',codice:'S1',h:15,dbh:40,cw:10,cd:4,fattoreContattoNum:5,pericolosita_num:6,vta:{}};
 const html=renderSchedaSpeditiva();
 out.card=html.includes('Dati dimora');
 out.opts=['Sito radicazione','Posizione sociale','Conflitti','Stazione','Pavimentazione','Suolo','Età ontogenetica'].map(l=>html.includes('<label>'+l));
 out.cavi=html.includes('cavi aerei')&&html.includes('predominante')&&html.includes('inidoneo')&&html.includes('buco asfalto');
 document.getElementById('app').insertAdjacentHTML('beforeend','<div id="ir-v-sp"></div><div id="fd-v"></div>');
 updateRisk();
 out.fd=document.getElementById('fd-v').textContent;
 out.expectedAvg=fd(15,40,7).toFixed(3);
 out.old=fd(15,40,10).toFixed(3);
 // save persist of fields
 autosaveField('conflitti','cavi aerei');autosaveField('eta','5');
 out.form=[G.form.conflitti,G.form.eta];
 return out;});
console.log(r,errs);await b.close();})();
