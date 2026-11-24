const VID="assets/leecycle-scroll.mp4",FPS=24;
let FR=263; // detected from the video length once it loads
const $=s=>document.querySelector(s),cl=(v,a,b)=>Math.min(b,Math.max(a,v)),sm=v=>{v=cl(v,0,1);return v*v*(3-2*v)};
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const cv=$('#cv'),cx=cv.getContext('2d'),vd=document.createElement('video');
vd.muted=true;vd.playsInline=true;vd.preload='auto';vd.setAttribute('playsinline','');
let started=false,want=.5/FPS,busy=false;
function prog(v){$('#pn').textContent=v;$('#pb').style.width=v+'%'}
const xr=new XMLHttpRequest();xr.open('GET',VID);xr.responseType='blob';
xr.onprogress=e=>{if(e.lengthComputable)prog(Math.round(e.loaded/e.total*100))};
xr.onload=()=>{vd.src=URL.createObjectURL(xr.response)};xr.onerror=()=>{vd.src=VID};xr.send();
vd.addEventListener('loadeddata',()=>{FR=Math.round(vd.duration*FPS);prog(100);busy=true;vd.currentTime=want});
vd.addEventListener('seeked',()=>{busy=false;if(!started){start();return}paint();if(Math.abs(vd.currentTime-want)>.01)go()});
function go(){busy=true;vd.currentTime=want}
function fit(){const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d);cx.imageSmoothingQuality='high';if(started)paint()}
function paint(){const W=vd.videoWidth,H=vd.videoHeight,cw=cv.width,ch=cv.height,ar=cw/ch,vr=W/H;
 if(ar>vr){const a=Math.min(ar,2.15),sh=W/a,sy=(H-sh)*.1,dw=a<ar?ch*a:cw;
  if(a<ar){cx.save();cx.filter='blur(28px)';cx.drawImage(vd,0,sy,W,sh,-40,-40,cw+80,ch+80);cx.restore()}
  cx.drawImage(vd,0,sy,W,sh,(cw-dw)/2,0,dw,ch)}
 else{const sw=H*ar;cx.drawImage(vd,(W-sw)/2,0,sw,H,0,0,cw,ch)}}
function start(){started=true;fit();paint();setTimeout(()=>{$('#pre').classList.add('off');document.body.classList.add('go')},450)}
addEventListener('resize',fit);
const story=$('#story'),beats=[...document.querySelectorAll('.beat')],rf=$('#rf');
const SK=[...document.querySelectorAll('.sk')].map(s=>{const p=s.querySelector('path'),L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;return{p,L,sec:s.parentElement}});
let cur=0,mx=0,my=0,tx=0,ty=0;
addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
function tick(){
 const r=story.getBoundingClientRect(),H=story.offsetHeight-(innerHeight-64),p=cl(-r.top/H,0,1);
 cur+=(p-cur)*(RM?1:.04);if(Math.abs(p-cur)<.0002)cur=p;
 mx+=(tx-mx)*.06;my+=(ty-my)*.06;
 if(started){const fp=cl((cur-.03)/.87,0,1),w=(Math.round(fp*(FR-1))+.5)/FPS;if(w!==want){want=w;if(!busy)go()}}
 cv.style.transform='scale(1.03) translate('+(mx*-8)+'px,'+(my*-5)+'px)';
 rf.style.transform='scaleY('+cur+')';
 $('#hint').style.opacity=cur<.02?1:0;
 beats.forEach(b=>{const s=+b.dataset.s,e=+b.dataset.e,u=(cur-s)/(e-s),h='hero'in b.dataset,ls='last'in b.dataset,
  i=h?1:sm(u/.2),o=ls?1:sm((1-u)/.2),op=u<0&&!h?0:Math.min(i,o),sd=b.classList.contains('l')?1:-1;
  b.style.opacity=u>1?0:op;b.style.transform='translateX('+(-((1-i)+(1-o))*54*sd)+'px)';
  b.firstElementChild.style.transform='translate('+(mx*8)+'px,'+(my*5)+'px)';b.style.pointerEvents=op>.5?'auto':'none'});
 SK.forEach(o=>{const q=o.sec.getBoundingClientRect(),k=cl((innerHeight*.9-q.top)/(q.height+innerHeight*.4),0,1);o.p.style.strokeDashoffset=o.L*(1-sm(k*1.2))});
 requestAnimationFrame(tick)}
requestAnimationFrame(tick);
