// Paper decoder and design guesser regression set (v11): realistic abstracts in NEJM, Lancet, JAMA, BMJ and Cochrane styles,
// plus the app's own papers. Asserts what decodeNumbers / rpGuessDesign / decSummary must find.
// node tests/decoder.test.js [path/to/kumquat.html]
const {chromium}=require('playwright');const path=require('path');
const F=process.argv[2]||path.resolve(__dirname,'../src/kumquat.html');
const ABS={
 nejm:`BACKGROUND In patients with type 2 diabetes, SGLT2 inhibitors reduce the risk of a first hospitalization for heart failure. METHODS In this phase 3, placebo-controlled trial, we randomly assigned 4744 patients with heart failure and an ejection fraction of 40% or less to receive either dapagliflozin or placebo. The primary outcome was a composite of worsening heart failure or cardiovascular death. RESULTS Over a median of 18.2 months, the primary outcome occurred in 386 of 2373 patients (16.3%) in the dapagliflozin group and in 502 of 2371 patients (21.2%) in the placebo group (hazard ratio, 0.74; 95% confidence interval [CI], 0.65 to 0.85; P<0.001). A first worsening heart failure event occurred in 237 patients (10.0%) in the dapagliflozin group and in 326 patients (13.7%) in the placebo group (hazard ratio, 0.70; 95% CI, 0.59 to 0.83). Death from cardiovascular causes occurred in 227 patients (9.6%) and 273 patients (11.5%), respectively (hazard ratio, 0.82; 95% CI, 0.69 to 0.98). CONCLUSIONS Among patients with heart failure and a reduced ejection fraction, the risk of worsening heart failure or death was lower with dapagliflozin.`,
 lancet:`Background Tranexamic acid can reduce bleeding in elective surgery. Methods This randomised controlled trial was undertaken in 274 hospitals in 40 countries. 20 211 adult trauma patients with, or at risk of, significant bleeding were randomly assigned within 8 h of injury to tranexamic acid or matching placebo. Findings All-cause mortality was significantly reduced with tranexamic acid (1463 [14·5%] tranexamic acid group vs 1613 [16·0%] placebo group; relative risk 0·91, 95% CI 0·85–0·97; p=0·0035). The risk of death due to bleeding was significantly reduced (489 [4·9%] vs 574 [5·7%]; relative risk 0·85, 95% CI 0·76–0·96; p=0·0077). Interpretation Tranexamic acid reduced the risk of death in bleeding trauma patients.`,
 jama:`Design, Setting, and Participants Randomized clinical trial in 30 emergency departments. Results Among 1200 randomized patients, the primary outcome occurred in 24.0% vs 31.0% (hazard ratio [HR], 0.75 [95% CI, 0.64-0.89]; P = .001). In a prespecified subgroup of women, the HR was 0.62 (95% CI, 0.45-0.86). Mortality did not differ (adjusted odds ratio [aOR], 0.92; 95% CI, 0.70-1.21).`,
 bmj:`Design Prospective cohort study. Results Hip fracture was less common in the intervention group (hazard ratio 0.80, 95% confidence interval 0.66 to 0.97). The absolute risk reduction was 1.2% (0.3% to 2.1%), number needed to treat 84. Sensitivity analyses using multiple imputation gave similar results. The cohort was followed for 10 years.`,
 cochrane:`Background Corticosteroids may modulate the host response in sepsis. Search methods We searched CENTRAL, MEDLINE, Embase and trial registries. Selection criteria Randomised controlled trials (RCTs) of corticosteroids versus placebo or usual care. Main results We included 61 trials (12,192 participants). Corticosteroids probably slightly reduce 28-day mortality (risk ratio (RR) 0.91, 95% confidence interval (CI) 0.84 to 0.99; 7297 participants; 50 studies; moderate-certainty evidence; I2 = 38%). Corticosteroids may reduce hospital mortality (RR 0.90, 95% CI 0.82 to 0.99; low-certainty evidence).`,
 ni:`METHODS We enrolled adults treated for bone or joint infection at 26 centers and randomly assigned them to intravenous or oral antibiotics. The primary end point was definitive treatment failure within 1 year after randomization. The noninferiority margin was 7.5 percentage points. RESULTS Treatment failure occurred in 74 of 506 participants (14.6%) in the intravenous group and 67 of 509 participants (13.2%) in the oral group. The difference in the risk of definitive treatment failure (oral group vs. intravenous group) in the intention-to-treat analysis was −1.4 percentage points (90% confidence interval [CI], −5.6 to 2.9), indicating noninferiority.`,
 dx:`Objective To assess the accuracy of a headache decision rule. Design Multicenter prospective cohort study in 10 emergency departments. Results Among 2131 patients (mean age 43.4 years; 59.4% women), 132 (6.2%) had subarachnoid hemorrhage. The rule had sensitivity 100% (95% CI, 97.2%-100.0%) and specificity 15.3% (95% CI, 13.8%-16.9%). The positive likelihood ratio was 1.18 and the negative likelihood ratio was 0.00 (95% CI, 0.00-0.18).`,
 cohortSens:`Methods Prospective cohort of 12,000 adults followed for 8 years. Results Smoking was associated with incident AF (adjusted HR 1.32, 95% CI 1.10-1.58). Sensitivity analyses excluding the first two years gave similar results. Conclusions Smoking cessation may prevent AF.`,
 registry:`METHODS We studied data from patients with sepsis reported to the New York State Department of Health. We used multilevel models to examine associations between the time to completion of the 3-hour bundle and risk-adjusted mortality. RESULTS Among 49,331 patients at 149 hospitals, each hour of delay was associated with higher risk-adjusted in-hospital mortality (odds ratio, 1.04 per hour; 95% confidence interval [CI], 1.02 to 1.05; P<0.001).`,
 its:`Methods Interrupted time series of monthly door-to-antibiotic time, analysed with segmented regression. Results At launch there was an immediate drop of 22.4 minutes (95% CI 13.8 to 31.0; p <0.001).`
};
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[],fails=[];p.on('pageerror',e=>errs.push(e.message));
 const ok=(c,m)=>{if(!c)fails.push(m)};
 await p.goto('file://'+F);await p.waitForTimeout(600);
 const R=await p.evaluate(A=>{const o={};for(const k in A){const f=decodeNumbers(A[k]);o[k]={design:rpGuessDesign(A[k]),sum:decSummary(f),meta:{tf:f.meta.tf,ni:f.meta.ni,niM:f.meta.niM,primSure:f.meta.primSure},hits:f.map(h=>({kind:h.kind,grp:h.grp,pref:!!h.pref,v:h.v,lo:h.lo,hi:h.hi,lvl:h.lvl,a:h.a,b:h.b,test:h.test,src:h.src,lines:h.lines.join(' | ')}))}}return o},ABS);
 const H=(k,f)=>R[k].hits.filter(f);
 // T5-1 NEJM "[CI]," and Cochrane "(CI)"
 ok(H('nejm',h=>h.kind==='ratio'&&h.v===0.74&&h.lo===0.65&&h.hi===0.85).length===1,'NEJM primary HR 0.74 decoded');
 ok(H('nejm',h=>h.pref)[0]&&H('nejm',h=>h.pref)[0].v===0.74&&R.nejm.meta.primSure,'NEJM HR 0.74 is the likely primary');
 ok(H('nejm',h=>h.kind==='ratio').length===3,'NEJM 3 ratios');
 ok(H('cochrane',h=>h.kind==='ratio'&&h.v===0.91&&h.hi===0.99).length===1,'Cochrane (RR)/(CI) form decoded');
 // T5-2 Lancet middle dots and thin-space thousands
 ok(H('lancet',h=>h.kind==='ratio'&&h.v===0.91&&h.lo===0.85&&h.hi===0.97).length===1,'Lancet RR 0·91 decoded');
 ok(H('lancet',h=>h.kind==='p'&&/0\.0035/.test(h.src)).length===1,'Lancet p=0·0035 decoded');
 ok(H('lancet',h=>h.kind==='rates'&&h.a===14.5&&h.b===16).length===1,'Lancet [14·5%] vs [16·0%] paired');
 // T5-3 unlabelled CIs, 90% CI, ARR and "number needed to treat"
 const app=await p.evaluate(()=>{const g=id=>PAPERS.find(P=>P.id===id).abstract;return {wa:decodeNumbers(g('rct-whatsapp-bp')).map(h=>[h.kind,h.v,h.lo,h.hi]),ns:decodeNumbers(g('cohort-nightshift-htn')).map(h=>[h.kind,h.v,h.lo,h.hi,!!h.pref]),cc:decodeNumbers(g('cc-heat-illness-acclimatisation')).map(h=>[h.kind,h.v]),ni:decodeNumbers(g('ni-dex-asthma-ed')).map(h=>[h.kind,h.v,h.lines.join(' ')]),hb:decodeNumbers(g('dx-poc-hba1c-screening')).map(h=>[h.kind,h.src,h.lines.join(' ')]),ma:decodeNumbers(g('ma-iv-magnesium-af')).map(h=>[h.kind,h.test||'',h.lines.join(' ')]),des:PAPERS.map(P=>[P.id,rpGuessDesign(P.abstract)])}});
 ok(app.wa.some(h=>h[0]==='ratio'&&h[1]===1.36&&h[2]===1.14),'RR 1.36 (1.14 to 1.62) decoded without a CI label');
 ok(app.ns.filter(h=>h[0]==='ratio').map(h=>h[1]).join()==='1.62,1.38,1.21','night shift: crude and both adjusted HRs');
 ok(app.ns.some(h=>h[0]==='ratio'&&h[1]===1.21&&h[4]),'night shift: fully adjusted HR is the likely primary');
 ok(['2.67','2.31','1.95','1.52','1.22'].every(v=>app.cc.some(h=>h[0]==='ratio'&&String(h[1])===v)),'heat illness: Model A OR 2.31 and interaction OR 1.95 decoded');
 ok(H('ni',h=>h.kind==='diff'&&h.v===-1.4&&h.lvl===90).length===1,'OVIVA: −1.4 points with a 90% CI decoded');
 ok(H('ni',h=>h.kind==='diff')[0]&&/90% CI/.test(H('ni',h=>h.kind==='diff')[0].lines),'90% CI printed as 90%');
 ok(H('bmj',h=>h.kind==='diff'&&h.v===1.2&&/NNT \(or NNH\) ≈ 84/.test(h.lines)&&/48 to 334/.test(h.lines)).length===1,'BMJ ARR 1.2% → NNT 84, CI 48 to 334');
 ok(H('bmj',h=>h.kind==='nnt'&&h.v===84).length===1,'"number needed to treat 84" decoded');
 // T5-4 event rates
 ok(H('nejm',h=>h.kind==='rates'&&h.a===16.3&&h.b===21.2&&/relative change -23%/.test(h.lines)).length===1,'NEJM "386 of 2373 (16.3%) … 502 of 2371 (21.2%)" paired, relative change vs control');
 const nsr=await p.evaluate(()=>decodeNumbers(PAPERS.find(P=>P.id==='cohort-nightshift-htn').abstract).filter(h=>h.kind==='rates').map(h=>({a:h.a,b:h.b,l:h.lines.join(' ')})));
 ok(nsr.some(r=>r.a===15.7&&/\+57%/.test(r.l)),'15.7% vs 10.0%: relative change +57%');
 ok(nsr.some(r=>r.a===38&&!/NNT \(or|treated for one/.test(r.l)),'38% vs 29% (leaving employment): no NNT offered');
 ok(app.ni.some(h=>h[0]==='rates'&&/Non-inferiority trial/.test(h[2])),'NI trial: event pairs not turned into an NNT');
 // T5-5 non-inferiority logic
 ok(R.ni.meta.ni&&R.ni.meta.niM&&R.ni.meta.niM.v===7.5,'OVIVA margin 7.5 found');
 ok(/upper bound 2\.9 < margin 7\.5 → non-inferiority shown/.test(R.ni.sum),'OVIVA verdict in summary: '+R.ni.sum);
 ok(/not 0/.test(H('ni',h=>h.kind==='diff')[0].lines)&&!/not statistically significant\./.test(H('ni',h=>h.kind==='diff')[0].lines),'NI frame replaces "includes 0 → not significant"');
 ok(app.ni.some(h=>h[0]==='diff'&&h[1]===0.2&&/upper bound 4\.9 < margin 5 → non-inferiority shown/.test(h[2]))&&app.ni.some(h=>h[0]==='diff'&&h[1]===2.3&&/upper bound 7\.2 ≥ margin 5 → non-inferiority NOT shown/.test(h[2])),'dexamethasone NI: ITT shown, per-protocol not shown');
 // T5-6 design guesser
 const D={nejm:/^Randomised/,lancet:/^Randomised/,jama:/^Randomised/,bmj:/^Cohort/,cochrane:/^Systematic review/,ni:/^Non-inferiority/,dx:/^Diagnostic accuracy/,cohortSens:/^Cohort/,registry:/^Observational/,its:/^Interrupted time series/};
 for(const k in D)ok(D[k].test(R[k].design),'design '+k+': '+R[k].design);
 const want={'rct-whatsapp-bp':/^Randomised/,'ni-dex-asthma-ed':/^Non-inferiority/,'cohort-nightshift-htn':/^Cohort/,'cc-heat-illness-acclimatisation':/^Case-control/,'dx-poc-hba1c-screening':/^Diagnostic/,'ma-iv-magnesium-af':/^Systematic/,'xs-noise-hearing-workers':/^Cross-sectional/,'spin-telemonitoring-hf':/^Randomised/,'psm-ketamine-etomidate-rsi':/^Cohort|^Observational/,'its-sepsis-triage-protocol':/^Interrupted/};
 app.des.forEach(([id,d])=>ok(want[id].test(d),'app paper design '+id+': '+d));
 // T5-16 p values in context
 ok(app.ma.some(h=>h[1]==='het'&&/Cochran/.test(h[2]))&&app.ma.some(h=>h[1]==='egger'&&/asymmetry/.test(h[2])),'magnesium: Q and Egger p explained as tests');
 const p05=await p.evaluate(()=>decodeNumbers("Results: mortality differed (p = 0.05).").find(h=>h.kind==='p').lines.join(' '));ok(/Not below 0\.05/.test(p05),'p = 0.05 is not below 0.05');
 ok(await p.evaluate(()=>decodeNumbers("Schoenfeld test p = 0.31.").some(h=>h.test==='ph')),'Schoenfeld p recognised');
 // T5-17 diagnostic decoding
 ok(app.hb.filter(h=>h[0]==='dx').length===2&&/Phase 1/.test(app.hb.filter(h=>h[0]==='dx')[0][1])&&/Phase 2/.test(app.hb.filter(h=>h[0]==='dx')[1][1]),'HbA1c: both phases decoded, in order');
 ok(app.hb.some(h=>h[0]==='dx'&&/PPV 58\.2%, NPV 98\.2%/.test(h[2])),'HbA1c phase 2: PPV/NPV at the 8.0% prevalence');
 ok(app.hb.some(h=>h[0]==='lr'&&/16\.0/.test(h[2])&&/0\.21/.test(h[2])),'stated LRs decoded');
 ok(H('dx',h=>h.kind==='dx'&&/LR− = 0\.00/.test(h.lines)&&/6\.2%/.test(h.lines)).length===1,'SAH rule: LR− 0 and prevalence 6.2% used');
 ok(H('bmj',h=>h.kind==='dx').length===0&&H('cohortSens',h=>h.kind==='dx').length===0,'"sensitivity analyses" never decoded as accuracy');
 ok(await p.evaluate(()=>decodeNumbers("Sensitivity was 0.98 and specificity 0.40.").some(h=>h.kind==='dx'&&/98%/.test(h.src))),'decimal proportions accepted');
 // T5-26 primary detection and T5-33 summary
 ok(/^Primary: HR 0\.74 \(95% CI 0\.65–0\.85\).*NNT ≈ 21/.test(R.nejm.sum)&&/18\.2 months/.test(R.nejm.sum),'NEJM journal-club line: '+R.nejm.sum);
 ok(R.nejm.hits.filter(h=>h.grp==='primary').length>=2&&R.nejm.hits.some(h=>h.grp==='sec'),'NEJM grouped primary/secondary');
 ok(H('jama',h=>h.grp==='sub'&&h.v===0.62).length===1,'JAMA subgroup grouped');
 ok(H('lancet',h=>h.pref)[0]&&H('lancet',h=>h.pref)[0].v===0.91,'Lancet first main result = RR 0.91');
 ok(R.nejm.meta.tf==='a median of 18.2 months'&&R.ni.meta.tf==='1 year','time frames found');
 // no false pairs from CIs or accuracy pairs
 ok(H('dx',h=>h.kind==='rates').length===0,'no rate pair from sensitivity/specificity or CIs');
 console.log('ERRORS',errs);console.log('FAILS',fails.length);fails.forEach(f=>console.log(' -',f));await b.close();process.exit(fails.length||errs.length?1:0)})();
