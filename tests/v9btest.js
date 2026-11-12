const {chromium}=require('playwright');const path=require('path');
const F=process.argv[2]||path.resolve(__dirname,'../src/kumquat.html');const SH=n=>path.resolve(__dirname,'shots/v9b-'+n+'.png');
(async()=>{const b=await chromium.launch();const fails=[],errs=[];const ok=(c,m)=>{if(!c)fails.push(m)};
 const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));
 await p.goto('file://'+F);await p.waitForTimeout(600);
 // mastery: 30 answers 90% on one day → not mastered; spread across 3 days → mastered
 const m=await p.evaluate(()=>{st.recent.dx=Array(30).fill(true).map((x,i)=>i%10!==0);st.tdays={dx:[dayNum()]};st.mast={};mastNote('dx');const a=mastState('dx');st.tdays.dx=[dayNum()-5,dayNum()-2,dayNum()];mastNote('dx');const b=mastState('dx');st.mast.dx.check=dayNum()-8;const c=mastState('dx');return [a,b,c,fadingTopics()]});
 console.log('mastery',JSON.stringify(m));ok(m[0]==='none'&&m[1]==='mastered'&&m[2]==='fading','mastery states');
 await p.evaluate(()=>{save();location.hash='home'});await p.waitForTimeout(300);ok(!(await p.$eval('#fade-card',e=>e.hidden)),'fade card');ok(await p.$('#fotd-rev'),'fotd card');
 await p.click('#fotd-rev');ok(await p.$eval('.fotd-a',e=>!e.hidden),'fotd reveal');
 await p.click('#fade-go');await p.waitForTimeout(300);ok(await p.evaluate(()=>Q.recheck&&Q.total===5&&!document.querySelector('#q-hint')),'recheck quiz');
 // answer 5 correctly
 for(let i=0;i<5;i++){await p.evaluate(()=>{if(document.querySelector('#q-pt'))document.querySelector('#q-pt .ptopt').click();if(document.querySelector('#q-show'))document.querySelector('#q-show').click()});await p.evaluate(()=>answer(Q.cur.ans));await p.waitForTimeout(60);await p.evaluate(()=>advance());await p.waitForTimeout(80)}
 await p.waitForTimeout(300);ok(await p.evaluate(()=>mastState('dx')==='mastered'&&st.mast.dx.lv===1),'recheck passed');
 // derive all items correct
 await p.evaluate(()=>{DVS={list:DV.slice(),i:0,num:[],den:[],slot:'num',done:false,score:0};location.hash='derive'});await p.waitForTimeout(300);
 for(let i=0;i<DVlen();i++){}
 const n=await p.evaluate(()=>DV.length);
 for(let i=0;i<n;i++){const it=await p.evaluate(()=>DVS.list[DVS.i]);
   for(const t of it.num){await p.click(`.dv-c[data-t="${t}"]`);await p.waitForTimeout(20)}
   await p.click('.dv-slot[data-slot="den"]');for(const t of it.den){await p.click(`.dv-c[data-t="${t}"]`);await p.waitForTimeout(20)}
   await p.click('#dv-check');await p.waitForTimeout(40);ok(await p.$eval('#dv-fb',e=>/Rebuilt/.test(e.textContent)),'derive '+it.id);await p.click('#dv-next');await p.waitForTimeout(40)}
 ok(await p.evaluate(()=>DVS.score===DV.length),'derive all first try');await p.screenshot({path:SH('derive-sum')});
 await p.evaluate(()=>{DVS={list:[DV[8]],i:0,num:[],den:[],slot:'num'};DRAW.derive()});await p.click('.dv-c[data-t="a"]');await p.click('.dv-c[data-t="d"]');await p.screenshot({path:SH('derive-or')});
 // sprint
 await p.evaluate(()=>{SP=null;location.hash='sprint'});await p.waitForTimeout(300);await p.click('#sp-go');await p.waitForTimeout(100);for(let i=0;i<5;i++){await p.click('.sp-o');await p.waitForTimeout(40)}
 await p.screenshot({path:SH('sprint')});await p.evaluate(()=>{SP.t=1});await p.waitForTimeout(1300);ok(await p.$('#sp-again'),'sprint ends');
 // dag correct all
 await p.evaluate(()=>{DG={i:0,list:DAG.slice(),ze:'',zo:'',done:false,score:0};location.hash='dag'});await p.waitForTimeout(300);
 for(let i=0;i<12;i++){const it=await p.evaluate(()=>DG.list[DG.i]);await p.click(`[data-dk="ze"][data-dv="${it.ze}"]`);await p.click(`[data-dk="zo"][data-dv="${it.zo}"]`);if(i===2)await p.screenshot({path:SH('dag')});await p.click('#dg-chk');await p.waitForTimeout(40);ok(await p.$eval('#dg-fb',e=>/Right/.test(e.textContent)),'dag '+it.e);await p.click('#dg-next');await p.waitForTimeout(40)}
 ok(await p.evaluate(()=>DG.score===12),'dag score');await p.click('#dg-sand');await p.waitForTimeout(100);await p.screenshot({path:SH('dag-sand')});
 // design
 await p.evaluate(()=>{DP={list:DSQ.slice(),i:0,score:0,pick:null};location.hash='design'});await p.waitForTimeout(300);
 for(let i=0;i<12;i++){const a=await p.evaluate(()=>DP.list[DP.i].a[0]);if(i===0){await p.click('.dsg-o[data-k="eco"]');await p.screenshot({path:SH('design-wrong'),fullPage:true});await p.click('#dp-next');continue}await p.click(`.dsg-o[data-k="${a}"]`);await p.waitForTimeout(30);await p.click('#dp-next');await p.waitForTimeout(30)}
 ok(await p.evaluate(()=>DP.score===11),'design score');
 // spotter
 await p.evaluate(()=>{BS={list:BSP.slice(),i:0,score:0,step:'where',si:null,bi:null};location.hash='spotter'});await p.waitForTimeout(300);
 for(let i=0;i<12;i++){const it=await p.evaluate(()=>DP&&BS.list[BS.i]);await p.click(`.bs-s[data-i="${it.i}"]`);await p.waitForTimeout(30);const bi=await p.evaluate(()=>BS.list[BS.i]._o.indexOf(BS.list[BS.i].b));await p.click(`.bs-b[data-i="${bi}"]`);if(i===0)await p.screenshot({path:SH('spotter'),fullPage:true});await p.click('#bs-next');await p.waitForTimeout(30)}
 ok(await p.evaluate(()=>BS.score===24),'spotter score');
 // tests: navigate tree to the right answer for each scenario via search
 const paths=await p.evaluate(()=>{const find=(node,t,pth)=>{if(node.t)return node.t===t?pth:null;for(let i=0;i<node.o.length;i++){const r=find(node.o[i][1],t,pth.concat(i));if(r)return r}return null};return TCQ.map(q=>[q[1],find(TC,q[1],[])])});
 paths.forEach(([t,pth])=>ok(pth,'tree has '+t));
 await p.evaluate(()=>{TCS={mode:'quiz',list:TCQ.slice(),i:0,path:[],score:0};location.hash='tchoose'});await p.waitForTimeout(300);
 for(let i=0;i<TCQlen();i++){}
 for(let i=0;i<12;i++){const t=await p.evaluate(()=>TCS.list[TCS.i][1]);const pth=paths.find(x=>x[0]===t)[1];for(const k of pth){await p.click(`.tc-o[data-i="${k}"]`);await p.waitForTimeout(20)}if(i===0)await p.screenshot({path:SH('tests'),fullPage:true});await p.click('#tc-next');await p.waitForTimeout(30)}
 ok(await p.evaluate(()=>TCS.score===12),'tests score');
 // real paper
 const abs="Background: X. Methods: We randomly assigned 2,104 patients to dexamethasone or usual care. Results: Death at 28 days occurred in 22.9% vs 25.7% (rate ratio 0.83; 95% CI 0.75 to 0.93; P<0.001). In a subgroup receiving ventilation the effect was larger. Conclusions: Dexamethasone reduced 28-day mortality.";
 await p.evaluate(()=>{RPS=null;location.hash='realpaper'});await p.waitForTimeout(300);await p.fill('#rp-text',abs);await p.fill('#rp-title','Test paper');await p.click('#rp-go');await p.waitForTimeout(300);
 ok(await p.$$eval('.rp-step',e=>e.length)===6,'6 steps');ok(await p.$eval('.rp-step',e=>/Randomised/.test(e.textContent)),'design guess');ok(await p.$$eval('.rp-pick',e=>e.length)>=2,'numbers found');
 await p.fill('#rp-br','25');await p.waitForTimeout(100);console.log('nnt',await p.$eval('#rp-nntout',e=>e.textContent));ok(await p.$eval('#rp-nntout',e=>/NNT/.test(e.textContent)),'nnt calc');
 ok(await p.$eval('[data-sp="subgroup"]',e=>e.closest('label').textContent.includes('wording found')),'subgroup flagged');
 await p.click('#rp-save');ok(await p.evaluate(()=>st.myPapers.length===1),'saved paper');await p.screenshot({path:SH('realpaper'),fullPage:true});
 // claude call mocked
 await p.route('https://api.anthropic.com/v1/messages',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({content:[{type:'text',text:'<h4>Design</h4><p>RCT <script>x</script></p>'}]})}));
 await p.evaluate(()=>{localStorage.setItem('kumquat.claude','sk-ant-test');DRAW.realpaper()});await p.waitForTimeout(200);await p.click('#rp-ai');await p.waitForTimeout(500);ok(await p.$eval('#rp-ai-out',e=>/Design/.test(e.textContent)&&!e.querySelector('script')),'claude mocked + sanitized');
 // round includes tool + recheck
 const legs=await p.evaluate(()=>{st.mood='focused';st.moodDay=dayNum();st.lessons={0:1,1:1};st.roundsDone=2;st.mast.dx.check=dayNum()-40;st.budget=60;return roundPlan().map(l=>l.t)});console.log('legs',legs.join(','));ok(legs.includes('recheck'),'recheck leg');
 // wide realpaper
 const w=await b.newPage({viewport:{width:1280,height:800}});w.on('pageerror',e=>errs.push(e.message));await w.goto('file://'+F);await w.waitForTimeout(400);await w.evaluate(a=>{RPS={text:a,title:'',ans:{},spin:{}};location.hash='realpaper'},abs);await w.waitForTimeout(400);await w.screenshot({path:SH('realpaper-wide')});
 for(const v of ['derive','sprint','dag','design','spotter','tchoose','realpaper']){await p.evaluate(v=>location.hash=v,v);await p.waitForTimeout(200);ok(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'hscroll '+v)}
 console.log('ERRORS',errs.length,errs.slice(0,6));console.log('FAILS',fails.length);fails.forEach(f=>console.log(' -',f));await b.close()})();
function DVlen(){return 0}function TCQlen(){return 0}
