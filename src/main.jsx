import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const checkpoints = [
  { eyebrow:'Checkpoint 01', time:'10:00', title:'Brunch. Obviously.', body:'Start slowly. Sit down somewhere nice, order whatever you fancy and do not think about the shop.', cta:'Brunch acquired', note:'Gareth pays. You do not.', destination:'Amsterdam' },
  { eyebrow:'Checkpoint 02', time:'11:45', title:'Someone is waiting for you.', body:"Someone you know is going to touch your face for 75 minutes. Don't make it weird.", cta:'Face successfully fondled', note:'REMM. Keizersgracht 394.', destination:'Keizersgracht 394, Amsterdam' },
  { eyebrow:'Checkpoint 03', time:'13:30', title:'Something green.', body:'Time for something fresh and healthy. Juice, salad, soup — whatever looks good. This is not penance.', cta:'Vegetables happened', note:'Yes, Gareth still pays.', destination:'Amsterdam' },
  { eyebrow:'Checkpoint 04', time:'14:30', title:'Coffee & appeltaart.', body:'Not work coffee. Not supplier coffee. Just coffee and a slice of appeltaart because you are off duty.', cta:'Pie demolished', note:'No tasting notes required.', destination:'Noordermarkt 43, Amsterdam' },
  { eyebrow:'Checkpoint 05', time:'15:15', title:'Buy a book.', body:'Choose one Dutch book you genuinely want to read. No wine books. No parenting books. No self-improvement. You do not need to become a better person today.', cta:'Book chosen', note:'Budget: €30. Make Gareth pay.', destination:'Spui 14-16, Amsterdam' },
  { eyebrow:'Checkpoint 06', time:'16:15', title:'Now read the fucking book.', body:'Order a glass of wine, sit somewhere lovely and read. Nobody needs anything from you right now.', cta:'Wine + reading achieved', note:'Your next instruction will appear when you need it.', destination:'Amsterdam' },
  { eyebrow:'Final checkpoint', time:'19:00', title:'One last place.', body:"Finish your wine. You've got somewhere to be. That's all you're getting for now.", cta:'Grand Day Off complete', note:'Be there on time. Trust the process.', destination:'Amsterdam' }
];

function mapsUrl(destination) {
  return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination) + '&travelmode=walking';
}

function App(){
 if(new URLSearchParams(window.location.search).has('reset')){if(window.confirm('Reset the Grand Day Off demo and erase saved progress and expenses?')){localStorage.removeItem('gdo-step');localStorage.removeItem('gdo-started');localStorage.removeItem('gdo-expenses');}window.history.replaceState({},'',window.location.pathname);}
 const [started,setStarted]=useState(()=>localStorage.getItem('gdo-started')==='true');
 const [introPage,setIntroPage]=useState(0);
 const [step,setStep]=useState(()=>Number(localStorage.getItem('gdo-step')||0));
 const [expenses,setExpenses]=useState(()=>JSON.parse(localStorage.getItem('gdo-expenses')||'{}'));
 const [amount,setAmount]=useState('');
 const [resetPrompt,setResetPrompt]=useState(false);
 const current=checkpoints[Math.min(step,checkpoints.length-1)];
 const complete=step>=checkpoints.length;
 const total=Object.values(expenses).reduce((sum,value)=>sum+(Number(value)||0),0);
 const paidCheckpoint=[0,2,3,4,5].includes(step);
 const progress=useMemo(()=>Math.min((step/checkpoints.length)*100,100),[step]);
 const advance=()=>{let nextExpenses=expenses;if(paidCheckpoint&&amount){nextExpenses={...expenses,[step]:Number(String(amount).replace(',','.'))||0};setExpenses(nextExpenses);localStorage.setItem('gdo-expenses',JSON.stringify(nextExpenses));}const next=step+1;localStorage.setItem('gdo-step',String(next));localStorage.setItem('gdo-started','true');setStep(next);setAmount('');window.scrollTo({top:0,behavior:'smooth'})};
 const reset=()=>{localStorage.removeItem('gdo-step');localStorage.removeItem('gdo-started');localStorage.removeItem('gdo-expenses');setExpenses({});setAmount('');setStep(0);setStarted(false);setIntroPage(0);setResetPrompt(false)};

 if(!started)return <main className="page hero-page"><section className="card hero-card intro-card">
  <div className="badge" onClick={()=>setResetPrompt(true)}>A Gareth Simms Production · {introPage+1}/2</div>
  {introPage===0 ? <>
   <h1>HAPPY DAY OFF, MAROES!</h1>
   <p>Today is <strong>YOUR</strong> day. Now, I know you.</p>
   <p>If I'd simply given you a day off, you'd stay home, order McDonald's on Uber Eats and watch Gilmore Girls all day.</p>
   <p>Which, to be fair, sounds pretty fucking great.</p>
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

 if(complete)return <main className="page"><section className="card done-card"><div className="badge" onClick={()=>setResetPrompt(true)}>System status</div><h2>Maroescha restored.</h2><div className="summary"><p>✓ 0 shifts worked</p><p>✓ 1 face fondling</p><p>✓ suspicious quantities of vegetables</p><p>✓ 1 completely unnecessary book</p><p>✓ ≥1 wine</p><p>✓ 0 decisions that mattered</p></div><div className="damage-total"><small>TODAY'S DAMAGE</small><strong>€ {total.toFixed(2).replace('.',',')}</strong><span>Gareth said he was paying. Time to collect.</span></div><p className="big-line">Grand Day Off complete. ❤️</p><button className="pay-gareth" onClick={()=>navigator.clipboard?.writeText(`Grand Day Off € ${total.toFixed(2)}`)}>MAKE GARETH PAY →</button></section></main>;

 return <main className="page"><section className="card checkpoint-card"><div className="topline"><span onClick={()=>setResetPrompt(true)}>{current.eyebrow}</span><span>{step+1}/{checkpoints.length}</span></div><div className="progress"><i style={{width:`${progress}%`}}/></div><div className="time-stamp"><small>BE THERE AT</small><strong>{current.time}</strong></div><h2>{current.title}</h2><p className="bodycopy">{current.body}</p><aside>{current.note}</aside>{paidCheckpoint&&<label className="damage-input"><span>DAMAGE?</span><div><b>€</b><input inputMode="decimal" placeholder="0,00" value={amount} onChange={e=>setAmount(e.target.value)} /></div></label>}<a className="maps-button" href={mapsUrl(current.destination)} target="_blank" rel="noreferrer">OPEN IN GOOGLE MAPS ↗</a><button onClick={advance}>{current.cta} →</button><p className="micro">One thing at a time. No peeking ahead.</p></section></main>
}
createRoot(document.getElementById('root')).render(<App/>);
