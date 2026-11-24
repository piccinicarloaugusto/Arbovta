const {chromium}=require('playwright');
const MOCK=`
window._cloud={photos:{},trees:{},projects:null};
window._fb={
 async saveTree(t){window._cloud.trees[t.id]=JSON.parse(JSON.stringify({...t,photos:(t.photos||[]).map(p=>({type:p.type,pid:p.pid}))}));},
 async deleteTree(id){delete window._cloud.trees[id];},
 async saveProjects(p){window._cloud.projects=JSON.parse(JSON.stringify(p));},
 async savePhoto(tid,p){window._cloud.photos[tid+'__'+p.pid]={treeId:tid,pid:p.pid,type:p.type||'',date:p.date||'',dataUrl:p.dataUrl};return true;},
 async loadPhotos(tid){return Object.values(window._cloud.photos).filter(d=>d.treeId===tid);},
 async listPhotoIds(tid){return Object.values(window._cloud.photos).filter(d=>d.treeId===tid).map(d=>d.pid);},
 async deletePhoto(tid,pid){delete window._cloud.photos[tid+'__'+pid];},
 async loadAll(){return Object.values(window._cloud.trees);},
 async loadProjects(){return window._cloud.projects;}
};`;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();const pg=await ctx.newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
const load=async()=>{await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.evaluate(MOCK);await sleep(900);};
const out={};
await load();
await pg.evaluate(()=>{G_projects.push({id:'c1',nome:'Cliente',progetti:[{id:'p1',nome:'P',rilievi:['A1']}]});saveProjects();
  G.trees.push({id:'A1',specie:'Test',_editedByUser:true,photos:[{dataUrl:'data:image/jpeg;base64,'+'Q'.repeat(5000),type:'Radici',date:'2026-01-01'},{dataUrl:'data:image/jpeg;base64,'+'W'.repeat(5000),type:'Chioma',date:'2026-01-02'}]});
  G.trees.push({id:'A2',specie:'Test2',_editedByUser:true,photos:[]});
  saveTrees();});
await sleep(4500);
out.cloudPhotos=await pg.evaluate(()=>Object.keys(_cloud.photos).length);
out.flag=await pg.evaluate(()=>G.trees[0].photos.every(p=>p.cloud));
// 2 delete one photo
await pg.evaluate(()=>{openTree('A1');deleteSchedaPhoto&&0;G.form.photos.splice(0,1);autosaveField('photos',G.form.photos);});
await sleep(4500);
out.afterDelete=await pg.evaluate(()=>Object.keys(_cloud.photos).length);
// 3 new device: wipe local, tree meta from cloud
const cloudTrees=await pg.evaluate(()=>JSON.stringify(Object.values(_cloud.trees)));
const cloudPh=await pg.evaluate(()=>JSON.stringify(_cloud.photos));
await pg.evaluate(async()=>{localStorage.clear();indexedDB.deleteDatabase('arborisk-photos');});
await pg.close();
const pg2=await ctx.newPage();pg2.on('pageerror',e=>errs.push('2:'+e.message));
await pg2.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg2.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg2.evaluate(MOCK);
await pg2.evaluate(([ct,cp])=>{_cloud.photos=JSON.parse(cp);JSON.parse(ct).forEach(t=>_cloud.trees[t.id]=t);},[cloudTrees,cloudPh]);
await sleep(600);
await pg2.evaluate(async()=>{const c=await _fb.loadAll();mergeCloudTrees(c);saveTrees();});
out.newDeviceNoData=await pg2.evaluate(()=>{const t=G.trees.find(x=>x.id==='A1');return t.photos.length+':'+hasPhotoData(t.photos)});
await pg2.evaluate(()=>openTree('A1'));await sleep(800);
out.newDeviceFetched=await pg2.evaluate(()=>G.form.photos.length+':'+hasPhotoData(G.form.photos));
// 4 local-db recovery: wipe localStorage trees + projects only
await sleep(2000);
await pg2.evaluate(()=>{localStorage.removeItem('arbovta-trees');localStorage.removeItem('arbovta-projects');});
await pg2.reload();await pg2.evaluate(MOCK);await sleep(1500);
out.afterWipe=await pg2.evaluate(()=>G.trees.length);
await pg2.evaluate(async()=>{window.confirm=()=>true;await restoreMissingFromLocal();});
out.restored=await pg2.evaluate(()=>({n:G.trees.map(t=>t.id).sort().join(','),ph:G.trees.find(t=>t.id==='A1').photos.length,hasData:hasPhotoData(G.trees.find(t=>t.id==='A1').photos),msg:document.getElementById('ldb-msg')?.textContent||''}));
// 5 trash
await pg2.evaluate(()=>{window.confirm=()=>true;deleteTree('A2');});await sleep(600);
out.afterDel=await pg2.evaluate(()=>G.trees.length);
await pg2.evaluate(()=>restoreMissingFromLocal());await sleep(800);
out.afterTrashRestore=await pg2.evaluate(()=>G.trees.map(t=>t.id).sort().join(','));
// 6 push all after cloud wipe
await pg2.evaluate(()=>{_cloud.photos={};_cloud.trees={};_cloud.projects=null;});
await pg2.evaluate(()=>pushAllToCloud(null));
out.pushAll=await pg2.evaluate(()=>({t:Object.keys(_cloud.trees).length,p:Object.keys(_cloud.photos).length,pr:!!_cloud.projects}));
// 7 snapshot + restore
await pg2.evaluate(()=>snapshotNow(true));await sleep(300);
await pg2.evaluate(()=>{G.trees.find(t=>t.id==='A1').specie='ROVINATO';saveTrees();});
const ts=await pg2.evaluate(async()=>{const st=await localDBStatus();return st.snaps[st.snaps.length-1].ts;});
await pg2.evaluate((ts)=>restoreSnapshot(ts),ts);await sleep(500);
out.snap=await pg2.evaluate(()=>G.trees.find(t=>t.id==='A1').specie);
// settings render
out.ui=await pg2.evaluate(()=>{const h=renderImpostazioniView();return h.includes('Database locale')});
console.log(out,errs);await b.close();})();
