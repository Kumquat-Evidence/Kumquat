// v8 feature test: google default, method step, recall, links, xray, fading hints, round legs
const {chromium}=require('playwright');const path=require('path');
const F=process.argv[2]||path.resolve(__dirname,'../src/kumquat.html');
(async()=>{const b=await chromium.launch();const fails=[];const errs=[];
 const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+F);await p.waitForTimeout(700);
 const ok=(c,m)=>{if(!c)fails.push(m)};
 // google default
 ok(await p.evaluate(()=>gcid().endsWith('apps.googleusercontent.com')&&!st.google.clientId),'default client id');
 // method step
 await p.evaluate(()=>{PT_RATE=1;startQuiz('topic','dx')});await p.waitForTimeout(300);
 let seenPT=0;
 for(let k=0;k<40;k++){const has=await p.$("#q-pt");
   if(has){seenPT++;ok(await p.$eval('.opts',e=>e.hidden),'opts hidden during method step');
     await p.click('.ptopt');await p.waitForTimeout(100);
     ok(await p.$eval('#q-pt-fb',e=>e.textContent.length>5),'method feedback');
     const typed=await p.$('#q-type');ok(typed?!(await p.$eval('#q-type',e=>e.hidden)):!(await p.$eval('.opts',e=>e.hidden)),'reveal after method');}
   if(await p.$('#q-show'))await p.click('#q-show');
   // hint
   if(await p.$('#q-hint')){await p.click('#q-hint');ok(await p.$eval('#q-hint-out',e=>e.innerHTML.length>3),'hint shows')}
   await p.click('.opt');await p.waitForTimeout(80);if(await p.$('#q-conf:not([hidden])'))await p.click('#q-conf [data-conf="think"]');await p.waitForTimeout(60);await p.click('#q-next');await p.waitForTimeout(120);
   if(await p.evaluate(()=>!Q||Q.done))break}
 ok(seenPT>0,'method step appeared');
 ok(await p.evaluate(()=>st.ptype&&st.ptype.n>0),'ptype stats');
 // hint parts
 const hp=await p.evaluate(()=>Object.keys(CALCF).map(k=>{const q=CALCF[k]();const h=hintParts(q);return h?[k,h.half,h.formula]:[k,null]}));
 hp.forEach(([k,h,f])=>{if(h)ok(/___/.test(h)&&f.length>2,'hint parts '+k)});
 // fade progression
 ok(await p.evaluate(()=>{const q=CALCF.genSE();Q={hinted:1};fadeNote(q,true);fadeNote(q,true);const a=fadeLv(q);Q={hinted:false};fadeNote(q,false);return a===2&&fadeLv(q)===1}),'fade levels');
 // recall
 await p.evaluate(()=>{Q=null;st.lessons={0:true,1:true};st.ldone={0:dayNum()-4,1:dayNum()};st.recall={};save();location.hash='recall'});await p.waitForTimeout(400);
 ok(await p.$$eval('.rc-in',e=>e.length)>=4,'recall gaps for lesson 1');
 const cl=await p.evaluate(()=>LESSONS.flatMap(l=>(l.take||[]).map(t=>{const c=clozeOf(t);return [t,c.ans]})));
 cl.forEach(([t,a])=>ok(a&&a.length>=2&&a.length<=45,'cloze '+t+' → '+a));
 await p.fill('.rc-in','Proportion');await p.click('#rc-reveal');await p.waitForTimeout(150);
 {const n=await p.$$eval('.rc-g input',e=>e.length);for(let i=0;i<n;i++){const c=(await p.$$('.rc-g input'))[i];if(!(await c.isChecked())){await c.click();await p.waitForTimeout(40)}}}
 await p.click('#rc-save');await p.waitForTimeout(200);
 ok(await p.evaluate(()=>st.recall[0]&&st.recall[0].s===1&&st.recall[0].due===dayNum()+7),'recall schedules next');
 // links
 await p.evaluate(()=>{LK=null;location.hash='links'});await p.waitForTimeout(300);
 for(let k=0;k<6;k++){await p.click('.lkopt');await p.waitForTimeout(60);await p.click('#lk-next');await p.waitForTimeout(80)}
 ok(await p.$('#lk-again'),'links summary');
 // xray all
 const XN=await p.evaluate(()=>XR.length);
 for(let xi=0;xi<XN;xi++){await p.evaluate(()=>{XS=null;if(location.hash==='#xray')DRAW.xray();else location.hash='xray'});await p.waitForTimeout(250);
   const t=await p.$$('[data-x]');await t[xi].click();await p.waitForTimeout(150);
   const SN=await p.evaluate(()=>XS.x.steps.length);for(let sI=0;sI<SN;sI++){
     if(await p.$('.xr-o')){const a=await p.evaluate(()=>XS.x.steps[XS.i].a);await p.click(`.xr-o[data-i="${a}"]`)}
     else if(await p.$('#xr-in')){const a=await p.evaluate(()=>XS.x.steps[XS.i].a);await p.fill('#xr-in',String(a));await p.click('#xr-num button[type=submit]')}
     else{const a=await p.evaluate(()=>XS.x.steps[XS.i].a);for(const k of a)await p.check(`.xr-sp input[data-k="${k}"]`);await p.click('#xr-chk')}
     await p.waitForTimeout(80);ok(await p.$('#xr-next'),`xray ${xi} step ${sI} next`);await p.click('#xr-next');await p.waitForTimeout(80)}
   ok(await p.$('#xr-list'),'xray summary '+xi)}
 const xs=await p.evaluate(()=>st.xray);ok(Object.keys(xs).length===XN&&Object.values(xs).every(v=>v===100),'xray perfect scores');
 // full-score check on last xray: correct answers → 100 for those where mcq first option might be wrong due to shuffle... just log
 console.log('xray scores',JSON.stringify(xs));
 // round with new legs
 await p.evaluate(()=>{st.lessons={0:1,1:1,2:1,3:1,4:1};st.ldone={0:dayNum()-3};st.recall={};st.xray={};st.budget=60;save()});
 const legs=await p.evaluate(()=>roundPlan().map(l=>l.t));console.log('legs',legs.join(','));ok(legs.includes('recall'),'round has recall');
 const par=await p.evaluate(()=>{const odd=dayNum()%2;const l=roundPlan().map(x=>x.t);return {odd,l}});console.log('parity',JSON.stringify(par));
 ok(par.odd?par.l.includes('paper'):par.l.includes('xray'),'xray/paper alternation');
 // drive round legs recall + links + xray via roundGo
 await p.evaluate(()=>{ROUND={legs:[{t:'recall',n:0,label:'r',min:2},{t:'links',n:2,label:'l',min:2},{t:'xray',id:'hs-trop',label:'x',min:5}],i:0,cnt:0,started:Date.now(),xp0:st.xp,ans0:0,ok0:0};roundGo()});await p.waitForTimeout(400);
 ok(await p.$('#rc-reveal'),'round recall leg');await p.click('#rc-reveal');await p.waitForTimeout(100);await p.click('#rc-save');await p.waitForTimeout(1200);
 ok(await p.evaluate(()=>ROUND&&ROUND.i===1),'recall leg advanced');
 for(let k=0;k<2;k++){await p.click('.lkopt');await p.waitForTimeout(100);if(k<1){await p.click('#lk-next');await p.waitForTimeout(100)}}
 await p.waitForTimeout(1500);ok(await p.evaluate(()=>ROUND&&ROUND.i===2),'links leg advanced');
 ok(await p.$('.xr-step'),'xray leg opened');
 // layout
 for(const v of ['recall','links','xray','quiz']){await p.evaluate(v=>{if(v==='quiz'){ROUND=null;PT_RATE=1;startQuiz('daily')}else location.hash=v},v);await p.waitForTimeout(300);
   const ov=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);ok(!ov,'no h-scroll '+v);await p.screenshot({path:path.resolve(__dirname,'shots/v8-'+v+'.png'),fullPage:true})}
 await p.evaluate(()=>{XS={x:XR[0],i:4,pts:0,ans:null,sel:{}};location.hash='xray'});await p.waitForTimeout(300);await p.screenshot({path:path.resolve(__dirname,'shots/v8-xray-spin.png'),fullPage:true});
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';LK=null;location.hash='links'});await p.waitForTimeout(300);await p.screenshot({path:path.resolve(__dirname,'shots/v8-links-dark.png'),fullPage:true});
 console.log('ERRORS',errs.length,errs.slice(0,5));console.log('FAILS',fails.length);fails.slice(0,40).forEach(f=>console.log(' -',f));await b.close()})();
