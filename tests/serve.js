// Shared helpers for the beta harness: local server, fake Google, page factory.
const http=require('http'),fs=require('fs'),path=require('path');
const SP=path.resolve(__dirname,'..')+'/';try{fs.mkdirSync(SP+'tests/.tmp',{recursive:true});fs.mkdirSync(SP+'tests/shots',{recursive:true})}catch(e){}
function build(){const s=fs.readFileSync(SP+'src/kumquat.html','utf8');
  fs.writeFileSync(SP+'tests/.tmp/page.html','<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'+s+'</body></html>')}
function serve(port){build();return http.createServer((q,res)=>{res.setHeader('content-type','text/html');res.end(fs.readFileSync(SP+'tests/.tmp/page.html'))}).listen(port)}
// in-memory Drive shared by every page in a run
function fakeGoogle(){const files={};let nid=1;const mk=o=>{const id='f'+(nid++);files[id]={id,...o,modifiedTime:new Date().toISOString()};return files[id]};
  async function route(r){const u=new URL(r.request().url()),m=r.request().method();
    if(u.hostname==='fonts.googleapis.com')return r.fulfill({contentType:'text/css',body:''});
    if(u.hostname==='fonts.gstatic.com')return r.fulfill({status:404,body:''});
    if(u.hostname==='accounts.google.com')return r.fulfill({contentType:'text/javascript',body:`window.google={accounts:{oauth2:{initTokenClient:(o)=>({requestAccessToken:()=>setTimeout(()=>o.callback({access_token:"tok",expires_in:3600}),10)})}}}`});
    if(u.pathname.endsWith('/userinfo'))return r.fulfill({json:{email:'tester@example.com'}});
    if(u.pathname==='/drive/v3/files'&&m==='GET'){const q=u.searchParams.get('q')||'';const name=/name='([^']+)'/.exec(q),parent=/'([^']+)' in parents/.exec(q);const out=Object.values(files).filter(f=>(!name||f.name===name[1])&&(!parent||f.parent===parent[1])&&(!/folder/.test(q)||f.folder));return r.fulfill({json:{files:out.map(f=>({id:f.id,name:f.name,modifiedTime:f.modifiedTime}))}})}
    if(u.pathname==='/drive/v3/files'&&m==='POST'){const b=JSON.parse(r.request().postData());return r.fulfill({json:mk({name:b.name,parent:(b.parents||['root'])[0],folder:true})})}
    if(/^\/drive\/v3\/files\/\w+$/.test(u.pathname)&&m==='GET'){const f=files[u.pathname.split('/').pop()];if(!f)return r.fulfill({status:404,body:'{}'});if(u.searchParams.get('alt')==='media')return r.fulfill({contentType:'application/json',body:f.body});return r.fulfill({json:{id:f.id,trashed:false}})}
    if(u.pathname.startsWith('/upload/drive/v3/files')){const body=r.request().postData();const parts=body.split(/--kumq\d+\r?\n/);const meta=JSON.parse(parts[1].split(/\r?\n\r?\n/)[1]);const content=parts[2].split(/\r?\n\r?\n/)[1].replace(/\r?\n--kumq\d+--$/,'').trim();
      if(m==='PATCH'){const id=u.pathname.split('/').pop().split('?')[0];files[id].body=content;files[id].modifiedTime=new Date().toISOString();return r.fulfill({json:{id}})}
      const f=mk({name:meta.name,parent:meta.parents[0],body:content});return r.fulfill({json:{id:f.id}})}
    return r.fulfill({status:500,body:'{}'})}
  return {files,mk,route}}
async function newPage(browser,{w=390,h=844,theme='light',port,hash='home',G,init}={}){
  const ctx=await browser.newContext({viewport:{width:w,height:h},colorScheme:theme,hasTouch:w<800});
  const p=await ctx.newPage();p._errs=[];
  p.on('pageerror',e=>p._errs.push('pageerror: '+e.message));
  p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))p._errs.push('console: '+m.text())});
  await p.route(/googleapis\.com|gstatic\.com|accounts\.google\.com/,G?G.route:(r=>r.fulfill({status:404,body:''})));
  if(init)await p.addInitScript(init);
  await p.goto(`http://localhost:${port}/#${hash}`);await p.waitForTimeout(350);return p}
module.exports={SP,serve,fakeGoogle,newPage};
