console.log("zura");
const C=document.getElementById("c");
const X=C.getContext("2d");
const ov=document.getElementById("ov");
const tt=document.getElementById("tt");
const tx=document.getElementById("tx");
const scEl=document.getElementById("sc");
const ouEl=document.getElementById("ou");
let W=800,H=480,play=0,sc=0,ou=0,t=0,sp=0,P,E,G,F,mx=0,my=0;
function hud(){scEl.textContent=sc;ouEl.textContent=ou}
function reset(){sc=ou=t=sp=0;P={x:W/2,y:H/2,f:0,cd:0};E=[];G=[];F=[];hud()}
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[(a.length*Math.random())|0]}
function fit(){W=Math.min(innerWidth-16,900)|0;H=Math.min(innerHeight-140,W*0.58)|0;C.width=W;C.height=H}
fit();
function spawn(){var bald=Math.random()<0.48;var s=pick(["l","r","t","b"]);var v=40+Math.min(70,t*3);var x,y,vx,vy;if(s==="l"){x=-20;y=rnd(40,H-40);vx=v;vy=rnd(-20,20)}if(s==="r"){x=W+20;y=rnd(40,H-40);vx=-v;vy=rnd(-20,20)}if(s==="t"){x=rnd(40,W-40);y=-20;vx=rnd(-20,20);vy=v}if(s==="b"){x=rnd(40,W-40);y=H+20;vx=rnd(-20,20);vy=-v}E.push({x:x,y:y,vx:vx,vy:vy,r:18,bald:bald,on:0,hair:pick(["#2b1d12","#4a2e14","#1a1a1a"])})}
function throwW(){if(!play||P.cd>0)return;G.push({x:P.x+Math.cos(P.f)*22,y:P.y+Math.sin(P.f)*22,vx:Math.cos(P.f)*320,vy:Math.sin(P.f)*320,life:0.45});P.cd=0.28}
function boom(x,y,s,ok){F.push({x:x,y:y,s:s,ok:ok,t:0})}
function fail(why){ou++;hud();if(ou>=3){play=0;tt.textContent="アウト";tx.textContent="スコア "+sc+" / "+why;document.getElementById("go").textContent="もう一回";ov.classList.remove("hide")}}
function stepPlayer(dt){P.cd=Math.max(0,P.cd-dt);if(mx||my){var n=Math.hypot(mx,my);P.f=Math.atan2(my,mx);P.x+=(mx/n)*180*dt;P.y+=(my/n)*180*dt}P.x=Math.max(20,Math.min(W-20,P.x));P.y=Math.max(20,Math.min(H-20,P.y))}
function stepMove(dt){var i;for(i=0;i<E.length;i++){E[i].x+=E[i].vx*dt;E[i].y+=E[i].vy*dt}for(i=0;i<G.length;i++){G[i].x+=G[i].vx*dt;G[i].y+=G[i].vy*dt;G[i].life-=dt}}
// next
function applyWig(){return}
function near(x,y){var best=null,bd=40,i,e,d;for(i=0;i<E.length;i++){e=E[i];d=Math.hypot(x-e.x,y-e.y);if(d<bd){bd=d;best=e}}return best}
function tryZura(){if(!play||!P)return;var e=near(P.x+Math.cos(P.f)*28,P.y+Math.sin(P.f)*28);if(!e)return;if(e.on)return;if(e.bald){e.on=1;sc++;hud();boom(e.x,e.y-24,"OK",1)}else{boom(e.x,e.y-24,"NG",0);fail("髪があるのに被せた")}}
function leave(){var keep=[],i,e,gone;for(i=0;i<E.length;i++){e=E[i];gone=e.x<-40||e.x>W+40||e.y<-40||e.y>H+40;if(gone){if(e.bald&&!e.on)fail("逃した")}else keep.push(e)}E=keep}
function tick(dt){if(!play)return;t+=dt;sp-=dt;if(sp<=0&&E.length<7){spawn();sp=Math.max(0.55,1.3-t*0.03)}stepPlayer(dt);stepMove(dt);leave();var i;for(i=0;i<F.length;i++)F[i].t+=dt;F=F.filter(function(p){return p.t<0.8})}
function face(e){X.save();X.translate(e.x,e.y);X.fillStyle="#c9a27a";X.beginPath();X.arc(0,4,11,0,6.3);X.fill();X.fillStyle="#e6c8a8";X.beginPath();X.arc(0,-4,13,0,6.3);X.fill();if(e.bald&&!e.on){X.fillStyle="rgba(255,255,255,0.55)";X.beginPath();X.ellipse(-3,-8,5,3,-0.5,0,6.3);X.fill()}else{X.fillStyle=e.on?"#3a2416":e.hair;X.beginPath();X.ellipse(0,-10,14,9,0,3.14,0);X.fill()}X.fillStyle="#2a2018";X.beginPath();X.arc(-4,-3,1.4,0,6.3);X.fill();X.beginPath();X.arc(4,-3,1.4,0,6.3);X.fill();X.restore()}
function draw(){X.clearRect(0,0,W,H)}
function paint(){var i;if(P){X.save();X.translate(P.x,P.y);X.rotate(P.f);X.fillStyle="#e8b84a";X.beginPath();X.arc(0,0,16,0,6.3);X.fill();X.fillStyle="#1a1714";X.fillRect(10,-3,10,6);X.restore()}for(i=0;i<E.length;i++)face(E[i])}
function floats(){var i,p;for(i=0;i<F.length;i++){p=F[i];X.globalAlpha=1-p.t/0.8;X.fillStyle=p.ok?"#7cbc6a":"#e85d4a";X.font="bold 16px sans-serif";X.textAlign="center";X.fillText(p.s,p.x,p.y-p.t*20);X.globalAlpha=1}}
var last=performance.now();
function loop(now){var dt=Math.min(0.033,(now-last)/1000);last=now;tick(dt);draw();paint();floats();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
function hold(id,ax,ay){var el=document.getElementById(id);el.onpointerdown=function(ev){ev.preventDefault();mx=ax;my=ay;if(P)P.f=Math.atan2(ay,ax)};el.onpointerup=function(){mx=0;my=0};el.onpointerleave=function(){mx=0;my=0}}
hold("bU",0,-1);hold("bD",0,1);hold("bL",-1,0);hold("bR",1,0);
document.getElementById("bZ").onclick=function(){tryZura()};
C.onpointerdown=function(ev){if(!play||!P)return;var r=C.getBoundingClientRect();P.f=Math.atan2(ev.clientY-r.top-P.y,ev.clientX-r.left-P.x);tryZura()};
document.getElementById("go").onclick=function(){ov.classList.add("hide");reset();play=1};
