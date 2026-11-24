const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('dialog',d=>d.dismiss());
await pg.route('**/*',r=>{const u=r.request().url();
 if(u.startsWith('file:'))return r.continue();
 if(u.includes('leaflet.js'))return r.fulfill({path:'node_modules/leaflet/dist/leaflet.js',contentType:'text/javascript'});
 if(u.includes('leaflet.css'))return r.fulfill({path:'node_modules/leaflet/dist/leaflet.css',contentType:'text/css'});
 r.abort();});
await pg.goto('file://'+(process.env.ARBO_HTML||'/home/claude/arbovta/index.html')+'');await pg.waitForTimeout(600);
await pg.evaluate(()=>{
 G.trees=[{id:'CLQ1',specie:'Pinus pinea',cpc:'C',lat:44.0320,lng:10.0688,photos:[]},{id:'CLQ12',specie:'Quercus ilex',cpc:'B',lat:44.0325,lng:10.0690,photos:[]},{id:'CLQ13',specie:'Acer',cpc:'A',lat:0,lng:0,photos:[]}];
 go('mappa',document.querySelectorAll('.nav-tab')[4]);});
await pg.waitForTimeout(1500);
await pg.fill('#map-search','clq1');
const list=await pg.evaluate(()=>document.getElementById('map-search-res').innerText.replace(/\n+/g,' | '));
await pg.click('#map-search-res div:nth-child(2)');
await pg.waitForTimeout(2000);
const st=await pg.evaluate(()=>({zoom:leafletMap.getZoom(),c:leafletMap.getCenter(),popup:leafletMap.hasLayer?!!document.querySelector('.leaflet-popup'):null,val:document.getElementById('map-search').value}));
console.log(list,JSON.stringify(st),errs);await b.close();})();
