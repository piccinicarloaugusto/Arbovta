const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();const pg=await ctx.newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
// ~1.5MB fake photo x 5 trees = well over 5MB localStorage quota
const big='data:image/jpeg;base64,'+'A'.repeat(1500000);
await pg.evaluate(async(big)=>{
  for(let i=1;i<=5;i++) G.trees.push({id:'T'+i,specie:'Test',_editedByUser:true,photos:[{dataUrl:big+i,type:'Pianta intera'}]});
  saveTrees(); await new Promise(r=>setTimeout(r,800));
},big);
const ls=await pg.evaluate(()=>localStorage.getItem('arbovta-trees').length);
await pg.reload();await pg.waitForTimeout(1500);
const r=await pg.evaluate(()=>({n:G.trees.filter(t=>t.id.startsWith('T')).length,ph:G.trees.filter(t=>t.id.startsWith('T')&&t.photos[0]&&t.photos[0].dataUrl&&t.photos[0].dataUrl.length>1500000).length}));
// edit-open keeps photos
const r2=await pg.evaluate(()=>{openTree('T3');return G.form.photos.length&&G.form.photos[0].dataUrl.length>1500000});
// delete photo persists
await pg.evaluate(async()=>{G.form.photos=[];autosaveField('photos',[]);await new Promise(r=>setTimeout(r,500));});
await pg.reload();await pg.waitForTimeout(1500);
const r3=await pg.evaluate(()=>G.trees.find(t=>t.id==='T3').photos.length);
console.log({lsBytes:ls,...r,r2,afterDelete:r3},errs);await b.close();})();
