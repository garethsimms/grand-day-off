import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const afternoonOptions = [
 {name:'Ambassade Library Bar', mood:'A little literary sanctuary 📚', detail:'Books, wine and a peaceful corner.', destination:'Ambassade Library Bar, Herengracht 341, Amsterdam'},
 {name:'OCCO at The Dylan', mood:'A little luxury 🥂', detail:'Almost next door to REMM. Minimal rain.', destination:'OCCO The Dylan, Keizersgracht 384, Amsterdam'},
 {name:"Lotti’s at The Hoxton", mood:'A little buzz ☕', detail:'Livelier surroundings, coffee or wine.', destination:'Lottis The Hoxton, Herengracht 255, Amsterdam'}
];

const checkpoints = [
  { eyebrow:'Checkpoint 01', time:'11:30', title:'Brunch. Obviously.', body:'Start your day with something delicious. No shop talk, no to-do list, no decisions more consequential than sweet or savoury.', cta:'Brunch acquired', note:'IMPORTANT: Head off by 12:20. Your next appointment is booked, and punctuality is required. ⏰', destination:'Lagom Amsterdam, Snoekjessteeg 1-3, Amsterdam', place:'Lagom' },
  { eyebrow:'Checkpoint 02', time:'12:45', title:'Time to switch off.', body:'Be here at 12:45 for a little chat before your 13:00 appointment. Then you have 80 glorious minutes of being looked after. Absolutely nothing is required of you.', cta:'Face successfully pampered', note:'REMM Facials · Keizersgracht 394 · Appointment 13:00–14:20. Arrive 15 minutes early.', destination:'REMM Facials, Keizersgracht 394, Amsterdam', place:'REMM Facials' },
  { eyebrow:'Checkpoint 03', time:null, title:'Your next appointment: nothing.', body:'Take one of your birthday books, find a comfortable corner and enjoy doing absolutely nothing. Three suggestions, zero obligations. Pick whatever suits your mood (and the weather).', cta:'Successfully did nothing', note:'The Library Bar might feel particularly lovely. But this is your afternoon, your call. ❤️', destination:'Amsterdam' },
  { eyebrow:'Final checkpoint', time:'18:00', timeLabel:'DINNER AT', title:'One last surprise.', body:"Your final reservation is waiting. Head to Scheepskameel for 18:00. There may be more to this evening than you think. 👀", cta:'Grand Day Off complete', note:'Aim to leave around 17:15 so you can get there comfortably. Trust the process.', destination:'Scheepskameel, Kattenburgerstraat 7, Gebouw 24, Amsterdam', place:'Scheepskameel' }
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
  <div className="badge">A Gareth Simms Production · {introPage+1}/2</div>
  {introPage===0 ? <>
   <h1>HAPPY DAY OFF, MAROES!</h1>
   <p>Today is <strong>YOUR</strong> day. Now, I know you.</p>
   <p>If I'd simply given you a day off, you'd stay home, order McDonald's on Uber Eats and watch Gilmore Girls all day.</p>
   <p>But we live in a city we don't always make the most of.</p>
   <p className="intro-shout">BUT NOT TODAY.</p>
   <p>I've planned you a little adventure. You don't have to follow it religiously (although I'd love it if you did). Just trust me. ❤️</p>
   <button onClick={()=>setIntroPage(1)}>LET'S DO THIS →</button>
  </> : <>
   <h1>ONE VERY IMPORTANT THING.</h1>
   <p>This app guides you through the day, one checkpoint at a time.</p>
   <p className="intro-shout">NO SKIPPING AHEAD. 👀</p>
   <p>Most of the day is yours to enjoy at your own pace. But a couple of things are booked, and for those:</p>
   <p className="intro-warning">YOU. MUST. BE. ON. TIME.</p>
   <p>The app will tell you where to go and when.</p>
   <button onClick={()=>{localStorage.setItem('gdo-started','true');setStarted(true)}}>RIGHT. OFF YOU GO →</button>
  </>}
 </section></main>;

 if(complete)return <main className="page"><section className="card done-card"><div className="badge" onClick={()=>setResetPrompt(true)}>System status</div><h2>Maroescha restored.</h2><div className="summary"><p>✓ 0 shifts worked</p><p>✓ 1 face fondling</p><p>✓ a very well-rested face</p><p>✓ 0 additional books on the unread pile</p><p>✓ ≥1 wine</p><p>✓ 0 decisions that mattered</p></div><div className="damage-total"><small>TODAY'S DAMAGE</small><strong>€ {total.toFixed(2).replace('.',',')}</strong><span>Gareth said he was paying. Time to collect.</span></div><p className="big-line">Grand Day Off complete. ❤️</p><button className="pay-gareth" onClick={()=>navigator.clipboard?.writeText(`Grand Day Off € ${total.toFixed(2)}`)}>MAKE GARETH PAY →</button></section></main>;

 return <main className="page"><section className="card checkpoint-card"><div className="topline"><span onClick={()=>setResetPrompt(true)}>{current.eyebrow}</span><span>{step+1}/{checkpoints.length}</span></div><div className="progress"><i style={{width:`${progress}%`}}/></div>{current.time&&<div className="time-stamp"><small>{current.timeLabel||"BE THERE AT"}</small><strong>{current.time}</strong></div>}<h2>{current.title}</h2><p className="bodycopy">{current.body}</p><aside>{current.note}</aside>{paidCheckpoint&&<label className="damage-input"><span>DAMAGE?</span><div><b>€</b><input inputMode="decimal" placeholder="0,00" value={amount} onChange={e=>setAmount(e.target.value)} /></div></label>}{step===2 ? <div className="afternoon-options">{afternoonOptions.map((option,i)=><div className="afternoon-option" key={option.name}><strong>{i===0?"★ ":""}{option.name}</strong><span>{option.mood}</span><small>{option.detail}</small><a href={mapsUrl(option.destination)} target="_blank" rel="noreferrer">DIRECTIONS ↗</a></div>)}</div> : <a className="maps-button" href={mapsUrl(current.destination)} target="_blank" rel="noreferrer">DIRECTIONS TO {current.place?.toUpperCase()} ↗</a>}<button onClick={advance}>{current.cta} →</button><p className="micro">One thing at a time. No peeking ahead.</p></section></main>
}
createRoot(document.getElementById('root')).render(<App/>);
