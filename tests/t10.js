const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
pg.on('pageerror',e=>console.log('PAGEERR',e.message));
pg.on('console',m=>{if(!/Failed to load|SW non/.test(m.text()))console.log('C',m.text().slice(0,200))});
await pg.route('**/*',r=>{const u=r.request().url();
 if(u.includes('jspdf'))return r.fulfill({body:fs.readFileSync('node_modules/jspdf/dist/jspdf.umd.min.js'),contentType:'text/javascript'});
 return u.startsWith('file:')?r.continue():r.abort();});
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
const r=await pg.evaluate(async()=>{
 const log=[];
 try{
 await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
 log.push('jspdf '+typeof window.jspdf);
 const P=window.jspdf.jsPDF.API;
 const saves=[]; window._saves=saves;
 const J=window.jspdf.jsPDF;
 J.prototype.save=function(name){saves.push({name,pages:this.getNumberOfPages()});};
 const mk=(id,mode)=>({id,specie:'Quercus ilex',cpc:'B',schedaMode:mode,h:12,dbh:40,cw:8,cd:6,vta:{},photos:[],lat:'44.0',lng:'10.0',cliente:'C',data:'2026-01-01'});
 G.trees=[mk('11','ordinaria'),mk('12','speditiva'),mk('13','ordinaria')];
 await generatePDFSingle(G.trees[0]); log.push(JSON.stringify(saves.slice()));
 }catch(e){log.push('ERR '+e.message+e.stack.slice(0,300))}
 return log;});
console.log(r);await b.close();})();
