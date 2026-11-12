// Build the phone app (GitHub Pages) from src/: index.html = pwa-head + kumquat.html + pwa-tail; sw.js cache name = content hash.
// node tools/build.js          → writes index.html and sw.js
// node tools/build.js --check  → exits 1 if the committed build is stale
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const R=path.resolve(__dirname,'..'),rd=f=>fs.readFileSync(path.join(R,f),'utf8');
const app=rd('src/kumquat.html').replace(/\n+$/,'');
const html=rd('src/pwa-head.html')+app+'\n'+rd('src/pwa-tail.html');
const hash=crypto.createHash('sha1').update(html).digest('hex').slice(0,10);
const sw=rd('src/sw.template.js').replace('kumquat-__HASH__','kumquat-'+hash);
const ver=(/APP_VERSION="([^"]+)"/.exec(app)||[])[1];
if(process.argv.includes('--check')){const ok=fs.readFileSync(path.join(R,'index.html'),'utf8')===html&&fs.readFileSync(path.join(R,'sw.js'),'utf8')===sw;
  console.log(ok?`build is current (${ver}, sw kumquat-${hash})`:'STALE BUILD: run node tools/build.js and commit');process.exit(ok?0:1)}
fs.writeFileSync(path.join(R,'index.html'),html);fs.writeFileSync(path.join(R,'sw.js'),sw);console.log(`built ${ver} · sw kumquat-${hash}`);
