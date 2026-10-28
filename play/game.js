/* Heart Rush. Vanilla Canvas; all score/state lives only in page memory. */
'use strict';
(() => {
  const copy = {
    en: {
      skip:'Skip to game',home:'Back to the project ↗',eyebrow:'A LITTLE REFLEX. A LOT OF HEART.',lead:'30 seconds. Catch the hearts. Dodge the trouble. Make your own high score.',mascotLabel:'YOUR HEART-CATCHING SIDEKICK',heart:'Heart',star:'Star',obstacle:'Obstacle',
      instructions:'Move with ← → or A / D. Mouse: move over the arena. Touch: drag in the arena or hold the arrow buttons. Space / P: pause. F: fullscreen; Esc: leave.',focusNote:'Keyboard player? Tab to the game, then use the arrow keys. You can pause at any time.',score:'Score',time:'Time',best:'Session best',readyEyebrow:'30 SECONDS. ALL HEART.',readyTitle:'Ready for\nthe rush?',readyBody:'Pink hearts, golden stars, a little trouble. Your sidekick is ready.',loading:'Loading mascot…',start:'Start 30-second rush ↗',onlyPoints:'Just game points. Nothing to buy or earn.',pausedEyebrow:'ON PAUSE',pausedTitle:'Take a breath.',pausedBody:'The timer is paused. Pick up right where you left off.',resume:'Keep playing',endedEyebrow:"TIME'S UP!",endedTitle:'That was\nall heart.',yourScore:'Your score',again:'Play again ↗',pause:'Pause',accessNote:'Focus the arena to play with the keyboard. Item scores and the final result are announced. This is a visual reflex game.',trust:'GAME POINTS ONLY · NO MONETARY REWARDS',prototype:'SEXY Coin remains a local prototype. No Mainnet token, sale or wallet connection.',privacy:"No accounts, cookies or analytics. Scores stay in this page's memory and reset on reload. GitHub Pages logs IP addresses for hosting security.",risks:'Project risk disclosure ↗',mascot:'Approved pink-haired SEXY Coin mascot',left:'Move left',right:'Move right',fullscreen:'Toggle fullscreen',arena:'Heart Rush game arena. Move left and right to catch falling items.',summary:'{hearts} hearts · {stars} stars · {hits} obstacles',started:'Round started. 30 seconds. Focus the arena and move left or right.',paused:'Game paused.',resumed:'Game resumed.',ended:'Time is up. Score: {score}. Play again with the replay button or R.',event:'{item}, {value} points. Score: {score}.',timeLeft:'{seconds} seconds left.',loadError:'Mascot unavailable. Reload to try again.'
    },
    tr: {
      skip:'Oyuna geç',home:'Projeye geri dön ↗',eyebrow:'BİRAZ REFLEKS. BOLCA KALP.',lead:'30 saniye. Kalpleri yakala. Engellerden kaç. Kendi yüksek puanını yap.',mascotLabel:'KALP YAKALAYAN OYUN ARKADAŞIN',heart:'Kalp',star:'Yıldız',obstacle:'Engel',
      instructions:'← → veya A / D ile hareket et. Fare: oyun alanında gezdir. Dokunmatik: alanda sürükle veya ok düğmelerini basılı tut. Boşluk / P: duraklat. F: tam ekran; Esc: çık.',focusNote:'Klavye ile mi oynuyorsun? Tab ile oyun alanına geç, sonra ok tuşlarını kullan. İstediğin zaman duraklatabilirsin.',score:'Puan',time:'Süre',best:'Oturum rekoru',readyEyebrow:'30 SANİYE. BOLCA KALP.',readyTitle:'Kalpleri yakalamaya\nhazır mısın?',readyBody:'Pembe kalpler, altın yıldızlar ve birkaç engel. Oyun arkadaşın hazır.',loading:'Maskot yükleniyor…',start:'30 saniyelik oyunu başlat ↗',onlyPoints:'Yalnız oyun puanı. Alım veya kazanç yok.',pausedEyebrow:'DURAKLATILDI',pausedTitle:'Bir nefes al.',pausedBody:'Sayaç durdu. Kaldığın yerden devam edebilirsin.',resume:'Oyuna devam et',endedEyebrow:'SÜRE DOLDU!',endedTitle:'Kalpler tamam,\ntur tamam.',yourScore:'Puanın',again:'Tekrar oyna ↗',pause:'Duraklat',accessNote:'Klavye ile oynamak için oyun alanına odaklan. Nesne puanları ve sonuç ekran okuyucuya bildirilir. Bu, görsel bir refleks oyunudur.',trust:'YALNIZ OYUN PUANI · PARASAL ÖDÜL YOK',prototype:'SEXY Coin hâlâ yerel bir prototiptir. Mainnet tokenı, satış veya cüzdan bağlantısı yoktur.',privacy:'Hesap, çerez veya analitik yoktur. Puanlar yalnız bu sayfanın belleğindedir; yenileyince sıfırlanır. GitHub Pages güvenlik için IP adreslerini kaydeder.',risks:'Projenin risk açıklaması ↗',mascot:'Onaylı pembe saçlı SEXY Coin maskotu',left:'Sola hareket et',right:'Sağa hareket et',fullscreen:'Tam ekranı aç veya kapat',arena:'Heart Rush oyun alanı. Düşen nesneleri yakalamak için sağa ve sola hareket et.',summary:'{hearts} kalp · {stars} yıldız · {hits} engel',started:'Tur başladı. 30 saniye. Oyun alanına odaklan ve sağa veya sola hareket et.',paused:'Oyun duraklatıldı.',resumed:'Oyun devam ediyor.',ended:'Süre doldu. Puan: {score}. Tekrar düğmesiyle veya R ile yeni tur başlat.',event:'{item}, {value} puan. Toplam: {score}.',timeLeft:'{seconds} saniye kaldı.',loadError:'Maskot yüklenemedi. Sayfayı yenileyerek tekrar dene.'
    }
  };
  const $ = selector => document.querySelector(selector);
  const canvas=$('#field'),ctx=canvas.getContext('2d',{alpha:false}),card=$('#game-card');
  const WORLD={w:720,h:900},VALUES={heart:10,star:25,obstacle:-10};
  const params=new URLSearchParams(location.search),seedParam=params.get('seed');
  let language=params.get('lang')==='tr'?'tr':'en',sessionBest=null,assetsReady=false,portrait=null,manualClock=false,lastFrame=performance.now(),visualTime=0;
  let rng=Math.random,entityId=0,hudCache='',lastEvent=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const input={left:false,right:false,button:0,target:null,kind:'keyboard'};
  const state={mode:'ready',remaining:30,score:0,player:{x:360,y:800,w:128,h:104},entities:[],particles:[],popups:[],counts:{hearts:0,stars:0,hits:0},spawnClock:0,elapsed:0,hitFlash:0,announced:30};
  const t=(key,values={})=>copy[language][key].replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??''));
  const announce=message=>{$('#announcer').textContent=message;};
  function randomSeed(){return crypto.getRandomValues(new Uint32Array(1))[0];}
  function seeded(seed){return()=>{let a=seed+=0x6D2B79F5;a=Math.imul(a^a>>>15,a|1);a^=a+Math.imul(a^a>>>7,a|61);return((a^a>>>14)>>>0)/4294967296;};}
  function clearInput(){input.left=input.right=false;input.button=0;input.target=null;for(const id of ['#left-btn','#right-btn'])$(id).classList.remove('active');}
  function setLanguage(lang){
    if(!copy[lang])return;language=lang;document.documentElement.lang=lang;
    for(const node of document.querySelectorAll('[data-copy]'))node.textContent=t(node.dataset.copy);
    for(const node of document.querySelectorAll('[data-aria]'))node.setAttribute('aria-label',t(node.dataset.aria));
    for(const node of document.querySelectorAll('[data-alt]'))node.alt=t(node.dataset.alt);
    for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===lang));
    canvas.setAttribute('aria-label',t('arena'));$('.language').setAttribute('aria-label',lang==='tr'?'Dil':'Language');
    $('.move-buttons').setAttribute('aria-label',lang==='tr'?'Hareket':'Move');$('.legend').setAttribute('aria-label',lang==='tr'?'Puan kuralları':'Scoring');
    document.title=lang==='tr'?'SEXY HEART RUSH · Ücretsiz mini oyun':'SEXY HEART RUSH · Free arcade game';
    document.querySelector('meta[name="description"]').content=lang==='tr'?'SEXY HEART RUSH: ücretsiz 30 saniyelik refleks oyunu. Yalnız oyun puanı; token veya parasal ödül yok.':'SEXY HEART RUSH: a free 30-second arcade game. Catch hearts and stars. Just game points, no tokens or monetary rewards.';
    for(const link of document.querySelectorAll('.brand,.home-link'))link.href=lang==='tr'?'../?lang=tr':'../';
    $('.footer a').href=lang==='tr'?'../?lang=tr#risk':'../#risk';
    hudCache='';updateHud();
  }
  function updateHud(){
    const shown=Math.max(0,state.remaining).toFixed(1),key=[shown,state.score,sessionBest,state.mode,language].join('|');
    if(key===hudCache)return;hudCache=key;
    $('#score').textContent=state.score;$('#timer').replaceChildren(document.createTextNode(shown),Object.assign(document.createElement('span'),{textContent:'s'}));
    $('#best').textContent=sessionBest===null?'—':sessionBest;
    $('.timer-block').classList.toggle('urgent',state.remaining<=5&&state.mode!=='ready');
    $('#pause-btn').disabled=!['running','paused'].includes(state.mode);
    $('#pause-btn').textContent=t(state.mode==='paused'?'resume':'pause');
    $('#final-score').textContent=state.score;$('#round-summary').textContent=t('summary',state.counts);
  }
  function overlay(mode){
    $('#overlay').hidden=mode==='running';
    for(const name of ['ready','paused','ended'])$('#'+name+'-panel').hidden=mode!==name;
    updateHud();
  }
  function start(){
    if(!assetsReady)return;
    Object.assign(state,{mode:'running',remaining:30,score:0,entities:[],particles:[],popups:[],counts:{hearts:0,stars:0,hits:0},spawnClock:.2,elapsed:0,hitFlash:0,announced:30});
    state.player.x=360;entityId=0;lastEvent=null;clearInput();manualClock=false;
    const seed=seedParam!==null&&/^\d{1,10}$/.test(seedParam)?Number(seedParam)>>>0:randomSeed();rng=seeded(seed);
    lastFrame=performance.now();overlay('running');canvas.focus();announce(t('started'));render();
  }
  function pause(){if(state.mode!=='running')return;state.mode='paused';clearInput();overlay('paused');$('#resume-btn').focus();announce(t('paused'));}
  function resume(){if(state.mode!=='paused')return;state.mode='running';lastFrame=performance.now();overlay('running');canvas.focus();announce(t('resumed'));}
  function finish(){
    if(state.mode!=='running')return;state.remaining=0;state.mode='ended';clearInput();
    sessionBest=sessionBest===null?state.score:Math.max(sessionBest,state.score);overlay('ended');$('#replay-btn').focus();announce(t('ended',{score:state.score}));
  }
  function spawn(){
    const chance=rng(),type=chance<.64?'heart':chance<.83?'star':'obstacle';
    state.entities.push({id:++entityId,type,x:44+rng()*632,y:-35,r:type==='obstacle'?24:23,vy:205+rng()*95+state.elapsed*2,phase:rng()*Math.PI*2});
  }
  function collect(item){
    state.score+=VALUES[item.type];state.counts[item.type==='heart'?'hearts':item.type==='star'?'stars':'hits']++;
    if(item.type==='obstacle')state.hitFlash=.28;
    lastEvent={id:item.id,type:item.type,value:VALUES[item.type],score:state.score,at:Number(state.elapsed.toFixed(3))};
    state.popups.push({x:item.x,y:item.y,text:(VALUES[item.type]>0?'+':'')+VALUES[item.type],life:.75,type:item.type});
    if(!reduced.matches)for(let i=0;i<10;i++){
      const a=rng()*Math.PI*2,speed=70+rng()*135;
      state.particles.push({x:item.x,y:item.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:.45+rng()*.2,type:item.type});
    }
    announce(t('event',{item:t(item.type),value:VALUES[item.type],score:state.score}));
  }
  function update(dt){
    state.remaining=Math.max(0,state.remaining-dt);state.elapsed=30-state.remaining;
    const direction=Number(input.right)-Number(input.left)||input.button;
    if(direction){state.player.x+=direction*600*dt;input.target=null;}
    else if(input.target!==null){const delta=input.target-state.player.x;state.player.x+=Math.sign(delta)*Math.min(Math.abs(delta),1500*dt);}
    state.player.x=Math.max(74,Math.min(646,state.player.x));
    state.spawnClock+=dt;const interval=.50-.12*(state.elapsed/30);
    while(state.spawnClock>=interval){state.spawnClock-=interval;spawn();}
    state.hitFlash=Math.max(0,state.hitFlash-dt);
    state.entities=state.entities.filter(item=>{
      const oldY=item.y;item.y+=item.vy*dt;
      const hitX=Math.abs(item.x-state.player.x)<state.player.w/2+item.r*.7;
      const hitY=item.y+item.r>=state.player.y-state.player.h/2&&oldY-item.r<=state.player.y+state.player.h/2;
      if(hitX&&hitY){collect(item);return false;}
      return item.y-item.r<WORLD.h;
    });
    for(const p of state.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=180*dt;p.life-=dt;}
    state.particles=state.particles.filter(p=>p.life>0);
    for(const p of state.popups){p.y-=75*dt;p.life-=dt;}state.popups=state.popups.filter(p=>p.life>0);
    const seconds=Math.ceil(state.remaining);
    if((seconds===10||seconds===5)&&seconds!==state.announced){state.announced=seconds;announce(t('timeLeft',{seconds}));}
    if(state.remaining<=1e-8)finish();
  }
  function simulate(ms){
    let seconds=Math.min(Math.max(0,Number(ms)||0)/1000,state.remaining);
    while(seconds>1e-9&&state.mode==='running'){const dt=Math.min(seconds,1/120,state.remaining);update(dt);seconds-=dt;}
    updateHud();
  }
  function heart(x,y,r,color='#ff4cbd'){
    ctx.save();ctx.translate(x,y);ctx.scale(r/22,r/22);ctx.beginPath();ctx.moveTo(0,20);ctx.bezierCurveTo(-43,-7,-20,-32,0,-13);ctx.bezierCurveTo(20,-32,43,-7,0,20);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#ff9cdd';ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
  }
  function drawStar(x,y,r){
    ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rad=i%2?r*.45:r;const px=x+Math.cos(a)*rad,py=y+Math.sin(a)*rad;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fillStyle='#edbd73';ctx.fill();ctx.strokeStyle='#ffe4b3';ctx.lineWidth=2;ctx.stroke();
  }
  function render(){
    const scale=canvas.width/WORLD.w;ctx.setTransform(scale,0,0,scale,0,0);
    const gradient=ctx.createLinearGradient(0,0,720,900);gradient.addColorStop(0,'#211130');gradient.addColorStop(.55,'#291137');gradient.addColorStop(1,'#150f24');ctx.fillStyle=gradient;ctx.fillRect(0,0,720,900);
    const glow=ctx.createRadialGradient(370,400,20,370,400,500);glow.addColorStop(0,'#68204b45');glow.addColorStop(1,'#22113000');ctx.fillStyle=glow;ctx.fillRect(0,0,720,900);
    for(let i=0;i<42;i++){
      const x=(i*137+45)%720,y=(i*193+30)%900,alpha=reduced.matches?.20:.13+.16*(1+Math.sin(visualTime*.6+i))/2;
      ctx.fillStyle=`rgba(210,178,235,${alpha})`;ctx.fillRect(x,y,i%7===0?3:2,i%7===0?3:2);
    }
    ctx.strokeStyle='#b79aff12';ctx.lineWidth=1;
    for(let y=80;y<900;y+=90){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(720,y);ctx.stroke();}
    ctx.strokeStyle='#edbd7333';ctx.setLineDash([4,12]);for(const x of [19,701]){ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,880);ctx.stroke();}ctx.setLineDash([]);
    ctx.save();ctx.translate(360,190);ctx.rotate(-.10);ctx.font='800 85px "Segoe UI",Arial';ctx.textAlign='center';ctx.fillStyle='#ffffff05';ctx.fillText('HEART RUSH',0,0);ctx.restore();
    for(const item of state.entities){
      ctx.save();ctx.translate(item.x,item.y);ctx.rotate(Math.sin(visualTime*2+item.phase)*.18);ctx.shadowBlur=reduced.matches?0:13;ctx.shadowColor=item.type==='heart'?'#ff4cbd88':item.type==='star'?'#edbd7388':'#b79aff66';
      if(item.type==='heart')heart(0,0,item.r);
      else if(item.type==='star')drawStar(0,0,item.r+2);
      else{
        ctx.beginPath();for(let k=0;k<16;k++){const a=k*Math.PI/8,rad=k%2?19:27;k?ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad):ctx.moveTo(rad,0);}ctx.closePath();ctx.fillStyle='#5b3a77';ctx.fill();ctx.strokeStyle='#d4b5ed';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#f8f4fb';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-7,-7);ctx.lineTo(7,7);ctx.moveTo(7,-7);ctx.lineTo(-7,7);ctx.stroke();
      }ctx.restore();
    }
    const p=state.player;ctx.save();ctx.translate(p.x+(state.hitFlash&&!reduced.matches?Math.sin(visualTime*80)*3:0),p.y+(reduced.matches?0:Math.sin(visualTime*4)*3));
    ctx.fillStyle='#ff4cbd25';ctx.beginPath();ctx.ellipse(0,66,91,17,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#281732';ctx.strokeStyle='#b79aff';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-67,-124,134,181,26);ctx.fill();ctx.stroke();
    if(portrait)ctx.drawImage(portrait,-62,-119,124,172);
    ctx.fillStyle='#ff4cbd';ctx.beginPath();ctx.roundRect(-80,43,160,17,9);ctx.fill();ctx.strokeStyle='#ffb1e2';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-66,46);ctx.lineTo(66,46);ctx.stroke();
    ctx.fillStyle='#edbd73';ctx.font='700 13px "Segoe UI",Arial';ctx.textAlign='center';ctx.fillText('SEXY',0,79);ctx.restore();
    for(const part of state.particles){ctx.globalAlpha=Math.min(1,part.life*2);ctx.fillStyle=part.type==='star'?'#edbd73':part.type==='heart'?'#ff4cbd':'#b79aff';ctx.beginPath();ctx.arc(part.x,part.y,3,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    for(const pop of state.popups){ctx.globalAlpha=Math.min(1,pop.life*3);ctx.fillStyle=pop.type==='obstacle'?'#dbc0f4':pop.type==='star'?'#edbd73':'#ff8ed6';ctx.font='800 35px "Segoe UI",Arial';ctx.textAlign='center';ctx.fillText(pop.text,pop.x,pop.y-30);}ctx.globalAlpha=1;
    if(state.hitFlash&&!reduced.matches){ctx.fillStyle=`rgba(183,154,255,${state.hitFlash*.18})`;ctx.fillRect(0,0,720,900);}
  }
  function resize(){const width=canvas.getBoundingClientRect().width,dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.round(canvas.width*900/720);render();}
  function tick(now){const dt=Math.max(0,now-lastFrame);lastFrame=now;visualTime+=Math.min(dt,100)/1000;if(!manualClock&&state.mode==='running')simulate(dt);render();requestAnimationFrame(tick);}
  function pointToWorld(event){const rect=canvas.getBoundingClientRect();return Math.max(74,Math.min(646,(event.clientX-rect.left)*720/rect.width));}
  canvas.addEventListener('pointerdown',event=>{if(state.mode!=='running')return;event.preventDefault();canvas.focus();canvas.setPointerCapture(event.pointerId);input.target=pointToWorld(event);input.kind=event.pointerType;input.left=input.right=false;});
  canvas.addEventListener('pointermove',event=>{if(state.mode!=='running')return;if(event.pointerType==='mouse'||canvas.hasPointerCapture(event.pointerId)){input.target=pointToWorld(event);input.kind=event.pointerType;input.left=input.right=false;}});
  canvas.addEventListener('pointerup',event=>{if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);});
  for(const[id,direction]of[['#left-btn',-1],['#right-btn',1]]){
    const button=$(id);button.addEventListener('pointerdown',event=>{if(state.mode!=='running')return;event.preventDefault();button.setPointerCapture(event.pointerId);input.button=direction;input.target=null;input.kind=event.pointerType;button.classList.add('active');});
    const release=()=>{input.button=0;button.classList.remove('active');};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
    // Keyboard users can focus the visible directional buttons as well as the arena.
    button.addEventListener('keydown',e=>{if((e.code==='Space'||e.code==='Enter')&&state.mode==='running'){e.preventDefault();input.button=direction;input.target=null;button.classList.add('active');}});
    button.addEventListener('keyup',e=>{if(e.code==='Space'||e.code==='Enter')release();});button.addEventListener('blur',release);
  }
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await card.requestFullscreen();}catch{announce(language==='tr'?'Tam ekran bu tarayıcıda kullanılamıyor.':'Fullscreen is unavailable in this browser.');}}
  document.addEventListener('keydown',event=>{
    if(!card.contains(document.activeElement))return;
    if(['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(event.code)&&state.mode==='running'){event.preventDefault();input.kind='keyboard';input.target=null;if(['ArrowLeft','KeyA'].includes(event.code))input.left=true;else input.right=true;return;}
    if(event.repeat)return;
    if(event.code==='KeyF'){event.preventDefault();fullscreen();}
    else if(event.code==='Escape'){if(document.fullscreenElement)fullscreen();if(state.mode==='running')pause();}
    else if(event.code==='KeyR'&&state.mode==='ended'){event.preventDefault();start();}
    else if((event.code==='KeyP'||(event.code==='Space'&&document.activeElement===canvas))&&['running','paused'].includes(state.mode)){event.preventDefault();state.mode==='running'?pause():resume();}
    else if(event.code==='Enter'&&document.activeElement===canvas&&state.mode==='ready'){event.preventDefault();start();}
  });
  document.addEventListener('keyup',event=>{if(['ArrowLeft','KeyA'].includes(event.code))input.left=false;if(['ArrowRight','KeyD'].includes(event.code))input.right=false;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('blur',()=>{clearInput();pause();});
  document.addEventListener('fullscreenchange',()=>{resize();canvas.focus();});
  new ResizeObserver(resize).observe($('#arena'));
  for(const button of document.querySelectorAll('[data-language]'))button.addEventListener('click',()=>setLanguage(button.dataset.language));
  $('#start-btn').addEventListener('click',start);$('#replay-btn').addEventListener('click',start);$('#resume-btn').addEventListener('click',resume);
  $('#pause-btn').addEventListener('click',()=>state.mode==='running'?pause():resume());$('#fullscreen-btn').addEventListener('click',fullscreen);
  window.render_game_to_text=()=>JSON.stringify({coordinate_system:'720x900; origin top-left; +x right, +y down',mode:state.mode,language,remaining_seconds:Number(state.remaining.toFixed(3)),score:state.score,session_best:sessionBest,player:{...state.player,x:Number(state.player.x.toFixed(2))},entities:state.entities.map(e=>({id:e.id,type:e.type,x:Number(e.x.toFixed(2)),y:Number(e.y.toFixed(2)),r:e.r,vy:e.vy})),counts:state.counts,last_event:lastEvent,clock:manualClock?'manual':'realtime',assets_ready:assetsReady,input:input.kind});
  window.advanceTime=ms=>{manualClock=true;simulate(ms);visualTime+=Math.max(0,Number(ms)||0)/1000;render();};
  setLanguage(language);overlay('ready');resize();
  const image=new Image();image.onload=()=>{
    portrait=document.createElement('canvas');portrait.width=144;portrait.height=200;
    const pc=portrait.getContext('2d'),scale=image.naturalWidth/1254;pc.beginPath();pc.roundRect(0,0,144,200,22);pc.clip();
    // Proportional upper-body crop of approved pixels; not a generated character/coin icon.
    pc.drawImage(image,135*scale,12*scale,691.2*scale,960*scale,0,0,144,200);
    assetsReady=true;$('#start-btn').disabled=false;$('#start-btn').dataset.copy='start';$('#start-btn').textContent=t('start');render();
  };
  image.onerror=()=>{$('#start-btn').textContent=t('loadError');announce(t('loadError'));};image.src='../assets/mascot-768.webp';
  requestAnimationFrame(tick);
})();
