// ( ( (б) ) ) ring field — static.
// Two copies of the brand ring gradient (dense + solid at the hit, sparse + transparent outward),
// offset by less than one ring step and smeared along that offset -> the "wave" look.
// Rings are ellipses whose centre slides down as they grow (tilted membrane).
// Photos / text are remapped through the same field (UV distortion) and the gradient goes on top.
(function(){
'use strict';
const GRAD='radial-gradient(50% 50% at 50% 50%, #FF00D0 0%, rgba(255, 14, 195, 0.00) 6.25%, rgba(255, 28, 182, 0.78) 12.5%, rgba(255, 42, 169, 0.00) 18.75%, rgba(255, 56, 156, 0.59) 25%, rgba(255, 70, 143, 0.00) 31.25%, rgba(255, 84, 130, 0.42) 37.5%, rgba(255, 98, 117, 0.00) 43.75%, rgba(255, 113, 104, 0.28) 50%, rgba(255, 127, 91, 0.00) 56.25%, rgba(255, 141, 78, 0.17) 62.5%, rgba(255, 155, 65, 0.00) 68.75%, rgba(255, 169, 52, 0.09) 75%, rgba(255, 183, 39, 0.00) 81.25%, rgba(255, 197, 26, 0.03) 87.5%, rgba(255, 211, 13, 0.00) 93.75%, rgba(255, 225, 0, 0.00) 100%)';
const LN=2048;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;

function parse(css){
  const inner=css.slice(css.indexOf('(')+1,css.lastIndexOf(')'));const parts=[];let cur='',d=0;
  for(const c of inner){if(c==='(')d++;if(c===')')d--;if(c===','&&d===0){parts.push(cur);cur=''}else cur+=c}parts.push(cur);
  const stops=[];
  for(const p of parts){const m=p.trim().match(/^(#[0-9a-f]{6}|rgba?\([^)]*\))\s+([\d.]+)%$/i);if(!m)continue;
    let c,a=1;if(m[1][0]==='#'){const h=m[1].slice(1);c=[0,2,4].map(k=>parseInt(h.substr(k,2),16))}
    else{const v=m[1].slice(m[1].indexOf('(')+1,-1).split(',').map(Number);c=v.slice(0,3);if(v.length>3)a=v[3]}
    stops.push({p:+m[2]/100,c,a})}
  const R=[],A=[],F=[];for(const s of stops)if(s.a>0){R.push(s.p);A.push(s.a)}
  R.push(stops[stops.length-1].p);A.push(0);const n=R.length-1;
  for(let k=0;k<n;k++){const z=stops.find(s=>s.a===0&&s.p>R[k]&&s.p<R[k+1]);F.push(z?(z.p-R[k])/(R[k+1]-R[k]):.5)}F.push(F[n-1]);
  return{stops,R,A,F,n};
}
// yellow-only variant for pink backgrounds: yellow / transparent yellow, rings tighter at the centre, fading outward
// yellow variant for pink backgrounds: same rings as the pink one (step, count, fade), colour = yellow only
const GRAD_YELLOW=GRAD.replace(/#FF00D0/i,'#FFE100').replace(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,/g,'rgba(255, 225, 0,');
// pink-only variant for the dark background: same rings, colour = pink only
const GRAD_PINKONLY=GRAD.replace(/#FFE100/i,'#FF00D0').replace(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,/g,'rgba(255, 0, 208,');
const GRADS={pink:parse(GRAD),yellow:parse(GRAD_YELLOW),pinkonly:parse(GRAD_PINKONLY)};
let G=GRADS.pink;
// same gradient with N rings instead of 8: rings stay evenly spaced, the fade and the colour still run from the centre to the edge
function withRings(B,N){if(!N||N===B.n)return B;const ai=t=>{const q=t*B.n,i=Math.floor(q);return i>=B.n?0:B.A[i]+(B.A[i+1]-B.A[i])*(q-i)};
  const R=[],A=[],F=[];for(let j=0;j<=N;j++){R.push(j/N);A.push(j===N?0:ai(j/N));F.push(B.F[0])}return{stops:B.stops,R,A,F,n:N}}
function colorAt(r){const s=G.stops;if(r<=s[0].p)return s[0].c;for(let i=0;i<s.length-1;i++)if(r<=s[i+1].p){const f=(r-s[i].p)/Math.max(1e-9,s[i+1].p-s[i].p);return s[i].c.map((v,k)=>v+(s[i+1].c[k]-v)*f)}return s[s.length-1].c}
// premultiplied 1D gradient; phase shifts every ring outward by a fraction of a step; soft = radial smoothing
function buildLUT(phase,soft,N=8){
  const{R,A,F,n}=G,li=(arr,q,lo,hi)=>q<=0?lo(q):q>=n?hi(q):arr[Math.floor(q)]+(arr[Math.floor(q)+1]-arr[Math.floor(q)])*(q-Math.floor(q));
  const Rq=q=>li(R,q,q=>R[0]+q*(R[1]-R[0]),q=>R[n]+(q-n)*(R[n]-R[n-1])),Aq=q=>li(A,q,()=>A[0],()=>0),Fq=q=>li(F,q,()=>F[0],()=>F[n]);
  const pts=[];for(let j=-2;j<=n+1;j++){const q=j+phase;pts.push([Rq(q),Aq(q)],[Rq(q+Fq(q)),0])}
  pts.sort((a,b)=>a[0]-b[0]);for(const p of pts)p[2]=colorAt(clamp(p[0],0,1));
  const f=new Float32Array(LN*4);let s=0;
  for(let i=0;i<LN;i++){const r=i/(LN-1);while(s<pts.length-2&&pts[s+1][0]<r)s++;
    const a=pts[s],b=pts[s+1],t=clamp((r-a[0])/Math.max(1e-9,b[0]-a[0]),0,1),o=i*4;
    for(let k=0;k<3;k++)f[o+k]=a[2][k]*a[1]+(b[2][k]*b[1]-a[2][k]*a[1])*t;f[o+3]=(a[1]+(b[1]-a[1])*t)*255}
  // softness per ring stays the same whatever the count
  const w=Math.round(soft*LN*.012*8/N);const out=new Uint8Array(LN*4);
  for(let i=0;i<LN;i++)for(let k=0;k<4;k++){let sum=0,c=0;for(let j=-w;j<=w;j++){const q=i+j;if(q<0||q>=LN)continue;sum+=f[q*4+k];c++}out[i*4+k]=Math.round(sum/c)}
  return out;
}

const VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS=`precision highp float;
uniform vec2 res,c,off;uniform float R,persp,sy,blur,disp,ca,tint,bga,fr,fw,bk,ld,lb;uniform vec3 lc;uniform vec3 bgc;uniform int mode;
uniform sampler2D lut,img;uniform vec4 fit;
float rho(vec2 p,vec2 cc){vec2 s=vec2(R,R*sy);float r=length((p-cc)/s);
  for(int i=0;i<6;i++)r=length((p-cc-vec2(0.,persp*r*R))/s);return r;}
vec4 ring(vec2 p,vec2 cc){float r=rho(p,cc);
  vec4 v=r<1.&&r<fr?texture2D(lut,vec2((r*${LN-1}.+.5)/${LN}.,.5))*(1.-smoothstep(fr-fw,fr,r))*smoothstep(bk-fw,bk,r):vec4(0.);
  // ld: radius of the strong first wave running ahead of the others; lb: its strength. it is the bright centre ring of the gradient, carried outward
  if(lb>0.){float d=abs(r-ld);vec4 l=texture2D(lut,vec2((d*${LN-1}.+.5)/${LN}.,.5))*lb*(1.-smoothstep(fw*.35,fw*.55,d));l.rgb=lc*l.a;v=l+v*(1.-l.a);}   // only the one ring, not the whole pattern
  return v;}   // fr: wave front (fraction of R), rings beyond it are not there yet
vec4 field(vec2 p){vec4 acc=vec4(0.);vec2 dir=normalize(off+1e-5);
  for(int k=0;k<9;k++){vec2 q=p-dir*(float(k)/8.-.5)*blur;vec4 a=ring(q,c),b=ring(q,c+off);acc+=b+a*(1.-b.a);}
  return acc/9.;}
vec4 tex(vec2 uv){return texture2D(img,clamp(uv*fit.xy+fit.zw,0.,1.));}
void main(){
  vec2 px=vec2(gl_FragCoord.x,res.y-gl_FragCoord.y);vec4 F=field(px);
  vec3 ground=F.rgb+bgc*(1.-F.a);
  if(mode==0){gl_FragColor=bga>.5?vec4(ground,1.):F;return;}  // bga 0: rings only, premultiplied, for layering
  // UV remap through the rings: pixels are pushed along the radius by the ring profile
  // (where there are no rings nothing moves, so a photo does not jump when an animated wave ends)
  vec2 d=normalize(px-c+1e-5);float m=(bga<.5?F.a:F.a-.3*min(1.,F.a*8.))*disp*R*.07;   // layer mode: no shift where there are no rings
  vec2 o=d*m/res,uv=px/res;
  vec4 tr=tex(uv-o*(1.+ca)),tg=tex(uv-o),tb=tex(uv-o*(1.-ca));
  vec3 col;
  if(mode==1){col=vec3(tr.r,tg.g,tb.b);col=F.rgb*tint+col*(1.-F.a*tint);}
  else{if(bga<.5){gl_FragColor=vec4(tr.r*tr.a,tg.g*tg.a,tb.b*tb.a,max(tr.a,max(tg.a,tb.a)));return;}   // text only, warped, transparent: a layer over a photo
    col=vec3(mix(ground.r,tr.r,tr.a),mix(ground.g,tg.g,tg.a),mix(ground.b,tb.b,tb.a));}
  gl_FragColor=vec4(col,1.);
}`;

function make(cv){
  const gl=cv.getContext('webgl',{preserveDrawingBuffer:true,antialias:false});if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(o));return o};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const U={};for(const k of['res','c','off','R','persp','sy','blur','disp','ca','tint','bga','bgc','mode','lut','img','fit','fr','fw','bk','ld','lb','lc'])U[k]=gl.getUniformLocation(pr,k);
  const mk=()=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
    for(const[p,v]of[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,p,v);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));return t};
  const lutT=mk(),imgT=mk();let img=null,lutKey='';
  return{
    setImage(el){if(!el){img=null;return}const s=Math.min(1,4096/Math.max(el.width,el.height)),c=document.createElement('canvas');
      c.width=Math.max(1,Math.round(el.width*s));c.height=Math.max(1,Math.round(el.height*s));c.getContext('2d').drawImage(el,0,0,c.width,c.height);
      gl.bindTexture(gl.TEXTURE_2D,imgT);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);img={w:c.width,h:c.height}},
    // o: {cx,cy (frac), size (R / width), shift (frac of R), angle (deg), blur (frac of R), persp, sy, phase, soft, disp, rgb, tint, bg [r,g,b], mode 0 flat | 1 photo | 2 text-over}
    draw(o){
      const W=cv.width,H=cv.height,R=W*o.size;gl.viewport(0,0,W,H);
      const N=o.rings||8,kN=8/N,key=o.phase+'|'+o.soft+'|'+(o.grad||'pink')+'|'+N;if(key!==lutKey){G=withRings(GRADS[o.grad]||GRADS.pink,N);gl.bindTexture(gl.TEXTURE_2D,lutT);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,LN,1,0,gl.RGBA,gl.UNSIGNED_BYTE,buildLUT(o.phase,o.soft,N));lutKey=key}
      const a=o.angle*Math.PI/180;
      gl.uniform2f(U.res,W,H);gl.uniform2f(U.c,o.cx*W,o.cy*H);gl.uniform2f(U.off,Math.cos(a)*o.shift*R*kN,Math.sin(a)*o.shift*R*kN);
      gl.uniform1f(U.R,R);gl.uniform1f(U.persp,o.persp);gl.uniform1f(U.sy,o.sy);gl.uniform1f(U.blur,o.blur*R*kN);
      gl.uniform1f(U.disp,o.disp*kN);gl.uniform1f(U.fr,o.front??9);gl.uniform1f(U.bk,o.back??-9);gl.uniform1f(U.ld,o.lead??-9);gl.uniform1f(U.lb,o.leadBoost??0);gl.uniform3f(U.lc,...(o.leadColor||[1,140/255,40/255]));gl.uniform1f(U.fw,(o.frontSoft??1)/N);gl.uniform1f(U.ca,o.rgb);gl.uniform1f(U.tint,o.tint);gl.uniform3f(U.bgc,...o.bg);gl.uniform1f(U.bga,o.transparent?0:1);
      const mode=img?o.mode:0;gl.uniform1i(U.mode,mode);
      let sx=1,sy=1;if(img){const ca=W/H,ia=img.w/img.h;if(ia>ca)sx=ca/ia;else sy=ia/ca;const z=o.zoom||1;sx/=z;sy/=z}const pn=o.pan||[0,0];gl.uniform4f(U.fit,sx,sy,(1-sx)*(.5+pn[0]),(1-sy)*(.5+pn[1]));   // pan: -.5..+.5 inside the cover crop
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,lutT);gl.uniform1i(U.lut,0);
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,imgT);gl.uniform1i(U.img,1);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }};
}

// the stick (колотушка): ONE shape (head + handle), one gradient along it, progressive blur:
// sharp at the head, more and more blurred toward the far end of the handle.
const STICK_GRADS={
  white:['#ffffff','rgba(255,255,255,0)'],
  orange:['#ffffff','rgba(255,140,40,0)'],
  pinkyellow:['#ff00d0','rgba(255,225,0,0)'],
  pinkorange:['#ff00d0','rgba(255,140,40,0)'],
  whiteyellow:['#ffffff','rgba(255,225,0,0)'],
  pink:['#ff00d0','rgba(255,0,208,0)'],
  dark:['#141414','rgba(20,20,20,0)'],
};
const tmp=[0,1,2].map(()=>document.createElement('canvas'));
function stick(ctx,W,H,o){
  ctx.clearRect(0,0,W,H);if(!o.on)return;
  const a=o.angle*Math.PI/180,ux=Math.cos(a),uy=Math.sin(a);
  const sc=o.scale||1,U=o.unit||W,hs=U*.12*sc,hw=U*.042*sc,maxB=U*(o.blur??.045)*sc;   // unit: the post width when one stick spans linked posts
  // the stick is drawn on a canvas bigger than the frame, so the blur never meets the frame edge
  const PAD=Math.ceil(maxB*3+hs),CW=W+2*PAD,CH=H+2*PAD,hx=o.cx*W+PAD,hy=o.cy*H+PAD;
  // length: fixed (1.5 frame widths), so the gradient and the blur along the handle look the same wherever the hit is;
  // longer only if the frame edge is even further away
  let L=1e9;const fx=hx-PAD,fy=hy-PAD;if(ux>1e-6)L=Math.min(L,(W-fx)/ux);if(ux<-1e-6)L=Math.min(L,-fx/ux);if(uy>1e-6)L=Math.min(L,(H-fy)/uy);if(uy<-1e-6)L=Math.min(L,-fy/uy);
  L=Math.max(L+U*.12,U*1.5);
  for(const c of tmp){if(c.width!==CW||c.height!==CH){c.width=CW;c.height=CH}}
  const[shape,band,out]=tmp.map(c=>c.getContext('2d'));
  const[c0,c1]=STICK_GRADS[o.grad]||STICK_GRADS.white;
  shape.clearRect(0,0,CW,CH);shape.save();shape.translate(hx,hy);shape.rotate(a);
  const g=shape.createLinearGradient(-hs*.5,0,L,0);g.addColorStop(0,c0);g.addColorStop(1,c1);
  shape.fillStyle=g;shape.beginPath();
  shape.roundRect(-hs*.5,-hs*.5,hs,hs,hs*.26);
  shape.roundRect(hs*.2,-hw/2,L-hs*.2,hw,hw/2);
  shape.fill('nonzero');shape.restore();
  // progressive blur: blurred copies weighted by overlapping tents along the axis (they sum to 1)
  out.clearRect(0,0,CW,CH);
  const N=10,t0=-hs*.5,t1=L,pos=i=>t0+(t1-t0)*i/N,P=t=>[hx+ux*t,hy+uy*t];
  for(let i=0;i<=N;i++){
    const b=maxB*Math.pow(i/N,1.15);
    band.globalCompositeOperation='source-over';band.clearRect(0,0,CW,CH);band.filter=b>.3?`blur(${b}px)`:'none';band.drawImage(tmp[0],0,0);band.filter='none';
    const lo=i===0?pos(0)-W*2:pos(i-1),mid=pos(i),hi=i===N?pos(N)+W*2:pos(i+1);
    const[x0,y0]=P(lo),[x1,y1]=P(hi),gm=band.createLinearGradient(x0,y0,x1,y1),m=(mid-lo)/(hi-lo);
    gm.addColorStop(0,i===0?'#000':'rgba(0,0,0,0)');gm.addColorStop(m,'#000');gm.addColorStop(1,i===N?'#000':'rgba(0,0,0,0)');
    band.globalCompositeOperation='destination-in';band.fillStyle=gm;band.fillRect(0,0,CW,CH);
    out.globalCompositeOperation='lighter';out.drawImage(tmp[1],0,0);
  }
  out.globalCompositeOperation='source-over';
  ctx.drawImage(tmp[2],-PAD,-PAD);
}
// logo  (   (  ( (б) )  )   ) — no transparency. Gaps grow outward: 1, 2, 3 spaces.
// Main version: one colour. Optional accent: brackets alternate colour/accent outward (like the two offset ring layers).
// rule: the closer to (б), the fewer spaces — pair k (from inside) sits k spaces further out. level = number of pairs.
const LOGO_LV=n=>Array.from({length:n},(_,k)=>k+1);
function logo(ctx,cx,cy,size,color,accent,level=3,family='Ubuntu',weight=400,core='б'){
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${weight} ${size}px ${family}`;
  const wb=ctx.measureText(core).width,bw=ctx.measureText('(').width,sp=ctx.measureText(' ').width;
  // core is ( б ) (or a whole word: ( ( барабанная ) )) — spaces inside too, so the brackets read as the rim of the drum
  // one colour:  (   (  ( ( б ) )  )   )      — pair k sits k spaces further out
  // two colours: ((  (( (( б )) ))  ))        — every bracket doubled; the outer one of each double (farther from б) is the accent
  // doubled brackets exist ONLY in two colours: same/no accent -> plain one-colour logo
  if(!accent||accent.toLowerCase()===String(color).toLowerCase())accent=null;
  let x=wb/2+sp+bw/2;const marks=[[x,color]];if(accent)marks.push([x+bw,accent]);
  for(const n of LOGO_LV(level)){x+=(accent?bw:0)+bw+n*sp;marks.push([x,color]);if(accent)marks.push([x+bw,accent])}
  for(let k=marks.length-1;k>=0;k--){const[mx,c]=marks[k];ctx.fillStyle=c;ctx.fillText('(',cx-mx,cy);ctx.fillText(')',cx+mx,cy)}
  ctx.fillStyle=color;ctx.fillText(core,cx,cy);
  ctx.restore();
}
// full width of the logo at a given size (for fitting)
function logoWidth(ctx,size,level=3,twoColour=false,family='Ubuntu',weight=400,core='б'){ctx.save();ctx.font=`${weight} ${size}px ${family}`;
  const wb=ctx.measureText(core).width,bw=ctx.measureText('(').width,sp=ctx.measureText(' ').width;ctx.restore();
  let x=wb/2+sp+bw/2+(twoColour?bw:0);for(const n of LOGO_LV(level))x+=(twoColour?bw:0)+bw+n*sp;return 2*x+bw}
window.Wave={make,stick,STICK_GRADS,logo,logoWidth,LOGO_LV};
})();
