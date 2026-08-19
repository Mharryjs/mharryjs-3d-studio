/* ╔══════════════════════════════════════════════════════════════╗
   ║  ⚙️ CONFIG — Mharryjs Portfolio Configuration                ║
   ╚══════════════════════════════════════════════════════════════╝ */
const CONFIG={
  brand:"Mharryjs", tag:"3D STUDIO", fullName:"Mharryjs Studio",
  pill:"Available for new work",
  title1:"Designing the",            
  title2:"invisible layer.",         
  sub:"I build high-end interfaces and real-time 3D experiences with nothing but HTML, CSS and JavaScript — powered by a real Node/Express API and a persistent database.",
  cta1:"Start a project →", cta2:"See the work",

  metrics:[{n:142,s:"",l:"Projects"},{n:99,s:"%",l:"Satisfaction"},{n:12,s:"h",l:"Avg. reply"}],

  capTitle:"What I engineer", capSub:"Three disciplines, one seamless pipeline.",
  caps:[
    {i:"🌌",t:"Real-time 3D",d:"Depth-sorted wireframe geometry, additive bloom and particle fields — hand-written projection math on a raw canvas.",g:["Canvas 2D","3D math","60fps"]},
    {i:"⚙️",t:"Backend systems",d:"Express REST APIs with validated CRUD, persistent storage and clean, predictable error handling.",g:["Node.js","Express","REST"]},
    {i:"🪞",t:"Interface design",d:"Transparent glass surfaces, fluid type scales and motion that guides attention instead of stealing it.",g:["CSS3","Motion","A11y"]}
  ],

  steps:[{i:"01",t:"Discover",d:"Goals, constraints, references."},
         {i:"02",t:"Design",d:"Layout, motion language, prototype."},
         {i:"03",t:"Build",d:"Frontend, API, database, tests."},
         {i:"04",t:"Ship",d:"Deploy, measure, iterate."}],

  works:[
    {e:"🌌",t:"Cosmic Orb Engine",d:"A depth-sorted 3D wireframe sphere with curved filaments, nebula dust and additive bloom — written from scratch.",g:["Canvas","3D Math"],demo:"#",code:"#",img:"",bg:"linear-gradient(135deg,#f0a6ff,#5b21b6)"},
    {e:"📡",t:"Live Data Inbox",d:"Express REST API plus JSON database with search, export and automatic offline fallback.",g:["Node","Express"],demo:"#",code:"#",img:"",bg:"linear-gradient(135deg,#5b8cff,#4c1d95)"},
    {e:"🛍️",t:"Commerce Front",d:"Responsive storefront with cart state, filters and a WhatsApp checkout flow in vanilla JS.",g:["JS","CSS Grid"],demo:"#",code:"#",img:"",bg:"linear-gradient(135deg,#f0abfc,#7c3aed)"}
  ],

  blurb:"Fill in the form and it lands in the live database instantly. Prefer email? Everything below works too.",
  email:"sswiftsite@gmail.com", location:"Quetta, Balochistan, Pakistan", reply:"Within 12 hours",
  socials:[
    {l:"GitHub",u:"https://github.com/Mharryjs"},
    {l:"LinkedIn",u:"https://www.linkedin.com/in/m-harry-js-98076442a"}
  ],
  types:["Website / Landing page","Web application","3D / Motion experience","Full-stack build","Something else"],

  orb:{
    points:260,        
    filaments:11,      
    dust:150,          
    starGap:5000,      
    spin:0.0038,       
    size:0.205,        
    linkDist:0.118     
  },

  api:"/api/messages"
};

/* 3D ORB RENDERING ENGINE */
(function(){
const O=CONFIG.orb, cv=document.getElementById('orb'), x=cv.getContext('2d',{alpha:false});
const DPR=Math.min(devicePixelRatio||1,2);
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
let W,H,CX,CY,R,stars=[],dust=[],pts=[],fils=[],rings=[],links=[];
let mx=0,my=0,tx=0,ty=0,t=0,scrollY=0;

const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const hex=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');
  const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
let C_CORE,C_HALO,C_DEEP,C_BG;
const rgba=(c,a)=>'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';

function build(){
  W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR;
  cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px';
  CX=W/2; CY=H*0.455; R=Math.min(W,H)*O.size;
  C_CORE=hex(css('--core')); C_HALO=hex(css('--halo')); C_DEEP=hex(css('--deep')); C_BG=css('--bg')||'#05030d';

  stars=[]; const sc=Math.floor((innerWidth*innerHeight)/O.starGap);
  for(let i=0;i<sc;i++){
    const d=Math.random();
    stars.push({x:Math.random()*W,y:Math.random()*H,r:(d*1.5+.2)*DPR,
      a:d*.6+.1,sp:Math.random()*.02+.003,ph:Math.random()*6.283,d:d*.7+.3});
  }

  dust=[];
  for(let i=0;i<O.dust;i++){
    const th=Math.random()*6.283, ph=Math.acos(2*Math.random()-1), rr=1.5+Math.random()*2.6;
    dust.push({th,ph,r:rr,sp:(Math.random()-.5)*.0022,sz:Math.random()*1.5+.4,a:Math.random()*.5+.15});
  }

  pts=[]; const N=innerWidth<720?Math.round(O.points*.6):O.points, ga=Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<N;i++){
    const yy=1-(i/(N-1))*2, rad=Math.sqrt(Math.max(0,1-yy*yy)), th=ga*i;
    pts.push({x:Math.cos(th)*rad,y:yy,z:Math.sin(th)*rad,ph:Math.random()*6.283,s:Math.random()*.55+.45});
  }
  
  links=[];
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
    const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,dz=a.z-b.z,d=dx*dx+dy*dy+dz*dz;
    if(d<O.linkDist) links.push({i,j,w:1-Math.sqrt(d)/Math.sqrt(O.linkDist)});
  }

  fils=[];
  for(let i=0;i<O.filaments;i++){
    const base=(i/O.filaments)*6.283+Math.random()*.5, el=(Math.random()-.5)*1.7;
    const seg=22, p=[];
    const bendA=(Math.random()-.5)*1.5, bendE=(Math.random()-.5)*1.1;
    const len=1.15+Math.random()*1.25;
    for(let s=0;s<=seg;s++){
      const k=s/seg, ease=k*k*(3-2*k);
      p.push({a:base+bendA*ease+Math.sin(k*4+i)*.14,
              e:el+bendE*ease+Math.cos(k*3.2+i)*.16,
              r:1+ease*len, k});
    }
    fils.push({p,ph:Math.random()*6.283,sp:.3+Math.random()*.5,br:.6+Math.random()*.5});
  }

  rings=[];
  for(let i=0;i<9;i++) rings.push({rx:.24+i*.072,ratio:.2+Math.random()*.42,
    rot:Math.random()*Math.PI,sp:(Math.random()-.5)*.0075,a:.08+Math.random()*.20,
    tilt:(Math.random()-.5)*1.2});
}

function project(px,py,pz,ry,rx,S){
  let c=Math.cos(ry),s=Math.sin(ry);
  let X=px*c-pz*s, Z=px*s+pz*c;
  c=Math.cos(rx); s=Math.sin(rx);
  let Y=py*c-Z*s; Z=py*s+Z*c;
  const p=2.8/(2.8+Z);
  return{x:CX+X*S*p, y:CY+Y*S*p, z:Z, p};
}
const sph=(a,e,r)=>[Math.cos(e)*Math.cos(a)*r, Math.sin(e)*r, Math.cos(e)*Math.sin(a)*r];

addEventListener('resize',build);
addEventListener('mousemove',e=>{tx=e.clientX/innerWidth-.5; ty=e.clientY/innerHeight-.5},{passive:true});
addEventListener('scroll',()=>{scrollY=window.scrollY||0},{passive:true});
build();

const P=[];

function draw(){
  t+= RM?.0011:O.spin;
  mx+=(tx-mx)*.04; my+=(ty-my)*.04;
  const par=Math.min(scrollY/900,1);

  x.fillStyle=C_BG; x.fillRect(0,0,W,H);

  for(let i=0;i<stars.length;i++){
    const s=stars[i]; s.ph+=s.sp;
    const tw=.5+Math.sin(s.ph)*.5;
    x.beginPath();
    x.arc(s.x-mx*46*DPR*s.d, s.y-my*46*DPR*s.d+par*70*DPR*s.d, s.r*(.55+tw*.45),0,6.283);
    x.fillStyle='rgba(230,226,255,'+(s.a*(.45+tw*.55))+')';
    x.fill();
  }

  const ry=t*.6+mx*.9, rx=Math.sin(t*.4)*.2+my*.6;
  const S=R*(1+Math.sin(t*.85)*.02)*(1-par*.14);
  const cy0=CY; CY=cy0-par*90*DPR;

  x.save();
  x.globalCompositeOperation='lighter';

  let g=x.createRadialGradient(CX,CY,S*.34,CX,CY,S*1.48);
  g.addColorStop(0,rgba(C_DEEP,.085));
  g.addColorStop(.52,rgba(C_DEEP,.075));
  g.addColorStop(.84,rgba(C_DEEP,.11));
  g.addColorStop(.96,rgba(C_DEEP,.05));
  g.addColorStop(1,rgba(C_DEEP,0));
  x.fillStyle=g; x.beginPath(); x.arc(CX,CY,S*1.48,0,6.283); x.fill();
  
  x.beginPath(); x.arc(CX,CY,S*1.34,0,6.283);
  x.strokeStyle=rgba(C_DEEP,.16); x.lineWidth=1.5*DPR; x.stroke();
  x.beginPath(); x.arc(CX,CY,S*1.30,0,6.283);
  x.strokeStyle='rgba(190,215,255,.07)'; x.lineWidth=3*DPR; x.stroke();

  g=x.createRadialGradient(CX,CY,0,CX,CY,S*1.02);
  g.addColorStop(0,'rgba(255,225,255,.40)');
  g.addColorStop(.2,rgba(C_CORE,.28));
  g.addColorStop(.52,rgba(C_HALO,.15));
  g.addColorStop(1,rgba(C_HALO,0));
  x.fillStyle=g; x.beginPath(); x.arc(CX,CY,S*1.02,0,6.283); x.fill();

  for(let i=0;i<dust.length;i++){
    const d=dust[i]; d.th+=d.sp;
    const v=sph(d.th,Math.cos(d.ph+t*.3)*.9,d.r);
    const q=project(v[0],v[1],v[2],ry,rx,S);
    if(q.p<=0) continue;
    x.beginPath(); x.arc(q.x,q.y,d.sz*DPR*q.p,0,6.283);
    x.fillStyle=rgba(C_CORE,d.a*q.p*.55); x.fill();
  }

  for(let f=0;f<fils.length;f++){
    const fl=fils[f]; fl.ph+=.0032*fl.sp;
    for(let pass=0;pass<2;pass++){
      x.beginPath();
      for(let i=0;i<fl.p.length;i++){
        const q=fl.p[i], wob=Math.sin(fl.ph*2.2+i*.36)*.07*q.k;
        const v=sph(q.a+wob,q.e+wob*.65,q.r);
        const pr=project(v[0],v[1],v[2],ry,rx,S);
        i?x.lineTo(pr.x,pr.y):x.moveTo(pr.x,pr.y);
      }
      x.strokeStyle = pass? rgba(C_CORE,.30*fl.br) : rgba(C_HALO,.09*fl.br);
      x.lineWidth   = pass? 1.1*DPR : 5*DPR;
      x.lineCap='round'; x.lineJoin='round';
      x.stroke();
    }
  }

  for(let i=0;i<pts.length;i++){
    const n=pts[i], w=1+Math.sin(t*1.7+n.ph)*.024;
    P[i]=project(n.x*w,n.y*w,n.z*w,ry,rx,S);
  }
  
  for(let pass=0;pass<2;pass++){
    for(let k=0;k<links.length;k++){
      const L=links[k], A=P[L.i], B=P[L.j];
      const dep=(A.z+B.z)*.5;
      const isBack=dep>0;
      if((pass===0)!==isBack) continue;
      const fade=L.w*(isBack?.34:.85);
      if(fade<.02) continue;
      x.beginPath(); x.moveTo(A.x,A.y); x.lineTo(B.x,B.y);
      x.strokeStyle = isBack ? rgba(C_DEEP,.19*fade) : rgba(C_CORE,.30*fade);
      x.lineWidth   = (isBack?.75:1.05)*DPR;
      x.stroke();
    }
  }

  for(let i=0;i<rings.length;i++){
    const r=rings[i]; r.rot+=r.sp;
    x.save(); x.translate(CX,CY); x.rotate(r.rot+ry*.35+r.tilt);
    x.beginPath();
    x.ellipse(0,0,S*r.rx,S*r.rx*r.ratio*(.55+Math.abs(Math.cos(rx))*.75),0,0,6.283);
    x.strokeStyle=rgba(C_CORE,r.a); x.lineWidth=1.15*DPR; x.stroke();
    x.restore();
  }

  g=x.createRadialGradient(CX,CY,0,CX,CY,S*.2);
  g.addColorStop(0,'rgba(255,255,255,.92)');
  g.addColorStop(.32,'rgba(255,214,255,.4)');
  g.addColorStop(1,rgba(C_CORE,0));
  x.fillStyle=g; x.beginPath(); x.arc(CX,CY,S*.2,0,6.283); x.fill();

  x.restore();
  CY=cy0;
  requestAnimationFrame(draw);
}
draw();
})();

const $=i=>document.getElementById(i);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

$('bName').textContent=CONFIG.brand; $('bTag').textContent=CONFIG.tag;
$('fN').textContent=CONFIG.fullName; $('yr').textContent=new Date().getFullYear();
$('pill').textContent=CONFIG.pill;
$('t1').textContent=CONFIG.title1; $('t2').textContent=CONFIG.title2;
$('sub').textContent=CONFIG.sub;
$('cta1').textContent=CONFIG.cta1; $('cta2').textContent=CONFIG.cta2;
$('capT').textContent=CONFIG.capTitle; $('capS').textContent=CONFIG.capSub;
$('blurb').textContent=CONFIG.blurb;

$('metrics').innerHTML=CONFIG.metrics.map(m=>
  '<div class="mb g"><div class="n" data-c="'+m.n+'" data-s="'+m.s+'">0</div><div class="l">'+esc(m.l)+'</div></div>'
).join('')+'<div class="mb g"><div class="n" id="kMsg">0</div><div class="l">In database</div></div>';

$('caps').innerHTML=CONFIG.caps.map(c=>
  '<div class="card g"><div class="ic">'+c.i+'</div><h3>'+esc(c.t)+'</h3><p>'+esc(c.d)+'</p>'+
  '<div class="tg">'+c.g.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div></div>').join('');

$('steps').innerHTML=CONFIG.steps.map(s=>
  '<div class="card g" style="padding:26px"><div class="kk" style="margin-bottom:10px">'+esc(s.i)+'</div>'+
  '<h3 style="font-size:17px;margin-bottom:8px">'+esc(s.t)+'</h3>'+
  '<p style="font-size:13.3px">'+esc(s.d)+'</p></div>').join('');

$('works').innerHTML=CONFIG.works.map(w=>
  '<div class="wc g"><div class="wcov" style="background:'+w.bg+'">'+
  (w.img?'<img src="'+esc(w.img)+'" alt="'+esc(w.t)+'" loading="lazy" onerror="this.remove()"/>':w.e)+'</div>'+
  '<div class="wb"><h3>'+esc(w.t)+'</h3><p>'+esc(w.d)+'</p>'+
  '<div class="tg">'+w.g.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div>'+
  '<div class="wl"><a href="'+esc(w.demo)+'" target="_blank">Live demo ↗</a>'+
  '<a href="'+esc(w.code)+'" target="_blank">Source ↗</a></div></div></div>').join('');

$('rows').innerHTML=
  '<div class="ir"><div class="i">✉️</div><div><b>Email</b><small>'+esc(CONFIG.email)+'</small></div></div>'+
  '<div class="ir"><div class="i">🌍</div><div><b>Location</b><small>'+esc(CONFIG.location)+'</small></div></div>'+
  '<div class="ir"><div class="i">⚡</div><div><b>Response</b><small>'+esc(CONFIG.reply)+'</small></div></div>'+
  '<div class="ir"><div class="i">🗄️</div><div><b>Storage</b><small id="stoT">Detecting…</small></div></div>';
$('socs').innerHTML=CONFIG.socials.map(s=>'<a href="'+esc(s.u)+'" target="_blank">'+esc(s.l)+' ↗</a>').join('');
$('i-t').innerHTML=CONFIG.types.map(t=>'<option>'+esc(t)+'</option>').join('');


const V={home:'v-home',work:'v-work',contact:'v-contact',inbox:'v-inbox'};
function go(v){
  Object.values(V).forEach(id=>$(id).classList.remove('on'));
  $(V[v]).classList.add('on');
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  $('tabs').classList.remove('open');
  if(v==='inbox') render();
  scrollTo({top:0,behavior:'smooth'}); location.hash=v;
}
document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>go(b.dataset.v));
$('bgBtn').onclick=()=>$('tabs').classList.toggle('open');

const API=CONFIG.api, LS='swift_msgs';
let live=false;
const lg=()=>{try{return JSON.parse(localStorage.getItem(LS))||[]}catch{return[]}};
const ls=a=>localStorage.setItem(LS,JSON.stringify(a));
function mark(on){
  live=on; $('st').className='dot-st '+(on?'on':'off');
  $('stT').textContent=on?'API live':'Offline';
  const s=$('stoT'); if(s)s.textContent=on?'Live server database':'Browser local storage';
  $('kS').textContent=on?'SERVER DB':'LOCAL';
}
async function list(){if(live){try{const r=await fetch(API);if(!r.ok)throw 0;return await r.json()}catch{mark(false)}}return lg()}
async function add(o){
  if(live){try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(o)});
    if(!r.ok)throw 0;return true}catch{mark(false)}}
  const a=lg();a.unshift({id:Date.now(),...o,date:new Date().toISOString()});ls(a);return false;
}
async function del(id){if(live){try{const r=await fetch(API+'/'+id,{method:'DELETE'});if(!r.ok)throw 0;return}catch{mark(false)}}ls(lg().filter(m=>m.id!==id))}
async function wipe(){if(live){try{const r=await fetch(API,{method:'DELETE'});if(!r.ok)throw 0;return}catch{mark(false)}}ls([])}
(async()=>{try{const r=await fetch(API);if(r.ok){await r.json();mark(true)}else mark(false)}catch{mark(false)}stats()})();
async function stats(){const l=await list();const e=$('kMsg');if(e)e.textContent=l.length}

let tT; const toast=m=>{const e=$('tst');e.textContent=m;e.classList.add('on');
  clearTimeout(tT);tT=setTimeout(()=>e.classList.remove('on'),2800)};

const FB={n:'f-n',e:'f-e',p:'f-p',m:'f-m'}, HB={n:'h-n',e:'h-e',p:'h-p',m:'h-m'};
const err=(k,t)=>{$(FB[k]).classList.add('bad');const h=$(HB[k]);h.classList.add('e');h.textContent=t};
const fine=k=>{$(FB[k]).classList.remove('bad');const h=$(HB[k]);h.classList.remove('e');h.textContent=''};
const RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function ok(){
  let v=true;
  if($('i-n').value.trim().length<2){err('n','Please enter your name.');v=false}else fine('n');
  if(!RE.test($('i-e').value.trim())){err('e',"That doesn't look like a valid email.");v=false}else fine('e');
  const p=$('i-p').value.trim();
  if(p&&!/^[0-9+()\-\s]{6,}$/.test(p)){err('p','Enter a valid phone number.');v=false}else fine('p');
  if($('i-m').value.trim().length<10){err('m','Give me at least a sentence to go on.');v=false}else fine('m');
  return v;
}

$('frm').onsubmit=async e=>{
  e.preventDefault();
  if(!ok()){toast('⚠️ Please fix the highlighted fields');return}
  const b=$('send'); b.disabled=true; b.textContent='Sending…';
  const srv=await add({name:$('i-n').value.trim(),email:$('i-e').value.trim(),
    phone:$('i-p').value.trim(),type:$('i-t').value,message:$('i-m').value.trim()});
  $('frm').reset(); $('cc').textContent='0'; ['n','e','p','m'].forEach(fine);
  b.disabled=false; b.textContent='Send message →';
  toast(srv?'✅ Saved to the live database':'✅ Saved locally (run the server for live DB)');
  stats(); go('inbox');
};

const ML=$('mlist'), Q=$('q');
async function render(){
  const all=await list(), q=Q.value.trim().toLowerCase();
  const f=all.filter(m=>(m.name+' '+m.email+' '+(m.message||'')).toLowerCase().includes(q));
  $('kT').textContent=all.length;
  if(!f.length){ML.innerHTML='<div class="mt g"><div class="bg">🛰️</div>No messages found.</div>';return}
  ML.innerHTML=f.map((m,i)=>
    '<div class="mi g"><div><h4>'+esc(m.name)+'</h4><a class="em" href="mailto:'+esc(m.email)+'">'+esc(m.email)+'</a><p class="bod">'+esc(m.message)+'</p></div>'+
    '<div class="sd"><button class="xb" data-id="'+m.id+'">Delete</button></div></div>').join('');
  ML.querySelectorAll('.xb').forEach(b=>b.onclick=async()=>{
    await del(Number(b.dataset.id)); stats(); render(); toast('🗑️ Deleted')});
}

const hsh=location.hash.replace('#','');
if(V[hsh]) go(hsh);
