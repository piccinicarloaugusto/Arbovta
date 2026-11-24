const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true});const pg=await ctx.newPage();
pg.on('pageerror',e=>console.log('PAGEERR',e.message));
const files=[];pg.on('download',async d=>{const p='dl/'+d.suggestedFilename();await d.saveAs(p);files.push(p);});
await pg.route('**/*',r=>{const u=r.request().url();
 if(u.includes('jspdf'))return r.fulfill({body:fs.readFileSync('node_modules/jspdf/dist/jspdf.umd.min.js'),contentType:'text/javascript'});
 return u.startsWith('file:')?r.continue():r.abort();});
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
await pg.evaluate(async()=>{
 const photo='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
 const mk=(id,mode,ph)=>({id,specie:'Quercus ilex',cpc:'B',schedaMode:mode,h:4,dbh:8,cw:2,cd:2,vta:{},photos:ph?[{dataUrl:photo,type:'Pianta intera'}]:[],lat:'44.0',lng:'10.0',cliente:'C',data:'2026-01-01',stazione:'aiuola',pavimentazione:'asfalto',suolo:'compatto',sitoCon:'mediocre',posizSoc:'dominante',conflitti:'cavi aerei',eta:'6',fattoreContatto:'MODERATO',fattoreContattoNum:5,indiceRischio:120});
 G.trees=[mk('11','ordinaria',false),mk('12','speditiva',false),mk('13','ordinaria',false)];
 G_projects.splice(0,G_projects.length,{id:'c1',nome:'Italgas',progetti:[{id:'p1',nome:'Lotto 2',rilievi:['11','12','13']}]});
 document.body.insertAdjacentHTML('beforeend','<button onclick="generatePDFSelected()">Genera PDF selezionati</button>'+G.trees.map(t=>`<input type="checkbox" class="report-cb" data-id="${t.id}" checked>`).join(''));
 await generatePDF1();
 async function generatePDF1(){ await generatePDFSingle(G.trees[0]); await new Promise(r=>setTimeout(r,800)); await generatePDFSpeditivo(G.trees[1]); await new Promise(r=>setTimeout(r,800)); await generatePDFSelected(); await new Promise(r=>setTimeout(r,1200));
   document.querySelectorAll('.report-cb')[1].checked=false; await generatePDFSelected(); await new Promise(r=>setTimeout(r,1200)); }
});
await pg.waitForTimeout(1500);
console.log(files);await b.close();})();
