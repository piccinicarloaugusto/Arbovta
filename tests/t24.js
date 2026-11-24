const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:800}});const pg=await ctx.newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.accept());
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
const o=await pg.evaluate(()=>({ver:document.getElementById('app-ver').textContent,topbar:getComputedStyle(document.querySelector('.topbar')).display,newBtn:!!document.querySelector('.topbar .btn-new')&&document.querySelector('.topbar .btn-new').offsetParent!==null}));
console.log(o);
// sync with hanging then ok fb
const r=await pg.evaluate(async()=>{
 window.withTimeoutOrig=withTimeout;
 document.body.insertAdjacentHTML('beforeend','<div id="fb-sync-status"></div>');
 G.trees=[1,2,3,4,5].map(i=>({id:'T'+i,photos:[]}));
 let n=0; window._fb={saveTree:(t)=>{n++; return t.id==='T3'?new Promise(()=>{}):Promise.resolve(true);}};
 // shrink timeout by patching setTimeout for speed
 const st=window.setTimeout; window.setTimeout=(f,ms,...a)=>st(f,ms>=20000?300:ms,...a);
 await forceSyncToFirebase();
 return {msg:document.getElementById('fb-sync-status').textContent,calls:n};
});
console.log(r,errs);await b.close();})();
