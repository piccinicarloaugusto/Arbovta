const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
for(const f of ['/tmp/claude-0/-home-claude/f9cba818-0b62-5027-9a2b-d220f5afa252/scratchpad/base/index.html',''+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'']){
await pg.goto('file://'+f);await pg.waitForTimeout(700);
console.log(f.includes('base')?'v36':'new',await pg.evaluate(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const out=[];
 for(const mode of ['ordinaria','speditiva']){
  const t={id:'X1',specie:'Q',schedaMode:mode,h:15,dbh:40,cw:10,cd:4,cpc:'D',indiceRischio:999,fattoreContattoNum:5,pericolosita_num:6,vta:{},photos:[]};
  G.trees=[t]; openTree('X1'); await sleep(100);
  out.push([mode,G.trees[0].cpc,G.trees[0].indiceRischio]);
 }
 return JSON.stringify(out);}));}
await b.close();})();
