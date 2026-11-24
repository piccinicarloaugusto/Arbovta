const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)); window.confirm=()=>true;
 document.body.insertAdjacentHTML('beforeend','<div id="recalc-msg"></div>');
 G.trees=[
  {id:'a',schedaMode:'speditiva',pericolosita_num:7,fattoreContattoNum:6,h:20,dbh:70,cw:12,cd:12,cpc:'C',indiceRischio:150,pericolosita:'ELEVATO'},
  {id:'b',schedaMode:'ordinaria',vta:{per_rc_num:3,per_fc_num:4,per_bc_num:2},fattoreContattoNum:5,h:15,dbh:40,cw:10,cd:4,cpc:'B',indiceRischio:50,pericolosita:'Basso'},
  {id:'c',schedaMode:'ordinaria',_fromGinve:true,cpc:'D',indiceRischio:0,h:10,dbh:41,cw:8},          /* nessun giudizio: non toccare */
  {id:'d',schedaMode:'speditiva',pericolosita_num:5,fattoreContattoNum:5,h:4,dbh:8,cw:2,cpc:'A',_cpcManual:true,indiceRischio:1}
 ];
 await recalcArchive(); await sleep(100);
 return {trees:G.trees.map(t=>[t.id,t.cpc,t.indiceRischio,t.fattoreDanno||'-']),msg:document.getElementById('recalc-msg').textContent};
}),null,0),errs);await b.close();})();
