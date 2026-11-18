/* Celebrate completed actions only after successful API responses. */
const arcadeFetch=window.fetch.bind(window);
window.fetch=async(url,options={})=>{
 const response=await arcadeFetch(url,options);
 if(!response.ok||typeof url!=='string'||options.method!=='POST')return response;
 try{
  const body=JSON.parse(options.body||'{}');
  if(url==='/api/match'){
   const data=await response.clone().json();
   setTimeout(()=>arcadeNotice('SCAN COMPLETE',`${data.candidates.length} possible ${data.candidates.length===1?'match':'matches'} found`),250);
  }else if(url==='/api/profile'){
   setTimeout(()=>arcadeNotice('PLAYER READY','Your explorer name is saved.'),250);
  }else if(url==='/api/animals'){
   const animal=await response.clone().json();
   setTimeout(()=>arcadeCelebrate({title:'NEW FRIEND!',points:'+60 XP',text:`${animal.nickname} joined the neighborhood files. First sighting logged.`,icon:'★',type:'discovery'}),300);
  }else if(/^\/api\/animals\/\d+\/events$/.test(url)){
   const saved=await response.clone().json();
   const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(explorer.key));
   const id=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
   const day=new Date(body.happened_at).toISOString().slice(0,10);
   const matching=(saved.events||[]).filter(e=>e.kind===body.kind&&e.contributor_id===id&&e.happened_at.slice(0,10)===day);
   const earned=matching.length===1;
   const feeding=body.kind==='feeding';
   setTimeout(()=>arcadeCelebrate({title:feeding?'CARE LOGGED!':'SIGHTING SAVED!',points:earned?(feeding?'+20 XP':'+10 XP'):'NICE WORK!',text:earned?(feeding?'Your feeding report is in the shared log.':'Your sighting was added to the shared memory.'):'Your report is saved. This activity already earned XP for this animal today.',icon:feeding?'♥':'✦',type:feeding?'feeding':'sighting'}),300);
  }
 }catch{ /* Effects never interfere with the saved action. */ }
 return response;
};
function arcadeNotice(title,message){
 document.querySelector('.arcade-notice')?.remove();
 const el=document.createElement('div');el.className='arcade-notice';el.setAttribute('role','status');
 const strong=document.createElement('strong'),span=document.createElement('span');strong.textContent=title;span.textContent=message;el.append(strong,span);document.body.append(el);setTimeout(()=>el.remove(),3800);
}
function arcadeCelebrate({title,points,text,icon,type}){
 document.querySelector('.arcade-overlay')?.remove();const previous=document.activeElement;
 const overlay=document.createElement('div');overlay.className=`arcade-overlay arcade-${type}`;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','arcade-title');
 overlay.innerHTML=`<div class="arcade-sparkles" aria-hidden="true">${Array.from({length:16},(_,i)=>`<i style="--x:${(i*37)%100}%;--delay:${(i%5)*.08}s;--color:${['#f5df55','#9ec872','#f49aa3','#8ac6d5'][i%4]}"></i>`).join('')}</div><section class="arcade-window"><header><span>PAWTROL.EXE</span><span aria-hidden="true">□ ×</span></header><div class="arcade-content"><div class="arcade-icon" aria-hidden="true"></div><p class="arcade-kicker">✦ QUEST COMPLETE ✦</p><h2 id="arcade-title"></h2><strong class="arcade-points"></strong><p class="arcade-description"></p><button type="button" class="arcade-continue">CONTINUE ▶</button></div></section>`;
 overlay.querySelector('.arcade-icon').textContent=icon;overlay.querySelector('h2').textContent=title;overlay.querySelector('.arcade-points').textContent=points;overlay.querySelector('.arcade-description').textContent=text;
 document.body.append(overlay);const btn=overlay.querySelector('button');let closed=false;
 const close=()=>{if(closed)return;closed=true;overlay.remove();document.removeEventListener('keydown',onKey);if(previous?.isConnected)previous.focus({preventScroll:true})};
 const onKey=e=>{if(e.key==='Escape')close()};btn.addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',onKey);btn.focus({preventScroll:true});
}
