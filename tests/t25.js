const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 document.body.insertAdjacentHTML('beforeend','<div id="fb-sync-status"></div>');
 G.trees=[1,2,3,4,5].map(i=>({id:'T'+i,h:i,photos:[]}));
 let calls=[]; window._fb={saveTree:async(t)=>{calls.push(t.id);markSynced(t);return true;}};
 const msg=()=>document.getElementById('fb-sync-status').textContent;
 await forceSyncToFirebase(); const r1=[calls.length,msg()]; calls=[];
 await forceSyncToFirebase(); const r2=[calls.length,msg()]; calls=[];
 G.trees[2].h=99; G.trees.push({id:'T6',photos:[]});
 await forceSyncToFirebase(); const r3=[calls.slice(),msg()];
 return {r1,r2,r3};}),null,1),errs);await b.close();})();
