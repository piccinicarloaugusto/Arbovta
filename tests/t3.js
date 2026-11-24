const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(500);
await pg.evaluate(()=>{localStorage.setItem('arbovta-trees',JSON.stringify([{id:'OLD1',specie:'x',_editedByUser:true,photos:[{dataUrl:'data:image/jpeg;base64,QUJD',type:'Radici'}]}]));});
await pg.reload();await pg.waitForTimeout(1200);
await pg.reload();await pg.waitForTimeout(1200);
console.log(await pg.evaluate(()=>({ls:localStorage.getItem('arbovta-trees').includes('QUJD'),mem:G.trees.find(t=>t.id==='OLD1').photos[0].dataUrl})));
await b.close();})();
