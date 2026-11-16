const {chromium}=require('playwright');const path=require('path');
const F=process.argv[2]||path.resolve(__dirname,'../src/kumquat.html');const SH=n=>path.resolve(__dirname,'shots/v9c-'+n+'.png');
(async()=>{const b=await chromium.launch();const fails=[],errs=[];const ok=(c,m)=>{if(!c)fails.push(m)};
 const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));
 await p.goto('file://'+F);await p.waitForTimeout(500);
 await p.evaluate(()=>{st.camp={oath:{done:dayNum(),score:7}};save();location.hash='campaign'});await p.waitForTimeout(300);
 ok(await p.$$eval('.camp-n',e=>e.length)===12,'12 stops');ok(await p.$$eval('.camp-n.open',e=>e.length)===1,'only first open');await p.screenshot({path:SH('timeline'),fullPage:true});
 await p.click('[data-ci="1"]');await p.waitForTimeout(200);await p.screenshot({path:SH('chapter'),fullPage:true});
 await p.click('#camp-go');await p.waitForTimeout(700);ok(await p.evaluate(()=>location.hash==='#case-semmelweis'&&CAMP_ACTIVE==='semmelweis'),'fires case');
 // play case to end with the player's own buttons
 for(let g=0;g<80;g++){const r=await p.evaluate(()=>{const vis=e=>e&&e.offsetParent!==null;const sec=document.querySelector('section:not([hidden])');const o=[...sec.querySelectorAll('.opt:not([disabled])')].find(vis);if(o){o.click();return 'o'}const n=sec.querySelector('#pl-next:not([disabled])');if(n&&vis(n)){n.click();return 'n'}return document.querySelector('#camp-ret')?'ret':location.hash});if(r==='ret')break;await p.waitForTimeout(r==='o'||r==='n'?60:400)}
 // v11: the end card stays (real history) until he chooses to return
 await p.waitForTimeout(1800);ok(await p.evaluate(()=>location.hash==='#case-semmelweis'&&!!document.querySelector('.pl-real')&&/Miasma/.test(document.querySelector('#camp-ret').textContent)),'end card stays, return button');
 await p.click('#camp-ret');await p.waitForTimeout(400);ok(await p.evaluate(()=>location.hash==='#campaign'&&st.cases.semmelweis!=null),'returns to machine');
 ok(await p.$('#camp-deb'),'debrief button');await p.click('#camp-deb');await p.waitForTimeout(300);ok(await p.evaluate(()=>Q.camp==='semmelweis'&&Q.total===6&&!document.querySelector('#q-hint')),'debrief quiz');
 for(let i=0;i<6;i++){await p.evaluate(()=>{const pt=document.querySelector('#q-pt .ptopt');if(pt)pt.click();const s=document.querySelector('#q-show');if(s)s.click();answer(Q.cur.ans)});await p.waitForTimeout(40);await p.evaluate(()=>advance());await p.waitForTimeout(60)}
 await p.waitForTimeout(600);ok(await p.evaluate(()=>campDone('semmelweis')),'chapter done');
 await p.evaluate(()=>{CAMP_OPEN=null;location.hash='campaign';DRAW.campaign()});await p.waitForTimeout(200);
 const g=await p.evaluate(()=>campGateOk(2));console.log('gate2',JSON.stringify(g));ok(!g.ok&&/85%/.test(g.why),'gate 2 needs epi accuracy');
 await p.evaluate(()=>{st.recent.epi=Array(20).fill(true);save();DRAW.campaign()});ok(await p.evaluate(()=>campGateOk(2).ok),'gate 2 opens');
 const g6=await p.evaluate(()=>{['snow','tuskegee','strepto','dollhill'].forEach(id=>st.camp[id]={done:dayNum(),score:6});return campGateOk(6)});ok(!g6.ok&&/mastered/.test(g6.why),'gate 6 needs mastery');
 await p.evaluate(()=>{CAMP_OPEN=6;DRAW.campaign()});await p.screenshot({path:SH('locked'),fullPage:true});
 // finale
 const fin=await p.evaluate(()=>{CAMP.slice(0,11).forEach(c=>st.camp[c.id]={done:dayNum(),score:6});st.mast={appraise:{on:dayNum(),check:dayNum(),lv:0}};CAMP_OPEN=11;DRAW.campaign();const a=!!document.querySelector('a[href="#realpaper"]');st.myPapers=[{id:'x',d:dayNum(),title:'t',text:'t'}];DRAW.campaign();const btn=document.querySelector('#camp-deb');return [a,!!btn]});
 // v11: the finale is a real duel with The Spinner
 await p.click('#camp-deb');await p.waitForTimeout(300);ok(await p.evaluate(()=>Q.camp==='present'&&/Spinner/.test(document.querySelector('.duel-b').textContent)),'spinner duel');
 for(let i=0;i<6;i++){await p.evaluate(()=>{answer(Q.cur.ans)});await p.waitForTimeout(40);await p.evaluate(()=>advance());await p.waitForTimeout(60)}
 await p.waitForTimeout(300);fin.push(await p.evaluate(()=>campDone('present')&&!!document.querySelector('.duel-farewell')));
 console.log('finale',fin);ok(fin.every(Boolean),'finale');await p.screenshot({path:SH('finale'),fullPage:true});
 // era music style
 ok(await p.evaluate(()=>{CAMP_OPEN=1;current='campaign';return CAMPAIGN_STYLE()==='c19'}),'era style');
 // new clinic calls
 for(const id of ['er-trop','oh-drugscreen','fm-aspirin']){await p.evaluate(id=>{RD=null;location.hash='round-'+id},id);await p.waitForTimeout(300);
   for(let g=0;g<20;g++){const r=await p.evaluate(()=>{const sec=document.querySelector('section:not([hidden])');const o=sec.querySelector('.opt:not([disabled])');if(o){o.click();return'o'}const n=sec.querySelector('#rd-next');if(n){n.click();return'n'}return'x'});if(r==='x')break;await p.waitForTimeout(80)}
   ok(await p.evaluate(id=>st.rounds[id]!=null,id),'round done '+id)}
 await p.screenshot({path:SH('round-drug'),fullPage:true});
 // deep links
 const d=await b.newPage({viewport:{width:390,height:844}});d.on('pageerror',e=>errs.push(e.message));await d.goto('file://'+F+'?from=citrus&do=realpaper');await d.waitForTimeout(900);
 ok(await d.evaluate(()=>location.hash==='#realpaper'&&!location.search),'deep link realpaper');ok(await d.$('#citrus-back'),'citrus back chip');await d.screenshot({path:SH('deeplink')});
 await d.goto('file://'+F+'?from=citrus&do=round');await d.waitForTimeout(1000);ok(await d.evaluate(()=>!!ROUND||(Q&&Q.mode==='blitz')),'deep link round');
 await d.goto('file://'+F+'?from=citrus&do=recheck-dx');await d.waitForTimeout(900);ok(await d.evaluate(()=>Q&&Q.recheck&&Q.topic==='dx'),'deep link recheck');
 // hubV2 shape
 const h=await p.evaluate(()=>{const s=hubV2(hubStatus());return {c:s.contract,keys:['title','icon','color','url','due','estimatedMinutes','streak','nextDue','summary','asks','metrics','progress','inbox','actions'].filter(k=>s[k]==null),m:s.metrics.every(m=>m.key&&m.label&&typeof m.value==='number'),a:s.actions.every(a=>a.id&&a.label&&a.url)}});
 console.log('hub',JSON.stringify(h));ok(h.c===2&&!h.keys.length&&h.m&&h.a,'status v2 shape');
 // study tile + layout
 await p.evaluate(()=>location.hash='learn');await p.waitForTimeout(300);ok(await p.$('.camp-cta'),'campaign cta');await p.screenshot({path:SH('learn')});
 for(const v of ['campaign','learn','settings']){await p.evaluate(v=>location.hash=v,v);await p.waitForTimeout(200);ok(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'hscroll '+v)}
 console.log('ERRORS',errs.length,errs.slice(0,6));console.log('FAILS',fails.length);fails.forEach(f=>console.log(' -',f));await b.close()})();
