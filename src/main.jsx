import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const remmGuide = 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTcwMDk3OTgzMTI5ODI2?cplk=aXA4dHdmOWJuOTYw';
const brunchMenu = 'https://static1.squarespace.com/static/6745b581c97f584d509776e5/t/6ac4ff9719502a18ee43d6d2/1791295383423/LagomMenu-Oct2026.pdf';
const afternoonOptions = [
 {name:'Ambassade Library Bar', mood:'A little literary sanctuary 📚', detail:'Books, wine and a peaceful corner. Their FAQ mentions cheese, bitterballen and other snacks. This is probably where I would go if it were my day. 😉', destination:'Ambassade Library Bar, Herengracht 341, Amsterdam'},
 {name:'OCCO at The Dylan', mood:'A little luxury 🥂', detail:'Almost next door to REMM. Minimal rain.', destination:'OCCO The Dylan, Keizersgracht 384, Amsterdam'},
 {name:"Lotti’s at The Hoxton", mood:'A little buzz ☕', detail:'Livelier surroundings, coffee or wine.', destination:'Lottis The Hoxton, Herengracht 255, Amsterdam'}
];

const nightOptions = [
 {name:'Vermeers Wijnkamer', detail:'A last glass of wine near Centraal.', destination:'Vermeers Wijnkamer, Zeedijk 11, Amsterdam'},
 {name:'Rosalia’s Menagerie', detail:'Cocktails on the way towards Centraal.', destination:'Rosalias Menagerie, Kloveniersburgwal 20, Amsterdam'}
];
const checkpoints = [
  { eyebrow:'Checkpoint 01', time:'11:15', timeLabel:'BE AT LAGOM BY', title:'Brunch. Obviously.', body:'Start your day with something delicious. No decisions bigger than sweet or savoury. (But I know you. Savoury all day!) Why Lagom? Honestly, no idea. I was drowning in options and this one made me salivate the most.', cta:'Brunch acquired', note:'Your next appointment is at 12:45, about 5–10 minutes away by bike. Aim to leave Lagom by 12:25. 🚲', destination:'Lagom Amsterdam, Snoekjessteeg 1-3, Amsterdam', place:'Lagom' },
  { eyebrow:'Checkpoint 02', time:'12:45', timeLabel:'BE AT REMM BY', title:'REMM Facials · Keizersgracht 394', body:'Arrive at 12:45 for a little chat before your 13:00 appointment. Then switch off and let someone else look after you. Absolutely nothing is required of you. Why not Stretch & Fold in Noord? Ralitsa recommended this place. And I am not about to argue with Ralitsa. 😉', cta:'Suitably pampered?', note:'APPOINTMENT 13:00 TO 14:20. ALREADY PAID FOR ❤️ Nothing to settle.', destination:'REMM Facials, Keizersgracht 394, Amsterdam', place:'REMM Facials' },
  { eyebrow:'Checkpoint 03', time:null, title:'Your next appointment: nothing.', body:'Take a book, find a comfortable corner and enjoy doing absolutely nothing. Three suggestions from me on where to head, zero obligations. Pick whatever suits your mood (and the weather).', cta:'Afternoon enjoyed?', note:'Next appointment at 18:00, about a 10-minute bike ride east of Centraal Station. Your destination is still a surprise. ❤️', destination:'Amsterdam' },
  { eyebrow:'Checkpoint 04', time:'18:00', timeLabel:'SCHEEPSKAMEEL AT', title:'Dinner. With a plot twist.', body:"Remember when we went to Scheepskameel in 2020 and I invited someone else to join us? Well, she never saw my message. Six years later, she's finally accepted. 😉", cta:'Dinner enjoyed?', note:'Scheepskameel · Kattenburgerstraat 7, Gebouw 24. Be there at 18:00. Check Google Maps from wherever you are and allow enough time.', destination:'Scheepskameel, Kattenburgerstraat 7, Gebouw 24, Amsterdam', place:'Scheepskameel' },
  { eyebrow:'After hours', time:null, title:"Don't want the night to end?", body:'One more glass with the girls? Entirely optional. Here are a couple of ideas on the way towards Centraal. Or head home whenever you fancy.', cta:'That was a grand day off', note:'No booking. No obligation. Just a suggestion.' }
];

function mapsUrl(destination) {
  return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination) + '&travelmode=walking';
}

function amsterdamDay(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function App(){
 const day=amsterdamDay();
 const preview=new URLSearchParams(window.location.search).get('preview');
 const adventureOpen=day>='2026-10-27'||preview==='day';
 const [giftOpened,setGiftOpened]=useState(()=>localStorage.getItem('gdo-gift-opened')==='true');
 if(new URLSearchParams(window.location.search).has('reset')){if(window.confirm('Reset the Grand Day Off demo and erase saved progress and expenses?')){localStorage.removeItem('gdo-step');localStorage.removeItem('gdo-started');localStorage.removeItem('gdo-expenses');localStorage.removeItem('gdo-gift-opened');}window.history.replaceState({},'',window.location.pathname);}
 const [started,setStarted]=useState(()=>localStorage.getItem('gdo-started')==='true');
 const [introPage,setIntroPage]=useState(0);
 const [step,setStep]=useState(()=>Number(localStorage.getItem('gdo-step')||0));
 const [expenses,setExpenses]=useState(()=>JSON.parse(localStorage.getItem('gdo-expenses')||'{}'));
 const [amount,setAmount]=useState('');
 const [brunchReview,setBrunchReview]=useState(false);
 const [brunchRating,setBrunchRating]=useState(null);
 const [facialReview,setFacialReview]=useState(false);
 const [facialRating,setFacialRating]=useState(null);
 const [afternoonReview,setAfternoonReview]=useState(false);
 const [afternoonSpot,setAfternoonSpot]=useState('');
 const [dinnerReview,setDinnerReview]=useState(false);
 const [dinnerRatings,setDinnerRatings]=useState({});

 const current=checkpoints[Math.min(step,checkpoints.length-1)];
 const complete=step>=checkpoints.length;
 const total=Object.values(expenses).reduce((sum,value)=>sum+(Number(value)||0),0);
 const paidCheckpoint=[0,2].includes(step);
 const progress=useMemo(()=>Math.min((step/checkpoints.length)*100,100),[step]);
 const advance=()=>{let nextExpenses=expenses;if(paidCheckpoint&&amount){nextExpenses={...expenses,[step]:Number(String(amount).replace(',','.'))||0};setExpenses(nextExpenses);localStorage.setItem('gdo-expenses',JSON.stringify(nextExpenses));}const next=step+1;setBrunchReview(false);setFacialReview(false);setAfternoonReview(false);setDinnerReview(false);localStorage.setItem('gdo-step',String(next));localStorage.setItem('gdo-started','true');setStep(next);setAmount('');window.scrollTo({top:0,behavior:'smooth'})};
 const reset=()=>{localStorage.removeItem('gdo-step');localStorage.removeItem('gdo-started');localStorage.removeItem('gdo-expenses');setExpenses({});setAmount('');setStep(0);setBrunchReview(false);setBrunchRating(null);setFacialReview(false);setFacialRating(null);setAfternoonReview(false);setAfternoonSpot('');setDinnerReview(false);setDinnerRatings({});setStarted(false);setIntroPage(0);setGiftOpened(false)};

 if(!adventureOpen)return <main className="page gift-page"><section className="card gift-card">
  <div className="badge">A GRAND DAY OFF ❤️</div>
  {!giftOpened ? <>
   <div className="gift-sticker">TOP SECRET 💌</div>
   <h1>HAPPY BIRTHDAY, MAROES! 💖</h1>
   <p>You've been given something very special.</p>
   <div className="gift-ticket"><small>YOUR PRESENT</small><strong>ONE GRAND DAY OFF.</strong><span>TUESDAY 27 OCTOBER*</span></div>
   <p>No shop. No responsibilities. No planning. No decisions.</p>
   <p>I've arranged a day just for you. All you have to do is show up. ❤️</p>
   <p className="gift-caveat">* Date still to be confirmed. A few scheming dominoes need to fall into place first. 👀</p>
   <button onClick={()=>{localStorage.setItem('gdo-gift-opened','true');setGiftOpened(true)}}>UNWRAP YOUR PRESENT →</button>
  </> : <>
   <div className="gift-sticker">🔒 CLASSIFIED</div>
   <h1>YOUR ADVENTURE IS LOCKED.</h1>
   <p>Your instructions will be revealed on <strong>Tuesday 27 October*.</strong></p>
   <div className="gift-ticket"><small>UNTIL THEN</small><strong>ABSOLUTELY NO SNOOPING.</strong><span>Love, Gareth ❤️</span></div>
   <p>Come back to this very same app on the day. It will guide you through your adventure, one surprise at a time.</p>
   <p className="gift-caveat">* Date still to be confirmed. A few scheming dominoes need to fall into place first. 👀</p>
   <p className="gift-foot">P.S. Punctuality may be required. Yes, really. ⏰</p>
   <button className="gift-back" onClick={()=>{localStorage.setItem("gdo-gift-opened","false");setGiftOpened(false)}}>← SHOW MY PRESENT AGAIN</button>
  </>}
 </section></main>;

 if(!started)return <main className="page hero-page"><section className="card hero-card intro-card">
  <div className="badge">A GRAND DAY OFF · {introPage+1}/3</div>
  {introPage===0 ? <>
   <h1>HAPPY DAY OFF, MAROES!</h1>
   <p>Today is <strong>YOUR</strong> day. Now, I know you.</p>
   <p>If I'd simply given you a day off, you'd stay home, order McDonald's on Uber Eats and watch Gilmore Girls all day.</p>
   <p>But we live in an incredible city that we don't always make the most of.</p>
   <p className="intro-shout">BUT NOT TODAY.</p>
   <p>I've planned you a little adventure. You don't have to follow it religiously (although I'd love it if you did). Just trust me. ❤️</p>
   <button onClick={()=>setIntroPage(1)}>LET'S DO THIS →</button>
  </> : introPage===1 ? <>
   <h1>ONE VERY IMPORTANT THING.</h1>
   <p>This app guides you through the day, one checkpoint at a time.</p>
   <p className="intro-shout">NO SKIPPING AHEAD. 👀</p>
   <p>There will be some appointments today, and some free time with some suggestions from me. For the things that are booked:</p>
   <p className="intro-warning">YOU. MUST. BE. ON. TIME.</p>
   <p>The app will tell you where to go and when.</p>
   <button onClick={()=>setIntroPage(2)}>WHAT DO I NEED? →</button>
  </> : <>
   <h1>BEFORE YOU LEAVE…</h1>
   <ul className="packing-list">
    <li><span className="packing-icon">📖</span><div><strong>A BOOK</strong><p>One of your birthday presents, or something from the unread pile. You'll have some quiet time later. Or you could doomscroll. Your day, your choice. 😘</p></div></li>
    <li><span className="packing-icon">💄</span><div><strong>MAKEUP BAG</strong><p>For a little freshen-up before the evening.</p></div></li>
    <li><span className="packing-icon">👗</span><div><strong>SOMETHING SMART(ISH)</strong><p>Not a ball gown, but maybe not your decorating clothes either. 😉 I'd go comfy during the day and change later. Don't overthink it. You always look fabulous.</p></div></li>
   </ul>
   <p className="intro-shout">FIRST ARRIVAL: 11:15 · NEAR NIEUWMARKT</p>
   <button onClick={()=>{localStorage.setItem('gdo-started','true');setStarted(true)}}>RIGHT. OFF YOU GO →</button>
  </>}
 </section></main>;

 if(step===0&&brunchReview)return <main className="page"><section className="card checkpoint-card"><div className="topline"><span>Brunch debrief</span><span>01/05</span></div><h2>WELL, HOW WAS IT?</h2><div className="rating-choices"><button className={brunchRating==='up'?'selected':''} onClick={()=>setBrunchRating('up')} aria-pressed={brunchRating==='up'}>👍 LOVED IT</button><button className={brunchRating==='down'?'selected':''} onClick={()=>setBrunchRating('down')} aria-pressed={brunchRating==='down'}>👎 WE NEED TO TALK</button></div><label className="damage-input"><span>HOW MUCH DO I OWE YOU?</span><div><b>€</b><input inputMode="decimal" placeholder="0,00" value={amount} onChange={e=>setAmount(e.target.value)} /></div></label><p className="micro">Both optional. No paperwork on your day off.</p><button onClick={advance}>ON TO THE NEXT ADVENTURE →</button></section></main>;

 if(step===1&&facialReview)return <main className="page"><section className="card checkpoint-card"><div className="topline"><span>Facial debrief</span><span>02/05</span></div><h2>WELL, HOW WAS THAT?</h2><p className="bodycopy">Is this going to become a regular wellness appointment? 👀</p><div className="rating-choices"><button className={facialRating==='up'?'selected':''} onClick={()=>setFacialRating('up')} aria-pressed={facialRating==='up'}>👍 ABSOLUTELY!</button><button className={facialRating==='down'?'selected':''} onClick={()=>setFacialRating('down')} aria-pressed={facialRating==='down'}>👎 TRY SOMEWHERE ELSE</button></div><p className="micro">No bill. No paperwork. Just a little curiosity.</p><button onClick={advance}>NEXT ADVENTURE →</button></section></main>;

 if(step===2&&afternoonReview)return <main className="page"><section className="card checkpoint-card"><div className="topline"><span>Afternoon debrief</span><span>03/05</span></div><h2>SO, WHERE DID YOU END UP?</h2><label className="damage-input"><span>YOUR LITTLE ESCAPE</span><input className="spot-input" type="text" placeholder="Somewhere lovely..." value={afternoonSpot} onChange={e=>setAfternoonSpot(e.target.value)} /></label><label className="damage-input"><span>AND WHAT DO I OWE YOU?</span><div><b>€</b><input inputMode="decimal" placeholder="0,00" value={amount} onChange={e=>setAmount(e.target.value)} /></div></label><p className="next-booking">NEXT APPOINTMENT: 18:00 · ABOUT 10 MIN BY BIKE EAST OF CENTRAAL</p><button onClick={advance}>REVEAL MY NEXT DESTINATION →</button></section></main>;

 if(step===3&&dinnerReview)return <main className="page"><section className="card checkpoint-card"><div className="topline"><span>Dinner debrief</span><span>04/05</span></div><h2>SO, HOW WAS IT?</h2>{['Food','Service','Drinks','Company'].map(category=><div className="dinner-rating" key={category}><strong>{category==='Company'?'Company?':category+'?'}</strong><div className="rating-choices"><button className={dinnerRatings[category]==='up'?'selected':''} onClick={()=>setDinnerRatings({...dinnerRatings,[category]:'up'})} aria-pressed={dinnerRatings[category]==='up'}>👍</button><button className={dinnerRatings[category]==='down'?'selected':''} onClick={()=>setDinnerRatings({...dinnerRatings,[category]:'down'})} aria-pressed={dinnerRatings[category]==='down'}>👎</button></div></div>)}<aside>I've covered €300 towards dinner: €105 already paid as a deposit, plus €195 that should be in your account by now. If the transfer hasn't arrived, message me! ❤️</aside><button onClick={advance}>WHAT NOW? →</button></section></main>;

 if(complete)return <main className="page"><section className="card done-card"><div className="badge">From Gareth, with love ❤️</div><h2>I hope you've enjoyed your day, liefje.</h2><p className="bodycopy">I love you. I'm proud of you.</p><p className="big-line">Now send me a Tikkie. 😘</p></section></main>;

 return <main className="page"><section className="card checkpoint-card"><div className="topline"><span>{current.eyebrow}</span><span>{step+1}/{checkpoints.length}</span></div><div className="progress"><i style={{width:`${progress}%`}}/></div>{current.time&&<div className="time-stamp"><small>{current.timeLabel||"BE THERE AT"}</small><strong>{current.time}</strong></div>}<h2>{current.title}</h2>{step===0 ? <><p className="bodycopy">{current.body}</p><a className="maps-button" href={brunchMenu} target="_blank" rel="noreferrer">PEEK AT THE BRUNCH MENU ↗</a><a className="maps-button" href={mapsUrl(current.destination)} target="_blank" rel="noreferrer">DIRECTIONS TO LAGOM ↗</a><aside><strong>UP NEXT: 12:45 · KEIZERSGRACHT</strong><br/>{current.note}</aside></> : <>{step===1&&<><p className="next-booking">REMM FACIALS · KEIZERSGRACHT 394</p><a className="maps-button" href={remmGuide} target="_blank" rel="noreferrer">HOW TO FIND THE ENTRANCE ↗</a></>}{step===2&&<p className="next-booking">NEXT APPOINTMENT: 18:00 · ABOUT 10 MIN BY BIKE EAST OF CENTRAAL</p>}<p className="bodycopy">{current.body}</p><aside>{current.note}</aside>{step===4 ? <div className="afternoon-options">{nightOptions.map(option=><div className="afternoon-option" key={option.name}><strong>{option.name}</strong><small>{option.detail}</small><a href={mapsUrl(option.destination)} target="_blank" rel="noreferrer">DIRECTIONS ↗</a></div>)}</div> : step===2 ? <div className="afternoon-options">{afternoonOptions.map((option,i)=><div className="afternoon-option" key={option.name}><strong>{i===0?"★ ":""}{option.name}</strong><span>{option.mood}</span><small>{option.detail}</small><a href={mapsUrl(option.destination)} target="_blank" rel="noreferrer">DIRECTIONS ↗</a></div>)}</div> : <a className="maps-button" href={mapsUrl(current.destination)} target="_blank" rel="noreferrer">DIRECTIONS TO {current.place?.toUpperCase()} ↗</a>}</>}{paidCheckpoint&&step!==0&&step!==2&&<label className="damage-input"><span>SPENT ANYTHING? (OPTIONAL)</span><div><b>€</b><input inputMode="decimal" placeholder="0,00" value={amount} onChange={e=>setAmount(e.target.value)} /></div></label>}<button onClick={step===0?()=>{setBrunchReview(true);window.scrollTo({top:0,behavior:'smooth'})}:step===1?()=>{setFacialReview(true);window.scrollTo({top:0,behavior:'smooth'})}:step===2?()=>{setAfternoonReview(true);window.scrollTo({top:0,behavior:'smooth'})}:step===3?()=>{setDinnerReview(true);window.scrollTo({top:0,behavior:'smooth'})}:advance}>{current.cta} →</button><p className="micro">One thing at a time. No peeking ahead.</p></section></main>
}
createRoot(document.getElementById('root')).render(<App/>);
