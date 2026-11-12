// Beta 1: every view × 4 device/theme combos → errors, overflow, clipped text, unlabeled controls, small targets; then a monkey click pass.
const {chromium}=require('playwright');const {serve,newPage,SP}=require('./serve');const fs=require('fs');
const PORT=4301;
(async()=>{const srv=serve(PORT);const b=await chromium.launch();const report={views:{},monkey:{},errors:[]};
 const probe=await newPage(b,{port:PORT});
 const views=(await probe.evaluate(()=>VIEWS)).filter(v=>!["quiz","lesson","case","round"].includes(v)).concat(["lesson-1","lesson-7","case-snow","case-recovery","round-er-ddimer"]);
 await probe.context().close();
 const combos=[[390,844,'light'],[390,844,'dark'],[768,1024,'dark'],[1280,900,'light']];
 for(const [w,h,theme] of combos){const p=await newPage(b,{w,h,theme,port:PORT});
  for(const v of views){p._errs.length=0;await p.evaluate(v=>{location.hash=v},v);await p.waitForTimeout(260);
   // seed some interaction so dynamic content renders
   const r=await p.evaluate(({w})=>{const out={hscroll:document.documentElement.scrollWidth>innerWidth+1,over:[],clip:[],unl:[],small:0,smallEx:[],text:0};
     const sec=[...document.querySelectorAll('main > section')].find(s=>!s.hidden);out.text=sec?sec.innerText.trim().length:0;
     const allowed=el=>el.closest('.tbl-wrap,.web-wrap,.forest-wrap,.viz,.tabs,#roundbar,.sheet-scrim,#toast,.hintbubble');
     const desc=el=>(el.id?'#'+el.id:'')+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).slice(0,2).join('.'):'')+'<'+el.tagName.toLowerCase()+'> "'+(el.innerText||el.getAttribute('aria-label')||'').trim().slice(0,30)+'"';
     const vis=el=>{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'};
     for(const el of document.querySelectorAll('main *')){if(!vis(el)||allowed(el))continue;const r=el.getBoundingClientRect();
       if(r.right>innerWidth+1||r.left<-1)out.over.push(desc(el));
       const cs=getComputedStyle(el);if(/hidden|clip/.test(cs.overflowX)&&el.scrollWidth>el.clientWidth+2&&!/INPUT|TEXTAREA|SELECT|CANVAS|svg/i.test(el.tagName)&&!el.closest('.bcard'))out.clip.push(desc(el))}
     for(const el of document.querySelectorAll('button,a[href],input,select,textarea')){if(!vis(el))continue;const name=(el.innerText||el.value||el.getAttribute('aria-label')||el.getAttribute('title')||el.getAttribute('placeholder')||(el.labels&&el.labels[0]&&el.labels[0].innerText)||'').trim();
       if(!name&&!el.closest('.hintbubble'))out.unl.push(desc(el));
       const r=el.getBoundingClientRect();if(w<800&&!/INPUT|TEXTAREA|SELECT/.test(el.tagName)&&(r.height<32||r.width<32)&&!el.closest('.forest-wrap,.vz-tl')){out.small++;if(out.smallEx.length<4)out.smallEx.push(desc(el)+` ${Math.round(r.width)}×${Math.round(r.height)}`)}}
     out.over=[...new Set(out.over)].slice(0,6);out.clip=[...new Set(out.clip)].slice(0,6);out.unl=[...new Set(out.unl)].slice(0,6);return out},{w});
   r.errs=[...p._errs];const key=`${v}@${w}${theme[0]}`;
   if(r.hscroll||r.over.length||r.clip.length||r.unl.length||r.errs.length||r.text<40||r.small>0)report.views[key]=r;
   if(w===390&&theme==='dark')await p.screenshot({path:`${SP}tests/shots/${v}.png`,fullPage:false});
  }
  await p.context().close()}
 // monkey: click everything clickable in each view, returning to the view between clicks
 const p=await newPage(b,{port:PORT});
 const DANGER='#reset-yes,#g-out,#rb-stop,#g-take,#g-keep,#g-import';
 for(const v of views){await p.evaluate(v=>{location.hash=v},v);await p.waitForTimeout(200);
  const n=await p.evaluate(D=>{const vis=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0};const sec=[...document.querySelectorAll('main > section')].find(s=>!s.hidden);if(!sec)return 0;
    const els=[...sec.querySelectorAll('button,a[href^="#"],.opt,[data-start],.web-n,.bcard,summary,input[type=checkbox]')].filter(e=>vis(e)&&!e.matches(D)&&!e.disabled);els.forEach((e,i)=>e.setAttribute('data-mk',i));return els.length},DANGER);
  let clicked=0;const errsBefore=p._errs.length;
  for(let i=0;i<Math.min(n,45);i++){const ok=await p.evaluate(i=>{const e=document.querySelector(`[data-mk="${i}"]`);if(!e)return false;e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));return true},i);
   if(!ok)continue;clicked++;await p.waitForTimeout(90);
   await p.evaluate(()=>{try{if(typeof stopTimer==='function')stopTimer();if(window.ROUND){ROUND=null;renderRoundBar()}const s=document.querySelector('.sheet-scrim');if(s)s.remove()}catch(e){}});
   if(!(await p.evaluate(v=>location.hash==='#'+v,v))){await p.evaluate(v=>{location.hash=v},v);await p.waitForTimeout(160);
     await p.evaluate(D=>{const vis=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0};const sec=[...document.querySelectorAll('main > section')].find(s=>!s.hidden);if(!sec)return;[...sec.querySelectorAll('button,a[href^="#"],.opt,[data-start],.web-n,.bcard,summary,input[type=checkbox]')].filter(e=>vis(e)&&!e.matches(D)&&!e.disabled).forEach((e,i)=>e.setAttribute('data-mk',i))},DANGER)}}
  report.monkey[v]={controls:n,clicked,errs:p._errs.slice(errsBefore)};}
 report.errors=p._errs;fs.writeFileSync(SP+'tests/.tmp/sweep.json',JSON.stringify(report,null,1));
 const vk=Object.keys(report.views);console.log('views with findings:',vk.length);for(const k of vk){const r=report.views[k];console.log(k,JSON.stringify({h:r.hscroll,over:r.over,clip:r.clip,unl:r.unl,small:r.small,smallEx:r.smallEx,text:r.text,errs:r.errs}))}
 console.log('--- monkey');for(const [v,m] of Object.entries(report.monkey)){if(m.errs.length)console.log(v,m.controls,m.clicked,m.errs.slice(0,4))}
 console.log('monkey total clicks',Object.values(report.monkey).reduce((a,m)=>a+m.clicked,0));
 await b.close();srv.close()})();
