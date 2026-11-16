// Read the paper + Abstract X-ray content checks (v11 d12): length cue, spin keys, number steps, and figures that must agree with each paper's own numbers.
// node tests/reading.test.js  → prints FAILS 0 when everything holds. No browser needed.
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../src/kumquat.html'),'utf8');
let fails=0,checks=0;const ok=(c,m)=>{checks++;if(!c){fails++;console.log('FAIL',m)}};
const line=html.split('\n').find(l=>l.startsWith('const PAPERS='));const PAPERS=JSON.parse(line.slice(13).replace(/;\s*$/,''));
const xa=html.indexOf('const XR_SPIN='),xb=html.indexOf('let XS=null;');const {XR,XR_SPIN}=new Function(html.slice(xa,xb)+';return {XR,XR_SPIN}')();
const near=(a,b,t)=>Math.abs(a-b)<=t;

/* 1. length cue (T5-8): the key must not usually be the longest option */
const cue=items=>{let n=0,l=0;items.forEach(({o,a})=>{n++;const L=o.map(x=>x.length);if(L[a]>Math.max(...L.filter((_,i)=>i!==a)))l++});return {n,l,share:l/n}};
const pq=cue(PAPERS.flatMap(P=>P.questions.map(q=>({o:q.o,a:0}))));
const xq=cue(XR.flatMap(x=>x.steps.filter(s=>s.k==='mcq').map(s=>({o:s.o,a:s.a}))));
console.log(`length cue: papers ${pq.l}/${pq.n} (${(pq.share*100).toFixed(0)}%), X-ray ${xq.l}/${xq.n} (${(xq.share*100).toFixed(0)}%)`);
ok(pq.share<=0.4,'papers: key is the longest option in more than 40% of questions');
ok(xq.share<=0.4,'X-ray: key is the longest option in more than 40% of MCQ steps');

/* 2. X-ray step integrity */
XR.forEach(x=>{ok(x.steps.length>=6,x.id+' has the six-step routine');
  x.steps.forEach((s,i)=>{const id=`${x.id} step ${i}`;
    if(s.k==='mcq'){ok(Number.isInteger(s.a)&&s.a>=0&&s.a<s.o.length,id+' key index');ok(new Set(s.o).size===s.o.length,id+' duplicate options')}
    else if(s.k==='num'){ok(isFinite(s.a)&&isFinite(s.tol)&&s.tol>0,id+' number answer and tolerance')}
    else{ok(Array.isArray(s.a)&&s.a.length>0&&s.a.every(k=>k in XR_SPIN),id+' spin keys exist');ok(!(s.a.includes('none')&&s.a.length>1),id+' “none” is exclusive');(s.ok||[]).forEach(k=>ok(k in XR_SPIN&&k!=='none'&&!s.a.includes(k),id+' fair-to-tick key '+k))}})});
const spin=id=>XR.find(x=>x.id===id).steps.find(s=>s.k==='multi');
ok(spin('sepsis-subgroup').a.includes('rel')&&spin('solvent-pd').a.includes('rel'),'T5-13 relative-only claims keyed consistently');
ok(spin('hs-trop').a.includes('safety'),'T5-10 troponin “safely rules out” keyed as overstated safety');
ok(spin('hfno-copd').a.includes('comparator')&&XR.find(x=>x.id==='hfno-copd').steps.some(s=>/comparator/i.test(s.h)),'T5-11 HFNO comparator step and key');
['secondary','surrogate','overgen','comparator','safety','trend'].forEach(k=>ok(k in XR_SPIN,'T5-14 spin category '+k));
/* T5-12: cellulitis CI fits n = 500 */
{const x=XR.find(y=>y.id==='ni-cellulitis');const se=Math.sqrt(.85*.15/250+.87*.13/250)*100;ok(x.text.includes(`−${(2+1.96*se).toFixed(1)} to ${(1.96*se-2).toFixed(1)}`),'T5-12 ITT CI is −8.1 to 4.1');
 const n=x.steps.find(s=>s.k==='num');ok(n.a===8.1&&n.mag,'T5-12 worst plausible loss 8.1, magnitude accepted')}
ok(!/pull the true effect towards none/.test(XR.find(x=>x.id==='ma-steroids-cap').steps.map(s=>s.e).join(' ')),'T5-15 heterogeneity does not pull toward the null');
/* X-ray arithmetic */
{const t=XR.find(x=>x.id==='hs-trop');const npv=t.steps.find(s=>s.k==='num');ok(near(npv.a,528/530*100,.05)&&npv.pct,'troponin NPV 99.6% and proportion accepted')}
{const l=XR.find(x=>x.id==='ldl-surrogate');ok(l.steps.find(s=>s.k==='num').a===Math.round(1/(0.07-0.05)),'LDL NNT 50');const se=Math.sqrt(1/30+1/42);ok(near(0.71*Math.exp(-1.96*se),0.44,.01)&&near(0.71*Math.exp(1.96*se),1.14,.01),'LDL MACE HR CI from 30 vs 42 events')}

/* 3. papers: content fixes */
const P=id=>PAPERS.find(p=>p.id===id);
ok(/two months/.test(P('its-sepsis-triage-protocol').walk.map(w=>w.p).join(' '))&&!/three months/.test(JSON.stringify(P('its-sepsis-triage-protocol'))),'T5-29 e-triage two months later');
ok(/either way|uncertain/.test(P('cohort-nightshift-htn').questions[2].e)&&!/upper-ish/.test(P('cohort-nightshift-htn').questions[2].e),'T5-28 censoring direction');
ok(/conditional logistic/.test(P('cc-heat-illness-acclimatisation').walk[0].p),'T5-30 conditional logistic regression');

/* 4. figures (T5-22) agree with the paper's numbers */
const KINDS=['km','roc','its','forest','consort'];
PAPERS.forEach(p=>{(p.figs||[]).forEach((f,i)=>ok(KINDS.includes(f.kind)&&f.caption,p.id+' fig '+i+' kind'));p.questions.forEach((q,i)=>{if(q.fig!=null)ok(p.figs&&p.figs[q.fig],p.id+' q'+i+' figure exists')})});
const figs=PAPERS.filter(p=>p.figs&&p.figs.length);ok(figs.length>=4,'at least four papers have a figure ('+figs.length+')');
{const f=P('cohort-nightshift-htn').figs[0];const ci=g=>100*(1-Math.exp(-g.rate*5));ok(near(ci(f.groups[0]),15.7,.05)&&near(ci(f.groups[1]),10.0,.05),'KM 5-year incidence 15.7% vs 10.0%');
 ok(f.groups[0].risk[0]===1903&&f.groups[1].risk[0]===2909&&f.groups[0].risk[5]===812&&f.groups[1].risk[5]===1287,'KM numbers at risk match the abstract');
 const py=g=>g.risk.reduce((a,r,t,arr)=>a+(t?(r+arr[t-1])/2:0),0)+g.risk[g.risk.length-1]/2;ok(near(py(f.groups[0]),8410,250)&&near(py(f.groups[1]),12850,350),'KM numbers at risk roughly match person-years')}
{const f=P('dx-poc-hba1c-screening').figs[0];const auc=p=>p.fpr*p.tpr/2+(1-p.fpr)*(p.tpr+1)/2;ok(near(auc(f.pts[0]),0.97,.006)&&near(auc(f.pts[1]),0.88,.006),'ROC single-cut-off areas match AUC 0.97 and 0.88');ok(near(f.pts[1].tpr,.8,1e-9)&&near(1-f.pts[1].fpr,.95,1e-3),'ROC phase 2 point is 80% / 95%')}
{const f=P('its-sepsis-triage-protocol').figs[0];const pre=t=>f.b0+f.b1*(t-1),post=t=>pre(t)+f.lvl+f.b3*(t-f.pre-1),n=f.pre+f.post,mean=(a,b,fn)=>{let s=0;for(let t=a;t<=b;t++)s+=fn(t);return s/(b-a+1)};
 ok(near(mean(1,f.pre,pre),118.8,.05)&&near(mean(f.pre+1,n,post),74.5,.05)&&near(mean(f.pre+1,n,pre),102.0,.05)&&near(post(n)-pre(n),-32.6,.05),'ITS model reproduces 118.8, 102.0, 74.5 and −32.6');ok(f.etriage===f.pre+3,'e-triage two months after launch')}
{const f=P('rct-whatsapp-bp').figs[0];ok(f.alloc.every((a,i)=>a-f.ppOut[i]===f.pp[i]&&f.itt[i]===a&&f.missing[i]<=f.ppOut[i]),'CONSORT boxes add up');ok(f.pp[0]===236&&f.pp[1]===262&&f.missing[0]===41&&f.missing[1]===27,'CONSORT matches Table 2')}
{const fp=P('ma-iv-magnesium-af').figs;if(fp&&fp[0]){const f=fp[0];
  const pool=tr=>{const y=tr.map(t=>Math.log((t.et)/(t.ec))),v=tr.map(t=>1/t.et-4/t.n+1/t.ec);let w=v.map(x=>1/x),mu=y.reduce((a,b,i)=>a+w[i]*b,0)/w.reduce((a,b)=>a+b);const Q=y.reduce((a,b,i)=>a+w[i]*(b-mu)**2,0),fe=[mu,1/Math.sqrt(w.reduce((a,b)=>a+b))];
    let t2=0;for(let k=0;k<200;k++){w=v.map(x=>1/(x+t2));mu=y.reduce((a,b,i)=>a+w[i]*b,0)/w.reduce((a,b)=>a+b);const W2=w.reduce((a,b)=>a+b*b,0);t2=Math.max(0,y.reduce((a,b,i)=>a+w[i]*w[i]*((b-mu)**2-v[i]),0)/W2+1/w.reduce((a,b)=>a+b))}
    w=v.map(x=>1/(x+t2));mu=y.reduce((a,b,i)=>a+w[i]*b,0)/w.reduce((a,b)=>a+b);return {re:[mu,1/Math.sqrt(w.reduce((a,b)=>a+b))],fe,Q,t2,I2:Math.max(0,(Q-(y.length-1))/Q)}};
  const r3=([m,s])=>[Math.exp(m),Math.exp(m-1.96*s),Math.exp(m+1.96*s)],cl=(a,b,t)=>a.every((x,i)=>near(x,b[i],t));
  const all=pool(f.trials),lo=pool(f.trials.filter(t=>t.low)),hi=pool(f.trials.filter(t=>!t.low));
  console.log('forest check: RE',r3(all.re).map(x=>x.toFixed(3)).join(' '),'FE',r3(all.fe).map(x=>x.toFixed(3)).join(' '),'I2',all.I2.toFixed(3),'tau2',all.t2.toFixed(3),'Q',all.Q.toFixed(2),'low',r3(lo.re).map(x=>x.toFixed(3)).join(' '),'high',r3(hi.re).map(x=>x.toFixed(3)).join(' '));
  ok(f.trials.length===14&&f.trials.reduce((a,t)=>a+t.n,0)===2140&&f.trials.filter(t=>t.low).length===5&&f.trials.filter(t=>t.low).reduce((a,t)=>a+t.n,0)===1180,'forest: 14 trials, 2,140 patients, 5 low risk of bias (1,180)');
  ok(cl(r3(all.re),[1.28,1.08,1.52],.015),'forest: random-effects pool reproduces 1.28 (1.08–1.52)');ok(cl(r3(all.fe),[1.19,1.10,1.29],.015),'forest: fixed-effect pool reproduces 1.19 (1.10–1.29)');
  ok(near(all.I2,.62,.02)&&near(all.Q,34.2,1),'forest: I² 62%, Q 34.2');ok(cl(r3(lo.re),[1.08,.94,1.24],.02)&&cl(r3(hi.re),[1.46,1.17,1.82],.03),'forest: subgroup pools match Table 2');
  f.trials.forEach((t,i)=>{const y=Math.log(t.et/t.ec),se=Math.sqrt(1/t.et-4/t.n+1/t.ec);ok(near(t.rr,Math.exp(y),.006)&&near(t.lo,Math.exp(y-1.96*se),.006)&&near(t.hi,Math.exp(y+1.96*se),.006),'forest trial '+i+' RR and CI from its counts')})}}
console.log(`${checks} checks`);console.log('FAILS',fails);
