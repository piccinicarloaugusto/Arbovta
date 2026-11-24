const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext()).newPage();
pg.on('pageerror',e=>console.log('ERR',e.message));pg.on('console',m=>{if(!/Failed to load|SW non/.test(m.text()))console.log('C',m.text())});
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
console.log(await pg.evaluate(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 render('misure');startSensor();
 measureDist('dist');await sleep(100);
 const ov=document.getElementById('cam-fs-overlay');
 const info=[!!ov, ov&&ov._distTarget, ov&&ov._pendingTarget];
 for(let i=0;i<8;i++){window.dispatchEvent(new DeviceOrientationEvent('deviceorientation',{alpha:0,beta:90-12.2,gamma:0}));await sleep(15);}
 const r=readClino();
 let err=null; try{captureFromOverlay();}catch(e){err=e.message+e.stack}
 return JSON.stringify({info,r,err,ang:G.clino.angle,dist:G.clino.dist});
}));
await b.close();})();
