/* Celebrate confirmed writes; the database remains the source of truth. */
const careFetch=window.fetch.bind(window);
window.fetch=async(url,options={})=>{
 const response=await careFetch(url,options);
 if(typeof url==='string'&&/^\/api\/animals\/\d+\/events$/.test(url)&&options.method==='POST'&&response.ok){
  try{const body=JSON.parse(options.body||'{}');if(body.kind==='feeding'){
   const saved=await response.clone().json();
   const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(explorer.key));
   const id=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
   const day=new Date(body.happened_at).toISOString().slice(0,10);
   const matching=(saved.events||[]).filter(e=>e.kind==='feeding'&&e.contributor_id===id&&e.happened_at.slice(0,10)===day);
   setTimeout(()=>celebrateCare(matching.length===1),250);
  }}catch{ /* A celebration must never interfere with saving. */ }
 }
 return response;
};
function celebrateCare(earned){
 document.querySelector('.xp-takeover')?.remove();
 const overlay=document.createElement('div');overlay.className='xp-takeover';overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
 overlay.innerHTML=`<div class="xp-confetti" aria-hidden="true">${Array.from({length:24},(_,i)=>`<i style="--x:${(i*37)%100}%;--turn:${i*47}deg;--delay:${i%6*.04}s;--color:${['#9f7aff','#ff7959','#83d9f6','#293b2a'][i%4]}"></i>`).join('')}</div><div class="xp-burst" aria-hidden="true">✹</div><div class="xp-message"><span class="xp-kicker">CARE LOG SAVED · GOOD HUMAN DETECTED</span><strong>${earned?'+20 XP':'BIG W'}</strong><h2>${earned?'Kindness is a power move.':'Care logged. Legend behavior.'}</h2><p>${earned?'Your photo-backed feeding log earned 20 XP.':'You already earned feeding XP for this animal today. Your new care log is still saved.'}</p><button class="btn btn-dark" type="button">Keep the good vibes going ↗</button></div>`;
 document.body.append(overlay);let timer;const close=()=>{clearTimeout(timer);overlay.classList.add('xp-out');setTimeout(()=>overlay.remove(),250)};overlay.querySelector('button').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});timer=setTimeout(close,earned?5500:6500);overlay.querySelector('button').focus({preventScroll:true});
}
