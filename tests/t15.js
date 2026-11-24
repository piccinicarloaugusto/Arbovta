const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(700);
console.log(await pg.evaluate(()=>{const h=pericPairHTML(6);return [(h.match(/background:var\(--green-600\);color:#fff[^>]*>(\d)/)||[])[1], (pericPairHTML(0)==='')]}));
await b.close();})();
