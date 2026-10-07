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
 const [started,setStarted]=useState(false);
 const [step,setStep]=useState(()=>Number(localStorage.getItem('gdo-step')||0));
 const current=checkpoints[Math.min(step,checkpoints.length-1)];
 const complete=step>=checkpoints.length;
 const progress=useMemo(()=>Math.min((step/checkpoints.length)*100,100),[step]);
 const advance=()=>{const next=step+1;localStorage.setItem('gdo-step',String(next));setStep(next);window.scrollTo({top:0,behavior:'smooth'})};
 const reset=()=>{localStorage.removeItem('gdo-step');setStep(0);setStarted(false)};

 if(!started)return <main className="page hero-page"><section className="card hero-card"><div className="badge">A Gareth Simms Production</div><h1>A Grand<br/>Day Off.</h1><p className="lede">Maroes, today you have exactly one responsibility:</p><p className="big-line">Do what the app tells you.</p><div className="rules"><span>No planning.</span><span>No shop.</span><span>No decisions.</span></div><button onClick={()=>setStarted(true)}>LET'S GO →</button><p className="micro">Everything is organised. Just follow along.</p></section></main>;

 if(complete)return <main className="page"><section className="card done-card"><div className="badge">System status</div><h2>Maroescha restored.</h2><div className="summary"><p>✓ 0 shifts worked</p><p>✓ 1 face fondling</p><p>✓ suspicious quantities of vegetables</p><p>✓ 1 completely unnecessary book</p><p>✓ ≥1 wine</p><p>✓ 0 decisions that mattered</p></div><p className="big-line">Grand Day Off complete. ❤️</p><button className="ghost" onClick={reset}>Reset demo</button></section></main>;

 return <main className="page"><section className="card checkpoint-card"><div className="topline"><span>{current.eyebrow}</span><span>{step+1}/{checkpoints.length}</span></div><div className="progress"><i style={{width:`${progress}%`}}/></div><div className="time-stamp"><small>BE THERE AT</small><strong>{current.time}</strong></div><h2>{current.title}</h2><p className="bodycopy">{current.body}</p><aside>{current.note}</aside><a className="maps-button" href={mapsUrl(current.destination)} target="_blank" rel="noreferrer">OPEN IN GOOGLE MAPS ↗</a><button onClick={advance}>{current.cta} →</button><p className="micro">One thing at a time. No peeking ahead.</p></section></main>
}
createRoot(document.getElementById('root')).render(<App/>);
