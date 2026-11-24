const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:800,height:600}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>{const u=r.request().url();
 if(u.includes('leaflet.js'))return r.fulfill({body:fs.readFileSync('node_modules/leaflet/dist/leaflet.js'),contentType:'text/javascript'});
 if(u.includes('leaflet.css'))return r.fulfill({body:fs.readFileSync('node_modules/leaflet/dist/leaflet.css'),contentType:'text/css'});
 if(u.startsWith('file:'))return r.continue(); return r.abort();});
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(800);
const r=await pg.evaluate(async()=>{
 G.form.lat='44.000000';G.form.lng='10.000000';
 document.body.insertAdjacentHTML('beforeend','<input id="lat-in"><input id="lng-in"><div id="gps-box"><span id="gps-txt"></span><div id="gps-coords"></div></div>');
 openGpsFix();await new Promise(r=>setTimeout(r,600));
 const ov=!!document.getElementById('gpsfix-ov');
 _gfMap.fire('click',{latlng:L.latLng(44.1234567,10.7654321)});
 confirmGpsFix();
 return {ov,lat:G.form.lat,lng:G.form.lng,inp:document.getElementById('lat-in').value,closed:!document.getElementById('gpsfix-ov'),txt:document.getElementById('gps-txt').textContent};});
console.log(JSON.stringify(r),errs);await b.close();})();
