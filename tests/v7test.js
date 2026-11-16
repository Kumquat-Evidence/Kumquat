// v7: Round end-to-end (all leg kinds), Toolkit search, papers, decoder, myths, figures, type-first, migration, budget, layout.
const {chromium}=require('playwright');const {serve,newPage}=require('./serve');const PORT=4307;
(async()=>{const srv=serve(PORT);const b=await chromium.launch();const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m)};
const drive=async p=>{ // advance whatever is on screen by one action
  return p.evaluate(()=>{const vis=el=>el&&el.offsetParent!==null;const sec=document.querySelector('section:not([hidden])');if(!sec)return 'nosec';
   const nb=[...sec.querySelectorAll('button[onclick="roundLegDone()"],#e-leg')].find(vis);if(nb){nb.click();return 'nextleg'}
   if(typeof Q!=="undefined"&&Q&&!Q.done&&Q.cur&&location.hash==="#quiz"){if(document.querySelector('#q-type')){document.querySelector('#q-show').click()}if(!Q.answered){answer(Q.cur.ans)}else{advance()}return 'q'}
   const opt=[...sec.querySelectorAll('.opt:not([disabled])')].find(vis);if(opt){opt.click();return 'opt'}
   const so=[...sec.querySelectorAll('button')].find(b=>vis(b)&&/Show the options instead/.test(b.textContent));if(so){so.click();return 'showopts'}const sk=sec.querySelector('#v11-skip');if(sk&&vis(sk)){sk.click();return 'skippredict'}
   const n=sec.querySelector('#pl-next:not([disabled]),#pp-next:not([disabled]),#rd-next');if(n&&vis(n)){n.click();return 'next'}
   const rb=sec.querySelector('#round-root .btn.primary[onclick]');if(rb){rb.click();return 'rdone'}
   return 'stuck:'+location.hash})};
/* 1. Round, beginner then regular */
for(const pre of [null,'regular']){const p=await newPage(b,{port:PORT,init:pre?`localStorage.setItem("kumquat.v1",JSON.stringify({xp:500,lessons:{0:1,1:1},roundsDone:3,log:[{d:Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5)-1,n:10,score:8,mode:"daily"}],topics:{dx:{c:8,n:10}},lord:7}))`:null});
 await p.click('#hero-btn');await p.waitForTimeout(500);const legs=await p.evaluate(()=>ROUND&&ROUND.legs.map(l=>l.t));R.push('INFO legs '+(pre||'beginner')+': '+legs);
 let g=0,last='',stuckN=0;while(await p.evaluate(()=>!!ROUND)&&g++<400){const leg=await p.evaluate(()=>ROUND.legs[ROUND.i].t);
  if(['concept','derive','dag','design','spotter','tests','links','recall','xray'].includes(leg)){await p.evaluate(()=>roundLegDone());await p.waitForTimeout(600);continue}
  if(leg==='tree'){await p.evaluate(()=>{if(!TR||TR.done){const n=document.querySelector('#tr-next');if(n)n.click();return}const c=TR.q[TR.step];document.querySelector('#tr-in').value=String(c.a);document.querySelector('#tr-form').onsubmit({preventDefault(){}})});await p.waitForTimeout(150);continue}
  if(leg==='estimate'){await p.evaluate(()=>{const r=document.querySelector('#es-reveal');if(r&&!r.disabled)r.click();else{const n=document.querySelector('#es-next');if(n)n.click()}});await p.waitForTimeout(250);continue}
  if(leg==='teach'){await p.evaluate(()=>{if(!TB)return;TB.text="PPV depends on prevalence; with few true cases false positives dominate. Confirm positives before acting. Odds times LR.";TB.stage="grade";DRAW.teach();document.querySelectorAll('.tb-rub input').forEach(c=>{c.checked=true;c.onchange&&c.onchange()});const f=document.querySelector('#tb-finish');if(f)f.click()});await p.waitForTimeout(700);continue}
  const a=await drive(p);if(a.startsWith('stuck')){stuckN=(stuckN||0)+1;if(stuckN>8){R.push('FAIL stuck on '+leg+' '+a);break}await p.waitForTimeout(400);continue}stuckN=0;last=a;await p.waitForTimeout(a==='nextleg'?700:60)}
 const fin=await p.evaluate(()=>({done:st.lastRound===dayNum(),sum:document.querySelector('#round-summary').innerText.slice(0,80),bar:!!document.querySelector('#roundbar')}));
 ok(fin.done&&/Round complete/i.test(fin.sum)&&!fin.bar,'round '+(pre||'beginner')+' completes with summary: '+fin.sum.replace(/\n/g,' '));
 ok(!p._errs.length,'round errors: '+p._errs.join(' | '));
 await p.screenshot({path:'shots/v7-round-'+(pre||'beginner')+'.png'});await p.context().close()}
/* 2. Toolkit search */
{const p=await newPage(b,{port:PORT,hash:'toolkit'});for(const [q,exp] of [['hazard','Hazard'],['ppv','PPV'],['collider','ollider'],['i2','I²'],['kaplan','Kaplan'],['anchoring','Anchoring'],['vaccine','accine'],['zzzz','Nothing']]){await p.fill('#tk-q',q);await p.waitForTimeout(120);const t=await p.evaluate(()=>document.querySelector('#tk-res').innerText);ok(t.includes(exp),'search "'+q+'" → '+t.split('\n').slice(0,3).join(' / ').slice(0,90))}
 await p.fill('#tk-q','hazard ratio');await p.waitForTimeout(100);await p.click('#tk-res .tk-hit');await p.waitForTimeout(400);ok(await p.evaluate(()=>!!document.querySelector('#glpop.on,#glpop:not([hidden])')||location.hash!=='#toolkit'),'search hit opens something ('+await p.evaluate(()=>location.hash)+')');
 ok(!p._errs.length,'toolkit errors '+p._errs.join('|'));await p.context().close()}
/* 3. Papers: play all ten */
{const p=await newPage(b,{port:PORT,hash:'papers'});const ids=await p.evaluate(()=>PAPERS.map(P=>P.id));for(const id of ids){await p.evaluate(id=>location.hash='paper-'+id,id);await p.waitForTimeout(250);let g=0;while(g++<60){const a=await p.evaluate(()=>{const o=[...document.querySelectorAll('#v-paper .opt:not([disabled])')];if(o.length){o[0].click();return 'o'}const n=document.querySelector('#pp-next');if(n&&!n.disabled){n.click();return 'n'}return 'end'});if(a==='end')break;await p.waitForTimeout(30)}}
 const n=await p.evaluate(()=>Object.keys(st.papers).length);ok(n===ids.length,'papers completed '+n+'/'+ids.length);ok(!p._errs.length,'papers errors '+p._errs.join('|'));await p.screenshot({path:'shots/v7-paper.png'});await p.context().close()}
/* 4. Decoder */
{const p=await newPage(b,{port:PORT,hash:'decoder'});await p.click('#dec-sample');await p.waitForTimeout(300);const t=await p.evaluate(()=>document.querySelector('#dec-out').innerText);ok(/NNT|hazard|HR/i.test(t),'decoder reads sample: '+t.slice(0,90).replace(/\n/g,' '));
 await p.fill('#dec-in','Mortality was 12.0% vs 15.0% (aHR 0.78, 95% CI 0.66 to 0.92; p=0.003). Sensitivity 92% and specificity 85%. I2 = 64%.');await p.waitForTimeout(400);const t2=await p.evaluate(()=>document.querySelector('#dec-out').innerText);ok(/LR\+/.test(t2)&&/I²|heterogeneity/i.test(t2)&&/NNT/.test(t2),'decoder parses custom text');ok(!p._errs.length,'decoder errors '+p._errs.join('|'));await p.context().close()}
/* 5. Myths, figures, type-first, migration, budget */
{const p=await newPage(b,{port:PORT,init:`localStorage.setItem("kumquat.v1",JSON.stringify({xp:50,lessons:{3:1,4:1,6:1}}))`});
 const L=await p.evaluate(()=>Object.keys(st.lessons).sort().join(','));ok(L==='3,4,5','old lesson order migrated: '+L);
 await p.evaluate(()=>startQuiz('myths'));await p.waitForTimeout(200);ok(await p.evaluate(()=>/Myth/i.test(document.querySelector('#v-quiz').innerText)),'myths mode renders');
 const figs=await p.evaluate(()=>POOLS.F.arr.map((_,i)=>{const q=regen('F:'+i);return q&&/<svg/.test(q.prompt)}).every(Boolean));ok(figs,'figure items render svg');
 await p.evaluate(()=>{startQuiz('topic','appraise');Q.cur=regen('F:0');renderQ()});await p.waitForTimeout(200);await p.screenshot({path:'shots/v7-figure.png',fullPage:true});
 const tf=await p.evaluate(()=>{for(let k=0;k<40;k++){startQuiz('topic','risk');if(document.querySelector('#q-type')){const c=Q.cur;document.querySelector('#q-num').value=String(numOf(c.opts[c.ans]));document.querySelector('#q-type').dispatchEvent(new Event('submit',{cancelable:true}));const cf=document.querySelector('#q-conf:not([hidden]) [data-conf="sure"]');if(cf)cf.click();return Q.answered&&Q.typed===true}}return 'none'});ok(tf===true,'type-first calc answer accepted ('+tf+')');
 await p.evaluate(()=>location.hash='settings');await p.waitForTimeout(250);await p.selectOption('#set-budget','15');const mins=await p.evaluate(()=>roundPlan().reduce((a,l)=>a+l.min,0));ok(mins<=18,'budget 15 → plan '+mins+' min');
 await p.selectOption('#set-budget','60');const m2=await p.evaluate(()=>roundPlan().length);ok(m2>=6,'budget 60 → '+m2+' legs');
 const lessonsOK=await p.evaluate(()=>LESSONS.map((L,i)=>L.steps.every(s=>!s.q||(Array.isArray(s.o)&&s.o.length>=2&&s.e))&&PATH[i]).every(Boolean));ok(lessonsOK,'all lesson steps well-formed');
 const order=await p.evaluate(()=>PATH.map(u=>u.t).join(','));ok(order==='math,epi,dx,design,risk,stats,bias,tests,appraise,trials','path order '+order);
 const myth=await p.evaluate(()=>LESSONS.filter(L=>L.steps.some(s=>s.myth)).length);R.push('INFO lessons with myth check: '+myth);
 ok(!p._errs.length,'misc errors '+p._errs.join('|'));await p.context().close()}
/* 6. layout: no horizontal scroll in new views, both themes, phone + desktop */
for(const [w,h,theme] of [[360,780,'dark'],[390,844,'light'],[1280,900,'light'],[1280,900,'dark']]){const p=await newPage(b,{port:PORT,w,h,theme});
 for(const v of ['home','learn','practice','toolkit','progress','settings','papers','decoder','path','web','bias','vault','paper-'+(await p.evaluate(()=>PAPERS[0].id)),'lesson-6']){await p.evaluate(v=>location.hash=v,v);await p.waitForTimeout(250);const sw=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(sw>1)R.push(`FAIL hscroll ${v} ${w} ${theme} +${sw}px`);if(['home','toolkit','progress','learn','practice'].includes(v))await p.screenshot({path:`shots/v7-${v}-${w}-${theme}.png`})}
 ok(!p._errs.length,`layout ${w} ${theme} errors `+p._errs.join('|'));await p.context().close()}
console.log(R.join('\n'));console.log('FAILS',R.filter(x=>x.startsWith('FAIL')).length);await b.close();srv.close()})();
