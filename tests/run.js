// Runs every Kumquat test suite in order and fails if any suite fails.
// node tests/run.js            all suites
// node tests/run.js quick      skip the long sweep
const {spawnSync}=require('child_process'),fs=require('fs'),path=require('path');
const D=__dirname,quick=process.argv.includes('quick');
const has=(re)=>o=>re.test(o),no=(re)=>o=>!re.test(o);
const SUITES=[
 ['build',null,[]],
 ['v7test.js','Round end to end, Toolkit, papers, decoder, figures, layout',[has(/^FAILS 0$/m)]],
 ['v8test.js','method step, fading hints, recall, links, Abstract X-ray',[has(/^FAILS 0$/m)]],
 ['reading.test.js','Read the paper + Abstract X-ray content: length cue, spin keys, figures match the numbers',[has(/^FAILS 0$/m)]],
 ['v9test.js','moods, interfaces, keyboard, gamepad, sound',[has(/^FAILS 0$/m)]],
 ['v9btest.js','mastery, formulas, bias and design tools, real papers',[has(/^FAILS 0$/m)]],
 ['v9ctest.js','campaign, deep links, clinic calls, status v2',[has(/^FAILS 0$/m)]],
 ['decoder.test.js','paper decoder: NEJM, Lancet, JAMA, BMJ, Cochrane, NI and accuracy abstracts',[has(/^FAILS 0$/m)]],
 ['v10test.js','Dar al-Mizan world: guild look, Shaykh, omen, oath, duels, Archive',[has(/^FAILS 0$/m)]],
 ['audit.js','content integrity and every flow',[has(/flow issues: 0/),has(/page errors: 0/)]],
 ['hubtest.js','Google Drive + Citrus + Yuzu on two devices (fake Drive)',[has(/A signed in: true/),has(/B one-tap/),has(/inbox: kumquat-misses/),has(/status v2: 2 /),no(/sheet: none/),has(/^errors: \[\]$/m)]],
 ['pwatest.js','phone app: offline, update banner',[has(/controlled: true/),has(/offline loads: true/),has(/update banner: true/),has(/^errors \[\]$/m)]],
 ['sweep.js','every view × 4 screens + random taps',[o=>{try{const r=JSON.parse(fs.readFileSync(path.join(D,'.tmp/sweep.json'),'utf8'));return !Object.values(r.monkey).some(v=>v.errs.length)&&!Object.values(r.views).some(v=>v.hscroll)}catch(e){return false}}],true]];
let failed=0;const t0=Date.now();
for(const [f,what,checks,slow] of SUITES){
  if(slow&&quick)continue;
  let out='',code=0;const s=Date.now();
  if(f==='build'){const r=spawnSync('node',[path.join(D,'../tools/build.js'),'--check'],{encoding:'utf8'});out=r.stdout+r.stderr;code=r.status;checks.push(()=>code===0)}
  else{const r=spawnSync('node',[f],{cwd:D,encoding:'utf8',timeout:15*60e3,env:process.env});out=(r.stdout||'')+(r.stderr||'');code=r.status}
  const ok=code===0&&checks.every(c=>c(out));if(!ok)failed++;
  console.log(`${ok?'PASS':'FAIL'}  ${f.padEnd(12)} ${((Date.now()-s)/1000).toFixed(0).padStart(4)}s  ${what||out.trim()}`);
  if(!ok)console.log(out.split('\n').filter(l=>/FAIL|ERR|error|STALE|false|none/i.test(l)).slice(0,25).map(l=>'      '+l.slice(0,300)).join('\n'));
}
console.log(`\n${failed?failed+' suite(s) failed':'all suites passed'} in ${((Date.now()-t0)/60e3).toFixed(1)} min`);process.exit(failed?1:0);
