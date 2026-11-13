const videos=['kwNwZ99zCf4','raO9IYAhhvA','MvvIN0rAJoc','eUEtaEkrDYI','HiGoCLnsRXs','Ivl_WPiLyaQ','yprswFLO_Uw','kwOfTpC4ctc','JD3xPl6eubQ','l2Np7RTQgXU','mXN3-q8Ycmo','1Kx3MKKC5HQ','OIPAk11DXzE','lDeX2f65D9I','-lT1q9V5hDI','FCRJXGWLB50','8WVjKyP7Lo8','edl1oYAQeuw','yF3a80693lc','nbSMCDQ45kE','rsg6VytN-E4','kLgA3m00eMU','eoXVt-415Dw','a5I2R6vd16g','7kcbqvdBMjg','Qt2DRH_PqTU','p2bacCg1mqg','oGlkmoiuWnA','S7j6MTTf3jg','7UXLSk5tXr8','4NYVKuJI0a4','8F-GK3bGl9Y'];

const social=[['reel','DeJ2nEOSvOL'],['reel','Deg9QaOzknE'],['reel','DeMgIaZzDKw'],['p','Dd9EnnvINH9'],['p','Dd6Wtl8TJxx'],['p','DdtlBkHzwLM'],['p','DdJXFhHTHKo'],['p','DcBQ4ZyNoZV'],['p','Db8HSErz1jl'],['p','DbYD8otThqL'],['p','DaQABKPzvXz'],['p','DaFqztFT2X8'],['p','DYJ6ZDVs8F1'],['p','DX_2ADHT06P'],['p','DWOnrXMTrtp'],['p','DU8c_aOE9ry'],['p','DUGBPIJE5rm'],['p','DT2n3pUE1OP'],['p','DSfN0p_E5IY'],['p','DRevkDqE3DO'],['p','DRKOMHmE8N3'],['p','DP6WORfk9IY'],['p','DPWTAvUk1h_'],['p','DO5-5plE8iL'],['p','DN8HPwtjLP6'],['p','DNnp_q2zKfo'],['p','DNBXUgWTf_f'],['p','DMx1UH2zTMh'],['p','DMp90dNT1FW'],['p','DMfqmcAz090'],['p','DL7fhafBTI8'],['p','DLxC-dYoR75'],['p','DLkKpAbTiBz'],['p','DLKocXzt28k'],['p','DKhQ2GLNLvS'],['p','DNqEgw1zy0z'],['p','DKCdc5LoPUG'],['p','DI_ZH0rzgHI'],['p','DI1M4ItTJYM']];

const creativeIds=new Set(['DRKOMHmE8N3','DKhQ2GLNLvS']);

const featuredReels=window.featuredReels || [];

const sortedVideos=[...videos].sort((a,b)=>(window.youtubeVideoData?.[b]?.views ?? -1)-(window.youtubeVideoData?.[a]?.views ?? -1));

const aiVideos=window.aiVideos || [];

const motionGraphicsVideos=window.motionGraphicsVideos || [];

const graphicDesigns=window.graphicDesigns || [];

const works=[...sortedVideos.map((id,index)=>({platform:'youtube',id,index,url:`https://www.youtube.com/watch?v=${id}`})),...featuredReels.map((video,index)=>({...video,platform:'instagram',featured:true,index})),...social.map(([type,id],index)=>({platform:creativeIds.has(id)?'creative':'instagram',type,id,index,url:`https://www.instagram.com/${type}/${id}/`})),...aiVideos.map((video,index)=>({...video,platform:'ai',index})),...motionGraphicsVideos.map((video,index)=>({...video,platform:'motion',index})),...graphicDesigns.map((design,index)=>({...design,platform:'graphic',index}))];

const grid=document.querySelector('#work-grid'),more=document.querySelector('#show-more'),count=document.querySelector('#result-count');let filter='all',expanded=false;

const aiIntro=document.querySelector('#ai-collection-intro');

const motionIntro=document.querySelector('#motion-collection-intro');

const creativeIntro=document.querySelector('#creative-collection-intro');

const graphicIntro=document.querySelector('#graphic-collection-intro');

document.querySelector('#ai-video-total').textContent=`${aiVideos.length} videos`;

document.querySelector('#motion-video-total').textContent=`${motionGraphicsVideos.length} videos`;

function wireVideoPlayback(video){

 video.addEventListener('play',()=>{grid.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()})});

}

function createLocalVideoCard(item){

 const isMotion=item.platform==='motion';

 const card=document.createElement('article');card.className=`card ai-card${isMotion?' motion-card':''}`;

 const frame=document.createElement('div');frame.className='ai-player-frame';

 const video=document.createElement('video');video.className='ai-player';video.src=item.src;video.poster=item.poster;video.controls=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-label',`${item.title} — ${isMotion?'Motion graphics':'AI video'}`);

 wireVideoPlayback(video);

 const fallback=document.createElement('a');fallback.className='ai-video-fallback';fallback.href=item.src;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.textContent='Open video ↗';fallback.hidden=true;

 video.addEventListener('error',()=>{video.hidden=true;fallback.hidden=false});

 const duration=document.createElement('span');duration.className='ai-duration';const seconds=Math.round(item.duration);duration.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;duration.setAttribute('aria-label',`Duration ${seconds} seconds`);

 frame.append(video,duration,fallback);

 if(isMotion){const badge=document.createElement('img');badge.className='motion-graphics-badge';badge.src='https://vignesh-m-creative-portfolio.netlify.app/assets/motion-graphics-badge-v1.png';badge.alt='Motion graphics';badge.width=44;badge.height=44;frame.append(badge);}

 const meta=document.createElement('div');meta.className='card-meta ai-card-meta';

 const title=document.createElement('strong');title.textContent=item.title;

 const label=document.createElement('small');label.textContent=isMotion?'MOTION GRAPHICS':'AI VIDEO';

 meta.append(title,label);card.append(frame,meta);return card;

}

function render(){

 const matching=works.filter(item=>(filter==='all'||item.platform===filter)&&!(filter==='instagram'&&item.featured));

 window.featuredReelGallery?.setVisible(filter==='instagram');

 const firstCount=filter==='instagram'?10:9;

 const visible=(expanded||filter==='graphic')?matching:matching.slice(0,firstCount);grid.querySelectorAll('video').forEach(video=>video.pause());grid.replaceChildren();

 aiIntro.hidden=filter!=='ai';motionIntro.hidden=filter!=='motion';creativeIntro.hidden=filter!=='creative';graphicIntro.hidden=filter!=='graphic';grid.dataset.collection=filter;

 visible.forEach(item=>{

  const number=String(item.index+1).padStart(2,'0');

  if(item.platform==='graphic'){grid.append(window.graphicDesignGallery.createCard(item));return;}

  if(item.platform==='ai'||item.platform==='motion'){grid.append(createLocalVideoCard(item));return;}

  if(item.featured){grid.append(window.featuredReelGallery.createCard(item));return;}

  if(item.platform==='instagram'||item.platform==='creative'){

   const card=document.createElement('article');card.className=`card ${item.platform==='creative'?'creative-card':'instagram-card'} video-only`;

   const clip=window.instagramMedia?.[item.id]?.clips?.[0];

   const link=document.createElement('a');link.className='video-source';link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='↗';link.setAttribute('aria-label',`Open Instagram video ${number} on Instagram (opens in a new tab)`);

   if(clip){

    const video=document.createElement('video');video.className='instagram-player';video.src=clip.src;video.controls=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-label',`Instagram portfolio video ${number}`);if(clip.poster)video.poster=clip.poster;

    wireVideoPlayback(video);

    video.addEventListener('error',()=>{video.hidden=true;card.classList.add('video-unavailable');link.textContent='Open video on Instagram ↗'});

    card.append(video);

   }else{card.classList.add('video-unavailable');link.textContent='Open video on Instagram ↗'}

   if(item.platform==='creative'){const stamp=document.createElement('img');stamp.className='creative-edit-stamp';stamp.src='assets/creative-edit-stamp.svg';stamp.alt='Creative Edit';stamp.width=stamp.height=49;card.append(stamp);}

   card.append(link);grid.append(card);return;

  }

  const card=document.createElement('a');card.className='card';card.href=item.url;card.target='_blank';card.rel='noopener noreferrer';card.setAttribute('aria-label',`Watch ${window.youtubeVideoData?.[item.id]?.title || `YouTube item ${number}`} on YouTube (opens in a new tab)`);

  const image=document.createElement('div');image.className='card-image';const img=document.createElement('img');img.src=`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;img.alt='';img.loading='lazy';img.addEventListener('error',()=>{img.remove();image.classList.add('instagram');const fallback=document.createElement('span');fallback.className='art-number';fallback.textContent=number;image.prepend(fallback)});image.append(img);

  const badge=document.createElement('span');badge.className='badge';badge.textContent='YOUTUBE';const arrow=document.createElement('span');arrow.className='arrow';arrow.textContent='↗';image.append(badge,arrow);

  const meta=document.createElement('div');meta.className='card-meta';const text=document.createElement('div');const title=document.createElement('strong');title.textContent=window.youtubeVideoData?.[item.id]?.title || `YouTube item ${number}`;const sub=document.createElement('small');sub.textContent=window.youtubeVideoData?.[item.id]?.views!=null ? `${window.youtubeVideoData[item.id].views.toLocaleString('en-US')} views ↗` : 'View original ↗';text.append(title,sub);meta.append(text);card.append(image,meta);grid.append(card);

 });

 count.textContent=(filter==='instagram'?`${featuredReels.length} featured · `:'')+`Showing ${visible.length} of ${matching.length} ${filter==='instagram'?'other reels':filter==='graphic'?'designs':filter==='all'?'works':'videos'}`;more.hidden=filter==='graphic'||matching.length<=firstCount;more.setAttribute('aria-expanded',String(expanded));more.innerHTML=expanded?'Show less <span>↑</span>':filter==='ai'?'Show all AI videos <span>↓</span>':filter==='motion'?'Show all motion graphics <span>↓</span>':'Show all work <span>↓</span>';

}

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;expanded=false;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});render()}));more.addEventListener('click',()=>{expanded=!expanded;render();if(!expanded)document.querySelector('#work').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});render();

const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});nav.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});



const themeToggle=document.querySelector('.theme-toggle');

function updateThemeButton(){const dark=document.documentElement.dataset.theme==='dark';themeToggle.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);themeToggle.querySelector('[aria-hidden]').textContent=dark?'☀':'☾';themeToggle.querySelector('span:last-child').textContent=dark?'Light mode':'Dark mode';}

updateThemeButton();

themeToggle.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('portfolio-theme',next)}catch(e){}updateThemeButton();});

