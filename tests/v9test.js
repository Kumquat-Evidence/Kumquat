const {chromium}=require('playwright');const path=require('path');
const F=process.argv[2]||path.resolve(__dirname,'../src/kumquat.html');const SH=n=>path.resolve(__dirname,'shots/v9-'+n+'.png');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const fails=[],errs=[];const ok=(c,m)=>{if(!c)fails.push(m)};
 const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
 p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join(' | ')));p.on('console',m=>{if(m.type()==='error'&&!/ERR_|net::|Failed to load/.test(m.text()))errs.push(m.text())});
 await p.goto('file://'+F);await p.waitForTimeout(600);
 await p.evaluate(()=>{st.lessons={0:1,1:1,2:1};st.roundsDone=3;save();location.hash='home'});await p.waitForTimeout(300);
 ok(await p.$$eval('[data-mood]',e=>e.length)===4,'4 mood chips');
 const plans=await p.evaluate(()=>{const o={};for(const m of ['tired','focused','playful','exam']){st.mood=m;st.moodDay=dayNum();o[m]=roundPlan().map(l=>l.t)}return o});console.log(JSON.stringify(plans));
 ok(!plans.tired.includes('lesson')&&plans.tired.length>=2,'tired light');ok(plans.playful.includes('blitz')&&plans.playful.includes('boss'),'playful arcade');ok(plans.exam[0]==='exam','exam block');ok(plans.focused.includes('lesson'),'focused has lesson');
 // mood chip click updates hero
 await p.evaluate(()=>{st.mood='focused';save();renderToday()});await p.click('[data-mood="tired"]');await p.waitForTimeout(200);
 ok(await p.$eval('#hero-h2',e=>e.textContent).then(t=>/legs/.test(t)),'hero updates');ok(await p.evaluate(()=>moodNow()==='tired'),'mood saved');
 await p.screenshot({path:SH('today-mood'),fullPage:false});
 // exam leg
 await p.evaluate(()=>{st.mood='exam';st.moodDay=dayNum();startRound()});await p.waitForTimeout(400);
 ok(await p.evaluate(()=>Q&&Q.mode==='step1'&&Q.exam&&Q.total===20),'exam quiz started');ok(!(await p.$('#q-hint')),'no hint in exam');
 await p.evaluate(()=>{stopTimer();Q={done:true};ROUND=null;renderRoundBar()});
 // playful legs
 await p.evaluate(()=>{st.mood='playful';st.moodDay=dayNum();ROUND={legs:[{t:'blitz',label:'b',min:2},{t:'boss',topic:'dx',label:'x',min:8}],i:0,cnt:0,started:Date.now(),xp0:0,ans0:0,ok0:0};roundGo()});await p.waitForTimeout(300);
 ok(await p.evaluate(()=>Q&&Q.mode==='blitz'),'blitz leg');await p.evaluate(()=>{stopTimer();Q={done:true};ROUND.i=1;roundGo()});await p.waitForTimeout(300);ok(await p.evaluate(()=>Q&&Q.mode==='boss'&&Q.topic==='dx'),'boss leg');
 await p.evaluate(()=>{stopTimer();Q={done:true};ROUND=null;renderRoundBar()});
 // interfaces
 for(const ui of ['arcade','clean','paper']){await p.evaluate(ui=>{location.hash='settings'},ui);await p.waitForTimeout(250);await p.click(`[data-uk="ui"][data-uv="${ui}"]`);await p.waitForTimeout(150);
   ok(await p.evaluate(ui=>document.documentElement.dataset.ui===ui,ui),'ui '+ui);
   for(const v of ['home','learn','practice','xray','settings']){await p.evaluate(v=>{XS=null;location.hash=v},v);await p.waitForTimeout(250);const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);ok(!ov,`hscroll ${ui} ${v}`)}
   await p.evaluate(()=>location.hash='home');await p.waitForTimeout(250);await p.screenshot({path:SH('home-'+ui)});
   await p.evaluate(()=>location.hash='practice');await p.waitForTimeout(250);await p.screenshot({path:SH('practice-'+ui)})}
 ok(await p.evaluate(()=>document.documentElement.dataset.theme==='light'),'paper forces light');
 await p.evaluate(()=>location.hash='settings');await p.waitForTimeout(200);await p.click('[data-uk="size"][data-uv="l"]');ok(await p.evaluate(()=>document.documentElement.dataset.size==='l'),'size');
 await p.screenshot({path:SH('settings-paper-l'),fullPage:true});
 await p.click('[data-uk="size"][data-uv="m"]');await p.click('[data-uk="ui"][data-uv="arcade"]');
 // persistence across reload
 await p.click('[data-uk="ui"][data-uv="clean"]');await p.reload();await p.waitForTimeout(500);ok(await p.evaluate(()=>document.documentElement.dataset.ui==='clean'&&document.documentElement.dataset.theme==='dark'),'ui persists');
 // sound
 const snd=await p.evaluate(async()=>{uiSet({music:true,fx:true});SND.fx('ok');SND.retune();await new Promise(r=>setTimeout(r,600));const on=SND.on;uiSet({music:false});SND.retune();return on});ok(snd,'music starts');
 // keyboard in links
 await p.evaluate(()=>{LK=null;location.hash='links'});await p.waitForTimeout(300);await p.keyboard.press('2');await p.waitForTimeout(150);ok(await p.$('#lk-next'),'key 2 answers link');await p.keyboard.press('Enter');await p.waitForTimeout(200);ok(await p.evaluate(()=>LK.n===1),'Enter next');
 await p.keyboard.press(']');await p.waitForTimeout(200);console.log('after ] hash',await p.evaluate(()=>location.hash));
 await p.keyboard.press('/');await p.waitForTimeout(300);ok(await p.evaluate(()=>location.hash==='#toolkit'&&document.activeElement&&document.activeElement.id==='tk-q'),'/ search');
 // quiz keys with method step
 await p.evaluate(()=>{document.activeElement.blur();PT_RATE=1;startQuiz('daily')});await p.waitForTimeout(300);
 for(let i=0;i<8;i++){if(await p.$('#q-pt')){await p.keyboard.press('1');await p.waitForTimeout(100);ok(await p.$eval('#q-pt',e=>!!e.dataset.done),'key picks method');break}await p.evaluate(()=>{Q.answered=true;advance()});await p.waitForTimeout(100)}
 // gamepad mock
 const gp=await p.evaluate(async()=>{let st8={pressed:false};const btns=Array.from({length:17},()=>({pressed:false}));const pad={index:0,buttons:btns,axes:[0,0,0,0]};navigator.getGamepads=()=>[pad];window.dispatchEvent(new Event('gamepadconnected'));
   LK=null;location.hash='links';await new Promise(r=>setTimeout(r,400));const tap=async i=>{btns[i]={pressed:true};await new Promise(r=>setTimeout(r,60));btns[i]={pressed:false};await new Promise(r=>setTimeout(r,60))};
   await tap(13);await tap(13);const f1=document.activeElement&&document.activeElement.className;await tap(0);await new Promise(r=>setTimeout(r,150));const answered=!!document.querySelector('#lk-next');await tap(5);await new Promise(r=>setTimeout(r,200));return {f1,answered,hash:location.hash}});
 console.log('gamepad',JSON.stringify(gp));ok(gp.answered,'gamepad A answers');ok(gp.hash!=='#links','R1 switches tab');
 // wide xray
 const w=await b.newPage({viewport:{width:1280,height:800}});w.on('pageerror',e=>errs.push(e.message));await w.goto('file://'+F);await w.waitForTimeout(500);
 await w.evaluate(()=>{XS={x:XR[3],i:1,pts:0,ans:null,sel:{}};location.hash='xray'});await w.waitForTimeout(400);
 ok(await w.evaluate(()=>document.body.classList.contains('wide')&&getComputedStyle(document.querySelector('.xr-grid')).display==='grid'),'wide two-col');await w.screenshot({path:SH('xray-wide')});
 for(const ui of ['clean','paper']){await w.evaluate(ui=>uiSet({ui}),ui);await w.waitForTimeout(200);await w.screenshot({path:SH('xray-wide-'+ui)})}
 console.log('ERRORS',errs.length,errs.slice(0,6));console.log('FAILS',fails.length);fails.forEach(f=>console.log(' -',f));await b.close()})();
