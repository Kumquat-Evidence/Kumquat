// Beta 2: content integrity + every flow played to the end (all branches), state robustness.
const {chromium}=require('playwright');const {serve,newPage,fakeGoogle}=require('./serve');
const PORT=4302;
(async()=>{const srv=serve(PORT);const b=await chromium.launch();const out=[];const log=(...a)=>{out.push(a.join(' '));console.log(...a)};
 const p=await newPage(b,{port:PORT});
 /* ---------- A. content integrity ---------- */
 const A=await p.evaluate(()=>{const iss=[];const add=(k,m)=>iss.push(k+': '+m);
  const strip=s=>String(s).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  // pools
  for(const [P,pool] of Object.entries(POOLS)){pool.arr.forEach((it,i)=>{let q;try{q=regen(P+':'+i)}catch(e){add('pool',P+':'+i+' throws '+e.message);return}
    if(!q){add('pool',P+':'+i+' null');return}
    if(!TOPICS[q.topic])add('topic',P+':'+i+' '+q.topic);
    if(q.ans<0||q.ans>=q.opts.length)add('ans',P+':'+i);
    if(new Set(q.opts.map(strip)).size!==q.opts.length)add('dupopt',P+':'+i+' '+q.opts.join(' | '));
    if(!q.explain||strip(q.explain).length<15)add('noexplain',P+':'+i);
    if(/undefined|NaN|Infinity|\[object/.test(q.prompt+q.opts.join()+q.explain))add('junk',P+':'+i);
    if(q.opts.length<2)add('fewopts',P+':'+i)})}
  // duplicate prompts across pools
  const seen={};for(const [P,pool] of Object.entries(POOLS)){if(P==='W')continue;pool.arr.forEach((it,i)=>{const q=regen(P+':'+i);if(!q)return;const k=strip(q.prompt).toLowerCase().replace(/^(step 1 vignette|step 2ck \/ 3 vignette|name the design|spot the bias|which test\?)\s*/,'').slice(0,80);if(seen[k])add('dupq',seen[k]+' ≈ '+P+':'+i+' «'+k.slice(0,50)+'»');else seen[k]=P+':'+i})}
  // generators ×800
  for(const k of Object.keys(CALCF))for(let n=0;n<800;n++){const q=CALCF[k]();const t=q.opts.join('|');
    if(new Set(q.opts).size!==q.opts.length||q.ans<0){add('gen',k+' '+t);break}
    if(/NaN|Infinity|undefined|-\d/.test(t.replace(/−/g,''))&&!/−/.test(t)){add('gengarbage',k+' '+t);break}
    if(q.opts.some(o=>/^-|^−/.test(strip(o)))){add('genneg',k+' '+t);break}
    if(q.opts.some(o=>{const m=/^([\d.]+)%/.exec(strip(o));return m&&+m[1]>100})){add('genpct>100',k+' '+t);break}}
  // lessons / cases
  LESSONS.forEach((L,li)=>L.steps.forEach((s,i)=>{if(s.q){if(!s.o||s.o.length<2||new Set(s.o).size!==s.o.length)add('lessonq',li+'.'+i);if(!s.e)add('lessonexp',li+'.'+i)}if(s.viz&&!VIZ[s.viz[0]])add('lessonviz',li+'.'+i+' '+s.viz[0]);if(/\{\{|undefined/.test(s.p||''))add('lessontext',li+'.'+i)}));
  if(LESSONS.length!==PATH.length)add('lessons','count '+LESSONS.length+' vs path '+PATH.length);
  CASES.forEach(C=>{if(!C.real||!C.learn)add('case',C.id+' missing real/learn');C.topics.forEach(t=>{if(!TOPICS[t])add('casetopic',C.id+' '+t)});C.steps.forEach((s,i)=>{if(s.q&&(new Set(s.o).size!==s.o.length||!s.e))add('caseq',C.id+'.'+i);if(s.viz&&!VIZ[s.viz[0]])add('caseviz',C.id+'.'+i)})});
  // rounds graph: every target exists; every node reachable; every path ends; option 0 is the best path
  ROUNDS.forEach(R=>{const ids=Object.keys(R.steps);const reach=new Set(['s1']);const stack=['s1'];
    while(stack.length){const k=stack.pop();const s=R.steps[k];if(!s){add('round',R.id+' missing step '+k);continue}if(s.done)continue;if(!s.o||!s.o.length){add('round',R.id+' '+k+' dead end');continue}
      s.o.forEach(o=>{if(!R.steps[o[1]])add('round',R.id+' '+k+' → missing '+o[1]);else if(!reach.has(o[1])){reach.add(o[1]);stack.push(o[1])}if(!o[2])add('round',R.id+' '+k+' option without feedback')})}
    ids.forEach(k=>{if(!reach.has(k))add('round',R.id+' unreachable '+k)});
    // can every reachable node reach end?
    const canEnd=k=>{const seen=new Set();const go=k=>{if(seen.has(k))return false;seen.add(k);const s=R.steps[k];if(!s)return false;if(s.done)return true;return s.o.some(o=>go(o[1]))};return go(k)};
    ids.forEach(k=>{if(!canEnd(k))add('round',R.id+' '+k+' cannot reach end')});
    R.topics.forEach(t=>{if(!TOPICS[t])add('roundtopic',R.id+' '+t)});
    // single-option "correction" steps: fine. Check that steps with one option use it as the correction.
  });
  // web
  const nid=new Set(WEB_NODES.map(n=>n[0]));WEB_EDGES.forEach(e=>{if(!nid.has(e[0])||!nid.has(e[1]))add('web','edge '+e.join('→'))});
  WEB_NODES.forEach(n=>{if(!TOPICS[n[2]])add('webtopic',n[0]);if(!WEB_EDGES.some(e=>e[0]===n[0]||e[1]===n[0]))add('weborphan',n[0])});
  if(nid.size!==WEB_NODES.length)add('web','duplicate node ids');
  TEACH.forEach(t=>{if(!nid.has(t.c))add('teach','unknown concept '+t.c);if(!t.rub||t.rub.length<3)add('teach','thin rubric '+t.c)});
  // plan
  PLAN.forEach((d,i)=>d.tasks.forEach(t=>{try{const l=taskLabel(t);if(!l||!l.l||/undefined/.test(l.l))add('plan','day '+(i+1)+' bad label');if(t.t==='lesson'&&!LESSONS[t.n])add('plan','day '+(i+1)+' lesson '+t.n);if(t.t==='case'&&!CASES.find(c=>c.id===t.id))add('plan','day '+(i+1)+' case '+t.id);if(t.t==='lab'&&!VIEWS.includes(t.v))add('plan','day '+(i+1)+' lab '+t.v);if(t.t==='drill'&&!TOPICS[t.topic])add('plan','day '+(i+1)+' topic '+t.topic)}catch(e){add('plan','day '+(i+1)+' throws '+e.message)}}));
  if(PLAN.length!==30)add('plan','length '+PLAN.length);
  // GEN specs resolvable
  for(const [t,specs] of Object.entries(GEN))specs.forEach(sp=>{const [P,arg]=sp.split(':');if(P==='g'){if(!CALCF[arg])add('gen','missing generator '+arg)}else if(!POOLS[P])add('gen','missing pool '+P);else if(arg&&!POOLS[P].arr.some(x=>POOLS[P].topic(x)===arg))add('gen','empty pool '+sp)});
  // every topic has enough questions for a boss fight (12) without heavy repeats
  for(const t of Object.keys(TOPICS)){let n=0;for(const P of Object.keys(POOLS)){if(P==='W')continue;n+=POOLS[P].arr.filter(x=>POOLS[P].topic(x)===t).length}const gens=GEN[t].filter(s=>s.startsWith('g:')).length;if(n+(gens?99:0)<12)add('thin','topic '+t+' has '+n+' fixed items'+(gens?' + generators':''))}
  // blueprint items count & vault examples
  VAULT.forEach(([g,rows])=>rows.forEach(r=>{if(!r[3]&&!/Bradford|Wilson|GRADE|Equivalence|Factorial|Surrogate|Mediator|CER, EER/.test(r[0]))add('vaultex','no worked example: '+r[0])}));
  // leftover names
  const html=document.documentElement.outerHTML;if(/[Cc]lementine/.test(html.replace(/clementine\.v1/g,'')))add('name','"Clementine" still appears');
  // duplicate element ids
  const idc={};document.querySelectorAll('[id]').forEach(e=>idc[e.id]=(idc[e.id]||0)+1);Object.entries(idc).forEach(([k,v])=>{if(v>1)add('dupid',k+'×'+v)});
  return iss});
 log('A. content issues:',A.length);A.forEach(x=>log('  ',x));
 /* ---------- B. flows ---------- */
 const B=await p.evaluate(async()=>{const iss=[];const add=m=>iss.push(m);const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  // every lesson & case, answering wrong first then right
  for(let i=1;i<=LESSONS.length;i++){location.hash='lesson-'+i;await sleep(60);let g=0;while(PL&&PL.i<=LESSONS[i-1].steps.length&&g++<40){const s=LESSONS[i-1].steps[PL.i];if(s&&s.q){const o=document.querySelectorAll('#lesson-root .pl-q .opt');if(o.length)o[(s._a+1)%o.length].click()}const n=document.querySelector('#pl-next');if(!n){break}if(n.disabled){add('lesson '+i+' next disabled after answering at step '+PL.i);break}n.click();await sleep(5)}if(!st.lessons[i-1])add('lesson '+i+' not marked done')}
  for(const C of CASES){location.hash='case-'+C.id;await sleep(60);let g=0;while(PL&&PL.i<=C.steps.length&&g++<40){const s=C.steps[PL.i];if(s&&s.q){const o=document.querySelectorAll('#case-root .pl-q .opt');if(o.length)o[s._a].click()}const n=document.querySelector('#pl-next');if(!n)break;n.click();await sleep(5)}if(st.cases[C.id]==null)add('case '+C.id+' not saved')}
  // every round, every branch: walk each option at each step once
  for(const R of ROUNDS){for(const [k,s] of Object.entries(R.steps)){if(s.done)continue;for(let oi=0;oi<s.o.length;oi++){location.hash='rounds';await sleep(20);RD=null;location.hash='round-'+R.id;await sleep(40);for(let w=0;w<50&&!RD;w++)await sleep(20);if(!RD){add('round '+R.id+' did not open');continue}RD.at=k;DRAW.round();const b=document.querySelector(`#round-root .opt[data-i="${oi}"]`);if(!b){add('round '+R.id+' '+k+' option '+oi+' missing');continue}b.click();const nx=document.querySelector('#rd-next');if(!nx){add('round '+R.id+' '+k+' no next');continue}nx.click();await sleep(5)}}
   RD=null;location.hash='round-'+R.id;await sleep(30);for(let w=0;w<50&&!RD;w++)await sleep(20);let g=0;while(RD&&!R.steps[RD.at].done&&g++<30){document.querySelector('#round-root .opt[data-i="0"]').click();document.querySelector('#rd-next').click()}if(st.rounds[R.id]!==0)add('round '+R.id+' best path wrong turns='+st.rounds[R.id])}
  // quiz modes
  for(const m of ['daily','blitz','marathon','step1','step2','twins','mock']){startQuiz(m);let g=0;while(Q&&!Q.done&&g++<45){if(!Q.cur){add(m+' no current question');break}const i=g%3===0?(Q.cur.ans+1)%Q.cur.opts.length:Q.cur.ans;answer(i);if(Q.block){blockMove(1);if(Q.review){blockSubmit();break}}else if(m==='mock')await sleep(360);else advance();await sleep(0)}if(m==='blitz'){stopTimer();endQuiz()}if(Q&&!Q.done)add(m+' did not finish at question '+Q.i+'/'+Q.total)}
  for(const t of Object.keys(TOPICS)){startQuiz('topic',t);while(Q&&!Q.done){answer(Q.cur.ans);advance()}startQuiz('boss',t);while(Q&&!Q.done){answer(Q.cur.ans);advance()}if(!st.badges[t])add('boss '+t+' no badge on perfect run')}
  startQuiz('boss','dx');let k=0;while(Q&&!Q.done){answer(k++<3?(Q.cur.ans+1)%Q.cur.opts.length:Q.cur.ans);advance()}
  // review and retry
  const due0=dueKeys().length;Object.keys(st.srs).forEach(key=>st.srs[key].due=0);startQuiz('review');if(!Q||Q.done)add('review did not start with '+Object.keys(st.srs).length+' in deck');else{while(Q&&!Q.done){answer(Q.cur.ans);advance()}}
  const mk=Object.keys(st.miss)[0];if(mk){startQuiz('retry',mk);while(Q&&!Q.done){answer(Q.cur.ans);advance()}}else add('no misses recorded');
  // empty review deck
  st.srs={};startQuiz('review');if(Q&&!Q.done&&Q.mode==='review')add('empty review started a quiz');
  // tree 20 with wrong first
  location.hash='tree';await sleep(40);for(let r=0;r<20;r++){let g=0;while(!TR.done&&g++<10){const c=TR.q[TR.step];const inp=document.querySelector('#tr-in');inp.value=String(c.a+50);document.querySelector('#tr-form').onsubmit({preventDefault(){}});inp.value=String(c.a);document.querySelector('#tr-form').onsubmit({preventDefault(){}})}document.querySelector('#tr-next').click()}
  // estimate 20
  location.hash='estimate';await sleep(40);for(let r=0;r<20;r++){document.querySelector('#es-reveal').click();document.querySelector('#es-next').click()}
  // teach all prompts
  for(const t of TEACH){TB_PICK=t.c;TB=null;location.hash='home';await sleep(10);location.hash='teach';await sleep(30);if(TB.item.c!==t.c){add('teach pick ignored '+t.c);}const ta=document.querySelector('#tb-text');ta.value='short';ta.oninput({target:ta});document.querySelector('#tb-done').click();if(TB.stage!=='write')add('teach accepted too-short text');ta.value='A full explanation with enough words to pass the length check here.';ta.oninput({target:ta});document.querySelector('#tb-done').click();document.querySelectorAll('.tb-rub input')[0].click();document.querySelector('#tb-finish').click()}
  // flash full deck both grades
  location.hash='flash';await sleep(30);let f=0;while(FL&&FL.i<FL.deck.length&&f++<60){document.querySelector('#fl-card').click();document.querySelector(f%2?'#fl-yes':'#fl-no').click()}
  // labs extremes
  const labs={dx:['#dx-prev','#dx-sens','#dx-spec'],bayes:['#b-pre','#b-lr'],risk:['#r-cer','#r-eer'],power:['#p-d','#p-n'],ci:['#c-n'],cutoff:['#co-cut','#co-prev'],mathgym:['#m-z','#m-p','#m-sk'],outbreak:['#ob-c','#ob-p','#ob-v','#ob-d'],confound:['#cf-pe','#cf-pu','#cf-k','#cf-e0','#cf-e1'],funnel:['#fn-t']};
  for(const [v,ids] of Object.entries(labs)){location.hash=v;await sleep(40);for(const id of ids){const el=document.querySelector(id);for(const val of [el.min,el.max,(+el.min+ +el.max)/2]){el.value=val;el.dispatchEvent(new Event('input'));const txt=document.querySelector('#v-'+v).innerText;if(/NaN|Infinity|undefined/.test(txt)){add('lab '+v+' '+id+'='+val+' shows '+(/NaN|Infinity|undefined/.exec(txt)[0]));break}}}}
  // equal arms in risk lab
  location.hash='risk';await sleep(30);document.querySelector('#r-cer').value=10;document.querySelector('#r-eer').value=10;document.querySelector('#r-eer').dispatchEvent(new Event('input'));if(/NaN|Infinity/.test(document.querySelector('#v-risk').innerText))add('risk lab equal arms shows NaN/Infinity');
  // CI dance run
  location.hash='ci';await sleep(30);for(let i=0;i<30;i++)document.querySelector('#c-one').click();
  // test picker all leaves
  location.hash='tests';await sleep(30);const leaves=new Set();const walk=async(path)=>{tPath=[];renderTree();for(const i of path){document.querySelectorAll('#t-choices .choice[data-i]')[i].click()}const ch=document.querySelectorAll('#t-choices .choice[data-i]');if(!ch.length){const h=document.querySelector('#t-result h2');leaves.add(h&&h.textContent);return}for(let i=0;i<ch.length;i++)await walk([...path,i])};await walk([]);
  // v11: one tree for both pickers; every RES test is a reachable TC leaf, and every TC leaf has a RES entry
  const resKeys=Object.keys(RES);resKeys.forEach(k=>{if(!leaves.has(RES[k][0])&&!Object.keys(TC_RES).some(t=>TC_RES[t]===k&&leaves.has(t)))add('test picker leaf unreachable '+k)});[...leaves].forEach(t=>{if(!RES[TC_RES[t]])add('tree leaf without RES entry '+t)});
  // plan: start, every day view
  st.plan={start:dayNum()-29};location.hash='plan';await sleep(30);for(let d=1;d<=30;d++){PLANVIEW=d;DRAW.plan()}
  // progress, settings, blueprint ratings
  location.hash='blueprint';await sleep(30);document.querySelectorAll('.bp-rate button')[2].click();location.hash='progress';await sleep(30);location.hash='settings';await sleep(30);
  // round complete twice
  for(let n=0;n<2;n++){startRound();let g=0;while(ROUND&&g++<30){const L=ROUND.legs[ROUND.i];if(['drill','review'].includes(L.t)){while(Q&&!Q.done){answer(Q.cur.ans);advance()}roundLegDone()}else roundLegDone();await sleep(800)}if(ROUND)add('round session did not finish');}
  return iss});
 log('B. flow issues:',B.length);B.forEach(x=>log('  ',x));log('page errors:',p._errs.length);p._errs.slice(0,10).forEach(e=>log('  ',e));
 /* ---------- C. state robustness ---------- */
 const cases={
  corrupt:`localStorage.setItem("kumquat.v1","{not json")`,
  nulls:`localStorage.setItem("kumquat.v1",JSON.stringify({xp:null,topics:null,srs:[],log:"x",lessons:5,recent:{dx:"bad"},plan:{start:"x"}}))`,
  legacy:`localStorage.setItem("clementine.v1",JSON.stringify({xp:321,streak:3,last:null,topics:{dx:{c:5,n:6}},ck:{}}))`,
  throwing:`Object.defineProperty(window,"localStorage",{get(){throw new Error("denied")}})`,
  future:`localStorage.setItem("kumquat.v1",JSON.stringify({xp:5,topics:{zzz:{c:1,n:1}},recent:{zzz:[true]},srs:{"S:9999":{box:1,due:0},"g:nope":{box:1,due:0}},miss:{"S:9999":3},plan:{start:0},cases:{ghost:100},lessons:{"99":true}}))`
 };
 for(const [name,init] of Object.entries(cases)){const q=await newPage(b,{port:PORT,init:`try{${init}}catch(e){}`});
   const res=await q.evaluate(async()=>{const r=[];const sleep=ms=>new Promise(x=>setTimeout(x,ms));for(const v of ['home','practice','progress','plan','learn','settings']){location.hash=v;await sleep(80)}try{startQuiz('review');if(Q&&!Q.done){answer(Q.cur.ans);advance()}}catch(e){r.push('review: '+e.message)}try{startQuiz('daily');answer(Q.cur.ans);advance()}catch(e){r.push('daily: '+e.message)}return {r,xp:typeof st!=='undefined'?st.xp:'?'}});
   log(`C. ${name}: xp=${res.xp}`,res.r.join('; '),q._errs.slice(0,4).join(' | '));await q.context().close()}
 await b.close();srv.close()})();
