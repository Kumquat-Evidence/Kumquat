const {chromium}=require('playwright');const http=require('http');const fs=require('fs');
// fake Drive
const files={};let nid=1;const mk=(o)=>{const id="f"+(nid++);files[id]={id,...o,modifiedTime:new Date().toISOString()};return files[id]};
function route(page,errs){
 return page.route(/googleapis\.com|gstatic\.com|accounts\.google\.com/,async r=>{const u=new URL(r.request().url()),m=r.request().method();
  if(/fonts\.(googleapis|gstatic)\.com/.test(u.hostname))return r.fulfill({contentType:"text/css",body:""});if(u.hostname==="accounts.google.com"){return r.fulfill({contentType:"text/javascript",body:`window.google={accounts:{oauth2:{initTokenClient:(o)=>({requestAccessToken:()=>o.callback({access_token:"tok",expires_in:3600})})}}}`})}
  if(u.pathname.endsWith("/userinfo"))return r.fulfill({json:{email:"amro@test"}});
  if(u.pathname==="/drive/v3/files"&&m==="GET"){const q=u.searchParams.get("q")||"";const name=/name='([^']+)'/.exec(q),parent=/'([^']+)' in parents/.exec(q);const out=Object.values(files).filter(f=>(!name||f.name===name[1])&&(!parent||f.parent===parent[1])&&(!/folder/.test(q)||f.folder));return r.fulfill({json:{files:out.map(f=>({id:f.id,name:f.name,modifiedTime:f.modifiedTime}))}})}
  if(u.pathname==="/drive/v3/files"&&m==="POST"){const b=JSON.parse(r.request().postData());return r.fulfill({json:mk({name:b.name,parent:(b.parents||["root"])[0],folder:true})})}
  if(/^\/drive\/v3\/files\/\w+$/.test(u.pathname)&&m==="GET"){const f=files[u.pathname.split("/").pop()];if(!f)return r.fulfill({status:404,body:"{}"});if(u.searchParams.get("alt")==="media")return r.fulfill({contentType:"application/json",body:f.body});return r.fulfill({json:{id:f.id,trashed:false}})}
  if(u.pathname.startsWith("/upload/drive/v3/files")){const body=r.request().postData();const parts=body.split(/--kumq\d+\r?\n/);const meta=JSON.parse(parts[1].split(/\r?\n\r?\n/)[1]);const content=parts[2].split(/\r?\n\r?\n/)[1].replace(/\r?\n--kumq\d+--$/,"").trim();
    if(m==="PATCH"){const id=u.pathname.split("/").pop().split("?")[0];files[id].body=content;files[id].modifiedTime=new Date().toISOString();return r.fulfill({json:{id}})}
    const f=mk({name:meta.name,parent:meta.parents[0],body:content});return r.fulfill({json:{id:f.id}})}
  errs.push("unhandled "+m+" "+u.href);return r.fulfill({status:500,body:"{}"})});
}
(async()=>{const b=await chromium.launch();const errs=[];
 const url='http://localhost:4173/preview.html';const srv=http.createServer((q,res)=>{res.setHeader("content-type","text/html");res.end(fs.readFileSync(require('path').join(__dirname,'../src/kumquat.html')))}).listen(4173);
 const dev=async(name)=>{const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(name+": "+e.message));await route(p,errs);await p.goto(url+'#settings');await p.waitForTimeout(500);return p};
 const A=await dev("A");
 console.log("hubCan",await A.evaluate(()=>hubCan()));
 await A.click('#google-root .adv summary');await A.fill('#g-cid','abc.apps.googleusercontent.com');await A.click('#g-connect');await A.waitForTimeout(800);
 console.log("A signed in:",await A.evaluate(()=>signedIn()),"| line:",await A.evaluate(()=>G.line));
 // do some work on A
 await A.evaluate(()=>{startQuiz("daily");for(let i=0;i<10&&Q&&!Q.done;i++){answer(Q.cur.ans);advance()}});await A.waitForTimeout(300);
 await A.evaluate(()=>syncAll(true));await A.waitForTimeout(800);
 const names=Object.values(files).map(f=>f.name);console.log("drive files:",names.join(", "));
 const stateF=Object.values(files).find(f=>f.name==="state.json");console.log("state xp:",JSON.parse(stateF.body).xp,"status summary:",JSON.parse(Object.values(files).find(f=>f.name==="status.json").body).summary);
 console.log("citrus status:",Object.values(files).find(f=>f.name==="Kumquat.status.json").body.slice(0,140));
 // plan.json from scheduler
 const hub=Object.values(files).find(f=>f.name==="hub");const sch=mk({name:"scheduler",parent:hub.id,folder:true});mk({name:"plan.json",parent:sch.id,body:JSON.stringify([{app:"kumquat",date:new Date().toISOString().slice(0,10),start:"19:30",minutes:40,title:"Kumquat · drills"}])});
 const td=(()=>{const t=new Date();return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")})();
 const cit=mk({name:"citrus",parent:hub.id,folder:true});mk({name:"plan.json",parent:cit.id,body:JSON.stringify({app:"citrus",days:{[td]:{shift:{code:"N2",label:"Night",start:"20:00",end:"08:00",overnight:true},blocks:[]}},blocks:[{app:"kumquat",date:td,start:"19:30",minutes:40,title:"Kumquat · drills",status:"accepted"}]})});
 const myapps=Object.values(files).find(f=>f.name==="My Apps");const yz=mk({name:"Yuzu",parent:myapps.id,folder:true});const col=mk({name:"collection",parent:yz.id,folder:true});
 // device B pulls
 const B=await dev("B");console.log('B one-tap (no paste), cid:',await B.evaluate(()=>gcid().slice(0,12)));await B.click('#g-connect');await B.waitForTimeout(1200);
 console.log("B xp after pull:",await B.evaluate(()=>st.xp),"| B line:",await B.evaluate(()=>G.line),"| plan:",await B.evaluate(()=>JSON.stringify(G.plan)));
 await B.goto(url+'#home');await B.waitForTimeout(400);console.log("shift:",await B.evaluate(()=>JSON.stringify(shiftLoad())),"| mood:",await B.evaluate(()=>moodNow()),"| legs:",await B.evaluate(()=>roundPlan().map(l=>l.t).join(",")));
 const ys=await B.evaluate(async()=>{st.miss={};for(let i=0;i<6;i++)st.miss["B:"+i]=2;try{const n=await sendToYuzu("misses");const f=await sendToYuzu("formulas");return n+" misses, "+f+" formulas"}catch(e){return "ERR "+e.message}});
 console.log("yuzu:",ys);const inbox=Object.values(files).find(f=>f.name==="inbox");const packs=Object.values(files).filter(f=>inbox&&f.parent===inbox.id).map(f=>f.name+":"+JSON.parse(f.body).cards.length+":"+JSON.parse(f.body).cards[0].type);console.log("inbox:",packs.join(" | "));
 await B.evaluate(async()=>{st.google.publish=true;await writeStatus(true)});const stj=JSON.parse(Object.values(files).filter(f=>f.name==="status.json").pop().body);console.log("status v2:",stj.contract,stj.title,stj.metrics.length,stj.actions.map(a=>a.id).join(","),"| inbox:",stj.inbox.map(i=>i.title).join(" / "),"| summary:",stj.summary);
 console.log("citrus line:",await B.evaluate(()=>document.querySelector('#citrus-line').textContent.trim().slice(0,90)));
 // conflict: both change
 await A.evaluate(()=>{startQuiz("blitz");answer(Q.cur.ans);advance();stopTimer();endQuiz()});await A.evaluate(()=>syncAll(true));await A.waitForTimeout(600);
 await B.evaluate(()=>{startQuiz("blitz");answer(Q.cur.ans);advance();stopTimer();endQuiz()});await B.evaluate(()=>syncAll(true));await B.waitForTimeout(600);
 console.log("B conflict?",await B.evaluate(()=>!!G.conflict),"| line:",await B.evaluate(()=>G.line));
 // hand kit: hold on streak chip
 await B.goto(url+'#home');await B.waitForTimeout(300);const chip=await B.$('#hdr-streak');const bb=await chip.boundingBox();await B.mouse.move(bb.x+5,bb.y+5);await B.mouse.down();await B.waitForTimeout(600);console.log("hint bubble:",await B.evaluate(()=>{const h=document.querySelector('.hintbubble');return h&&h.classList.contains('on')?h.textContent.slice(0,40):"none"}));await B.mouse.up();
 // hold menu on a mastery tile
 await B.goto(url+'#progress');await B.waitForTimeout(400);const m=await B.$('.mast');await m.scrollIntoViewIfNeeded();const mb=await m.boundingBox();await B.mouse.move(mb.x+20,mb.y+20);await B.mouse.down();await B.waitForTimeout(650);await B.mouse.up();await B.waitForTimeout(250);console.log("sheet:",await B.evaluate(()=>{const s=document.querySelector('.sheet');return s?s.textContent.slice(0,60):"none"}));
 await B.screenshot({path:'shot-settings.png'});await A.goto(url+'#settings');await A.waitForTimeout(300);await A.screenshot({path:'shot-settings-a.png'});
 console.log("errors:",errs);await b.close();srv.close()})();
