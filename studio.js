'use strict';
// one studio, two pages: assets.html (post + profile, with the phone) and merch.html (merch only)
const PAGE=document.body.dataset.page||'social',SECS=PAGE==='merch'?['merch']:['post','avatar'];
// ───────── brand rules (from the guide) ─────────
const RING={size:.6,phase:.23,shift:.061,angle:15,blur:0,soft:1.35,persp:0,sy:1.08,disp:.88,rgb:.35,tint:.43};
const PINK=[1,0,.816],WHITE=[1,1,1],DARK=[20/255,20/255,20/255];
const SURF={ // background decides everything else
  pink:{sw:'#ff00d0',bg:PINK,grad:'yellow',stick:'white'},
  white:{sw:'#ffffff',bg:WHITE,grad:'pink',stick:'pinkyellow'},
  photo:{sw:null,bg:WHITE,grad:'pink',stick:'white'},
};
const DIRS=[['↖',-135],['↑',-90],['↗',-50],['←',180],['→',0],['↙',135],['↓',90],['↘',45]];
const LOGOS=[
  {id:'b1',label:'( ( б ) )',level:1,main:true},{id:'b0',label:'( б )',level:0},{id:'b2',label:'(  ( ( б ) )  )',level:2},{id:'b3',label:'(   (  ( ( б ) )  )   )',level:3},
  {id:'w1',label:'( ( барабанная ) )',level:1,word:'барабанная'},
  {id:'m1',label:'барабанная',lines:['барабанная']},{id:'m2',label:'барабанная / мастерская',lines:['барабанная','мастерская']},
  {id:'m4',label:'барабанная мастерская петра атапина',lines:['барабанная','мастерская','петра','атапина']},
];
const FONTS=[['Ubuntu','Ubuntu',400],['моно','"JetBrains Mono"',400],['антиква','"PT Serif"',400],['гротеск','Unbounded',500],['округлый','Comfortaa',500]];
const LCOL={white:'#ffffff',pink:'#ff00d0',dark:'#141414',two:'two'};   // two = pink + yellow double brackets
const FMTS={photo:'как фото','4:5':'4:5','1:1':'1:1','9:16':'сторис'};
const FMTWH={'4:5':[1080,1350],'1:1':[1080,1080],'9:16':[1080,1920]};
const POS=[['bl','↙'],['tl','↖'],['tr','↗'],['br','↘'],['c','•']];
const POSNAME={bl:'слева внизу',tl:'слева вверху',tr:'справа вверху',br:'справа внизу',c:'по центру'};   // from bottom-left, clockwise

const DEF={tab:'post',postFmt:'4:5',
  post:{surf:'white',text:'приходи на мастер-класс\nсделаем бубен своими руками',tsize:.5,tpos:'top',rings:true,stick:true,logo:true,cx:.64,cy:.62,zone:null,rsize:.45,dir:-50,lkind:'b1',lcolor:'auto',lpos:'bl',lsize:.4},
  avatar:{surf:'pink',cx:.46,cy:.52,phase:.23,stick:true,dir:-50,scale:.55},
  logo:{fmt:'4:5'},
  card:{kind:'b1',color:'white',pos:'bl',size:.5}};      // defaults for every new photo
// defaults set by the user (project file of 2026-11-26): what a fresh browser shows
const DEFAULTS={"post":{"surf":"pink","text":"в субботу\nделаем бубен\nсвоими руками","tsize":0.6,"tpos":"bottom","textOn":true,"rings":true,"logo":true,"lkind":"b1","lcolor":"auto","lpos":"tl","lsize":0.35,"pz":0,"wave":"stay","hits":[{"cx":0.7295766524869111,"cy":0.283332678197065,"step":0.60859375,"count":0.3062270220588236,"warp":0.07856770833333335,"stick":true,"dir":58,"sgrad":"whiteyellow"}],"rsize":0.45,"dir":-50},"avatarSet":{"surf":"pink","text":"приходи на мастер-класс\nсделаем бубен своими руками","tsize":0.5,"tpos":"top","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"c","lsize":0.6,"pz":0,"textOn":false,"wave":"stay","hits":[{"cx":0.5022230113636365,"cy":0.4783984375,"step":0.7308072916666667,"stick":true,"dir":-50}]},"hlSet":{"surf":"pink","text":"мастер-\nклассы","tsize":0.7246874999999999,"tpos":"mid","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"bl","lsize":0.4,"textOn":true,"pz":0,"wave":"stay","hits":[{"cx":0,"cy":0.34000355113636366,"step":1,"count":0.29411764705882354,"warp":0,"stick":false,"dir":-50}]},"posts":[{"set":{"surf":"pink","text":"в субботу\nделаем бубен\nсвоими руками","tsize":0.6,"tpos":"bottom","textOn":true,"rings":true,"logo":true,"lkind":"b1","lcolor":"auto","lpos":"tl","lsize":0.35,"pz":0,"wave":"stay","hits":[{"cx":0.7295766524869111,"cy":0.283332678197065,"step":0.60859375,"count":0.3062270220588236,"warp":0.07856770833333335,"stick":true,"dir":58,"sgrad":"whiteyellow"}],"rsize":0.45,"dir":-50},"pan":[0,0]}],"profile":[{"set":{"surf":"pink","text":"приходи на мастер-класс\nсделаем бубен своими руками","tsize":0.5,"tpos":"top","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"c","lsize":0.6,"textOn":false,"pz":0,"wave":"stay","hits":[{"cx":0.5022230113636365,"cy":0.4783984375,"step":0.7308072916666667,"stick":true,"dir":-50}]},"av":true,"pan":[0,0]},{"set":{"surf":"pink","text":"отзывы","tsize":0.7246874999999999,"tpos":"mid","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"bl","lsize":0.4,"textOn":true,"pz":0,"wave":"stay","hits":[{"cx":0.29633345170454545,"cy":0,"step":1,"count":0.29411764705882354,"warp":0,"stick":false,"dir":-50}]},"title":"отзывы","pan":[0,0]},{"set":{"surf":"white","text":"эко-бубны","tsize":0.8629427083333332,"tpos":"mid","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"bl","lsize":0.4,"textOn":true,"pz":0,"wave":"stay","hits":[{"cx":0.7538529829545455,"cy":1,"step":1,"count":0.29411764705882354,"warp":0,"stick":false,"dir":-50}]},"title":"эко-бубны","pan":[0,0]},{"set":{"surf":"dark","text":"практики","tsize":0.7246874999999999,"tpos":"mid","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"bl","lsize":0.4,"textOn":true,"pz":0,"wave":"stay","hits":[{"cx":0.6941761363636363,"cy":0,"step":1,"count":0.29411764705882354,"warp":0,"stick":false,"dir":-50}]},"title":"практики","pan":[0,0]},{"set":{"surf":"pink","text":"мастер-\nклассы","tsize":0.7246874999999999,"tpos":"mid","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"bl","lsize":0.4,"textOn":true,"pz":0,"wave":"stay","hits":[{"cx":0,"cy":0.34000355113636366,"step":1,"count":0.29411764705882354,"warp":0,"stick":false,"dir":-50}]},"title":"мастер-классы","pan":[0,0]},{"set":{"surf":"white","text":"барабаны","tsize":0.7246874999999999,"tpos":"mid","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"bl","lsize":0.4,"textOn":true,"pz":0,"wave":"stay","hits":[{"cx":0.9690962357954546,"cy":0.6323508522727272,"step":1,"count":0.29411764705882354,"warp":0,"stick":false,"dir":-50}]},"title":"барабаны","pan":[0,0]}],"merchs":[{"set":{"surf":"white","text":"","tsize":0.5,"tpos":"top","rings":false,"stick":true,"logo":true,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b2","lcolor":"two","lpos":"free","lsize":0.55,"textOn":false,"pz":0,"wave":"stay","hits":[{"cx":0.5,"cy":0.45,"step":0.5,"count":0.29411764705882354,"warp":0.2,"stick":true,"dir":-50}],"show":"dark","lx":0.49776046140630753,"ly":0.3245786447840401},"pan":[0,0],"merch":"front"},{"set":{"surf":"white","text":"","tsize":0.5,"tpos":"top","rings":true,"stick":true,"logo":true,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"m4","lcolor":"pink","lpos":"free","lsize":0.35,"textOn":false,"pz":0,"wave":"stay","hits":[{"cx":0.5,"cy":0.48,"step":0.3,"count":0.3,"warp":0.2,"stick":true,"dir":115,"sgrad":"whiteyellow"}],"show":"pink","rgrad":"yellow","lx":0.28007211903674034,"ly":0.20060690507884038},"pan":[0,0],"merch":"back"},{"set":{"surf":"white","text":"барабанная\nмастерская\nпетра\nатапина","tsize":1,"tpos":"top","rings":true,"stick":true,"logo":false,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"b1","lcolor":"auto","lpos":"c","lsize":0.5,"textOn":true,"pz":0,"wave":"stay","hits":[{"cx":0.68,"cy":0.2,"step":0.3,"count":0.35,"warp":0.7,"color":false,"stick":true,"dir":40,"sgrad":"pink"},{"cx":0.45,"cy":0.32,"step":0.3,"count":0.35,"warp":0.7,"color":false,"stick":true,"dir":40,"sgrad":"pink"}],"show":"yellow"},"pan":[0,0],"merch":"back"},{"set":{"surf":"white","text":"","tsize":0.5,"tpos":"top","rings":true,"stick":true,"logo":true,"cx":0.64,"cy":0.62,"zone":null,"rsize":0.45,"dir":-50,"lkind":"m4","lcolor":"pink","lpos":"bl","lsize":0.5,"textOn":false,"pz":0,"wave":"stay","hits":[{"cx":0.6519404450261781,"cy":0.35753005464480875,"step":0.55,"count":0.4,"warp":0.2,"stick":true,"dir":60,"sgrad":"whiteyellow"}],"show":"dark"},"pan":[0,0],"merch":"tote"}]};
const fresh=k=>JSON.parse(JSON.stringify(DEFAULTS[k]));
DEF.post=fresh('post');
let S=JSON.parse(JSON.stringify(DEF));
try{const v=JSON.parse(localStorage.getItem('bb.assets.v6')||'null');if(v&&v.avatar){S.tab=v.tab==='logo'?'post':v.tab;if(v.post)Object.assign(S.post,v.post);if(v.postFmt)S.postFmt=v.postFmt;if(v.avatarSet)S.avatarSet=v.avatarSet;if(v.hlSet)S.hlSet=v.hlSet;if(Array.isArray(v.profile)&&v.profile.length)S.profile=v.profile;if(Array.isArray(v.posts)&&v.posts.length)S.posts=v.posts;if(Array.isArray(v.merchs)&&v.merchs.length)S.merchs=v.merchs;Object.assign(S.avatar,v.avatar);Object.assign(S.logo,v.logo||{});Object.assign(S.card,v.card||{})}}catch(e){}
S.move=true;   // a post is always animated; the PNG is the still picture (the end state of a staying wave)
// posts and the profile (avatar + every cover) are kept card by card, so each one comes back with its own settings
let ready=false;
const keepLists=()=>{if(!ready)return;for(const[k,to]of[['post','posts'],['avatar','profile'],['merch','merchs']]){const L=S.tab===k?posts:TABS[k];if(L)S[to]=L.map(p=>({set:p.set,title:p.title,av:p.av,pan:p.pan,pid:p.pid,link:p.link,merch:p.merch}))}};
// photos live in IndexedDB under the card's photo id
const photoDB=()=>new Promise((ok,no)=>{const r=indexedDB.open('bb.photos',1);r.onupgradeneeded=()=>r.result.createObjectStore('p');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
async function keepPhoto(p,file){p.pid='p'+Date.now()+Math.random().toString(36).slice(2,7);try{const db=await photoDB();db.transaction('p','readwrite').objectStore('p').put(file,p.pid)}catch(e){console.warn(e)}}
async function loadPhoto(p){try{const db=await photoDB(),f=await new Promise(ok=>{const r=db.transaction('p').objectStore('p').get(p.pid);r.onsuccess=()=>ok(r.result);r.onerror=()=>ok(null)});if(!f)return;
  const url=URL.createObjectURL(f),im=new Image();im.onload=()=>{p.img=im;p.url=url;layout()};im.src=url}catch(e){console.warn(e)}}
const restoreList=A=>A.map(o=>{const p={img:null,url:'',pan:o.pan||[0,0],set:o.set,pid:o.pid};if(o.av)p.av=true;if(o.title!=null)p.title=o.title;if(o.link)p.link=true;if(o.merch){p.merch=o.merch;if(p.set.tpos==='corners'){p.set.textOn=false;p.set.tpos='top'}}if(p.pid)loadPhoto(p);return p});
function restoreProfile(){const L=restoreList(S.profile);if(!L.some(isAv))L.unshift(makeAvatarPost());return L}
// on load: forget photos that no card uses any more
async function prunePhotos(){try{const used=new Set([...(S.posts||[]),...(S.profile||[])].map(o=>o.pid)),db=await photoDB(),st=db.transaction('p','readwrite').objectStore('p'),r=st.getAllKeys();r.onsuccess=()=>r.result.forEach(k=>{if(!used.has(k))st.delete(k)})}catch(e){}}
// each page writes only its own lists: the other page may be open in another tab
// the whole project as one file: posts, profile, merch and their photos; open it in any browser to continue
const blobURL=b=>new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result);r.readAsDataURL(b)});
async function exportProject(){save();const state=JSON.parse(localStorage.getItem('bb.assets.v6')||'{}'),photos={};
  try{const db=await photoDB(),st=db.transaction('p').objectStore('p'),keys=await new Promise(ok=>{const r=st.getAllKeys();r.onsuccess=()=>ok(r.result);r.onerror=()=>ok([])});
    for(const k of keys){const f=await new Promise(ok=>{const r=db.transaction('p').objectStore('p').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>ok(null)});if(f)photos[k]=await blobURL(f)}}catch(e){console.warn(e)}
  const d=new Date(),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({app:'barabannaja',v:1,state,photos})],{type:'application/json'}));
  a.download=`barabannaja-проект-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);toast('проект сохранён в файл')}
async function importProject(file){let o;try{o=JSON.parse(await file.text())}catch(e){toast('это не файл проекта');return}
  if(!o||o.app!=='barabannaja'||!o.state){toast('это не файл проекта барабанной');return}
  if(!confirm('Заменить всё, что сейчас в генераторе, содержимым файла?'))return;
  ready=false;try{const db=await photoDB();for(const[k,u]of Object.entries(o.photos||{})){const b=await (await fetch(u)).blob();await new Promise(ok=>{const t=db.transaction('p','readwrite');t.objectStore('p').put(b,k);t.oncomplete=ok;t.onerror=ok})}}catch(e){console.warn(e)}
  localStorage.setItem('bb.assets.v6',JSON.stringify(o.state));location.reload()}
{const bar=document.querySelector('.topbar .tbl'),pf=document.createElement('input');pf.type='file';pf.accept='.json,application/json';pf.hidden=true;pf.onchange=()=>{if(pf.files[0])importProject(pf.files[0]);pf.value=''};
  const mk=(t,ti,f)=>{const b=document.createElement('button');b.className='tbl tbbtn';b.textContent=t;b.title=ti;b.onclick=f;return b};
  if(bar)bar.after(mk('сохранить проект','скачать файл со всеми постами, профилем, мерчем и фото',exportProject),mk('открыть проект','загрузить сохранённый файл проекта',()=>pf.click()),pf)}
const save=()=>{try{keepLists();let v=null;try{v=JSON.parse(localStorage.getItem('bb.assets.v6')||'null')}catch(e){}
  const out=PAGE==='merch'?Object.assign(v&&v.avatar?v:JSON.parse(JSON.stringify(S)),{merchs:S.merchs}):Object.assign({},S,{merchs:v?v.merchs:S.merchs});
  localStorage.setItem('bb.assets.v6',JSON.stringify(out))}catch(e){}};

// ───────── engines ─────────
const glc=document.createElement('canvas'),E=Wave.make(glc),stk=document.createElement('canvas'),tmp=document.createElement('canvas');
const photos=[];   // [{img,url,set}]  set = this photo's own logo settings
let avatarPhoto=null;if(S.avatar.surf==='photo')S.avatar.surf='pink';
function addPhotos(srcs){let left=srcs.length;const start=photos.length;
  srcs.forEach((src,i)=>{const im=new Image();im.onload=()=>{const set=JSON.parse(JSON.stringify(S.card));if(!['tl','tr','c','bl','br'].includes(set.pos))set.pos='bl';photos[start+i]={img:im,url:src,set,pan:[0,0]};
    if(!avatarPhoto)avatarPhoto=im;if(--left===0){build();layout()}};im.src=src})}

// ───────── AVATAR ─────────
function renderAvatar(W){
  const A=S.avatar,su=SURF[A.surf],c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d');
  // logo variant: ( ( б ) ) in the middle of the circle, on the plain background or the photo
  if(A.kind==='logo'){const ph=A.surf==='photo'&&avatarPhoto;
    if(ph){const im=avatarPhoto,sc=Math.max(W/im.width,W/im.height);x.drawImage(im,(W-im.width*sc)/2,(W-im.height*sc)/2,im.width*sc,im.height*sc)}
    else{x.fillStyle=A.surf==='white'?'#ffffff':'#ff00d0';x.fillRect(0,0,W,W)}
    const col=A.surf==='white'?'#ff00d0':'#ffffff';let size=W*.3;while(size>8&&Wave.logoWidth(x,size,1,false,'Ubuntu',400,'б')>W*(.42+A.scale*.3))size*=.97;
    Wave.logo(x,W/2,W/2,size,col,null,1,'Ubuntu',400,'б');return c}
  glc.width=glc.height=W;const ph=A.surf==='photo'&&avatarPhoto;E.setImage(ph?avatarPhoto:null);
  const k=.7+A.scale*1.5;  // 0..1 slider -> 0.7..2.2x
  E.draw(Object.assign({},RING,{size:RING.size*k,cx:A.cx,cy:A.cy,phase:A.phase,bg:su.bg,grad:su.grad,mode:ph?1:0}));
  x.drawImage(glc,0,0);
  if(A.stick){stk.width=stk.height=W;Wave.stick(stk.getContext('2d'),W,W,{on:true,cx:A.cx+.03*k,cy:A.cy-.02*k,angle:A.dir,grad:su.stick,blur:.045,scale:k});x.drawImage(stk,0,0)}
  return c;
}
// ───────── LOGO ON PHOTO ─────────
function photoDims(p){const L=S.logo;
  if(L.fmt==='photo'){let s=Math.min(1,2400/Math.max(p.img.width,p.img.height));if(Math.min(p.img.width,p.img.height)*s<1080)s=1080/Math.min(p.img.width,p.img.height);
    return[Math.round(p.img.width*s/2)*2,Math.round(p.img.height*s/2)*2]}
  return FMTWH[L.fmt]||FMTWH['4:5'];}
function fitOf(p,W,H,z=1){const ca=W/H,ia=p.img.width/p.img.height;let sx=1,sy=1;if(ia>ca)sx=ca/ia;else sy=ia/ca;return[sx/z,sy/z]}   // z: photo zoom, 1 = cover
function renderLogo(p,W,H){
  const st=p.set,k=LOGOS.find(l=>l.id===st.kind)||LOGOS[0],f=FONTS[0];
  const two=st.color==='two'&&!k.lines,col=two?'#ff00d0':(LCOL[st.color]==='two'?'#ff00d0':LCOL[st.color]);
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),md=Math.min(W,H);
  const size=md*(k.lines?.035+st.size*.07:.04+st.size*.1),m=md*.06;let box;
  if(k.lines){x.font=`${f[2]} ${size}px ${f[1]}`;let w=0;for(const l of k.lines)w=Math.max(w,x.measureText(l).width);box={w,h:k.lines.length*size*1.02}}
  else box={w:Wave.logoWidth(x,size,k.level,two,f[1],f[2],k.word||'б'),h:size};
  let cx,cy;{
    const lft=m+box.w/2,rgt=W-m-box.w/2,top=m+box.h/2,bot=H-m-box.h/2;[cx,cy]={tl:[lft,top],tr:[rgt,top],bl:[lft,bot],br:[rgt,bot],c:[W/2,H/2]}[st.pos]||[rgt,bot]}
  const pan=p.pan||[0,0];
  {const[sx,sy]=fitOf(p,W,H);x.drawImage(p.img,p.img.width*(1-sx)*(.5+pan[0]),p.img.height*(1-sy)*(.5+pan[1]),p.img.width*sx,p.img.height*sy,0,0,W,H)}
  if(k.lines){x.font=`${f[2]} ${size}px ${f[1]}`;x.fillStyle=col;x.textBaseline='alphabetic';const lh=size*1.02;k.lines.forEach((l,i)=>x.fillText(l,cx-box.w/2,cy-box.h/2+size*.78+i*lh))}
  else Wave.logo(x,cx,cy,size,col,two?'#ffe100':null,k.level,f[1],f[2],k.word||'б');
  return c;
}

// ───────── helpers ─────────
let toastT=0;
function toast(msg,undo){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.innerHTML='';t.append(msg);if(undo){const b=document.createElement('button');b.textContent='отменить';b.onclick=()=>{undo();t.classList.remove('on')};t.appendChild(b)}
  t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),7000)}
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const dpr=()=>Math.min(devicePixelRatio||1,2);
// colour swatch button: shows the colour, never names it
function swatch(val,cur,css,on,title){const b=el('button','sw'+(val===cur?' on':''));b.style.background=css;b.title=title||'';b.setAttribute('aria-label',title||'');b.setAttribute('aria-pressed',val===cur);b.onclick=on;return b}
function swatchRow(p,opts,cur,on){const w=el('div','sws');for(const[v,css,t]of opts)w.appendChild(swatch(v,cur,css,()=>on(v),t));p.appendChild(w)}
// H.264 first (instagram takes it everywhere); VP9 inside MP4 only if the browser has no H.264 encoder
async function pickCodec(w,h){for(const[c,m]of[['avc1.640033','avc'],['avc1.640028','avc'],['avc1.4d0033','avc'],['avc1.42003e','avc'],['avc1.42001f','avc'],['vp09.00.40.08','vp9']]){try{const r=await VideoEncoder.isConfigSupported({codec:c,width:w,height:h,bitrate:8e6,framerate:30});if(r.supported)return[c,m]}catch(e){}}return null}
// one post as a clip: its own length (durOf), 30 fps, H.264 in MP4
async function saveMP4(p,i,W,H,prog){
  if(!('VideoEncoder' in window)){toast('этот браузер не пишет видео — открой в свежем Chrome');return}
  try{const{Muxer,ArrayBufferTarget}=await import('./lib/mp4-muxer.mjs');
    const fps=30,N=Math.round(durOf(p)*fps),pc=await pickCodec(W,H);if(!pc)throw Error('нет видеокодека');const[codec,mc]=pc;
    const muxer=new Muxer({target:new ArrayBufferTarget(),video:{codec:mc,width:W,height:H},fastStart:'in-memory'});let err=null;
    const enc=new VideoEncoder({output:(c,m)=>muxer.addVideoChunk(c,m),error:e=>err=e});enc.configure({codec,width:W,height:H,bitrate:Math.round(W*H*6),framerate:fps});
    for(let f=0;f<N;f++){if(err)throw err;const T=f/fps,fr=renderPost(p,W,H,{t:T});
      const vf=new VideoFrame(fr,{timestamp:Math.round(T*1e6),duration:Math.round(1e6/fps)});enc.encode(vf,{keyFrame:f%fps===0});vf.close();
      while(enc.encodeQueueSize>4)await new Promise(r=>setTimeout(r,1));if(f%3===0){prog&&prog(f/N);await new Promise(r=>setTimeout(r,0))}}
    await enc.flush();if(err)throw err;muxer.finalize();
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([muxer.target.buffer],{type:'video/mp4'}));a.download=`barabannaja-post-${i+1}-${W}x${H}.mp4`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
  catch(e){console.error(e);toast('не получилось записать видео: '+e.message)}}
async function savePNG(img,name){let b;try{b=await new Promise(r=>img.toBlob(r,'image/png'))}catch(e){console.error(e);toast('не получилось сохранить картинку: '+e.message);return}const a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000)}

// ───────── avatar stage ─────────
const ROWS={};let row;
const cv=document.getElementById('cv'),stage=document.getElementById('stage'),side=document.getElementById('side'),rowPost=document.getElementById('rowPost'),rowProfile=document.getElementById('rowProfile'),rowMerch=document.getElementById('rowMerch'),mainEl=document.querySelector('main');
function layoutAvatar(){
  let h=mainEl.clientHeight-80,w=h;const maxW=mainEl.clientWidth-80-160;if(w>maxW){w=maxW;h=w}
  cv.style.width=w+'px';cv.style.height=h+'px';cv.width=cv.height=Math.round(w*dpr());stage.classList.add('round');drawAvatar()}
function placeDir(){const b=document.getElementById('adir'),A=S.avatar,a=(A.dir??-50)*Math.PI/180,r=cv.clientWidth/2,R=r+22;
  b.style.display=A.stick&&A.kind!=='logo'?'block':'none';b.style.left=(r+Math.cos(a)*R)+'px';b.style.top=(r+Math.sin(a)*R)+'px'}
function drawAvatar(){const img=renderAvatar(cv.width),x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);x.drawImage(img,0,0);placeDir();
  side.innerHTML='';for(const[s,l]of[[110,'в профиле'],[40,'в комментариях']]){const f=el('figure'),c=el('canvas'),d=dpr();
    c.width=c.height=s*d;c.style.width=c.style.height=s+'px';c.getContext('2d').drawImage(img,0,0,s*d,s*d);f.append(c,l);side.appendChild(f)}}
let drag=false;
{const b=document.getElementById('adir');let on=false;
  const ang=e=>{const r=cv.getBoundingClientRect();return Math.round(Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI)};
  b.onpointerdown=e=>{on=true;b.setPointerCapture(e.pointerId);e.stopPropagation()};
  b.onpointermove=e=>{if(!on)return;S.avatar.dir=ang(e);drawAvatar()};
  b.onpointerup=()=>{if(on){on=false;save()}};
  b.onkeydown=e=>{const d={ArrowRight:10,ArrowDown:10,ArrowLeft:-10,ArrowUp:-10}[e.key];if(d){e.preventDefault();S.avatar.dir=((S.avatar.dir??-50)+d+540)%360-180;drawAvatar();save()}}}
cv.onpointerdown=e=>{drag=true;cv.setPointerCapture(e.pointerId);cv.onpointermove(e)};
cv.onpointermove=e=>{if(!drag||S.avatar.kind==='logo')return;const r=cv.getBoundingClientRect();S.avatar.cx=(e.clientX-r.left)/r.width;S.avatar.cy=(e.clientY-r.top)/r.height;drawAvatar()};
cv.onpointerup=()=>{drag=false;save()};

// ───────── logo cards row ─────────
let cardH=400;
function layoutRow(){
  cardH=Math.max(220,row.clientHeight-250);
  row.innerHTML='';
  photos.forEach((p,i)=>{if(p)row.appendChild(card(p,i))});
  const[aw,ah]=photos[0]?photoDims(photos[photos.length-1]):[1080,1350];
  const add=el('div','card');const tile=el('button','plus',photos.length?'+':'+<span>добавь фото</span>');tile.style.height=cardH+'px';tile.style.width=Math.round(cardH*aw/ah)+'px';
  tile.onclick=()=>document.getElementById('file').click();add.appendChild(tile);row.appendChild(add);
}
function card(p,i){
  const[W,H]=photoDims(p),w=Math.round(cardH*W/H),c=el('div','card'),cvv=el('canvas');
  cvv.style.width=w+'px';cvv.style.height=cardH+'px';cvv.width=Math.round(w*dpr());cvv.height=Math.round(cardH*dpr());
  const paint=()=>{const img=renderLogo(p,cvv.width,cvv.height);cvv.getContext('2d').drawImage(img,0,0)};paint();
  // drag = move the photo inside the frame (the logo stays where the arrows put it)
  let dr=null;const cl=v=>v<-.5?-.5:v>.5?.5:v;
  cvv.onpointerdown=e=>{dr=[e.clientX,e.clientY];cvv.setPointerCapture(e.pointerId);cvv.style.cursor='grabbing'};
  cvv.onpointermove=e=>{if(!dr)return;const r=cvv.getBoundingClientRect(),[sx,sy]=fitOf(p,W,H),pan=p.pan||(p.pan=[0,0]);
    const dx=(e.clientX-dr[0])/r.width,dy=(e.clientY-dr[1])/r.height;dr=[e.clientX,e.clientY];
    if(1-sx>1e-4)pan[0]=cl(((1-sx)*(.5+pan[0])-dx*sx)/(1-sx)-.5);if(1-sy>1e-4)pan[1]=cl(((1-sy)*(.5+pan[1])-dy*sy)/(1-sy)-.5);paint()};
  cvv.onpointerup=()=>{dr=null;cvv.style.cursor='grab'};cvv.style.cursor='grab';
  const ctl=el('div','ctl');ctl.style.width=Math.max(w,200)+'px';
  const k=LOGOS.find(l=>l.id===p.set.kind)||LOGOS[0];
  const col=[['white','#ffffff','белый'],['pink','#ff00d0','розовый'],['dark','#141414','тёмный']];
  if(!k.lines)col.push(['two','linear-gradient(90deg,#ff00d0 50%,#ffe100 50%)','два цвета']);
  swatchRow(ctl,col,p.set.color,v=>{p.set.color=v;remember(p);refresh()});
  const sel=el('select');for(const l of LOGOS){const o=el('option');o.value=l.id;o.textContent=l.label;if(l.id===p.set.kind)o.selected=true;sel.appendChild(o)}
  sel.onchange=()=>{p.set.kind=sel.value;if(LOGOS.find(l=>l.id===sel.value).lines&&p.set.color==='two')p.set.color='pink';remember(p);refresh()};ctl.appendChild(sel);
  const pr=el('div','posrow'),pc=el('div','chips dir');
  for(const[v,l]of POS){const b=el('button',v===p.set.pos?'on':'',l);b.title=POSNAME[v];b.onclick=()=>{p.set.pos=v;remember(p);refresh()};pc.appendChild(b)}
  const rg=el('input');rg.type='range';rg.min=0;rg.max=1;rg.step=.01;rg.value=p.set.size;rg.title='размер';rg.oninput=()=>{p.set.size=+rg.value;paint()};rg.onchange=()=>remember(p);
  pr.append(pc,rg);ctl.appendChild(pr);
  const ac=el('div','acts');const dl=el('button','','скачать');dl.onclick=()=>{const[W2,H2]=photoDims(p);savePNG(renderLogo(p,W2,H2),`barabannaja-logo-${i+1}-${W2}x${H2}.png`)};
    const all=el('button','','раскатить на все');all.title='цвет, лого, место и размер этого фото — на все остальные';
  all.onclick=()=>{const before=photos.map(q=>q&&JSON.parse(JSON.stringify(q.set)));for(const q of photos)if(q&&q!==p)q.set=JSON.parse(JSON.stringify(p.set));remember(p);refresh();toast('настройки раскатаны на все фото',()=>{photos.forEach((q,k)=>{if(q&&before[k])q.set=before[k]});refresh()})};
  ac.append(dl);if(photos.length>1)ac.append(all);ctl.appendChild(ac);
  // remove = small × on the photo's corner, away from the settings
  const wrap=el('div','pic');wrap.appendChild(cvv);
  {const x=el('button','del','×');x.title='убрать фото';x.onclick=()=>{const gone=photos.splice(i,1)[0];if(!photos.length)avatarPhoto=null;refresh();toast('фото убрано',()=>{photos.splice(i,0,gone);refresh()})};wrap.appendChild(x)}
  c.append(wrap,ctl);return c;
}
function remember(p){S.card=JSON.parse(JSON.stringify(p.set));if(!['tl','tr','c','bl','br'].includes(S.card.pos))S.card.pos='bl';save()}   // new photos start from the last used settings
// the avatar tab uses the post editor: the avatar is one square post (rings + logo, no text), previewed as a circle
// the profile tab: the avatar (first) and the highlight covers after it — all square files that instagram shows as circles
const isEd=()=>S.tab==='post'||S.tab==='avatar'||S.tab==='merch';
const isSq=()=>S.tab==='avatar';
const TABS={post:null,avatar:null,merch:null};   // lists of the tabs that are not open
const isAv=p=>!!(p&&p.av),isHlP=p=>!!p&&p.title!=null;
function makeAvatarPost(){const p=newPost();
  // on the avatar the logo always sits in the centre
  Object.assign(p.set,{textOn:false,rings:true,logo:false,lpos:'c',lsize:.6,surf:'pink',pz:0,wave:'stay',
    hits:[{cx:.5,cy:.5,step:.5,count:.35,warp:.2,stick:true,dir:-50,sgrad:'whiteyellow'}]});Object.assign(p.set,JSON.parse(JSON.stringify(S.avatarSet||DEFAULTS.avatarSet)));if(p.set.surf==='photo')p.set.surf='pink';p.set.lpos='c';p.av=true;return p}
// highlight covers: a short word in the middle, small rings, background alternating
const HL_TITLES=['отзывы','эко-бубны','практики','мастер-классы','барабаны'];
function makeHl(title,k=0){const p=newPost();
  Object.assign(p.set,{textOn:true,text:title,tpos:'mid',tsize:.45,rings:true,logo:false,surf:k%2?'white':'pink',pz:0,wave:'stay',
    hits:[{cx:.5,cy:.5,step:.3,count:5/17,warp:0,stick:false,dir:-50}]});
  {const d=JSON.parse(JSON.stringify(S.hlSet||DEFAULTS.hlSet));delete d.text;delete d.surf;Object.assign(p.set,d)}p.title=title;return p}
// the default covers: big soft rings coming in from different sides, three backgrounds
const HL_LOOK=[{surf:'pink',cx:.12,cy:.88},{surf:'white',cx:.92,cy:.12},{surf:'dark',cx:.9,cy:.72},{surf:'pink',cx:.08,cy:.08},{surf:'white',cx:.4,cy:1.02}];
const makeHls=()=>HL_TITLES.map((t,k)=>{const p=makeHl(t,k),L=HL_LOOK[k];if(!S.hlSet){p.set.surf=L.surf;p.set.tsize=.62;if(t==='мастер-классы')p.set.text='мастер-\nклассы';p.set.hits=[{cx:L.cx,cy:L.cy,step:.65,count:.35,warp:0,stick:false,dir:-50}]}return p});
// ───────── merch: the print is edited like a post, shown on the garment ─────────
// r = print area on the mockup (1200×1500 px), the print itself is 4:5
const MERCH={front:{src:'merch/hoodie-front.webp',label:'худи спереди',r:[400,400,400,500]},back:{src:'merch/hoodie-back.webp',label:'худи сзади',r:[380,480,440,550]},tote:{src:'merch/tote.webp',label:'шоппер',r:[380,650,450,562]}};
if(PAGE==='merch')for(const k in MERCH){const im=new Image();im.onload=()=>{if(ready)layout()};im.src=(window.MERCH_IMG||{})[k]||MERCH[k].src;MERCH[k].img=im}
const SHOW={dark:'#141414',pink:'#ff00d0',yellow:'#ffe100'};
const isMe=p=>!!(p&&p.merch);
const mRect=p=>{const r=MERCH[p.merch]?.r||[0,0,1200,1500];return{x:r[0]/1200,y:r[1]/1500,w:r[2]/1200,h:r[3]/1500}};
function makeMerch(kind,set){const p=newPost();p.merch=kind;
  Object.assign(p.set,{surf:'white',show:'dark',textOn:false,text:'',tpos:'top',tsize:.5,rings:false,logo:false,lkind:'b1',lcolor:'auto',lpos:'c',lsize:.5,pz:0,wave:'stay',
    hits:[{cx:.5,cy:.45,step:.5,count:5/17,warp:.2,stick:true,dir:-50}]},set);return p}
const makeMerchs=()=>[
  makeMerch('front',{show:'dark',logo:true,lkind:'b3',lcolor:'two',lpos:'c',lsize:.55}),
  makeMerch('back',{show:'pink',rings:true,rgrad:'yellow',logo:true,lkind:'m4',lcolor:'pink',lpos:'tl',lsize:.35,
    hits:[{cx:.5,cy:.48,step:.3,count:.3,warp:.2,stick:true,dir:115,sgrad:'whiteyellow'}]}),
  makeMerch('back',{show:'yellow',textOn:true,text:'барабанная\nмастерская\nпетра\nатапина',tpos:'top',tsize:1,rings:true,
    hits:[{cx:.68,cy:.2,step:.3,count:.35,warp:.7,color:false,stick:true,dir:40,sgrad:'pink'},{cx:.45,cy:.32,step:.3,count:.35,warp:.7,color:false,stick:true,dir:40,sgrad:'pink'}]}),
  makeMerch('tote',{show:'dark',rings:true,logo:true,lkind:'m4',lcolor:'pink',lpos:'bl',lsize:.5,hits:[{cx:.68,cy:.32,step:.55,count:.4,warp:.2,stick:true,dir:-40,sgrad:'whiteyellow'}]})];
// the print fades to white at its edges: the outer rings never end in a hard border on the cloth
function edgeFade(c){const x=c.getContext('2d'),W=c.width,H=c.height,e=Math.min(W,H)*.06;
  for(const[x0,y0,x1,y1,rx,ry,rw,rh]of[[0,0,0,e,0,0,W,e],[0,H,0,H-e,0,H-e,W,e],[0,0,e,0,0,0,e,H],[W,0,W-e,0,W-e,0,e,H]]){const g=x.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(rx,ry,rw,rh)}
  return c}
// the garment on its background with the print laid in by multiply: white of the print disappears, the folds of the cloth stay
function merchImage(p,W,H,opt={}){const M=MERCH[p.merch],c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),r=mRect(p);
  x.fillStyle=SHOW[p.set.show]||SHOW.dark;x.fillRect(0,0,W,H);let boxes={};
  if(M&&M.img.complete&&M.img.naturalWidth){const g=document.createElement('canvas');g.width=W;g.height=H;const gx=g.getContext('2d');gx.drawImage(M.img,0,0,W,H);
    const pr=asTab('merch',()=>renderPost(p,Math.round(W*r.w),Math.round(H*r.h),opt));edgeFade(pr);boxes=pr.boxes;
    gx.globalCompositeOperation='multiply';gx.drawImage(pr,W*r.x,H*r.y,W*r.w,H*r.h);gx.globalCompositeOperation='destination-in';gx.drawImage(M.img,0,0,W,H);x.drawImage(g,0,0)}
  c.boxes=boxes;return c}
// print file: white becomes transparent (colour to alpha), so it can go to DTF / screen print as is
function printFile(p){const[W,H]=[2400,3000],c=edgeFade(asTab('merch',()=>renderPost(p,W,H))),x=c.getContext('2d'),d=x.getImageData(0,0,W,H),a=d.data;
  for(let i=0;i<a.length;i+=4){const al=Math.max(255-a[i],255-a[i+1],255-a[i+2])/255;if(al<=0){a[i+3]=0;continue}for(let k=0;k<3;k++)a[i+k]=Math.round((a[i+k]-255*(1-al))/al);a[i+3]=Math.round(al*255)}
  x.putImageData(d,0,0);return c}
const newList=k=>k==='merch'?restoreList(S.merchs||fresh('merchs')):k==='avatar'?(S.profile?restoreProfile():restoreList(fresh('profile'))):restoreList(S.posts||fresh('posts'));
const listOf=k=>k===S.tab?posts:(TABS[k]||(TABS[k]=newList(k)));
const avatarOf=()=>listOf('avatar').find(isAv),hlsOf=()=>listOf('avatar').filter(isHlP);
// the publication in the phone: a fixed example — master-class promo that matches the caption under it
let DEMO=null;
function demoPost(){if(DEMO)return DEMO;const p={img:null,url:'',pan:[0,0],set:{surf:'pink',text:'в субботу\nделаем бубен\nсвоими руками',tsize:.6,tpos:'bottom',textOn:true,
  rings:true,logo:true,lkind:'b1',lcolor:'auto',lpos:'tl',lsize:.35,pz:0,wave:'stay',
  hits:[{cx:.78,cy:.36,step:.42,count:5/17,warp:.1,stick:true,dir:-55,sgrad:'whiteyellow'}]}};return DEMO=p}
function setTab(k){if(k===S.tab)return;
  if(isEd())TABS[S.tab]=posts.splice(0);
  const L=TABS[k]||newList(k);TABS[k]=null;posts.push(...L);
  if(k==='avatar'){const a=posts.find(isAv);if(a)a.set.lpos='c';SEL={post:0,el:'rings',hit:0}}else SEL={post:0,el:'bg'};
  S.tab=k;save();build();layout()}
document.querySelectorAll('.tbnav a').forEach(a=>SECS.includes(a.dataset.k)&&(a.onclick=e=>{e.preventDefault();setTab(a.dataset.k);document.getElementById({post:'posts',avatar:'profile',merch:'merch'}[a.dataset.k]).scrollIntoView({behavior:'smooth'})}));
function refresh(){const sl=row.scrollLeft;layoutPosts();row.scrollLeft=sl;build();labelize();save()}


// ───────── POST: text on colour / photo, with or without rings ─────────
// stick colours: a stick that starts white is not offered on white
const SGR={white:'linear-gradient(90deg,#ffffff 50%,#ffffff 50%)',orange:'linear-gradient(90deg,#ffffff 50%,#ff8c28 50%)',pinkyellow:'linear-gradient(90deg,#ff00d0 50%,#ffe100 50%)',pinkorange:'linear-gradient(90deg,#ff00d0 50%,#ff8c28 50%)',whiteyellow:'linear-gradient(90deg,#ffffff 50%,#ffe100 50%)',pink:'#ff00d0',dark:'#141414'};   // split like the two-colour logo swatch: start | end
const stickOpts=surf=>S.tab==='merch'?['pink','pinkyellow','whiteyellow','white']:surf==='white'?['pinkyellow','whiteyellow','white']:surf==='pink'?['pink','pinkyellow','whiteyellow']:surf==='dark'?['dark','pinkyellow','whiteyellow']:['white','pinkyellow','whiteyellow'];   // on pink a pink stick, on dark a dark one
function stickGrad(h,surf){const o=stickOpts(surf),d=PSURF[surf]?.stick;return o.includes(h.sgrad)?h.sgrad:o.includes(d)?d:o[0]}
const PSURF={white:{bg:WHITE,grad:'pink',ink:'#141414',logo:'#ff00d0',stick:'pinkyellow'},pink:{bg:PINK,grad:'yellow',ink:'#ffffff',logo:'#ffffff',stick:'whiteyellow'},photo:{bg:WHITE,grad:'pink',ink:'#ffffff',logo:'#ffffff',stick:'white'},
  dark:{bg:DARK,grad:'pinkonly',ink:'#ffffff',logo:'#ff00d0',stick:'pinkyellow'}};   // dark #141414: white text, pink logo, rings in pink only
const posts=[];let pendingPost=null;
function newPost(img,url){const d=JSON.parse(JSON.stringify(S.post));d.pz=0;if(Array.isArray(d.hits)&&d.hits.length>1)d.hits=[d.hits[0]];   // a new post starts with one hit
  if(Array.isArray(d.hits))d.hits.forEach(h=>{if(h.cx>1)h.cx=h.cx%1||.5});return{img:img||null,url:url||'',pan:[0,0],set:Object.assign(d,{surf:img?'photo':(d.surf==='photo'?'white':d.surf)})}}
function postDims(){return isSq()?[1080,1080]:S.tab==='merch'?[2400,3000]:FMTWH[S.postFmt]||FMTWH['4:5']}
const ZONES={bl:[.3,.7],tl:[.3,.3],tr:[.7,.3],br:[.7,.7],c:[.5,.5]};
const LCOLS=[['auto',null,'по фону'],['white','#ffffff','белый'],['pink','#ff00d0','розовый'],['dark','#141414','тёмный'],['two','linear-gradient(90deg,#ff00d0 50%,#ffe100 50%)','два цвета']];
// every post setting has a default, older saved posts get the missing ones
// rings come as a list of hits, each with its own stick; older posts had one set of fields
function hitsOf(st){if(!Array.isArray(st.hits)||!st.hits.length)st.hits=[{cx:st.cx??.64,cy:st.cy??.62,rsize:st.rsize??.45,stick:st.stick!==false,dir:st.dir??-50}];return st.hits}
const hitOf=p=>{const H=hitsOf(p.set);if(SEL.hit==null||SEL.hit>=H.length)SEL.hit=H.length-1;return H[SEL.hit]};
// ring step from the knob (same scale the old size used for 8 rings), and how many rings
const ringStep=h=>RING.size*(.55+(h.step??h.rsize??.45)*1.6)/8,ringN=h=>Math.round(3+(h.count??5/17)*17);
const PDEF={rsize:.45,dir:-50,lkind:'b1',lcolor:'auto',lpos:'bl',lsize:.4};
// text block: fitted, returns the canvas plus where it landed (for selecting / editing on the post)
function textLayer(W,H,st,ink,m,resTop,resBot,hide){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const txt=(st.text||'').trim();   // case as typed: lowercase is only for the logo
  const maxW=W-2*m,top=m+resTop,bottom=H-m-resBot,availH=bottom-top;
  const wrap=fs=>{x.font=`400 ${fs}px Ubuntu`;const out=[];
    for(const para of (txt||' ').split('\n')){let line='';for(const w of para.split(/\s+/).filter(Boolean)){const t=line?line+' '+w:w;if(!line||x.measureText(t).width<=maxW)line=t;else{out.push(line);line=w}}out.push(line)}
    return out.filter((l,i,a)=>l||i<a.length-1)};
  const fits=fs=>{const ls=wrap(fs);let wm=0;for(const l of ls)wm=Math.max(wm,x.measureText(l).width);return ls.length*fs*1.04<=availH&&wm<=maxW};
  let fmax=W*.5;for(let k=0;k<120&&!fits(fmax);k++)fmax*=.96;
  const fs=txt?fmax*(.25+.75*st.tsize):W*.07,lines=txt?wrap(fs):[''],lh=fs*1.04,h=Math.max(1,lines.length)*lh,y0=st.tpos==='top'?top:st.tpos==='mid'?(top+bottom-h)/2:bottom-h;
  if(txt&&!hide){x.fillStyle=ink;x.font=`400 ${fs}px Ubuntu`;lines.forEach((l,i)=>x.fillText(l,st.tpos==='mid'?(W-x.measureText(l).width)/2:m,y0+fs*.8+i*lh))}
  let wm=0;x.font=`400 ${fs}px Ubuntu`;for(const l of lines)wm=Math.max(wm,x.measureText(l).width);
  c.box={x:st.tpos==='mid'?(W-maxW)/2:m,y:y0,w:maxW,h,fs,maxW};   // the text frame is always full width
  return c}
function logoBox(x,st,md){const k=LOGOS.find(l=>l.id===st.lkind)||LOGOS[0],size=md*(isSq()?2.2:1)*(k.lines?.03+st.lsize*.06:.035+st.lsize*.09),two=st.lcolor==='two'&&!k.lines;
  if(k.lines){x.font=`400 ${size}px Ubuntu`;let w=0;for(const l of k.lines)w=Math.max(w,x.measureText(l).width);return{k,size,two,w,h:k.lines.length*size*1.02}}
  return{k,size,two,w:Wave.logoWidth(x,size,k.level,two,'Ubuntu',400,k.word||'б'),h:size}}
// linked posts: posts[i].link joins post i with post i+1; a run of joined posts is one group sharing background, photo and hits
function grpOf(i,L=posts){let a=i;while(a>0&&L[a-1].link)a--;let b=i;while(b<L.length-1&&L[b].link)b++;return{a,n:b-a+1,k:i-a}}
const SHARED=['surf','rings','hits','pz','wave','dur'];
const zoomOf=st=>1+(st.pz||0)*2;   // photo scale knob 0..1 → 1×..3×
const ownerOf=p=>{const i=posts.indexOf(p);return i<0?p:posts[grpOf(i).a]};
function syncGroups(){for(let i=0;i<posts.length;i++){const g=grpOf(i);if(!g.k)continue;const o=posts[g.a],q=posts[i];hitsOf(o.set);q.img=o.img;q.url=o.url;q.pid=o.pid;q.pan=o.pan;for(const k of SHARED)q.set[k]=o.set[k]}}
// the whole group is drawn as one wide picture, each post is its slice; hits live in group units (cx 0..n)
let sceneCache={key:null};
// movement: rings run outward one step per beat, the stick lifts and strikes on the beat; seamless loop
// movement: every hit plays once at its time on the timeline:
// the stick fades in (coming from the viewer), strikes, the rings run out once in all directions, then the stick fades away
let CLIP=5;   // length of the active post's clip, seconds
const durOf=p=>p&&p.set&&p.set.dur||5;
const STICK_IN=.15,STICK_HOLD=1,STICK_OUT=.9,RING_T=3;   // stick: quick in, stays while the rings run, slow out
const hitAt=(h,k)=>h.at??Math.min(CLIP-1,.6+k*.8);
function hitAnim(h,k,t,wave){if(t==null)return{on:true,sa:1,ss:1,sb:0,ox:0,oy:0,punch:1,front:9,back:-9,fade:1,ph:0};
  const tau=t-hitAt(h,k),ease=v=>1-Math.pow(1-v,3);
  const go=wave==='go';
  // the stick: flies in from the viewer (big and blurred → sharp, its size; very fast), strikes, holds a moment,
  // then drives off along its handle, growing and blurring as it goes
  const IN=.13,SH=.15,OUT=.55,a=h.dir*Math.PI/180;
  let sa=0,ss=1,sb=0,ox=0,oy=0;
  if(tau>=-IN&&tau<0){const q=(tau+IN)/IN;sa=Math.min(1,q*3);ss=1+1.3*(1-q)**2;sb=(1-q)**2}
  else if(tau>=0&&(!go||tau<SH))sa=1;   // when the wave stays as a picture, the stick stays too
  else if(tau>=SH&&tau<SH+OUT){const o=(tau-SH)/OUT,e=o*o;sa=1-o;ss=1+.25*e;sb=.3*e;ox=Math.cos(a)*.45*e;oy=Math.sin(a)*.45*e}
  const punch=tau>=0?1+2.2*Math.exp(-tau/.12):1;   // the surface jolts at the moment of the hit, then calms down
  // the field is the still picture (N rings, bright at the centre, paler and yellower outward); the motion is how it gets there:
  // 'stay' — rings are born at the hit and run out until the still picture is complete, then it stays
  // 'go'   — the same, but the rings keep running: the centre calms down behind them and the whole field leaves the frame
  // the strong first ring leaves first; LAG later the rest of the wave starts behind it, while it is still alive.
  // both run and fade at the same pace (the first one is the bright centre ring, dimming with distance like the others)
  const N=ringN(h),K=Math.max(2,Math.round(N*.4)),T=go?3.6:2.5,LAG=.13;
  const run=tt=>{const p=tt/T;return tt<0?-1:go?(N+K)*(1-(1-Math.min(1,p))**2):N*ease(Math.min(1,p))};
  const pl=tau/T,ldOn=tau>=0&&pl<1,ld=ldOn?(run(tau)*1.22+.5)/N:-9;   // the first one a bit faster
  const t2=tau-LAG,p=t2/T,on=t2>=0&&(!go||p<1),ph=on?run(t2):0;
  return{on:on||ldOn,sa,ss,sb,ox,oy,punch,lead:ld,leadA:ldOn?Math.max(0,1-ld)**1.6:0,front:on&&(go||p<1)?(ph+.7)/N:on?9:-1,back:go?(ph-K+.3)/N:-9,fade:1,ph:!go&&p>=1?0:ph}}
const textCache=new Map();
document.fonts&&document.fonts.addEventListener('loadingdone',()=>{textCache.clear();sceneCache.key=null});   // text drawn before Ubuntu arrived must not stick
function textCached(W,H,st,ink,m,rt,rb,hide){const k=JSON.stringify([W,H,st.text,st.tsize,st.tpos,ink,m,rt,rb,hide,document.fonts?document.fonts.check('400 20px Ubuntu'):1]);let c=textCache.get(k);if(!c){c=textLayer(W,H,st,ink,m,rt,rb,hide);if(textCache.size>40)textCache.clear();textCache.set(k,c)}return c}
function renderScene(mem,W,H,hideK,t=null){
  const n=mem.length,WW=W*n,o=mem[0],st0=o.set;
  for(const q of mem){Object.keys(PDEF).forEach(k=>{if(q.set[k]==null)q.set[k]=PDEF[k]});if(q.set.text==null)q.set.text=''}
  const su=PSURF[st0.surf==='photo'&&!o.img?'white':st0.surf],c=document.createElement('canvas');c.width=WW;c.height=H;const x=c.getContext('2d'),md=Math.min(W,H),m=md*.07;
  hitsOf(st0);const HS=st0.rings?st0.hits:[];const AN=new Map(HS.map((h,k)=>[h,hitAnim(h,k,t,st0.wave)])),AH=HS.filter(h=>AN.get(h).on);
  const ringOf=h=>{const a=AN.get(h);return Object.assign({},RING,{phase:(RING.phase+a.ph)%1,size:ringStep(h)*ringN(h)/n,front:a.front,back:a.back,lead:a.lead,leadBoost:a.leadA||0,leadColor:st0.surf==='dark'?[1,0,.816]:undefined,rings:ringN(h),cx:h.cx/n,cy:h.cy,bg:su.bg,grad:st0.rgrad||su.grad,pan:o.pan,zoom:zoomOf(st0),disp:RING.disp*(.25+(h.warp??.2)*3.75)*a.fade*a.punch},h.color===false?{tint:0,rgb:0}:{tint:RING.tint*a.fade})};   // no colour = distortion only
  // runs a layer through every hit in turn: each next hit distorts the result of the previous one
  const through=(src,op)=>{let cur=src;AH.forEach((h,k)=>{E.setImage(cur);E.draw(Object.assign(ringOf(h),op,k?{pan:[0,0],zoom:1}:{}));tmp.width=WW;tmp.height=H;tmp.getContext('2d').drawImage(glc,0,0);cur=tmp});return glc};
  glc.width=WW;glc.height=H;const photo=st0.surf==='photo'&&o.img;
  if(photo){if(AH.length)x.drawImage(through(o.img,{mode:1}),0,0);
    else{const[sx,sy]=fitOf({img:o.img},WW,H,zoomOf(st0));x.drawImage(o.img,o.img.width*(1-sx)*(.5+o.pan[0]),o.img.height*(1-sy)*(.5+o.pan[1]),o.img.width*sx,o.img.height*sy,0,0,WW,H)}}
  else{x.fillStyle=st0.surf==='pink'?'#ff00d0':st0.surf==='dark'?'#141414':'#ffffff';x.fillRect(0,0,WW,H);E.setImage(null);for(const h of AH)if(h.color!==false){E.draw(Object.assign(ringOf(h),{mode:0,transparent:true}));x.globalAlpha=AN.get(h).fade;x.drawImage(glc,0,0);
    if(st0.surf==='dark'){x.globalCompositeOperation='screen';x.drawImage(glc,0,0);x.globalCompositeOperation='source-over'}   // on dark the pale rings would turn brown: light them up
    x.globalAlpha=1}}
  // text of every post, side by side on one layer, warped together
  const per=mem.map(q=>{const st=q.set,lb=st.logo&&!isHlP(q)?logoBox(x,st,md):null,gap=md*.05,lTop=lb&&['tl','tr'].includes(st.lpos),lBot=lb&&['bl','br'].includes(st.lpos);return{st,lb,lTop,lBot}});
  const tls=per.map((r,k)=>r.st.textOn!==false?textCached(W,H,r.st,su.ink,m,topSafe(W,H,m)-m+(r.lTop&&r.st.tpos==='top'?r.lb.h+gap0(md):0),r.lBot?r.lb.h+gap0(md):0,k===hideK):null);
  if(tls.some(Boolean)){const tw=document.createElement('canvas');tw.width=WW;tw.height=H;const tx=tw.getContext('2d');tls.forEach((t,k)=>t&&tx.drawImage(t,k*W,0));
    x.drawImage(AH.length?through(tw,{mode:2,transparent:true,pan:[0,0],zoom:1,rgb:0}):tw,0,0)}
  for(const h of HS)if(h.stick&&AN.get(h).sa>0){const A=AN.get(h);stk.width=WW;stk.height=H;const sk=Math.sqrt(ringStep(h)*8/RING.size)*A.ss;Wave.stick(stk.getContext('2d'),WW,H,{on:true,cx:(h.cx+.03*sk+A.ox)/n,cy:h.cy-.02*sk+A.oy*W/H,angle:h.dir,grad:stickGrad(h,st0.surf),blur:.045,scale:sk,unit:W});x.globalAlpha=A.sa;if(A.sb>.01)x.filter=`blur(${(A.sb*.05*W).toFixed(1)}px)`;x.drawImage(stk,0,0);x.filter='none';x.globalAlpha=1}
  // logos, each on its own post
  const f=r=>r&&{x:r.x/W,y:r.y/H,w:r.w/W,h:r.h/H};
  const boxes=per.map((r,k)=>{const st=r.st,lb=r.lb;
    if((st0.surf==='white'&&st.lcolor==='white')||(st0.surf==='pink'&&(st.lcolor==='pink'||st.lcolor==='two'))||(st0.surf==='dark'&&st.lcolor==='dark'))st.lcolor='auto';
    let logoRect=null;
    if(lb){const col=st.lcolor==='auto'||st.lcolor==='two'?(st.lcolor==='two'?'#ff00d0':su.logo):(LCOLS.find(c=>c[0]===st.lcolor)||LCOLS[0])[1];
      const L=m+lb.w/2,R=W-m-lb.w/2,T=topSafe(W,H,m)+lb.h/2,B=H-m-lb.h/2,[lx,ly]=st.lpos==='free'?[(st.lx??.5)*W,(st.ly??.5)*H]:{tl:[L,T],tr:[R,T],bl:[L,B],br:[R,B],c:[W/2,H/2]}[st.lpos]||[L,B];
      x.save();x.translate(k*W,0);x.beginPath();x.rect(0,0,W,H);x.clip();
      if(lb.k.lines){x.font=`400 ${lb.size}px Ubuntu`;x.fillStyle=col;x.textBaseline='alphabetic';lb.k.lines.forEach((l,i)=>x.fillText(l,lx-lb.w/2,ly-lb.h/2+lb.size*.78+i*lb.size*1.02))}
      else Wave.logo(x,lx,ly,lb.size,col,lb.two?'#ffe100':null,lb.k.level,'Ubuntu',400,lb.k.word||'б');
      x.restore();logoRect={x:lx-lb.w/2,y:ly-lb.h/2,w:lb.w,h:lb.h}}
    const tl=tls[k];
    return{text:tl?f(tl.box):null,textFs:tl?tl.box.fs/W:0,textInk:su.ink,logo:f(logoRect),rings:HS.map(h=>{const ex=Math.min(1-.09,Math.max(-.09,h.cx-k-.09)),ey=Math.min(1-.09*W/H,Math.max(-.09*W/H,h.cy-.09*W/H));return{x:ex,y:ey,w:.18,h:.18*W/H}})}});
  return{c,boxes}}
const gap0=md=>md*.05;
// stories: instagram puts the avatar and the name over the top 250 px of 1920, so logo and text start below them
function topSafe(W,H,m){return H/W>1.6?Math.max(m,H*.13):m}
function renderPost(p,W,H,opt={}){
  const L=posts.includes(p)?posts:(TABS.post||[]).includes(p)?TABS.post:[p],g=grpOf(L.indexOf(p),L),mem=L.slice(g.a,g.a+g.n),hideK=opt.hideText?g.k:-1;
  const t=opt.t??null,key=JSON.stringify([W,H,hideK,t,mem.map(q=>[q.set,q.url,q.pan])]);
  if(sceneCache.key!==key)sceneCache={key,...renderScene(mem,W,H,hideK,t)};
  const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(sceneCache.c,-g.k*W,0);c.boxes=sceneCache.boxes[g.k];return c}

// ───────── direct editing on the post ─────────
const CELLKEY=['tl','t','tr','l','c','r','bl','b','br'];
const ZONECELLS=['tl',null,'tr',null,'c',null,'bl',null,'br'];
const DIRCELLS=[-135,-90,-50,180,null,0,135,90,45];
let pressed=false;addEventListener('pointerdown',()=>pressed=true,true);for(const n of['pointerup','pointercancel'])addEventListener(n,()=>pressed=false,true);
let SEL={post:0,el:'bg'};const cardPaint=[];
const gset=(i,k,v)=>{const g=grpOf(i);for(let j=g.a;j<g.a+g.n;j++)posts[j].set[k]=v};   // shared settings go to the whole linked group   // which post and which element on it is active
function rememberPost(p){if(isMe(p)){save();return}const d=JSON.parse(JSON.stringify(p.set));if(isAv(p))S.avatarSet=d;else if(isHlP(p))S.hlSet=d;else S.post=d;save()}
// stick control: click shows/hides the stick, press and drag rotates its handle (turns it on too)
function stickCtl(h,toggle,paint,done){const p={set:h};const w=el('div','stk'+(p.set.stick?' on':''));w.title='колотушка: нажми — показать, потяни — повернуть';w.tabIndex=0;w.setAttribute('role','button');w.setAttribute('aria-pressed',p.set.stick);w.setAttribute('aria-label','колотушка');
  w.innerHTML='<svg viewBox="0 0 44 44"><line x1="22" y1="22" x2="36" y2="22"/><circle cx="22" cy="22" r="4.5"/></svg>';
  const ln=w.querySelector('line');let v=p.set.dir,st=null,moved=false;const draw=()=>ln.setAttribute('transform',`rotate(${v} 22 22)`);draw();
  const ang=e=>{const r=w.getBoundingClientRect();return Math.round(Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI)};
  w.onpointerdown=e=>{st=[e.clientX,e.clientY];moved=false;w.setPointerCapture(e.pointerId)};
  w.onpointermove=e=>{if(!st)return;if(!moved&&Math.hypot(e.clientX-st[0],e.clientY-st[1])<5)return;
    if(!moved){moved=true;if(!p.set.stick){p.set.stick=true;w.classList.add('on')}}v=ang(e);p.set.dir=v;draw();paint()};
  w.onpointerup=()=>{if(!st)return;st=null;if(moved)done&&done();else toggle()};
  w.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();return}
    const d={ArrowRight:10,ArrowDown:10,ArrowLeft:-10,ArrowUp:-10}[e.key];if(d&&p.set.stick){e.preventDefault();v=(v+d+540)%360-180;p.set.dir=v;draw();paint();done&&done()}};
  return w}
// a knob with a word on its left says what it turns
const KLAB={size:'размер',count:'колец',gap:'размер',warp:'искажение',zoom:'масштаб'};
function lab(t,ctl){const w=el('div','kico');w.appendChild(el('span','klab',t));w.appendChild(ctl);return w}
function ico(k,ctl){const w=el('div','kico');w.appendChild(el('span','klab',KLAB[k]));w.appendChild(ctl);return w}
// synth-like knob: drag up/down or scroll; arrows on the keyboard
function knob(label,val,on,done){const w=el('div','knob');w.title=label;w.tabIndex=0;w.setAttribute('role','slider');w.setAttribute('aria-label',label);
  w.innerHTML='<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" class="kt"/><path class="kv"/><line x1="22" y1="22" x2="22" y2="8" class="kp"/></svg><span></span>';
  const draw=v=>{const a0=-135,a1=a0+270*v,r=20,p=a=>[22+r*Math.cos((a-90)*Math.PI/180),22+r*Math.sin((a-90)*Math.PI/180)],[sx,sy]=p(a0),[ex,ey]=p(a1);
    w.querySelector('.kv').setAttribute('d',`M${sx} ${sy} A${r} ${r} 0 ${270*v>180?1:0} 1 ${ex} ${ey}`);w.querySelector('.kp').setAttribute('transform',`rotate(${a1} 22 22)`);
    w.querySelector('span').textContent=label;w.setAttribute('aria-valuenow',Math.round(v*100))};
  let v=val,st=null;draw(v);const set=nv=>{v=Math.min(1,Math.max(0,nv));draw(v);on(v)};
  w.onpointerdown=e=>{st=[e.clientY,v];w.setPointerCapture(e.pointerId)};w.onpointermove=e=>{if(st)set(st[1]+(st[0]-e.clientY)/150)};w.onpointerup=()=>{if(st){st=null;done&&done()}};
  w.onwheel=e=>{e.preventDefault();set(v-e.deltaY/600);clearTimeout(w._t);w._t=setTimeout(()=>done&&done(),300)};
  w.onkeydown=e=>{const d={ArrowUp:.05,ArrowRight:.05,ArrowDown:-.05,ArrowLeft:-.05}[e.key];if(d){e.preventDefault();set(v+d);done&&done()}};
  return w}
function postCard(p,i){
  const[W,H]=postDims(),w=Math.round(cardH*W/H),active=SEL.post===i,c=el('div','card'+(active?' active':'')),cvv=el('canvas');c.dataset.i=i;
  cvv.style.width=w+'px';cvv.style.height=cardH+'px';cvv.width=Math.round(w*dpr());cvv.height=Math.round(cardH*dpr());
  const pic=el('div','pic'),ov=el('div','ov');pic.append(cvv,ov);
  let boxes={};const editing=()=>active&&SEL.el==='text'&&SEL.editing;
  const MR=isMe(p)?mRect(p):{x:0,y:0,w:1,h:1},ow=w*MR.w,oh=cardH*MR.h;
  if(isMe(p)){Object.assign(ov.style,{left:MR.x*100+'%',top:MR.y*100+'%',width:MR.w*100+'%',height:MR.h*100+'%',right:'auto',bottom:'auto'});
    cvv.onpointerdown=()=>{if(!active||SEL.el!=='bg'){SEL={post:i,el:'bg'};refresh()}}}
  const paint=()=>{const img=(isMe(p)?merchImage:renderPost)(p,cvv.width,cvv.height,{hideText:editing(),t:S.move&&S.tab==='post'&&grpOf(SEL.post).a===grpOf(i).a&&SEL.post<posts.length?tNow():null});cvv.getContext('2d').drawImage(img,0,0);boxes=img.boxes;drawSel();if(S.tab==='post'&&i===(SEL.post|0)&&!editing())drawLive(p,img,tNow()/CLIP);if(isAv(p))drawIg(img);const hk=isHlP(p)?posts.filter(isHlP).indexOf(p):-1;if(hk>=0&&igHl[hk]){const x=igHl[hk].getContext('2d');x.clearRect(0,0,igHl[hk].width,igHl[hk].height);x.drawImage(img,0,0,igHl[hk].width,igHl[hk].height)}};cardPaint[i]=paint;
  const paintG=()=>{const g=grpOf(i);for(let j=g.a;j<g.a+g.n;j++)(cardPaint[j]||paint)()};
  // yellow dashed frame on the active element
  const drawSel=()=>{ov.querySelectorAll('.selbox').forEach(n=>n.remove());if(!active||editing())return;const b=SEL.el==='bg'?{x:0,y:0,w:1,h:1}:SEL.el==='rings'?(boxes.rings||[])[SEL.hit|0]:boxes[SEL.el];if(!b)return;
    const d=el('div','selbox');const pad=SEL.el==='bg'?0:6;d.style.left=`calc(${b.x*100}% - ${pad}px)`;d.style.top=`calc(${b.y*100}% - ${pad}px)`;d.style.width=`calc(${b.w*100}% + ${pad*2}px)`;d.style.height=`calc(${b.h*100}% + ${pad*2}px)`;ov.appendChild(d)};
  paint();
  // typing right on the post
  if(editing()&&boxes.text){const b=boxes.text,ta=el('textarea','ontext');ta.value=p.set.text;ta.setAttribute('aria-label','текст поста');
    Object.assign(ta.style,{left:b.x*100+'%',top:b.y*100+'%',width:(boxes.text&&(1-2*b.x))*100+'%',fontSize:boxes.textFs*ow+'px',color:boxes.textInk,minHeight:Math.max(b.h*oh,40)+'px'});
    const grow=()=>{ta.style.height='auto';ta.style.height=ta.scrollHeight+'px'};ta.oninput=()=>{p.set.text=ta.value;grow()};
    const mine=SEL;
    // leaving the text by pressing a button: rebuild the page only after that press is over, or the press would be lost
    ta.onblur=()=>{rememberPost(p);if(SEL!==mine)return;SEL.editing=false;if(pressed)addEventListener('pointerup',()=>setTimeout(refresh,0),{once:true});else refresh()};ta.onkeydown=e=>{if(e.key==='Escape')ta.blur()};
    ov.appendChild(ta);setTimeout(()=>{ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);grow()},0)}
  // logo snapping: the 5 allowed places show up while dragging, the nearest is yellow
  const showSnaps=(px,py)=>{ov.querySelectorAll('.snap').forEach(n=>n.remove());const b=boxes.logo;if(!b)return;
    const mx=Math.min(W,H)*.07/W,my=Math.min(W,H)*.07/H,ty=topSafe(W,H,Math.min(W,H)*.07)/H,T={tl:[mx,ty],tr:[1-mx-b.w,ty],bl:[mx,1-my-b.h],br:[1-mx-b.w,1-my-b.h],c:[.5-b.w/2,.5-b.h/2]};
    let best=null,bd=9;for(const k in T){const d=Math.hypot(T[k][0]+b.w/2-px,(T[k][1]+b.h/2-py)*H/W);if(d<bd){bd=d;best=k}}
    for(const k in T){const d=el('div','snap'+(k===best?' on':''));Object.assign(d.style,{left:T[k][0]*100+'%',top:T[k][1]*100+'%',width:b.w*100+'%',height:b.h*100+'%'});ov.appendChild(d)}
    ov.dataset.snap=best};
  // click = select what is under the cursor; drag moves rings (if they are selected) or the photo (if the background is)
  let dr=null,mode=null,dr0=null,pend=null,pendK=-1,moved=false;const cl=v=>v<-.5?-.5:v>.5?.5:v,inb=(b,px,py)=>b&&px>=b.x-.02&&px<=b.x+b.w+.02&&py>=b.y-.02&&py<=b.y+b.h+.02;
  ov.onpointerdown=e=>{if(e.target.classList.contains('ontext'))return;const r=ov.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    const G=grpOf(i);let hk=-1,hd=r.width*.12;(p.set.rings?hitsOf(p.set):[]).forEach((h,k)=>{const ex=Math.min(1,Math.max(0,h.cx-G.k)),ey=Math.min(1,Math.max(0,h.cy)),d=Math.hypot((px-ex)*r.width,(py-ey)*r.height);if(d<hd){hd=d;hk=k}});
    const hit=inb(boxes.logo,px,py)?'logo':inb(boxes.text,px,py)?'text':hk>=0?'rings':'bg';
    // the active element is always on top: with rings active, a drag anywhere moves the rings (even under text); a plain click selects what is under it
    if(active&&SEL.el==='logo'&&hit==='logo'&&isMe(p)){const b=boxes.logo;mode='free';dr=[e.clientX,e.clientY];dr0=[e.clientX,e.clientY,b.x+b.w/2,b.y+b.h/2,b.w,b.h];ov.setPointerCapture(e.pointerId);return}
    if(active&&SEL.el==='logo'&&hit==='logo'&&!isAv(p)){mode='logo';dr=[e.clientX,e.clientY];ov.setPointerCapture(e.pointerId);showSnaps(px,py);return}
    if(active&&SEL.el==='rings'&&!(hit==='rings'&&hk!==(SEL.hit|0)&&hk>=0&&hd<r.width*.06)){const h=hitOf(p);mode='hit';dr=[e.clientX,e.clientY];const gn=grpOf(i).n;dr0=[e.clientX,e.clientY,Math.min(gn,Math.max(0,h.cx)),Math.min(1,Math.max(0,h.cy))];pend=hit;pendK=hk;moved=false;ov.setPointerCapture(e.pointerId);return}
    if(!active||SEL.el!==hit||(hit==='rings'&&hk!==(SEL.hit|0))){SEL={post:i,el:hit,editing:hit==='text',hit:hk>=0?hk:0};refresh();return}
    if(hit==='text'){SEL.editing=true;refresh();return}
    mode=hit==='rings'?'hit':hit==='bg'&&p.img&&p.set.surf==='photo'?'pan':null;if(!mode)return;dr=[e.clientX,e.clientY];ov.setPointerCapture(e.pointerId)};
  ov.onpointermove=e=>{if(!dr)return;const r=ov.getBoundingClientRect();
    if(mode==='free'){const[x0,y0,cx,cy,bw,bh]=dr0;p.set.lpos='free';p.set.lx=Math.min(1-bw/2-.065,Math.max(bw/2+.065,cx+(e.clientX-x0)/r.width));p.set.ly=Math.min(1-bh/2-.05,Math.max(bh/2+.05,cy+(e.clientY-y0)/r.height));paint();return}
    if(mode==='logo'){showSnaps((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);return}
    if(mode==='hit'){if(Math.hypot(e.clientX-dr0[0],e.clientY-dr0[1])>3)moved=true;if(!moved)return;
      const h=hitOf(p);h.cx=Math.min(grpOf(i).n,Math.max(0,dr0[2]+(e.clientX-dr0[0])/r.width));h.cy=Math.min(1,Math.max(0,dr0[3]+(e.clientY-dr0[1])/r.height))}
    else{const gn=grpOf(i).n,[sx,sy]=fitOf({img:p.img},W*gn,H,zoomOf(p.set)),dx=(e.clientX-dr[0])/(r.width*gn),dy=(e.clientY-dr[1])/r.height;
      if(1-sx>1e-4)p.pan[0]=cl(((1-sx)*(.5+p.pan[0])-dx*sx)/(1-sx)-.5);if(1-sy>1e-4)p.pan[1]=cl(((1-sy)*(.5+p.pan[1])-dy*sy)/(1-sy)-.5)}
    dr=[e.clientX,e.clientY];paintG()};
  ov.onpointerup=()=>{if(!dr)return;dr=null;if(mode==='free'){rememberPost(p);refresh();return}if(mode==='logo'){const t=ov.dataset.snap;ov.querySelectorAll('.snap').forEach(n=>n.remove());if(t&&t!==p.set.lpos){p.set.lpos=t;rememberPost(p)}refresh();return}if(mode==='hit'&&!moved&&pend&&(pend!=='rings'||pendK!==(SEL.hit|0))){SEL={post:i,el:pend,editing:pend==='text',hit:pendK>=0?pendK:0};refresh();return}rememberPost(p)};
  if(isSq())pic.appendChild(el('div','amask'));
  if(isAv(p))pic.appendChild(el('div','hltitle avlabel','аватар'));
  if(isMe(p))pic.appendChild(el('div','hltitle avlabel',MERCH[p.merch].label));   // first card on the profile tab is the avatar; covers carry their title in the same place
  if(isHlP(p)){const ti=el('input','hltitle');ti.value=p.title||'';ti.placeholder='название';ti.setAttribute('aria-label','название хайлайта');ti.onchange=()=>{p.title=ti.value;refresh()};pic.appendChild(ti)}   // instagram shows the square file as a circle
  c.appendChild(pic);
  // everything that decorates the post lives around it (only on the active post)
  if(active){const d=decor(p,i,paintG);pic.append(d.top,d.bottom);if(!isAv(p))pic.appendChild(d.top.del);if(S.move&&S.tab==='post')pic.appendChild(timeline(p,i));   // the avatar is a still picture
    if(d.left){const b=(SEL.el==='rings'?(boxes.rings||[])[SEL.hit|0]:boxes[SEL.el])||{y:0};const ty=MR.y*cardH+b.y*oh;d.left.style.top=Math.max(0,ty)+'px';pic.appendChild(d.left);requestAnimationFrame(()=>{const h=d.left.offsetHeight;d.left.style.top=Math.max(0,Math.min(ty,cardH-h))+'px'})}}   // stays within the post's height
  return c}
// covers: the same knob gives a long word smaller letters than a short one, so spreading finds the knob value that gives each word the source's letter size
function sameLetters(src,dst){const W=1080,m=W*.07,fs=st=>textLayer(W,W,st,'#000',m,0,0,true).box.fs,want=fs(src),top=fs(Object.assign({},dst,{tsize:1}));
  return Math.min(1,Math.max(0,(want/top-.25)/.75))}
function delHit(p,i){const H=hitsOf(p.set),k=SEL.hit|0,before=JSON.parse(JSON.stringify(H)),wasOn=p.set.rings;
  if(H.length>1){H.splice(k,1);SEL.hit=Math.max(0,k-1)}else{gset(i,'rings',false);SEL={post:i,el:'bg'}}
  rememberPost(p);refresh();toast('удар убран',()=>{H.splice(0,H.length,...before);gset(i,'rings',wasOn);SEL={post:i,el:'rings',hit:k};rememberPost(p);refresh()})}
function decor(p,i,paint){
  const mk=(cls)=>el('div',cls);
  const circ=(label,on,onclick,title,cls='')=>{const b=el('button','circ'+(on?' on':'')+(cls?' '+cls:''),label);b.title=title;b.setAttribute('aria-label',title);b.setAttribute('aria-pressed',!!on);b.onclick=onclick;return b};
  const done=()=>rememberPost(p),set=(k,v)=>{if(SHARED.includes(k))gset(i,k,v);else p.set[k]=v;rememberPost(p);refresh()};
  const compass=(cells,cur,on,names)=>{const w=el('div','compass');cells.forEach((v,k)=>{if(v==null){w.appendChild(el('i'));return}
      const ch={tl:'↖',t:'↑',tr:'↗',l:'←',c:'•',r:'→',bl:'↙',b:'↓',br:'↘'}[CELLKEY[k]];const b=el('button',v===cur?'on':'',ch);b.title=names[v];b.setAttribute('aria-label',names[v]);
      b.onclick=()=>{on(v);rememberPost(p);refresh()};w.appendChild(b)});return w};
  // top: save, roll out ··· delete
  const top=mk('dtop'),tl=mk('dgrp');
  const sv=el('button','rect','png');sv.title='сохранить картинку';sv.onclick=()=>{const[W2,H2]=postDims().map(v=>v*2);savePNG(renderPost(p,W2,H2),`barabannaja-post-${i+1}-${W2}x${H2}.png`)};   // pictures at 2×
  const sm=el('button','rect','mp4');sm.title='сохранить видео';sm.onclick=async()=>{const[W2,H2]=postDims();sm.disabled=true;await saveMP4(p,i,W2,H2,f=>sm.textContent=`${Math.round(f*100)}%`);sm.disabled=false;sm.textContent='mp4'};tl.append(sv);if(S.tab==='post')tl.append(sm);
  if(isMe(p)){sv.textContent='скачать мокап';sv.title='сохранить картинку с вещью';sv.onclick=()=>savePNG(merchImage(p,1200,1500),`barabannaja-${p.merch}-${i+1}-mockup.png`);
    const pf=el('button','rect','скачать принт');pf.title='файл для печати: 2400×3000, прозрачный фон';pf.onclick=()=>savePNG(printFile(p),`barabannaja-${p.merch}-${i+1}-print-2400x3000.png`);tl.append(pf)}
  if(posts.length>1&&!isAv(p)&&!isMe(p)){const ro=el('button','rect','раскатать');ro.title='настройки этого поста — на все, кроме текста и фото';
    if(isHlP(p))ro.title='настройки этой обложки — на все обложки, кроме текста; буквы одного размера';
    ro.onclick=()=>{const before=posts.map(q=>JSON.parse(JSON.stringify(q.set)));for(const q of posts)if(q!==p&&!isAv(q)){const tx=q.set.text,sf=q.set.surf;q.set=JSON.parse(JSON.stringify(p.set));q.set.text=tx;if(sf==='photo'&&q.img)q.set.surf='photo';else if(q.set.surf==='photo'&&!q.img)q.set.surf='white';if(isHlP(p))q.set.tsize=sameLetters(p.set,q.set)}
      rememberPost(p);refresh();toast(isHlP(p)?'настройки раскатаны на все обложки':'настройки раскатаны на все посты',()=>{posts.forEach((q,k)=>{if(before[k])q.set=before[k]});refresh()})};tl.appendChild(ro)}
  top.appendChild(tl);
  top.del=circ('×',false,()=>{if(posts[i].link||(i>0&&posts[i-1].link)){if(posts[i].link)toggleLink(i);if(i>0&&posts[i-1].link)toggleLink(i-1)}const gone=posts.splice(i,1)[0];SEL={post:Math.max(0,i-1),el:'bg'};refresh();toast('пост убран',()=>{posts.splice(i,0,gone);refresh()})},'удалить пост','del2');
  // bottom: background ··· rings, logo
  const bottom=mk('dbot'),bl=mk('dgrp');
  if(isMe(p))swatchRow(bl,[['dark',SHOW.dark,'чёрный фон'],['pink',SHOW.pink,'розовый фон'],['yellow',SHOW.yellow,'жёлтый фон']],p.set.show,v=>set('show',v));
  else swatchRow(bl,[['white','#ffffff','белый фон'],['pink','#ff00d0','розовый фон'],['dark','#141414','тёмный фон'],['photo',p.img?`center/cover url(${p.url})`:'repeating-linear-gradient(45deg,#e4e1db 0 4px,#f4f2ef 4px 8px)','фото']],p.set.surf,
    v=>{if(v==='photo'&&(!p.img||p.set.surf==='photo')){pendingPost=i;document.getElementById('file').click();return}set('surf',v)});
  if(p.img&&!isMe(p)){const ph=bl.querySelector('.sws').lastChild;ph.title=p.set.surf==='photo'?'заменить фото':'фото';ph.setAttribute('aria-label',ph.title);}
  const br=mk('dgrp');if(!isAv(p))br.append(circ('т',p.set.textOn!==false,()=>{p.set.textOn=p.set.textOn===false;SEL={post:i,el:p.set.textOn?'text':'bg',editing:p.set.textOn};rememberPost(p);refresh()},'текст'));br.append(circ('◎',p.set.rings,()=>{gset(i,'rings',!p.set.rings);SEL={post:i,el:p.set.rings?'rings':'bg'};rememberPost(p);refresh()},'кольца'));
  // highlight covers carry only a word: no logo there
  if(!isHlP(p))br.append(circ('(б)',p.set.logo,()=>{p.set.logo=!p.set.logo;SEL={post:i,el:p.set.logo?'logo':'bg'};rememberPost(p);refresh()},'лого','lg'));
  bottom.append(bl,br);
  // left: tools of the selected element, at its height
  let left=null;const E_=SEL.el;
  if(E_==='bg'&&isMe(p)){left=mk('dleft');for(const k in MERCH){const b=el('button','rect'+(p.merch===k?' on':''),MERCH[k].label);b.setAttribute('aria-pressed',p.merch===k);b.onclick=()=>{p.merch=k;save();refresh()};left.appendChild(b)}}
  if(E_==='bg'&&p.img&&p.set.surf==='photo'){left=mk('dleft lab');left.append(ico('zoom',knob('масштаб фото',p.set.pz||0,v=>{gset(i,'pz',v);paint()},done)))}
  if(E_==='text'){left=mk('dleft');left.append(circ('↑',p.set.tpos==='top',()=>set('tpos','top'),'текст вверх'),circ('•',p.set.tpos==='mid',()=>set('tpos','mid'),'текст по центру'),circ('↓',p.set.tpos==='bottom',()=>set('tpos','bottom'),'текст вниз'),ico('size',knob('размер текста',p.set.tsize,v=>{p.set.tsize=v;paint()},done)))}
  if(E_==='logo'){left=mk('dleft');const k=LOGOS.find(l=>l.id===p.set.lkind)||LOGOS[0],cols=LCOLS.filter(c=>c[0]!=='auto'&&(c[0]!=='two'||!k.lines)&&!(p.set.surf==='white'&&c[0]==='white')&&!(p.set.surf==='pink'&&(c[0]==='pink'||c[0]==='two'))&&!(p.set.surf==='dark'&&c[0]==='dark'));
    const sw=mk('sws col');swatchRow(sw,cols,p.set.lcolor==='auto'?(p.set.surf==='white'||p.set.surf==='dark'?'pink':'white'):p.set.lcolor,v=>set('lcolor',v));left.appendChild(sw);
    const sel=el('select');sel.setAttribute('aria-label','вид лого');for(const l of LOGOS){const o=el('option');o.value=l.id;o.textContent=l.label.replace(/\n/g,' ');if(l.id===p.set.lkind)o.selected=true;sel.appendChild(o)}
    sel.onchange=()=>{if(LOGOS.find(l=>l.id===sel.value).lines&&p.set.lcolor==='two')p.set.lcolor='auto';set('lkind',sel.value)};left.appendChild(sel);
    left.append(ico('size',knob('размер лого',p.set.lsize,v=>{p.set.lsize=v;paint()},done)))}
  if(E_==='rings'){left=mk('dleft lab');const H=hitsOf(p.set),h=hitOf(p);
    const rg=p.set.surf==='pink'?'#ffe100':'#ff00d0',rc=mk('sws');
    if(isMe(p)){const cur=h.color===false?'no':p.set.rgrad||'pink',ring=c=>`repeating-radial-gradient(circle,${c} 0 2px,#fff 2px 4px)`;
      for(const[v,css,t]of[['pink',ring('#ff00d0'),'розовые кольца'],['yellow',ring('#ffe100'),'жёлтые кольца'],['no','repeating-radial-gradient(circle,#fff 0 2px,#d8d5cf 2px 3px,#fff 3px 4px)','только искажение']])
        rc.appendChild(swatch(v,cur,css,()=>{H.forEach(q=>q.color=v!=='no');if(v!=='no')p.set.rgrad=v;rememberPost(p);refresh()},t))}else
    rc.append(swatch(true,h.color!==false,`repeating-radial-gradient(circle,${rg} 0 2px,#fff 2px 4px)`,()=>{H.forEach(q=>q.color=true);rememberPost(p);refresh()},'кольца в цвете'),
      swatch(false,h.color!==false,'repeating-radial-gradient(circle,#fff 0 2px,#d8d5cf 2px 3px,#fff 3px 4px)',()=>{H.forEach(q=>q.color=false);rememberPost(p);refresh()},'только искажение'));
    left.append(ico('count',knob('сколько колец',h.count??5/17,v=>{h.count=v;paint()},done)),ico('gap',knob('размер колец и колотушки',h.step??h.rsize??.45,v=>{h.step=v;paint()},done)),ico('warp',knob('сила искажения',h.warp??.2,v=>{h.warp=v;paint()},done)),rc,el('i','gap'),stickCtl(h,()=>{h.stick=!h.stick;rememberPost(p);refresh()},paint,done));
    if(h.stick){const sc=mk('sws wrap'),cur=stickGrad(h,p.set.surf);for(const k of stickOpts(p.set.surf))sc.appendChild(swatch(k,cur,SGR[k],()=>{H.forEach(q=>q.sgrad=k);rememberPost(p);refresh()},'цвет колотушки'));left.append(sc)}
    left.append(el('i','gap'));
    if(H.length<6)left.append(lab('ещё удар',circ('+',false,()=>{H.push({cx:Math.min(grpOf(i).n-.15,Math.max(.15,h.cx+((h.cx-grpOf(i).k)>.5?-.3:.3))),cy:Math.min(.85,Math.max(.15,h.cy+(h.cy>.5?-.22:.22))),step:h.step??h.rsize,count:h.count,warp:h.warp,color:h.color,sgrad:h.sgrad,stick:true,at:Math.round(Math.min(CLIP-.2,tNow())*20)/20,dir:h.dir});SEL.hit=H.length-1;rememberPost(p);refresh()},'ещё удар')));
    left.append(lab('убрать удар',circ('×',false,()=>delHit(p,i),'убрать этот удар')))}
  return{top,bottom,left}}
// lock between post i and i+1: joined, the right one takes the left one's background, photo and hits
function toggleLink(i){const g=grpOf(i);
  if(posts[i].link){posts[i].link=false;const o=posts[g.a],off=i+1-g.a,r=posts[i+1];
    r.set.hits=hitsOf(o.set).map(h=>Object.assign({},h,{cx:h.cx-off}));r.pan=[...o.pan];r.img=o.img;r.url=o.url;r.pid=o.pid;r.set.surf=o.set.surf;r.set.rings=o.set.rings}
  else posts[i].link=true;
  refresh()}
let animOn=false,tlHead=null;
// by default: stopped on the last frame (the still picture), plays once, the wave stays
let playing=false,looping=false,pausedAt=CLIP-1e-3,playStart=performance.now();
const tRaw=()=>playing?(performance.now()-playStart)/1000:pausedAt;
const tNow=()=>{const t=tRaw();return looping?t%CLIP:Math.min(t,CLIP-1e-3)};
function seek(t){t=Math.min(CLIP-1e-3,Math.max(0,t));if(playing)playStart=performance.now()-t*1000;else pausedAt=t;if(tlHead)tlHead.style.left=t/CLIP*100+'%'}
function togglePlay(){if(playing){pausedAt=tNow();playing=false}else{const t=!looping&&pausedAt>=CLIP-.01?0:pausedAt;playStart=performance.now()-t*1000;playing=true}refresh()}
// timeline under the active post, inside its width: play, loop, then the track
// track: press or drag on it moves the playhead; drag a mark to move that hit; double click adds a hit there
function timeline(p,i){const H=p.set.rings?hitsOf(p.set):[],w=el('div','tline'),tr=el('div','ttrack');
  const pb=el('button','circ'+(playing?' on':''));pb.title=playing?'пауза (пробел)':'играть (пробел)';pb.setAttribute('aria-label',pb.title);
  pb.innerHTML=playing?'<svg viewBox="0 0 20 20"><rect x="5" y="4" width="3.5" height="12"/><rect x="11.5" y="4" width="3.5" height="12"/></svg>':'<svg viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z"/></svg>';
  pb.onclick=togglePlay;
  // touching the timeline pauses playback (without rebuilding, so the drag keeps going)
  const hold=()=>{if(!playing)return;pausedAt=tNow();playing=false;pb.classList.remove('on');pb.title='играть (пробел)';pb.setAttribute('aria-label',pb.title);pb.innerHTML='<svg viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z"/></svg>'};
  const lb=el('button','circ'+(looping?' on':''));lb.title=looping?'по кругу':'один раз';lb.setAttribute('aria-label','играть по кругу');lb.setAttribute('aria-pressed',looping);
  lb.innerHTML='<svg viewBox="0 0 20 20"><path d="M15.5 8A6 6 0 1 0 16 12" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M17.5 4v5h-5z" stroke="none"/></svg>';
  lb.onclick=()=>{const t=tNow();looping=!looping;seek(t);refresh()};
  const go=p.set.wave==='go',wb=el('button','circ'+(go?' on':''));wb.title=go?'волна уходит за край':'волна остаётся картинкой';wb.setAttribute('aria-label','волна уходит за край');wb.setAttribute('aria-pressed',go);
  wb.innerHTML='<svg viewBox="0 0 20 20" style="fill:none;stroke-width:1.6"><circle cx="10" cy="10" r="8"/><circle cx="10" cy="10" r="5"/>'+(go?'':'<circle cx="10" cy="10" r="2"/>')+'</svg>';
  wb.onclick=()=>{gset(i,'wave',go?'stay':'go');rememberPost(p);refresh()};
  // clip length, seconds — shared by linked posts
  const du=el('input','tdur');du.type='number';du.min=1;du.max=20;du.step=.5;du.value=CLIP;du.title='длительность, секунды';du.setAttribute('aria-label',du.title);
  du.onchange=()=>{const v=Math.min(20,Math.max(1,+du.value||5));gset(i,'dur',v);rememberPost(p);refresh()};
  const dw=el('label','tdw');dw.append(du);
  w.append(pb,lb,wb,tr,dw);tr.title='тащи — перемотка; двойной клик — удар в этот момент';
  for(let k=0;k<=CLIP;k++){const tk=el('b','ttick');tk.style.left=k/CLIP*100+'%';tr.appendChild(tk)}
  const head=el('i','thead');head.style.left=tNow()/CLIP*100+'%';tr.appendChild(head);tlHead=head;
  const atX=(e,r)=>Math.min(CLIP-.2,Math.max(0,(e.clientX-r.left)/r.width*CLIP)),snap=v=>Math.round(v*20)/20;
  H.forEach((h,k)=>{const m=el('button','tmark'+(SEL.el==='rings'&&(SEL.hit|0)===k?' on':''));m.style.left=hitAt(h,k)/CLIP*100+'%';m.title=`удар ${k+1}`;m.setAttribute('aria-label',`удар ${k+1}, ${hitAt(h,k).toFixed(1)} с`);
    m.onpointerdown=e=>{e.stopPropagation();hold();const r=tr.getBoundingClientRect();m.setPointerCapture(e.pointerId);
      m.onpointermove=ev=>{h.at=snap(atX(ev,r));m.style.left=h.at/CLIP*100+'%'};
      m.onpointerup=()=>{m.onpointermove=null;if(h.at==null)h.at=hitAt(h,k);SEL={post:i,el:'rings',hit:k};rememberPost(p);refresh()}};
    m.onkeydown=e=>{const d={ArrowLeft:-.1,ArrowRight:.1}[e.key];if(d){e.preventDefault();h.at=Math.min(CLIP-.2,Math.max(0,Math.round((hitAt(h,k)+d)*10)/10));m.style.left=h.at/CLIP*100+'%';rememberPost(p)}};
    tr.appendChild(m)});
  let scrub=false;
  tr.onpointerdown=e=>{if(e.target.closest('.tmark'))return;hold();scrub=true;tr.setPointerCapture(e.pointerId);seek(atX(e,tr.getBoundingClientRect()))};
  tr.onpointermove=e=>{if(scrub)seek(atX(e,tr.getBoundingClientRect()))};
  tr.onpointerup=()=>{scrub=false};
  tr.ondblclick=e=>{if(e.target.closest('.tmark'))return;const at=snap(atX(e,tr.getBoundingClientRect()));
    if(!p.set.rings){gset(i,'rings',true);const h0=hitsOf(p.set)[0];h0.at=at;h0.stick=true;SEL={post:i,el:'rings',hit:0}}
    else if(H.length<6){const b=H[H.length-1],g=grpOf(i);H.push({cx:Math.min(g.n-.15,Math.max(.15,b.cx+((b.cx-g.k)>.5?-.3:.3))),cy:Math.min(.85,Math.max(.15,b.cy+(b.cy>.5?-.22:.22))),step:b.step??b.rsize,count:b.count,warp:b.warp,color:b.color,sgrad:b.sgrad,stick:true,dir:b.dir,at});SEL={post:i,el:'rings',hit:H.length-1}}
    rememberPost(p);refresh()};
  return w}
function animTick(){if(!S.move||S.tab!=='post'){animOn=false;return}
  if(playing&&!looping&&tRaw()>=CLIP){pausedAt=CLIP-1e-3;playing=false;refresh()}   // played once: stop on the last frame
  if(!document.hidden&&!dragging()){const g=grpOf(Math.min(SEL.post,posts.length-1));for(let j=g.a;j<g.a+g.n;j++)cardPaint[j]&&cardPaint[j]();if(tlHead)tlHead.style.left=tNow()/CLIP*100+'%'}
  requestAnimationFrame(animTick)}
const dragging=()=>!!document.querySelector('.ov:active');
function startAnim(){if(S.move&&!animOn&&posts.length){animOn=true;requestAnimationFrame(animTick)}}
// avatar preview: how it looks in the instagram app — profile header and a comment
let igCanv=[],igHl=[];
const asTab=(k,f)=>{const t0=S.tab;S.tab=k;try{return f()}finally{S.tab=t0}};
// the account's real feed (saved from instagram into ig/) fills the grid after the posts made here
const IGFEED=PAGE==='merch'?[]:Array.from({length:9},(_,k)=>{const im=new Image();im.src=`ig/ig-${k+1}.jpg`;return im});
const coverDraw=(x,im,w,h)=>{const sc=Math.max(w/im.naturalWidth,h/im.naturalHeight);x.drawImage(im,(w-im.naturalWidth*sc)/2,(h-im.naturalHeight*sc)/2,im.naturalWidth*sc,im.naturalHeight*sc)};
// which screen the phone shows: 0 profile, 1 publication, 2 story; it follows what is being edited, the user can still flip it
let igSlide=1,igCtx=null,igLive=null,lastPost=0;
const igContext=()=>S.tab==='avatar'?0:S.postFmt==='9:16'?2:1;
function igGo(k,animate=true){igSlide=Math.min(2,Math.max(0,k));const t=document.querySelector('.igtrack');if(!t)return;
  t.classList.toggle('still',!animate);t.style.transform=`translateX(${-igSlide*100/3}%)`;
  document.querySelectorAll('.igdotsnav button').forEach((b,i)=>{b.classList.toggle('on',i===igSlide);b.setAttribute('aria-pressed',i===igSlide)})}
// puts a rendered post onto the publication and the story; called on every frame while the post is being played or edited
function drawLive(p,img,u){if(!igLive)return;const{post,story,prog}=igLive;
  const cover=(c,fit)=>{const x=c.getContext('2d'),sc=Math[fit](c.width/img.width,c.height/img.height),w=img.width*sc,h=img.height*sc;x.drawImage(img,(c.width-w)/2,(c.height-h)/2,w,h)};
  cover(post,'max');
  const x=story.getContext('2d');x.fillStyle={white:'#ffffff',pink:'#ff00d0'}[ownerOf(p).set.surf]||'#141414';x.fillRect(0,0,story.width,story.height);cover(story,'min');
  story.parentElement.classList.toggle('light',ownerOf(p).set.surf==='white');
  prog.style.width=(u==null?100:u*100)+'%'}
function igPreview(){const ph=el('div','igs');igCanv=[];
  const av=sz=>{const c=el('canvas','igav');c.width=c.height=Math.round(sz*dpr());c.style.width=c.style.height=sz+'px';igCanv.push(c);return c};
  ph.innerHTML='<div class="igsb"><b>12:01</b><span>5G ▮</span></div><div class="ighd c"><span>‹</span><b>barabannaja</b><span></span></div>';
  const top=el('div','igtop');top.appendChild(av(86));
  const st=el('div','igst');st.innerHTML='<div class="igun">( барабанная ) <span>⋯</span></div><div class="ignums"><div><b>742</b>posts</div><div><b>1,160</b>followers</div><div><b>990</b>following</div></div>';top.appendChild(st);ph.appendChild(top);
  const bio=el('div','igbio');bio.innerHTML='<b>барабанная мастерская петра атапина</b><br>🍃 ЭКО бубны из ткани 👍 Ручная работа 👑 Более 10 лет в профессии 🚗 Доставка по России<div class="iglink">🔗 t.me/liza_mpr</div>';ph.appendChild(bio);
  const bt=el('div','igbt');bt.innerHTML='<span>Following ⌄</span><span>Message</span><span class="sq">+</span>';ph.appendChild(bt);
  // highlights: the covers made on the highlight tab
  const stories=el('div','igstories');igHl=[];
  const HL=hlsOf();HL.forEach((q,k)=>{const s_=el('div','igstory'),c=el('canvas');c.width=c.height=Math.round(64*dpr());
    asTab('avatar',()=>c.getContext('2d').drawImage(renderPost(q,c.width,c.height),0,0));igHl.push(c);s_.appendChild(c);s_.appendChild(el('span','',(q.title||'').length>9?(q.title||'').slice(0,8)+'…':q.title||''));stories.appendChild(s_)});
  ph.appendChild(stories);
  // the profile grid as instagram shows it now: tabs (posts / reels / tagged), 3 columns of 4:5 tiles, 2 px gaps
  const tabs=el('div','igtabs');tabs.innerHTML='<i class="on"><svg viewBox="0 0 24 24"><path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z"/></svg></i><i><svg viewBox="0 0 24 24" class="ol"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M10 8.5v7l5.5-3.5z"/></svg></i><i><svg viewBox="0 0 24 24" class="ol"><rect x="3.5" y="4.5" width="17" height="16" rx="4"/><circle cx="12" cy="11" r="3"/><path d="M7 19c1-3 3-4 5-4s4 1 5 4M9 4.5l3-2 3 2"/></svg></i>';
  ph.appendChild(tabs);
  // a linked run is one carousel: only its first slide shows in the grid
  const grid=el('div','iggrid');const PL0=listOf('post'),PS=PL0.filter((p,i)=>!(i>0&&PL0[i-1].link)).reverse(),isCar=p=>!!p.link;const t0=S.tab;S.tab='post';   // take the list before switching the tab   // the grid: newest post first (like instagram), then the account's real feed
  try{for(let k=0;k<9;k++){const c=el('canvas'),tw=Math.round(122*dpr()),th=Math.round(152*dpr());c.width=tw;c.height=th;const x=c.getContext('2d'),q=PS[k];
    if(q){const[W0,H0]=FMTWH[S.postFmt]||FMTWH['4:5'],sc=Math.max(tw/W0,th/H0),r=renderPost(q,Math.round(W0*sc),Math.round(H0*sc));x.drawImage(r,(tw-r.width)/2,(th-r.height)/2);
      if(isCar(q)){const u=tw/24;x.fillStyle='#fff';x.globalAlpha=.95;x.beginPath();x.roundRect(tw-u*7,u*2.4,u*4,u*4,u*.8);x.fill();x.strokeStyle='#fff';x.lineWidth=u*.7;x.beginPath();x.roundRect(tw-u*8.4,u*3.8,u*4,u*4,u*.8);x.stroke();x.globalAlpha=1}}   // carousel mark, like instagram
    else{x.fillStyle='#f1f1f1';x.fillRect(0,0,tw,th);const im=IGFEED[k-PS.length];if(im){if(im.complete&&im.naturalWidth)coverDraw(x,im,tw,th);else im.addEventListener('load',()=>coverDraw(x,im,tw,th),{once:true})}}
    grid.appendChild(c)}}finally{S.tab=t0}
  ph.appendChild(grid);
  // second screen: a post and the comments under it
  const ph2=el('div','igs');ph2.innerHTML='<div class="igsb"><b>12:01</b><span>5G ▮</span></div><div class="ighd"><span>‹</span><b>Публикации</b><span></span></div>';
  const au=el('div','igau');au.appendChild(av(30));au.appendChild(el('b','','barabannaja'));au.appendChild(el('span','igdots','⋯'));ph2.appendChild(au);
  const PL=listOf('post');if(S.tab==='post')lastPost=SEL.post|0;
  const pp=PL[Math.min(lastPost,PL.length-1)],[W0,H0]=FMTWH[S.postFmt]||FMTWH['4:5'],pw=366;
  // the feed never shows anything taller than 4:5: a story is cropped there
  const pc=el('canvas','igpost'),pr=Math.min(H0/W0,1.25);pc.width=Math.round(pw*dpr());pc.height=Math.round(pw*pr*dpr());
  ph2.appendChild(pc);
  ph2.appendChild(el('div','igacts','♡  💬  ➤'));
  // caption under the post, in their voice, about drums
  const cap=el('div','igcap');cap.innerHTML='<b>Нравится: 48</b><div><b>barabannaja</b> Мастер-класс в субботу: делаем бубен своими руками 🥁 Обод из дерева, натуральная кожа, ручная оплётка — к вечеру у вас свой инструмент и первый ритм… <span class="igmore">ещё</span></div><div class="igmeta">Смотреть все комментарии (12)</div>';ph2.appendChild(cap);
  const cms=el('div','igcms');
  const com=(mine,name,text,meta)=>{const r=el('div','igcm');if(mine)r.appendChild(av(28));else{const g=el('i','iggray');r.appendChild(g)}const t=el('div');t.innerHTML=`<b>${name}</b> ${text}<div class="igmeta">${meta}</div>`;r.appendChild(t);cms.appendChild(r)};
  com(false,'masha.k','а с детьми можно?','1 ч · ответить');
  com(true,'barabannaja','конечно, с 7 лет 🥁','58 мин · ответить');
  ph2.appendChild(cms);
  // third screen: the story
  const ph3=el('div','igs igst3');ph3.innerHTML='<div class="igsb"><b>12:01</b><span>5G ▮</span></div>';
  const media=el('div','igmedia'),sc=el('canvas');sc.width=Math.round(pw*dpr());sc.height=Math.round(pw*16/9*dpr());media.appendChild(sc);
  const bar=el('div','igbar'),prog=el('i');bar.appendChild(prog);media.appendChild(bar);
  const who=el('div','igwho');who.appendChild(av(32));who.appendChild(el('b','','barabannaja'));who.appendChild(el('span','','2 ч'));who.appendChild(el('span','igx','×'));media.appendChild(who);ph3.appendChild(media);
  const rp=el('div','igreply');rp.innerHTML='<span>Отправить сообщение</span><i>♡</i><i>➤</i>';ph3.appendChild(rp);
  igLive={post:pc,story:sc,prog};
  if(pp)asTab('post',()=>drawLive(pp,renderPost(pp,Math.round(pw*dpr()),Math.round(pw*H0/W0*dpr())),null));
  // one phone, three screens side by side
  const track=el('div','igtrack');track.append(ph,ph2,ph3);const phone=el('div','igph');phone.appendChild(track);
  const wrap=el('div','igcard'),w1=el('div','igwrap');w1.appendChild(phone);wrap.appendChild(w1);
  const dots=el('div','igdotsnav');['профиль','пост','сторис'].forEach((n,k)=>{const b=el('button','',n);b.onclick=()=>igGo(k);dots.appendChild(b)});
  dots.onkeydown=e=>{const d={ArrowLeft:-1,ArrowRight:1}[e.key];if(d){e.preventDefault();igGo(igSlide+d);dots.children[igSlide].focus()}};
  wrap.appendChild(dots);
  // flipping: drag sideways, or a sideways wheel
  let x0=null,dx=0;phone.onpointerdown=e=>{if(e.button)return;x0=e.clientX;dx=0;phone.setPointerCapture(e.pointerId)};
  phone.onpointermove=e=>{if(x0==null)return;dx=e.clientX-x0;track.classList.add('still');track.style.transform=`translateX(calc(${-igSlide*100/3}% + ${dx/igK()}px))`};
  phone.onpointerup=phone.onpointercancel=()=>{if(x0==null)return;x0=null;const w=390*igK();igGo(igSlide+(dx<-w*.15?1:dx>w*.15?-1:0))};
  let lock=0;phone.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;e.preventDefault();if(Date.now()<lock||Math.abs(e.deltaX)<8)return;lock=Date.now()+500;igGo(igSlide+(e.deltaX>0?1:-1))},{passive:false});
  const ap=avatarOf();if(ap)drawIg(asTab('avatar',()=>renderPost(ap,400,400)));
  return wrap}
// the phone is as tall as the window allows
const igK=()=>Math.max(.45,Math.min(.95,(innerHeight-60-16-64)/844));
// instagram preview: a panel that slides in from the right; the eye button is pinned to the right edge
function renderPanel(){let pn=document.getElementById('igpanel'),eye=document.getElementById('igeye');if(!eye){document.body.style.setProperty('--pv','0px');return}   // no phone on the merch page

  if(!pn){pn=el('div','igpanel');pn.id='igpanel';document.body.appendChild(pn);eye.onclick=()=>{S.eye=!S.eye;save();renderPanel()}}
  const on=!!S.eye&&isEd();eye.classList.toggle('on',on);eye.title=on?'спрятать превью инстаграма':'превью в инстаграме';eye.setAttribute('aria-label',eye.title);eye.setAttribute('aria-pressed',on);
  pn.classList.toggle('on',on);document.body.style.setProperty('--pv',on?Math.round(390*igK()+40)+'px':'0px');document.body.style.setProperty('--igk',igK());
  const c=igContext();if(c!==igCtx){igCtx=c;igSlide=c}
  pn.innerHTML='';igLive=null;if(on){pn.appendChild(igPreview());igGo(igSlide,false)}}
let igLast=null;
function drawIg(img){igLast=img;for(const c of igCanv){const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height)}}
function layoutPosts(){
  cardH=Math.max(260,Math.min(innerHeight-60-260,560));row.innerHTML='';
  if(S.tab==='avatar')cardH=Math.min(cardH,440);   // avatar and covers: several in view
  if(SEL.post>=posts.length)SEL={post:Math.max(0,posts.length-1),el:'bg'};
  syncGroups();cardPaint.length=0;{const o=CLIP;CLIP=durOf(posts[Math.min(SEL.post,posts.length-1)]);if(!playing&&pausedAt>=o-.01)pausedAt=CLIP-1e-3}setTimeout(startAnim,0);
  posts.forEach((p,i)=>{const c=postCard(p,i);row.appendChild(c);
    if(i<posts.length-1&&S.tab==='post'){const on=!!p.link,b=el('button','lock'+(on?' on':''));b.title=on?'разъединить посты':'объединить с соседним: общий фон, фото и удары';b.setAttribute('aria-label',b.title);b.setAttribute('aria-pressed',on);
      b.innerHTML=`<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="${on?'M8 11V8a4 4 0 0 1 8 0v3':'M8 11V8a4 4 0 0 1 7.5-2'}"/></svg>`;
      b.onclick=()=>toggleLink(i);c.querySelector('.pic').appendChild(b)}});
  const[W,H]=postDims(),add=el('div','card'),tile=el('button','plus',posts.length?'+':'+<span>новый пост</span>');
  tile.style.height=cardH+'px';tile.style.width=Math.round(cardH*W/H)+'px';tile.title=S.tab==='merch'?'новая вещь':'новый пост — фото можно перетащить сюда';
  tile.onclick=()=>addNew(S.tab);add.appendChild(tile);row.appendChild(add);renderPanel()}

// ───────── side panel ─────────
const panel=document.getElementById('panel');
function sec(title,right){const s=el('div','sec');s.appendChild(el('div','lab','<span>'+title+'</span>'+(right?'<span>'+right+'</span>':'')));panel.appendChild(s);return s}
function chips(p,opts,val,on,cls=''){const w=el('div','chips '+cls);for(const[v,l]of opts){const b=el('button',v===val?'on':'');b.textContent=l;if(cls==='dir'&&DIRNAME[v]!=null)b.title=DIRNAME[v];b.onclick=()=>{on(v);save();build();layout()};w.appendChild(b)}p.appendChild(w)}
function range(p,val,on){const r=el('input');r.type='range';r.min=0;r.max=1;r.step=.01;r.value=val;r.oninput=()=>{on(+r.value);save();drawAvatar()};p.appendChild(r)}
function check(p,label,val,on){const l=el('label','chk'),c=el('input');c.type='checkbox';c.checked=val;c.onchange=()=>{on(c.checked);save();build();layout()};l.append(c,document.createTextNode(label));p.appendChild(l)}
function build(){
  const T=document.getElementById('tabs');T.innerHTML='';
  for(const[k,l]of[['post','пост'],['avatar','профиль']]){const b=el('button',k===S.tab?'on':'',l);b.onclick=()=>setTab(k);T.appendChild(b)}
  panel.innerHTML='';
  if(S.tab==='avatar'){
    panel.appendChild(el('div','note','аватар и обложки хайлайтов — квадраты 1080×1080, в инстаграме круги. название хайлайта — под обложкой'));
  }else if(S.tab==='post'){
    chips(sec('формат'),[['4:5','4:5'],['1:1','1:1'],['9:16','сторис']],S.postFmt,v=>S.postFmt=v);
    
    panel.appendChild(el('div','note','кликни по элементу на посте — рядом появятся его настройки. текст пишется прямо на посте. лого и кольца тащи мышью'));
    document.getElementById('hint').textContent='';
  }else{
    chips(sec('формат'),Object.entries(FMTS),S.logo.fmt,v=>S.logo.fmt=v);
    panel.appendChild(el('div','note','цвет, вид лого, место и размер — под каждым фото. тяни фото мышью, чтобы выбрать кадр'));
    document.getElementById('hint').textContent='';
  }
  document.getElementById('rnd').style.display='none';
  document.getElementById('png').textContent=isEd()?'скачать все png':'скачать все фото';
  const va=document.getElementById('pngall');va.textContent=S.tab==='avatar'?'скачать mp4':'скачать все mp4';va.style.display=S.tab==='post'&&posts.length?'block':'none';
  document.getElementById('png').style.display=(S.tab==='logo'&&!photos.length)||(isEd()&&!posts.length)?'none':'block';
}
function labelize(){document.querySelectorAll('button[title],input[title],canvas[title]').forEach(e=>{if(!e.getAttribute('aria-label'))e.setAttribute('aria-label',e.title)})}
const DIRNAME={'-135':'влево вверх','-90':'вверх','-50':'вправо вверх','180':'влево','0':'вправо','135':'влево вниз','90':'вниз','45':'вправо вниз'};
function layout(){ROWS.post=rowPost;ROWS.avatar=rowProfile;ROWS.merch=rowMerch;row=ROWS[S.tab]||rowPost;
  document.getElementById('hint').style.display='none';
  layoutPosts();for(const k of SECS)if(k!==S.tab)layoutStatic(k);heads();
  document.querySelectorAll('.tbnav a').forEach(a=>a.classList.toggle('on',a.dataset.k===S.tab));labelize()}
// new post / cover / thing; from a closed section it opens that section first
function addNew(k){if(S.tab!==k)setTab(k);posts.push(k==='merch'?makeMerch('back',{rings:true,logo:true}):k==='avatar'?makeHl('новое',posts.length):newPost());SEL={post:posts.length-1,el:'bg'};refresh();setTimeout(()=>row.scrollTo({left:row.scrollWidth,behavior:'smooth'}),100)}
// the section that is not being edited: still pictures; a click opens it in the editor
function layoutStatic(k){const r=ROWS[k];r.innerHTML='';const L=listOf(k),[W,H]=asTab(k,()=>postDims());
  const h=k==='avatar'?Math.min(Math.max(260,Math.min(innerHeight-60-260,560)),440):Math.max(260,Math.min(innerHeight-60-260,560)),w=Math.round(h*W/H);
  L.forEach((p,i)=>{const c=el('div','card static'),pic=el('div','pic'),cv_=el('canvas');cv_.style.width=w+'px';cv_.style.height=h+'px';cv_.width=Math.round(w*dpr());cv_.height=Math.round(h*dpr());
    asTab(k,()=>cv_.getContext('2d').drawImage((isMe(p)?merchImage:renderPost)(p,cv_.width,cv_.height),0,0));pic.appendChild(cv_);if(isMe(p))pic.appendChild(el('div','hltitle avlabel',MERCH[p.merch].label));
    if(k==='avatar'){pic.appendChild(el('div','amask'));pic.appendChild(el('div','hltitle avlabel',isAv(p)?'аватар':p.title||''))}
    c.title='открыть';c.appendChild(pic);c.onclick=()=>{setTab(k);SEL={post:i,el:'bg'};refresh()};r.appendChild(c)});
  const add=el('div','card'),tile=el('button','plus','+');tile.style.height=h+'px';tile.style.width=w+'px';tile.title={post:'новый пост',avatar:'новая обложка',merch:'новая вещь'}[k];tile.onclick=()=>addNew(k);add.appendChild(tile);r.appendChild(add)}
// section heads: format and downloads, each next to its own row
function heads(){const nil=el('div'),hp=document.getElementById('hdpost')||nil,ha=document.getElementById('hdavatar')||nil,hm=document.getElementById('hdmerch')||nil;hp.innerHTML='';ha.innerHTML='';hm.innerHTML='';
  const fmt=el('div','chips');for(const[v,l]of[['4:5','4:5'],['1:1','1:1'],['9:16','сторис']]){const b=el('button',v===S.postFmt?'on':'',l);b.onclick=()=>{S.postFmt=v;save();layout()};fmt.appendChild(b)}
  const dl=(k,label,id)=>{const b=el('button','rect',label);b.onclick=()=>{if(S.tab!==k)setTab(k);document.getElementById(id).click()};return b};
  hp.append(fmt,el('i','sp'),dl('post','скачать все png','png'),dl('post','скачать все mp4','pngall'));
  ha.append(el('i','sp'),dl('avatar','скачать все png','png'));
  hm.append(el('i','sp'),dl('merch','скачать все принты','png'))}

document.getElementById('rnd').onclick=()=>{const A=S.avatar;A.cx=.36+Math.random()*.26;A.cy=.38+Math.random()*.26;A.phase=Math.random();A.dir=DIRS[(Math.random()*DIRS.length)|0][1];save();build();drawAvatar()};
document.getElementById('pngall').onclick=async()=>{const btn=document.getElementById('pngall'),label=btn.textContent,[W,H]=postDims();btn.disabled=true;
  for(let i=0;i<posts.length;i++)await saveMP4(posts[i],i,W,H,f=>btn.textContent=`пишу ${i+1} из ${posts.length}: ${Math.round(f*100)}%`);
  btn.disabled=false;btn.textContent=label;toast(`скачано видео: ${posts.length}`)};
document.getElementById('png').onclick=async()=>{
  const btn=document.getElementById('png'),label=btn.textContent,list=isEd()?posts:photos;btn.disabled=true;
  for(let i=0;i<list.length;i++){btn.textContent=`скачиваю ${i+1} из ${list.length}`;
    if(isMe(list[i])){await savePNG(printFile(list[i]),`barabannaja-${list[i].merch}-${i+1}-print-2400x3000.png`);await new Promise(r=>setTimeout(r,400));await savePNG(merchImage(list[i],1200,1500),`barabannaja-${list[i].merch}-${i+1}-mockup.png`)}
    else if(isEd()){const[W,H]=postDims().map(v=>v*2),nm=isAv(list[i])?'avatar':isHlP(list[i])?`highlight-${(list[i].title||i+1)}`:`post-${i+1}`;await savePNG(renderPost(list[i],W,H),`barabannaja-${nm}-${W}x${H}.png`)}
    else{const[W,H]=photoDims(list[i]);await savePNG(renderLogo(list[i],W,H),`barabannaja-logo-${i+1}-${W}x${H}.png`)}
    await new Promise(r=>setTimeout(r,400))}
  btn.disabled=false;btn.textContent=label;toast(`скачано: ${list.length}`)};
function takeFiles(list){const fs=[...list].filter(f=>f.type.startsWith('image/'));if(!fs.length)return;
  if(S.tab==='merch'){pendingPost=null;return}   // merch has no photos
  if(isEd()){const tgt=pendingPost??(S.tab==='avatar'?0:null);pendingPost=null;
    fs.forEach((f,k)=>{const url=URL.createObjectURL(f),im=new Image();im.onload=()=>{if(k===0&&tgt!=null&&posts[tgt]){const o=posts[grpOf(tgt).a];o.img=im;o.url=url;keepPhoto(o,f);gset(tgt,'surf','photo')}
      else if(S.tab==='avatar'){const q=makeHl('новое',posts.length);q.img=im;q.url=url;q.set.surf='photo';keepPhoto(q,f);posts.push(q)}
      else{const q=newPost(im,url);keepPhoto(q,f);posts.push(q)}refresh()};im.src=url});return}
  if(S.tab==='avatar'){avatarPhoto=null;S.avatar.surf='photo';save()}addPhotos(fs.map(f=>URL.createObjectURL(f)));
  if(S.tab==='logo')setTimeout(()=>row.scrollTo({left:row.scrollWidth,behavior:'smooth'}),400)}
document.getElementById('file').onchange=e=>{takeFiles(e.target.files);e.target.value=''};
const drop=document.getElementById('drop');let dc=0;
addEventListener('dragenter',e=>{e.preventDefault();dc++;drop.classList.add('on')});
addEventListener('dragleave',()=>{if(--dc<=0){dc=0;drop.classList.remove('on')}});
addEventListener('dragover',e=>e.preventDefault());
addEventListener('drop',e=>{e.preventDefault();dc=0;drop.classList.remove('on');const c=e.target.closest&&e.target.closest('.card[data-i]');if(c&&isEd())pendingPost=+c.dataset.i;takeFiles(e.dataTransfer.files)});
addEventListener('resize',layout);
// click outside the post (or Esc) drops the selection, to look at the post clean
const unselect=()=>{if(!isEd()||SEL.el==null)return;const t=document.activeElement;if(t&&t.classList.contains('ontext'))t.blur();SEL={post:SEL.post,el:null};refresh()};
// anywhere on the page outside the posts and their tools (the side gaps, under the rows, section heads)
addEventListener('pointerdown',e=>{if(!e.target.closest('.pic,button,input,select,textarea,a,.igpanel,.topbar,#toast'))unselect()});
addEventListener('keydown',e=>{if(e.code==='Space'&&S.move&&S.tab==='post'&&!e.target.closest('textarea,input,select,button')){e.preventDefault();togglePlay()}});   // space = play / pause
addEventListener('keydown',e=>{if(e.key==='Escape'&&!(document.activeElement&&document.activeElement.classList.contains('ontext')))unselect()});
// saved posts; the first time, the master-class example
if(PAGE==='merch'){S.tab='merch';posts.push(...newList('merch'))}
else{if(location.hash==='#merch')location.replace('merch.html');
  if(S.tab==='merch')S.tab='post';posts.push(...newList('post'));
  if(location.hash==='#preview')S.eye=true;if(location.hash==='#profile')S.tab='avatar';if(location.hash==='#posts')S.tab='post';
  if(S.tab==='avatar'||S.tab==='hl'){S.tab='post';setTab('avatar')}}   // reopened on the avatar tab
function brand(){const c=document.getElementById('brand'),d=dpr();c.width=120*d;c.height=24*d;const x=c.getContext('2d');x.scale(d,d);Wave.logo(x,42,12,18,'#ff00d0',null,1)}
function tbLogo(){const c=document.getElementById('tbLogo'),d=dpr();c.width=90*d;c.height=28*d;c.style.width='90px';c.style.height='28px';const x=c.getContext('2d');x.scale(d,d);Wave.logo(x,42,14,20,'#ff00d0',null,1)}
Promise.all(['400 40px Ubuntu','400 40px "JetBrains Mono"','500 40px Unbounded','500 40px Comfortaa','400 40px "PT Serif"'].map(f=>document.fonts.load(f,'(б)'))).catch(()=>{}).then(()=>{brand();tbLogo();build();layout();renderPanel()});
ready=true;if(PAGE!=='merch')prunePhotos();build();layout();
