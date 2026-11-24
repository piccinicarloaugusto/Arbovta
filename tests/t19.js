const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>{errs.push('DIALOG '+d.message());d.dismiss()});
pg.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text().slice(0,150))});
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(async()=>{
 const big='data:image/jpeg;base64,'+'A'.repeat(400000);
 G.trees=[];for(let i=1;i<=60;i++)G.trees.push({id:'CLQ'+i,specie:'Pinus pinea',h:20,dbh:50,cw:8,cd:7,schedaMode:'speditiva',vta:{},photos:[{dataUrl:big,type:'tronco'},{dataUrl:big,type:'chioma'}],_editedByUser:true});
 G.form={codice:'CLQ61',specie:'Pinus pinea',h:21,dbh:83,cw:10,cd:10,schedaMode:'speditiva',pericolosita_num:5,fattoreContattoNum:6,vta:{},photos:[{dataUrl:big,type:'tronco'}]};
 let thrown=null;try{saveRilievo()}catch(e){thrown=e.message}
 await new Promise(r=>setTimeout(r,800));
 const ls=localStorage.getItem('arbovta-trees');
 return {thrown,n:G.trees.length,lsKB:ls?Math.round(ls.length/1024):null,lsHas61:!!(ls&&ls.includes('CLQ61'))};}),null,0),errs);await b.close();})();
