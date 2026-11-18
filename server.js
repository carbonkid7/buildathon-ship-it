const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const root = __dirname;
const db = new DatabaseSync(path.join(root, 'pawtrol.sqlite'));
db.exec(`CREATE TABLE IF NOT EXISTS animals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL,
  species TEXT NOT NULL,
  image TEXT NOT NULL,
  hash TEXT NOT NULL,
  colors TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  created_at TEXT NOT NULL
); CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  animal_id INTEGER NOT NULL REFERENCES animals(id),
  kind TEXT NOT NULL CHECK(kind IN ('sighting', 'feeding')),
  image TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  happened_at TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);`);

const json = (res, status, data) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(data));
};
const readBody = async req => {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 3_000_000) throw new Error('Photo is too large. Try a smaller image.');
  }
  return JSON.parse(body || '{}');
};
const imageOkay = value => typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value) && value.length < 2_500_000;
const text = (value, max = 120) => String(value || '').trim().slice(0, max);
const number = value => value === null || value === undefined || value === '' ? null : Number(value);
const validCoords = (lat, lng) => (lat === null && lng === null) || (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180);
const validTime = value => typeof value === 'string' && !Number.isNaN(Date.parse(value)) && new Date(value).getTime() <= Date.now() + 60_000;
const speciesSet = new Set(['dog', 'cat', 'cow']);
const distanceKm = (a, b, c, d) => {
  if ([a,b,c,d].some(x => x === null)) return null;
  const rad = Math.PI / 180, lat = (c-a)*rad, lng = (d-b)*rad;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.sin(lat/2)**2 + Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(lng/2)**2));
};
const hamming = (a,b) => {
  if (!/^[01]{64}$/.test(a) || !/^[01]{64}$/.test(b)) return 64;
  let n=0; for (let i=0;i<64;i++) if(a[i]!==b[i]) n++; return n;
};
const colorDistance = (a,b) => {
  try { const x=JSON.parse(a), y=JSON.parse(b); return Math.sqrt(x.reduce((sum,v,i)=>sum+(v-y[i])**2,0))/441.67; }
  catch { return 1; }
};
const animalRows = () => db.prepare(`SELECT a.*, (SELECT MAX(happened_at) FROM events WHERE animal_id=a.id AND kind='feeding') AS last_feeding,
  (SELECT MAX(happened_at) FROM events WHERE animal_id=a.id AND kind='sighting') AS last_sighting,
  (SELECT COUNT(*) FROM events WHERE animal_id=a.id) AS log_count FROM animals a ORDER BY a.id DESC`).all();
const detail = id => {
  const animal = animalRows().find(a => a.id === Number(id));
  if (!animal) return null;
  return { ...animal, events: db.prepare('SELECT * FROM events WHERE animal_id=? ORDER BY happened_at DESC, id DESC').all(id) };
};

const server = http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/animals' && req.method === 'GET') return json(res,200,animalRows());
    if (url.pathname === '/api/stats' && req.method === 'GET') {
      return json(res,200,{
        animals:db.prepare('SELECT COUNT(*) AS n FROM animals').get().n,
        sightings:db.prepare("SELECT COUNT(*) AS n FROM events WHERE kind='sighting'").get().n,
        feedings:db.prepare("SELECT COUNT(*) AS n FROM events WHERE kind='feeding'").get().n
      });
    }
    if (url.pathname === '/api/match' && req.method === 'POST') {
      const b=await readBody(req);
      if (!speciesSet.has(b.species) || !/^[01]{64}$/.test(b.hash) || !Array.isArray(b.colors)) return json(res,400,{error:'Invalid scan'});
      const lat=number(b.latitude), lng=number(b.longitude);
      const candidates=animalRows().filter(a=>a.species===b.species).map(a=>{
        const hash=hamming(b.hash,a.hash), color=colorDistance(JSON.stringify(b.colors),a.colors);
        const km=distanceKm(lat,lng,a.latitude,a.longitude);
        const samePlace=text(b.location).toLowerCase()===a.location.toLowerCase();
        const score=Math.round(Math.max(0,100 - hash*1.5 - color*22 - (km===null ? 0 : Math.min(km,20)*1.2) + (samePlace ? 5 : 0)));
        return {animal:a,score,signals:{hashDifference:hash,colorDifference:Math.round(color*100),distanceKm:km===null?null:Math.round(km*10)/10,samePlace},warning:'Photo similarity is only a lead. Confirm markings and location before adding to this profile.'};
      }).sort((a,b)=>b.score-a.score).slice(0,5);
      return json(res,200,{candidates});
    }
    if (url.pathname === '/api/animals' && req.method === 'POST') {
      const b=await readBody(req), lat=number(b.latitude), lng=number(b.longitude);
      if (!speciesSet.has(b.species) || !text(b.nickname) || !imageOkay(b.image) || !/^[01]{64}$/.test(b.hash) || !Array.isArray(b.colors) || !text(b.location) || !validCoords(lat,lng) || !validTime(b.happened_at)) return json(res,400,{error:'Please provide a photo, nickname, species, place, and valid time.'});
      const now=new Date().toISOString();
      const id=db.prepare('INSERT INTO animals (nickname,species,image,hash,colors,location,latitude,longitude,created_at) VALUES (?,?,?,?,?,?,?,?,?)').run(text(b.nickname,60),b.species,b.image,b.hash,JSON.stringify(b.colors),text(b.location),lat,lng,now).lastInsertRowid;
      db.prepare('INSERT INTO events (animal_id,kind,image,location,latitude,longitude,happened_at,note,created_at) VALUES (?,?,?,?,?,?,?,?,?)').run(id,'sighting',b.image,text(b.location),lat,lng,b.happened_at,'First spotted on Pawtrol',now);
      return json(res,201,detail(id));
    }
    const match=url.pathname.match(/^\/api\/animals\/(\d+)(?:\/events)?$/);
    if (match && req.method==='GET' && !url.pathname.endsWith('/events')) {
      const animal=detail(match[1]); return animal?json(res,200,animal):json(res,404,{error:'Animal not found'});
    }
    if (match && req.method==='POST' && url.pathname.endsWith('/events')) {
      const animal=detail(match[1]); if(!animal)return json(res,404,{error:'Animal not found'});
      const b=await readBody(req), lat=number(b.latitude), lng=number(b.longitude);
      if (!['sighting','feeding'].includes(b.kind) || !imageOkay(b.image) || !text(b.location) || !validCoords(lat,lng) || !validTime(b.happened_at)) return json(res,400,{error:'A photo, place, and valid time are required.'});
      const now=new Date().toISOString();
      db.prepare('INSERT INTO events (animal_id,kind,image,location,latitude,longitude,happened_at,note,created_at) VALUES (?,?,?,?,?,?,?,?,?)').run(Number(match[1]),b.kind,b.image,text(b.location),lat,lng,b.happened_at,text(b.note,300),now);
      return json(res,201,detail(match[1]));
    }
    if (url.pathname.startsWith('/api/')) return json(res,404,{error:'Not found'});
    const file=url.pathname==='/'?'index.html':url.pathname.slice(1);
    if (!['index.html','app.js','styles.css','manifest.webmanifest','sw.js','icon.svg'].includes(file)) {res.writeHead(404);return res.end();}
    const type={html:'text/html',js:'text/javascript',css:'text/css',webmanifest:'application/manifest+json',svg:'image/svg+xml'}[file.split('.').pop()];
    res.writeHead(200,{'content-type':type+'; charset=utf-8'});
    fs.createReadStream(path.join(root,'public',file)).pipe(res);
  } catch(err) { json(res,400,{error:err.message || 'Request failed'}); }
});

const port=Number(process.env.PORT || 3000);
server.listen(port,()=>console.log(`Pawtrol ready at http://localhost:${port}`));
