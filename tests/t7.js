const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:420,height:800}})).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
const res=await pg.evaluate(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const D=Math.PI/180, out={};
 // pose builder: camera direction (az clockwise from N, el) + roll psi (deg) -> euler alpha,beta,gamma (W3C ZXY)
 const norm=v=>{const n=Math.hypot(...v);return v.map(x=>x/n)};
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 function euler(az,el,psi,noise){
   az+= (noise?(Math.random()-.5)*2*noise:0); el+=(noise?(Math.random()-.5)*2*noise:0);
   const d=[Math.sin(az*D)*Math.cos(el*D),Math.cos(az*D)*Math.cos(el*D),Math.sin(el*D)];
   const up=[0,0,1]; let u=norm([up[0]-dot(up,d)*d[0],up[1]-dot(up,d)*d[1],up[2]-dot(up,d)*d[2]]);
   // rotate u about d by psi (Rodrigues)
   const c=Math.cos(psi*D), s=Math.sin(psi*D), k=cross(d,u);
   const y=[0,1,2].map(i=>u[i]*c+k[i]*s+d[i]*dot(d,u)*(1-c));
   const z=d.map(x=>-x); const x=cross(y,z);
   const R=[[x[0],y[0],z[0]],[x[1],y[1],z[1]],[x[2],y[2],z[2]]];
   const beta=Math.asin(R[2][1])/D, gamma=Math.atan2(-R[2][0],R[2][2])/D, alpha=((Math.atan2(-R[0][1],R[1][1])/D)+360)%360;
   return {alpha,beta,gamma};
 }
 async function aim(az,el,psi,noise){ // send a burst of samples
   for(let i=0;i<8;i++){const e=euler(az,el,psi,noise);
     window.dispatchEvent(new DeviceOrientationEvent('deviceorientation',{alpha:e.alpha,beta:e.beta,gamma:e.gamma}));await sleep(15);}
   await sleep(340);
 }
 render('misure'); await sleep(100); startSensor();
 const tan=a=>Math.tan(a*D);
 // 0. orientation independence: same direction in portrait / landscape / tilted
 const reads=[];
 for(const psi of [0,90,-90,45,180]){ await aim(37,25,psi,0); const r=readClino(); reads.push([psi,+r.el.toFixed(2),+r.az.toFixed(2)]); }
 out.orient=reads;
 // 1. distance meter: eye 1.3 m, trunk surface at 6.0 m
 G.clino.phoneH=1.3;
 measureDist('dist'); await sleep(150);
 await aim(10,-Math.atan(1.3/6)/D,0,0);
 captureFromOverlay(); await sleep(150);
 out.dist={dist:G.clino.dist,input:document.getElementById('dist-in').value,info:G.clino.distInfo.dist,overlayClosed:!document.getElementById('cam-fs-overlay'),q:document.getElementById('dq-dist').innerHTML.replace(/<[^>]+>/g,'')};
 async function pair(first,p1,p2,psi,noise){
   captureA(first); await sleep(150);
   await aim(p1[0],p1[1],psi,noise); captureFromOverlay();
   await aim(p2[0],p2[1],psi,noise); captureFromOverlay();
   await sleep(900);
 }
 // 2. height: tree 12 m, d=6
 G.clino.dist=6;
 await pair('base',[0,-Math.atan(1.3/6)/D],[0,Math.atan(10.7/6)/D],0,0);
 out.h=G.clino.meas.h; out.hq=G.clino.q.h;
 // 3. crown width: +-3 m lateral, 8 m to centre -> 6 m; landscape hold
 G.clino.dist=8; const azc=Math.atan(3/8)/D;
 await pair('cw_l',[-azc,40],[azc,40],90,0);
 out.cw=G.clino.meas.cw;
 // depth: 5 m wide at 7 m centre; portrait
 G.clino.distCd=7; const azd=Math.atan(2.5/7)/D;
 await pair('cd_l',[100-azd,35],[100+azd,35],0,0);
 out.cd=G.clino.meas.cd;
 // 4. DBH: radius .25 centre at 6 m -> surface 5.75 -> 50 cm
 G.clino.distDBH=5.75; const ah=Math.asin(0.25/6)/D;
 await pair('dbh_l',[200-ah,0],[200+ah,0],-90,0);
 out.dbh=G.clino.meas.dbh; out.dbhq=G.clino.q.dbh;
 // 5. noise +-0.3 deg per sample
 const vals=[];
 for(let k=0;k<10;k++){ G.clino.captured={};G.clino.capAz={}; await pair('dbh_l',[300-ah,0],[300+ah,0],30,0.3); vals.push(G.clino.meas.dbh); }
 const mean=vals.reduce((a,b)=>a+b)/vals.length, sd=Math.sqrt(vals.reduce((a,b)=>a+(b-mean)**2,0)/vals.length);
 out.dbhNoise={mean:+mean.toFixed(1),sd:+sd.toFixed(1)};
 // 6. UI after render
 renderClino(); await sleep(50);
 const html=document.getElementById('content').innerHTML;
 out.ui={cd:html.includes('cmv-cd'),qdbh:/q-dbh/.test(html),meas:document.getElementById('cmv-dbh').textContent};
 // 7. transfer
 G.clino.meas={h:12,dbh:50,cw:6,cd:5};
 return out;});
console.log(JSON.stringify(res,null,1),errs);await b.close();})();
