const {chromium}=require('playwright');const path=require('path');
const F=process.argv[2]||path.resolve(__dirname,'../src/kumquat.html');const SH=n=>path.resolve(__dirname,'shots/v10-'+n+'.png');
(async()=>{const b=await chromium.launch();const fails=[],errs=[];const ok=(c,m)=>{if(!c)fails.push(m)};
 const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));
 await p.goto('file://'+F);await p.waitForTimeout(700);
 ok(await p.evaluate(()=>document.documentElement.dataset.ui==='guild'),'guild default');
 await p.evaluate(()=>{st.log=[{d:dayNum()-4,mode:'daily',n:10,score:5}];save();location.hash='home';renderToday()});await p.waitForTimeout(300);
 ok(await p.$eval('#shaykh-card',e=>/Murid/.test(e.textContent)&&/away|gone/.test(e.textContent)),'shaykh greets away + rank');
 ok(await p.evaluate(()=>document.documentElement.dataset.fog==='1'&&parseFloat(document.documentElement.style.getPropertyValue('--fog'))>0.3),'fog after absence');
 await p.screenshot({path:SH('today-light'),fullPage:true});
 // omen
 await p.evaluate(()=>{document.querySelector('#today-extras').open=true});await p.click('#omen-break');await p.waitForTimeout(100);ok(await p.$$eval('.om-o',e=>e.length)>=2,'omen question');await p.screenshot({path:SH('omen')});
 const ans=await p.evaluate(()=>OMEN_Q.ans);await p.click(`.om-o[data-i="${ans}"]`);await p.waitForTimeout(100);ok(await p.evaluate(()=>omenToday().ok),'omen solved');await p.click('#om-close');ok(await p.$eval('#omen-card',e=>/broken/.test(e.textContent)),'omen closed');
 // wrong answer → whisper
 await p.evaluate(()=>{for(let i=0;i<10;i++)worldOnAnswer(false)});await p.waitForTimeout(100);ok(await p.evaluate(()=>!!document.querySelector('#dajij-w')||!!document.querySelector('#shaykh-pop')),'whisper/shaykh shown');
 // prologue oath
 await p.evaluate(()=>{CAMP_OPEN=null;location.hash='campaign'});await p.waitForTimeout(300);ok(await p.$$eval('.camp-n',e=>e.length)===12,'12 stops');
 await p.click('[data-ci="0"]');await p.waitForTimeout(200);await p.screenshot({path:SH('oath-brief'),fullPage:true});await p.click('#oath-go');await p.waitForTimeout(150);
 for(let i=0;i<7;i++){const a=await p.evaluate(()=>OATH[OS.i].a);await p.click(`.oath-o[data-i="${a}"]`);if(i===0)await p.screenshot({path:SH('oath'),fullPage:true});await p.click('#oath-next');await p.waitForTimeout(60)}
 await p.waitForTimeout(800);ok(await p.evaluate(()=>campDone('oath')&&rankIdx()===1),'oath → Talib');
 // v11: the Murmur beat after the oath (bestiary lists it only once answered)
 await p.click('.mm-o[data-k="5"]');await p.waitForTimeout(100);ok(await p.evaluate(()=>murmurDone()),'murmur answered');
 // Semmelweis now open; duel banner
 ok(await p.evaluate(()=>campGateOk(1).ok),'semmelweis opens after oath');
 await p.evaluate(()=>{st.cases.semmelweis=90;OS=null;CAMP_OPEN=1;DRAW.campaign()});await p.waitForTimeout(100);ok(await p.$eval('.duel-intro',e=>/Miasma/.test(e.textContent)),'avatar intro');await p.screenshot({path:SH('duel-intro'),fullPage:true});
 await p.click('#camp-deb');await p.waitForTimeout(300);ok(await p.$eval('.duel-b',e=>/Miasma/.test(e.textContent)),'duel banner');await p.screenshot({path:SH('duel')});
 for(let i=0;i<6;i++){await p.evaluate(()=>{const pt=document.querySelector('#q-pt .ptopt');if(pt)pt.click();const s=document.querySelector('#q-show');if(s)s.click();answer(Q.cur.ans)});await p.waitForTimeout(40);await p.evaluate(()=>advance());await p.waitForTimeout(60)}
 await p.waitForTimeout(700);ok(await p.evaluate(()=>campDone('semmelweis')),'duel won');
 // lore
 await p.evaluate(()=>location.hash='lore');await p.waitForTimeout(300);ok(await p.$$eval('.lore-e',e=>e.length)>=9,'lore entries');ok(await p.$$eval('.lore-av:not(.locked)',e=>e.length)===2,'two avatars unlocked');
 await p.evaluate(()=>document.querySelectorAll('.lore-e:not(.locked)').forEach(d=>d.open=true));await p.screenshot({path:SH('lore'),fullPage:true});
 // ranks: simulate
 const rk=await p.evaluate(()=>{const ks=Object.keys(TOPICS);ks.slice(0,2).forEach(t=>st.mast[t]={on:dayNum(),check:dayNum(),lv:0});st.camp.snow={done:dayNum(),score:6};return [rankIdx(),rankNext()]});console.log('rank',JSON.stringify(rk));ok(rk[0]===2,'Katib');
 // era sound styles
 ok(await p.evaluate(()=>eraStyle(1025)==='oud'&&eraStyle(1854)==='c19'&&eraStyle(1950)==='radio'&&eraStyle(2020)==='modern'),'era styles');
 const mus=await p.evaluate(async()=>{uiSet({music:true});CAMP_OPEN=0;location.hash='campaign';await new Promise(r=>setTimeout(r,800));const on=SND.on;uiSet({music:false});SND.retune();return on});ok(mus,'oud music plays');
 // toggles
 await p.evaluate(()=>location.hash='settings');await p.waitForTimeout(250);await p.click('#ap-world');await p.evaluate(()=>location.hash='home');await p.waitForTimeout(300);
 ok(await p.$eval('#shaykh-card',e=>e.hidden)&&await p.evaluate(()=>!document.documentElement.dataset.fog),'world off hides');
 await p.evaluate(()=>{uiSet({world:true});renderToday()});
 // dark guild
 await p.evaluate(()=>uiSet({theme:'dark'}));await p.waitForTimeout(200);await p.screenshot({path:SH('today-dark'),fullPage:true});
 for(const v of ['home','learn','practice','campaign','lore','quiz','settings']){if(v==='quiz')await p.evaluate(()=>startQuiz('daily'));else await p.evaluate(v=>location.hash=v,v);await p.waitForTimeout(250);ok(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'hscroll '+v)}
 await p.screenshot({path:SH('quiz-dark')});
 const w=await b.newPage({viewport:{width:1280,height:800}});await w.goto('file://'+F);await w.waitForTimeout(500);await w.evaluate(()=>{location.hash='home'});await w.waitForTimeout(300);await w.screenshot({path:SH('desk')});
 console.log('ERRORS',errs.length,errs.slice(0,6));console.log('FAILS',fails.length);fails.forEach(f=>console.log(' -',f));await b.close()})();
