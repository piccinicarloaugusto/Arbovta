/* v58 — misura diametro: foto con riferimento + sensori con serie/gate di stabilità + pulsante a destra */
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:1280,height:900},hasTouch:false})).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.accept());
await pg.route('**/*',r=>{const u=r.request().url();
 if(u.startsWith('file:'))return r.continue();
 if(u.includes('leaflet.js'))return r.fulfill({path:'node_modules/leaflet/dist/leaflet.js',contentType:'text/javascript'});
 if(u.includes('leaflet.css'))return r.fulfill({path:'node_modules/leaflet/dist/leaflet.css',contentType:'text/css'});
 r.abort();});
await pg.addInitScript(()=>{
  /* scena sintetica 1920x1080, 10 px/cm: tronco 40 cm (400 px), riferimento 30 cm (300 px) */
  const cv=document.createElement('canvas');cv.width=1920;cv.height=1080;const g=cv.getContext('2d');
  g.fillStyle='#8aa';g.fillRect(0,0,1920,1080);g.fillStyle='#5a3a1a';g.fillRect(760,0,400,1080);
  g.fillStyle='#ffd23c';g.fillRect(1160,520,300,12);
  try{DeviceOrientationEvent.requestPermission=async()=>'granted';}catch(e){}
  let k=0;setInterval(()=>{g.fillStyle=(k++%2)?'#8ab':'#8aa';g.fillRect(0,0,20,20);},50);
  navigator.mediaDevices.getUserMedia=async()=>cv.captureStream(15);
});
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html'));await pg.waitForTimeout(600);
const o={};
o.ver=await pg.evaluate(()=>document.getElementById('app-ver').textContent);
await pg.evaluate(()=>{go('misure',document.querySelectorAll('.nav-tab')[2]);setCParam('dbh',document.querySelector('#content .seg-b:nth-child(3)')||document.createElement('b'));});
await pg.waitForTimeout(200);
o.panelHasRef=await pg.evaluate(()=>!!document.getElementById('ref-len-in'));

/* ── A) foto con riferimento, senza distanza ── */
await pg.evaluate(()=>{G.clino.param='dbh';render('misure');setRefLen(30);startDbhRef();});
await pg.waitForTimeout(800);
o.snapRight=await pg.evaluate(()=>{const r=document.querySelector('#cam-ref-overlay .cam-fullscreen-snap').getBoundingClientRect();return r.left>window.innerWidth/2;});
await pg.evaluate(()=>snapDbhRef());await pg.waitForTimeout(300);
const m=await pg.evaluate(()=>{const s=document.getElementById('cam-ref-overlay')._st;return {s:s.s,ox:s.ox,oy:s.oy};});
const P=(x,y)=>[m.ox+x*m.s,m.oy+y*m.s];
for(const [x,y] of [[760,300],[1160,300],[1160,526],[1460,526]]){const [sx,sy]=P(x,y);await pg.mouse.move(sx,sy);await pg.mouse.down();await pg.mouse.up();}
o.ptsA=await pg.evaluate(()=>document.getElementById('cam-ref-overlay')._pts.length);
o.preview=await pg.evaluate(()=>document.getElementById('ref-res').textContent);
await pg.evaluate(()=>refConfirm());
o.A=await pg.evaluate(()=>({dbh:G.clino.meas.dbh,src:G.clino.dbhSrc,corr:G.clino.dbhRef.corr,q:G.clino.q.dbh.abs/G.clino.q.dbh.val,note:dbhNote()}));

/* ── B) con distanza misurata (3 m): correzione prospettica 40/(1-0.4/6)=42.86 ── */
await pg.evaluate(()=>{G.clino.dist=15;G.clino.distDBH=3;G.clino.distInfo.distDBH={angle:-23,d:3,err:.1,h0:1.3};startDbhRef();});
await pg.waitForTimeout(800);await pg.evaluate(()=>snapDbhRef());await pg.waitForTimeout(300);
for(const [x,y] of [[760,300],[1160,300],[1160,526],[1460,526]]){const [sx,sy]=P(x,y);await pg.mouse.move(sx,sy);await pg.mouse.down();await pg.mouse.up();}
/* trascina il primo punto di 20 px immagine con un dito accanto (spostamento relativo) e poi riportalo */
{const [sx,sy]=P(760,300);await pg.mouse.move(sx+30,sy+20);await pg.mouse.down();await pg.mouse.move(sx+30+10,sy+20);await pg.mouse.move(sx+30,sy+20);await pg.mouse.up();}
o.dragKeepsPoint=await pg.evaluate(()=>Math.round(document.getElementById('cam-ref-overlay')._pts[0].x));
await pg.evaluate(()=>refConfirm());
o.B=await pg.evaluate(()=>({dbh:G.clino.meas.dbh,corr:G.clino.dbhRef.corr,note:dbhNote()}));

/* ── C) sensori: serie di 3 misure, rifiuto se instabile ── */
await pg.evaluate(()=>{resetClino();G.clino.distDBH=3;G.clino.param='dbh';render('misure');});
const fire=async(alpha,beta,jit,ms)=>{await pg.evaluate(async([alpha,beta,jit,ms])=>{
  const t0=Date.now();while(Date.now()-t0<ms){
   window.dispatchEvent(new DeviceOrientationEvent('deviceorientation',{alpha:alpha+(Math.random()-.5)*2*jit,beta:beta+(Math.random()-.5)*2*jit,gamma:0,absolute:false}));
   await new Promise(r=>setTimeout(r,16));}
 },[alpha,beta,jit,ms]);};
await pg.evaluate(()=>startClinoCamera('dbh_l'));await pg.waitForTimeout(500);
const D=7.166; /* ° per Ø 40 cm a 3 m dalla superficie */
const deltas=[D*0.98,D*1.03,D*1.0];
const rep=[];
for(let i=0;i<3;i++){
  await fire(200,90,0.1,1300);
  await pg.evaluate(()=>{window._r1=captureFromOverlay();});
  await fire(200-deltas[i],90,0.1,1300);
  await pg.evaluate(()=>captureFromOverlay());
  await pg.waitForTimeout(900);
  rep.push(await pg.evaluate(()=>({runs:G.clino.dbhRuns.length,dbh:G.clino.meas.dbh})));
  if(i<2){await pg.evaluate(()=>startClinoCamera('dbh_l'));await pg.waitForTimeout(300);}
}
o.dbg=await pg.evaluate(()=>({az:G.clino.capAz,cap:G.clino.captured,sd:G.clino.capSd,runs:G.clino.dbhRuns,src:G.clino.dbhSrc,n:(G.clino._buf||[]).length,sensor:G.clino.sensorActive}));o.C=rep; o.noteC=await pg.evaluate(()=>dbhNote());
/* rifiuto: movimento forte (±3°), poi accetta alla seconda pressione */
await pg.evaluate(()=>startClinoCamera('dbh_l'));await pg.waitForTimeout(300);
await fire(200,90,3,1300);
await pg.evaluate(()=>captureFromOverlay());
o.shakyRejected=await pg.evaluate(()=>({l:G.clino.captured.dbh_l,msg:document.getElementById('fs-clino-label').textContent}));
await pg.evaluate(()=>captureFromOverlay());
o.shakySecondOK=await pg.evaluate(()=>G.clino.captured.dbh_l!==undefined);
o.errs=errs;
console.log(JSON.stringify(o,null,1));
await b.close();})();
