const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
pg.on('console',m=>console.log('C:',m.text()));pg.on('pageerror',e=>console.log('E:',e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(500);
await pg.evaluate(()=>{localStorage.setItem('arbovta-trees',JSON.stringify([{id:'OLD1',specie:'x',_editedByUser:true,photos:[{dataUrl:'data:image/jpeg;base64,QUJD',type:'Radici'}]}]));});
await pg.reload();await pg.waitForTimeout(1500);
console.log(await pg.evaluate(()=>[localStorage.getItem('arbovta-trees'),G.trees.length]));
await b.close();})();
