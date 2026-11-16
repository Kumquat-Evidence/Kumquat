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
 const idle=P=>P.evaluate(async()=>{for(let i=0;i<100&&G.busy;i++)await new Promise(r=>setTimeout(r,100))});
 const dev=async(name)=>{const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(name+": "+e.message));await route(p,errs);await p.goto(url+'#settings');await p.waitForTimeout(500);return p};
 const A=await dev("A");
 console.log("hubCan",await A.evaluate(()=>hubCan()));
 await A.click('#google-root .adv summary');await A.fill('#g-cid','abc.apps.googleusercontent.com');await A.click('#g-connect');await A.waitForTimeout(800);await idle(A);
 console.log("A signed in:",await A.evaluate(()=>signedIn()),"| line:",await A.evaluate(()=>G.line));
 // do some work on A
 await A.evaluate(()=>{startQuiz("daily");for(let i=0;i<10&&Q&&!Q.done;i++){answer(Q.cur.ans);advance()}});await A.waitForTimeout(300);
 await idle(A);await A.evaluate(()=>syncAll(true));await A.waitForTimeout(800);
 const names=Object.values(files).map(f=>f.name);console.log("drive files:",names.join(", "));
 const stateF=Object.values(files).find(f=>f.name==="state.json");console.log("state xp:",JSON.parse(stateF.body).xp,"status summary:",JSON.parse(Object.values(files).find(f=>f.name==="status.json").body).summary);
 console.log("citrus status:",Object.values(files).find(f=>f.name==="Kumquat.status.json").body.slice(0,140));
 // plan.json from scheduler
 const hub=Object.values(files).find(f=>f.name==="hub");const sch=mk({name:"scheduler",parent:hub.id,folder:true});mk({name:"plan.json",parent:sch.id,body:JSON.stringify([{app:"kumquat",date:new Date().toISOString().slice(0,10),start:"19:30",minutes:40,title:"Kumquat · drills"}])});
 const td=(()=>{const t=new Date();return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")})();
 const cit=mk({name:"citrus",parent:hub.id,folder:true});mk({name:"plan.json",parent:cit.id,body:JSON.stringify({app:"citrus",days:{[td]:{shift:{code:"N2",label:"Night",start:"20:00",end:"08:00",overnight:true},blocks:[]}},blocks:[{app:"kumquat",date:td,start:"19:30",minutes:40,title:"Kumquat · drills",status:"accepted"}]})});
 const myapps=Object.values(files).find(f=>f.name==="My Apps");const yz=mk({name:"Yuzu",parent:myapps.id,folder:true});const col=mk({name:"collection",parent:yz.id,folder:true});
 // device B pulls
 const B=await dev("B");console.log('B one-tap (no paste), cid:',await B.evaluate(()=>gcid().slice(0,12)));await B.click('#g-connect');await B.waitForTimeout(1200);await idle(B);
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
 await B.goto(url+'#progress');await B.waitForTimeout(400);console.log('DBG',await B.evaluate(()=>{try{DRAW.progress();return 'ok'}catch(e){return e.stack.slice(0,300)}}),errs,await B.evaluate(()=>[current,location.hash,document.querySelectorAll('.mast').length,document.querySelector('#v-progress')&&document.querySelector('#v-progress').hidden]));const m=await B.$('.mast');await m.scrollIntoViewIfNeeded();const mb=await m.boundingBox();await B.mouse.move(mb.x+20,mb.y+20);await B.mouse.down();await B.waitForTimeout(650);await B.mouse.up();await B.waitForTimeout(250);console.log("sheet:",await B.evaluate(()=>{const s=document.querySelector('.sheet');return s?s.textContent.slice(0,60):"none"}));
 /* ===== v11 d18: sync merge, Keep/Take, navigation-only devices, reset, backup import, strict mastery, local dates ===== */
 let F=0;const ok=(c,m)=>{console.log((c?"ok   ":"FAIL ")+m);if(!c)F++};
 const dstate=()=>JSON.parse(Object.values(files).find(f=>f.name==="state.json").body);
 const work=(P,k)=>P.evaluate(k=>{startQuiz("daily");for(let i=0;i<k&&Q&&!Q.done;i++){answer(Q.cur.ans);advance()}if(Q&&!Q.done){stopTimer();endQuiz()}},k);
 const sync=async P=>{await idle(P);await P.evaluate(()=>syncAll(true));await idle(P)};
 const xp=P=>P.evaluate(()=>st.xp);
 await A.goto(url+'#home');await B.goto(url+'#home');await A.waitForTimeout(400);
 await idle(A);await idle(B);for(let i=0;i<3;i++){await sync(A);await sync(B)}await sync(A);
 let X=dstate().xp;ok(await xp(A)===X&&await xp(B)===X,`settled: A, B and Drive all at ${X} XP`);
 // T10-2: a device that only browsed must not merge or conflict
 await A.evaluate(()=>{["dx","web","lore","settings","home"].forEach(v=>show(v))});
 await work(B,5);await sync(B);const xb=await xp(B);await sync(A);
 ok(await A.evaluate(()=>!G.conflict&&JSON.parse(localStorage.getItem("kumquat_last_sync")||"{}").kind!=="merge"),"browse-only device pulls without a conflict or merge: "+await A.evaluate(()=>localStorage.getItem("kumquat_last_sync").slice(0,60)));
 ok(await xp(A)===xb&&dstate().xp===xb,`browse-only A took B's work (${await xp(A)} = ${xb})`);
 // T10-3: both devices work, the second sync merges and keeps both sessions
 X=dstate().xp;const L0=dstate().log.length;
 await work(A,5);const gA=await xp(A)-X,nA=await A.evaluate(()=>st.log.length)-L0;await work(B,4);const gB=await xp(B)-X,nB=await B.evaluate(()=>st.log.length)-L0;
 await sync(A);await sync(B);
 ok(await B.evaluate(()=>!G.conflict&&/^Merged/.test(G.line)),"second device merges: "+await B.evaluate(()=>G.line));
 ok(dstate().xp===X+gA+gB,`merged XP adds both sessions: ${dstate().xp} = ${X}+${gA}+${gB}`);
 ok(dstate().log.length===L0+nA+nB,`merged log keeps both sessions: ${dstate().log.length} = ${L0}+${nA}+${nB}`);
 await sync(A);ok(await xp(A)===dstate().xp,"first device then pulls the merged save");
 await B.evaluate(()=>location.hash='settings');await B.waitForTimeout(300);ok(!!await B.$('#g-undo-sync'),"Settings offers Undo last sync after a merge");
 // T10-4 + T10-1: device D wipes here and on Drive; A is asked; Keep this device keeps A
 const D=await dev("D");await D.click('#g-connect');await D.waitForTimeout(800);await idle(D);ok(await xp(D)===dstate().xp,`new device D pulls Drive (D ${await xp(D)}, Drive ${dstate().xp}, ${await D.evaluate(()=>G.line)})`);
 await D.click('#reset-progress');ok(!!await D.$('#reset-all'),"signed-in reset asks: this device only, or here and on Drive");
 await D.click('#reset-all');await D.waitForTimeout(600);await idle(D);
 ok(await D.evaluate(()=>!!st.google&&st.xp===0&&!!st.resetAt),"reset keeps st.google and marks resetAt");
 ok(dstate().xp===0&&!!dstate().resetAt,"the wipe reached Drive with a reset marker");
 await D.evaluate(()=>location.hash='settings');await D.waitForTimeout(300);ok(!!await D.$('[data-v11snap="reset"]'),"reset leaves a restore point in Settings "+await D.evaluate(()=>[location.hash,!!localStorage.getItem("kumquat_before_reset"),document.querySelector("#g-snaps")&&document.querySelector("#g-snaps").innerHTML.length]));
 await work(A,3);const xa=await xp(A);await sync(A);
 ok(await A.evaluate(()=>G.conflict&&G.conflict.kind==="reset"),"A is asked about the reset instead of silently wiping");
 await A.evaluate(()=>location.hash='home');await A.waitForTimeout(200);ok(!!await A.$('#v-home #sync-banner'),"conflict shows as a banner on Today");
 await A.evaluate(()=>location.hash='settings');await A.waitForTimeout(300);await A.click('#g-keep');await A.waitForTimeout(300);await idle(A);
 ok(await xp(A)===xa&&dstate().xp===xa,`Keep this device keeps A's ${xa} XP (A ${await xp(A)}, Drive ${dstate().xp})`);
 await A.evaluate(()=>location.hash='home');await A.waitForTimeout(200);ok(!await A.$('#sync-banner'),"banner clears once resolved");
 await sync(D);ok(await xp(D)===xa,"D then pulls A's kept progress");
 // Take: D wipes again, A uses Drive's save, then undoes it
 await D.evaluate(()=>{location.hash='settings'});await D.waitForTimeout(300);await D.click('#reset-progress');await D.click('#reset-all');await D.waitForTimeout(600);await idle(D);
 await sync(A);await A.evaluate(()=>location.hash='settings');await A.waitForTimeout(300);await A.click('#g-take');await A.waitForTimeout(300);
 ok(await xp(A)===0,"Wipe this device too applies Drive's reset");
 await A.click('#g-snaps summary');await A.click('[data-v11snap="drive"]');await A.click('[data-v11snap="drive"]');await A.waitForTimeout(300);
 ok(await xp(A)===xa,`restore point brings A back to ${xa} XP`);
 // device-only reset stops syncing and leaves Drive alone
 await sync(A);const xd=dstate().xp;await B.goto(url+'#settings');await B.waitForTimeout(500);await idle(B);await B.evaluate(()=>{const s=document.querySelector('.sheet-scrim');if(s)s.remove()});await B.click('#reset-progress');await B.click('#reset-yes');await B.waitForTimeout(300);await sync(B);
 ok(await B.evaluate(()=>st.google.syncState===false&&st.xp===0)&&dstate().xp===xd,`wipe this device only: B 0 XP, sync off, Drive still ${xd}`);
 // T10-5: import validates, previews and asks
 await work(B,2);const xb2=await xp(B);await B.evaluate(()=>location.hash='settings');await B.waitForTimeout(300);await B.click('#g-backup details summary');
 await B.fill('#g-io','{"topics":{}}');await B.click('#g-import');await B.waitForTimeout(200);
 ok(await xp(B)===xb2&&!await B.$('#g-imp-card'),'{"topics":{}} is refused and changes nothing');
 const bk=await A.evaluate(()=>JSON.stringify(stateForDrive()));ok(JSON.parse(bk).schema===1,"backups carry schema 1");
 await B.fill('#g-io',bk);await B.click('#g-import');await B.waitForTimeout(200);
 ok(!!await B.$('#g-imp-card')&&await xp(B)===xb2,"a real backup shows a preview first: "+(await B.evaluate(()=>{const c=document.querySelector('#g-imp-card');return c?c.innerText.replace(/\n/g," / ").slice(0,160):""})));
 await B.click('#g-imp-replace');await B.waitForTimeout(200);ok(await xp(B)===JSON.parse(bk).xp&&!!await B.$('[data-v11snap="import"]'),"Replace applies it and keeps a restore point");
 // device name used on Drive saves
 await A.fill('#g-dev','Steam Deck');await A.press('#g-dev','Tab');ok(await A.evaluate(()=>stateForDrive().device)==="Steam Deck","device name goes on saves");
 // T10-9/10/11/25: strict mastery
 const E=await dev("E");
 await E.evaluate(()=>{st.recent.dx=Array(30).fill(true).map((x,i)=>i>1);st.tdays.dx=[dayNum()];st.topics.dx={c:28,n:30};st.mast={};mastNote('dx');save()});await E.reload();await E.waitForTimeout(400);
 ok(await E.evaluate(()=>mastState('dx'))==="none","one-day cram + reload is not mastered");
 await E.evaluate(()=>{st.mast.dx={on:dayNum()-40,check:dayNum()-10,lv:0};save()});ok(await E.evaluate(()=>mastState('dx'))==="fading","check 10 days ago at a 7-day gap: fading");
 await E.evaluate(()=>{startRecheck('dx');answer(Q.cur.ans);stopTimer();endQuiz()});
 ok(await E.evaluate(()=>mastState('dx')==="fading"&&st.mast.dx.check===dayNum()-10&&st.mast.dx.rc.n===1),"1 right then End does not pass the re-check");
 ok(await E.evaluate(()=>{startRecheck('dx');return Q.total})===4,"the next re-check asks only the remaining 4");
 await E.evaluate(()=>{answer((Q.cur.ans+1)%document.querySelectorAll('.opt').length);location.hash='home'});await E.waitForTimeout(200);
 ok(await E.evaluate(()=>st.mast.dx.rc&&st.mast.dx.rc.n===2&&st.mast.dx.rc.c===1),"leaving after a wrong answer still counts it");
 await E.evaluate(()=>{startRecheck('dx');answer((Q.cur.ans+1)%document.querySelectorAll('.opt').length);stopTimer();endQuiz()});ok(await E.evaluate(()=>st.mast.dx.lost!=null),"two misses lose the topic");
 await E.evaluate(()=>{st.mast.dx={on:dayNum()-40,check:dayNum()-10,lv:0};save();startRecheck('dx');for(let i=0;i<5&&Q&&!Q.done;i++){answer(Q.cur.ans);advance()}});await E.waitForTimeout(200);
 ok(await E.evaluate(()=>st.mast.dx.check===dayNum()&&st.mast.dx.lv===1&&!st.mast.dx.rc),"5 of 5 passes and doubles the gap");
 await E.evaluate(()=>{st.mast.dx={on:dayNum()-400,check:dayNum()-365,lv:0};save()});ok(await E.evaluate(()=>mastState('dx')==="none"&&!topicMastered('dx')),"checked 365 days ago: no longer mastered");
 await E.reload();await E.waitForTimeout(400);ok(await E.evaluate(()=>st.mast.dx.lost!=null),"expired topic is retired to lost on boot");
 const sz=await E.evaluate(()=>{const o=sanitize({mast:{dx:"yes",risk:{on:1,check:"x",lv:0},epi:{lost:3},stats:{on:1,check:2,lv:9}},log:[{d:1,mode:"mock",n:5,score:9},{d:1,mode:"x",n:0,score:0}],tdays:{dx:[1,"a",2],risk:"no"}});return JSON.stringify({m:o.mast,l:o.log,t:o.tdays})});
 ok(sz===JSON.stringify({m:{epi:{lost:3},stats:{on:1,check:2,lv:4}},l:[{d:1,mode:"mock",n:5,score:5}],t:{dx:[1,2]}}),"sanitize drops fake mastery and impossible scores: "+sz);
 // T10-19: local dates at 01:30 in Riyadh
 const nctx=await b.newContext({viewport:{width:400,height:860},timezoneId:'Asia/Riyadh'});const N=await nctx.newPage();N.on('pageerror',e=>errs.push("N: "+e.message));await route(N,errs);
 await N.addInitScript(`(()=>{const base=${Date.UTC(2026,10,13,22,30)},real=Date.now(),R=Date;const off=()=>base+(R.now()-real);class FD extends R{constructor(...a){if(a.length)super(...a);else super(off())}static now(){return off()}}FD.UTC=R.UTC;FD.parse=R.parse;window.Date=FD})()`);
 await N.goto(url+'#home');await N.waitForTimeout(400);const ns=await N.evaluate(()=>{const s=hubStatus();return{t:s.today.date,ws:s.week.start,we:s.week.end,d0:s.week.days[0].date,d6:s.week.days[6].date}});
 ok(ns.t==="2026-11-14"&&ns.ws===ns.d0&&ns.we===ns.d6&&ns.ws==="2026-11-09","status dates are local at 01:30 Riyadh: "+JSON.stringify(ns));
 console.log("FAILS "+F);
 await B.screenshot({path:'shot-settings.png'});await A.goto(url+'#settings');await A.waitForTimeout(300);await A.screenshot({path:'shot-settings-a.png'});
 console.log("errors:",errs);await b.close();srv.close()})();
