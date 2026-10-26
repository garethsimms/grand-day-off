import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const brunchMenu = 'https://static1.squarespace.com/static/6745b581c97f584d509776e5/t/6ac4ff9719502a18ee43d6d2/1791295383423/LagomMenu-Oct2026.pdf';
const afternoonOptions = [
 {name:'Ambassade Library Bar', mood:'A little literary sanctuary 📚', detail:'Books, wine and a peaceful corner. Their FAQ mentions cheese, bitterballen and other snacks.', destination:'Ambassade Library Bar, Herengracht 341, Amsterdam'},
 {name:'OCCO at The Dylan', mood:'A little luxury 🥂', detail:'Almost next door to REMM. Minimal rain.', destination:'OCCO The Dylan, Keizersgracht 384, Amsterdam'},
 {name:"Lotti’s at The Hoxton", mood:'A little buzz ☕', detail:'Livelier surroundings, coffee or wine.', destination:'Lottis The Hoxton, Herengracht 255, Amsterdam'}
];

const nightOptions = [
 {name:'Vermeers Wijnkamer', detail:'A last glass of wine near Centraal.', destination:'Vermeers Wijnkamer, Zeedijk 11, Amsterdam'},
 {name:'Rosalia’s Menagerie', detail:'Cocktails on the way towards Centraal.', destination:'Rosalias Menagerie, Kloveniersburgwal 20, Amsterdam'}
];
const checkpoints = [
  { eyebrow:'Checkpoint 01', time:'11:30', title:'Brunch. Obviously.', body:'Start your day with something delicious. No shop talk, no to-do list, no decisions more consequential than sweet or savoury.', cta:'Brunch acquired', note:'IMPORTANT: Head off by 12:20. Your next appointment is booked, and punctuality is required. ⏰', destination:'Lagom Amsterdam, Snoekjessteeg 1-3, Amsterdam', place:'Lagom' },
  { eyebrow:'Checkpoint 02', time:'12:45', title:'Time to switch off.', body:'Be here at 12:45 for a little chat before your 13:00 appointment. Then you have 80 glorious minutes of being looked after. Absolutely nothing is required of you.', cta:'Face successfully pampered', note:'REMM Facials · Keizersgracht 394 · Appointment 13:00–14:20. Arrive 15 minutes early. Already paid for — nothing to settle.', destination:'REMM Facials, Keizersgracht 394, Amsterdam', place:'REMM Facials' },
  { eyebrow:'Checkpoint 03', time:null, title:'Your next appointment: nothing.', body:'Take one of your birthday books, find a comfortable corner and enjoy doing absolutely nothing. Three suggestions, zero obligations. Pick whatever suits your mood (and the weather).', cta:'Reveal my next destination', note:'Next reservation at 18:00. Choose your spot, enjoy your book, and tap through when you’re ready to reveal where to go next. ❤️', destination:'Amsterdam' },
  { eyebrow:'Checkpoint 04', time:'18:00', timeLabel:'DINNER AT', title:'One last surprise.', body:"Your final reservation is waiting. Head to Scheepskameel for 18:00. There may be more to this evening than you think. 👀", cta:'Grand Day Off complete', note:'Your reservation is at 18:00. Check Google Maps from wherever you are and allow enough time. Gareth is transferring €250 to your account while you dine. Enjoy!', destination:'Scheepskameel, Kattenburgerstraat 7, Gebouw 24, Amsterdam', place:'Scheepskameel' },
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

 const current=checkpoints[Math.min(step,checkpoints.length-1)];
 const complete=step>=checkpoints.length;
 const total=Object.values(expenses).reduce((sum,value)=>sum+(Number(value)||0),0);
 const paidCheckpoint=[0,2].includes(step);
 const progress=useMemo(()=>Math.min((step/checkpoints.length)*100,100),[step]);
 const advance=()=>{let nextExpenses=expenses;if(paidCheckpoint&&amount){nextExpenses={...expenses,[step]:Number(String(amount).replace(',','.'))||0};setExpenses(nextExpenses);localStorage.setItem('gdo-expenses',JSON.stringify(nextExpenses));}const next=step+1;localStorage.setItem('gdo-step',String(next));localStorage.setItem('gdo-started','true');setStep(next);setAmount('');window.scrollTo({top:0,behavior:'smooth'})};
 const reset=()=>{localStorage.removeItem('gdo-step');localStorage.removeItem('gdo-started');localStorage.removeItem('gdo-expenses');setExpenses({});setAmount('');setStep(0);setStarted(false);setIntroPage(0);setGiftOpened(false)};

 if(!adventureOpen)return <main className="page gift-page"><section className="card gift-card">
  <div className="badge">A Gareth Simms Production™</div>
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
  <div className="badge">A Gareth Simms Production · {introPage+1}/3</div>
  {introPage===0 ? <>
   <h1>HAPPY DAY OFF, MAROES!</h1>
   <p>Today is <strong>YOUR</strong> day. Now, I know you.</p>
   <p>If I'd simply given you a day off, you'd stay home, order McDonald's on Uber Eats and watch Gilmore Girls all day.</p>
   <p>But we live in a city we don't always make the most of.</p>
   <p className="intro-shout">BUT NOT TODAY.</p>
   <p>I've planned you a little adventure. You don't have to follow it religiously (although I'd love it if you did). Just trust me. ❤️</p>
   <button onClick={()=>setIntroPage(1)}>LET'S DO THIS →</button>
  </> : introPage===1 ? <>
   <h1>ONE VERY IMPORTANT THING.</h1>
   <p>This app guides you through the day, one checkpoint at a time.</p>
   <p className="intro-shout">NO SKIPPING AHEAD. 👀</p>
   <p>Most of the day is yours to enjoy at your own pace. But a couple of things are booked, and for those:</p>
   <p className="intro-warning">YOU. MUST. BE. ON. TIME.</p>
   <p>The app will tell you where to go and when.</p>
   <button onClick={()=>setIntroPage(2)}>WHAT DO I NEED? →</button>
  </> : <>
   <h1>BEFORE YOU LEAVE…</h1>
   <p>Bring one of your birthday books. No adding to the unread pile. 👀</p>
   <p>Makeup bag, one of your birthday books, and something you feel fabulous in. Comfy for daytime, with an optional little glam-up for later. No need to pack half your wardrobe.</p>
   <p className="intro-shout">FIRST RESERVATION: 11:30</p>
   <p>Everything else is taken care of. All you have to do is turn up. ❤️</p>
   <button onClick={()=>{localStorage.setItem('gdo-started','true');setStarted(true)}}>RIGHT. OFF YOU GO →</button>
  </>}
 </section></main>;

 if(complete)return <main className="page"><section className="card done-card"><div className="badge">From Gareth, with love ❤️</div><h2>I hope you've enjoyed your day, liefje.</h2><p className="bodycopy">I love you. I'm proud of you.</p><p className="big-line">Now send me a Tikkie. 😘</p><p className="micro">For anything you spent today — the rest is on me. ❤️</p></section></main>;

 return <main className="page"><section className="card checkpoint-card"><div className="topline"><span onClick={()=>{}}>{current.eyebrow}</span><span>{step+1}/{checkpoints.length}</span></div><div className="progress"><i style={{width:`${progress}%`}}/></div>{current.time&&<div className="time-stamp"><small>{current.timeLabel||"BE THERE AT"}</small><strong>{current.time}</strong></div>}<h2>{current.title}</h2>{step<3&&<p className="next-booking">UP NEXT: {step===0?'12:45 APPOINTMENT · ALLOW ABOUT 20–25 MIN ON FOOT · LEAVE BY 12:20':step===1?'NEXT BOOKING AT 18:00 · DESTINATION STILL SECRET':'18:00 RESERVATION · CHECK YOUR JOURNEY WHEN READY'}</p>}<p className="bodycopy">{current.body}</p><aside>{current.note}</aside>{step===0&&<a className="maps-button" href={brunchMenu} target="_blank" rel="noreferrer">PEEK AT THE BRUNCH MENU ↗</a>}{paidCheckpoint&&<label className="damage-input"><span>SPENT ANYTHING? (OPTIONAL)</span><div><b>€</b><input inputMode="decimal" placeholder="0,00" value={amount} onChange={e=>setAmount(e.target.value)} /></div></label>}{step===4 ? <div className="afternoon-options">{nightOptions.map(option=><div className="afternoon-option" key={option.name}><strong>{option.name}</strong><small>{option.detail}</small><a href={mapsUrl(option.destination)} target="_blank" rel="noreferrer">DIRECTIONS ↗</a></div>)}</div> : step===2 ? <div className="afternoon-options">{afternoonOptions.map((option,i)=><div className="afternoon-option" key={option.name}><strong>{i===0?"★ ":""}{option.name}</strong><span>{option.mood}</span><small>{option.detail}</small><a href={mapsUrl(option.destination)} target="_blank" rel="noreferrer">DIRECTIONS ↗</a></div>)}</div> : <a className="maps-button" href={mapsUrl(current.destination)} target="_blank" rel="noreferrer">DIRECTIONS TO {current.place?.toUpperCase()} ↗</a>}<button onClick={advance}>{current.cta} →</button><p className="micro">One thing at a time. No peeking ahead.</p></section></main>
}
createRoot(document.getElementById('root')).render(<App/>);
