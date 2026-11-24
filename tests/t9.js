const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>{const u=r.request().url();
 if(u.includes('jspdf'))return r.fulfill({body:fs.readFileSync('node_modules/jspdf/dist/jspdf.umd.min.js'),contentType:'text/javascript'});
 return u.startsWith('file:')?r.continue():r.abort();});
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
const r=await pg.evaluate(async()=>{
 const saves=[];
 await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
 const P=window.jspdf.jsPDF.prototype, orig=P.save;
 P.save=function(name){saves.push({name,pages:this.getNumberOfPages(),
    texts:[...Array(this.getNumberOfPages()).keys()].map(i=>0)});};
 const mk=(id,mode)=>({id,specie:'Quercus ilex',cpc:'B',schedaMode:mode,h:12,dbh:40,cw:8,cd:6,vta:{},photos:[],lat:'44.0',lng:'10.0',cliente:'C',data:'2026-01-01'});
 G.trees=[mk('11','ordinaria'),mk('12','speditiva'),mk('13','ordinaria')];
 G_projects.splice(0,G_projects.length,{id:'c1',nome:'Italgas',progetti:[{id:'p1',nome:'Lotto 2',rilievi:['11','12','13']}]});
 // single baseline pages
 await generatePDFSingle(G.trees[0]); const single=saves.pop();
 await generatePDFSpeditivo(G.trees[1]); const sp=saves.pop();
 // merged via UI path
 document.body.insertAdjacentHTML('beforeend','<button onclick="generatePDFSelected()">Genera PDF selezionati</button>'+G.trees.map(t=>`<input type="checkbox" class="report-cb" data-id="${t.id}" checked>`).join(''));
 await generatePDFSelected();
 const merged=saves.slice();
 // partial selection
 document.querySelectorAll('.report-cb')[1].checked=false; saves.length=0;
 await generatePDFSelected();
 const partial=saves.slice();
 return {single,sp,merged,partial,btn:document.querySelector('[onclick="generatePDFSelected()"]').textContent};
});
console.log(JSON.stringify(r),errs);await b.close();})();
