import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, BadgeDollarSign, BarChart3, Bell, Building2, Check, ChevronDown, CircleDollarSign, CreditCard, LayoutDashboard, LogOut, Menu, PiggyBank, RefreshCw, Search, Settings, ShieldCheck, Sparkles, Target, WalletCards, X } from 'lucide-react'
import './styles.css'

const money = (value, sign = true) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', signDisplay: sign ? 'auto' : 'never' }).format(value)
const dateLabel = (value) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value))

async function api(path, options = {}) {
  const response = await fetch(`/api/${path}`, { credentials: 'include', headers: { 'content-type': 'application/json', ...options.headers }, ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw Object.assign(new Error(data.error || 'Something went wrong.'), { status: response.status })
  return data
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('demo@finflow.dev')
  const [password, setPassword] = useState('finflow2026')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try { await api('login', { method: 'POST', body: JSON.stringify({ email, password }) }); onLogin() }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <main className="login-shell">
    <section className="login-story">
      <div className="brand light"><Logo /> FinFlow</div>
      <div className="story-copy"><span className="eyebrow"><Sparkles size={15}/> FULL-STACK PORTFOLIO PROJECT</span><h1>Money, made<br/><i>beautifully clear.</i></h1><p>A secure, synthetic banking sandbox demonstrating modern product design, serverless APIs, persistent data, validation, and responsive UX.</p></div>
      <div className="trust-row"><ShieldCheck/><div><b>Safe by design</b><span>No real money, identity, or bank credentials.</span></div></div>
      <div className="orb orb-one"/><div className="orb orb-two"/>
    </section>
    <section className="login-panel"><form className="login-card" onSubmit={submit}>
      <span className="mobile-brand"><Logo/> FinFlow</span><p className="kicker">WELCOME BACK</p><h2>Enter the sandbox</h2><p>Use the ready-made demo profile. Your changes persist for 24 hours.</p>
      <label>Email address<input value={email} onChange={e=>setEmail(e.target.value)} type="email" /></label>
      <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" /></label>
      {error && <div className="error">{error}</div>}
      <button className="primary" disabled={busy}>{busy ? 'Opening workspace…' : 'Open demo dashboard'} <ArrowUpRight size={18}/></button>
      <div className="demo-note"><span>DEMO ACCESS</span><code>demo@finflow.dev</code><code>finflow2026</code></div>
    </form></section>
  </main>
}

const Logo = () => <span className="logo-mark"><span/><span/><span/></span>

const navItems = [
  ['Overview', LayoutDashboard], ['Transactions', ArrowLeftRight], ['Transfer', CircleDollarSign], ['Budgets', Target], ['Accounts', WalletCards]
]

function Sidebar({ page, setPage, open, setOpen, logout }) {
  return <aside className={`sidebar ${open ? 'open' : ''}`}><div className="side-top"><div className="brand"><Logo/> FinFlow</div><button className="icon mobile-close" onClick={()=>setOpen(false)}><X/></button></div>
    <nav>{navItems.map(([name, Icon])=><button key={name} className={page===name?'active':''} onClick={()=>{setPage(name);setOpen(false)}}><Icon size={19}/>{name}</button>)}</nav>
    <div className="side-bottom"><div className="sandbox-chip"><ShieldCheck/><div><b>Sandbox mode</b><span>Synthetic data only</span></div></div><button onClick={logout}><LogOut size={18}/> Sign out</button></div>
  </aside>
}

function Header({ profile, openMenu, page }) {
  return <header><div className="header-title"><button className="icon menu" onClick={openMenu}><Menu/></button><div><span>WORKSPACE / {page.toUpperCase()}</span><h2>{page}</h2></div></div><div className="header-actions"><button className="icon"><Bell size={19}/><i/></button><div className="avatar">AM</div><div className="profile"><b>{profile.name}</b><span>{profile.plan}</span></div><ChevronDown size={16}/></div></header>
}

function Stat({ label, value, detail, icon: Icon, tone }) { return <article className="stat"><div className={`stat-icon ${tone}`}><Icon/></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article> }

function Overview({ data, go }) {
  const total = data.accounts.reduce((sum,a)=>sum+a.balance,0)
  const monthIncome = data.cashflow.at(-1).income, monthSpend = data.cashflow.at(-1).spending
  return <div className="page-grid"><section className="hero-card"><div><span className="eyebrow dark">YOUR FINANCIAL PULSE</span><h1>Good morning, Alex.</h1><p>Your cash flow is healthy. You kept <b>{money(monthIncome-monthSpend)}</b> more than you spent this month.</p><div className="hero-actions"><button className="primary" onClick={()=>go('Transfer')}>Move money <ArrowUpRight size={18}/></button><button className="secondary" onClick={()=>go('Transactions')}>View activity</button></div></div><div className="score"><span>FINFLOW SCORE</span><strong>84</strong><small>Excellent</small><svg viewBox="0 0 160 90"><path d="M15 80 A65 65 0 0 1 145 80"/><path className="fill" d="M15 80 A65 65 0 0 1 145 80"/></svg></div></section>
    <section className="stats-row"><Stat label="Total balance" value={money(total)} detail="Across 3 accounts" icon={WalletCards} tone="green"/><Stat label="Monthly income" value={money(monthIncome)} detail="↑ 5.6% from August" icon={ArrowDownLeft} tone="blue"/><Stat label="Monthly spending" value={money(monthSpend)} detail="↓ 10.3% from August" icon={ArrowUpRight} tone="orange"/></section>
    <section className="panel chart-panel"><PanelHead title="Cash flow" subtitle="Income versus spending"/><div className="chart-legend"><span className="income">Income</span><span className="spend">Spending</span></div><ResponsiveContainer width="100%" height={250}><AreaChart data={data.cashflow}><defs><linearGradient id="income" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#20c997" stopOpacity=".25"/><stop offset="1" stopColor="#20c997" stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e9eee9"/><XAxis dataKey="month" axisLine={false} tickLine={false}/><Tooltip formatter={money}/><Area type="monotone" dataKey="income" stroke="#0c9b73" fill="url(#income)" strokeWidth={3}/><Area type="monotone" dataKey="spending" stroke="#7f6de0" fill="transparent" strokeWidth={2}/></AreaChart></ResponsiveContainer></section>
    <section className="panel budget-snapshot"><PanelHead title="Budget snapshot" subtitle="This month" action="Manage" onAction={()=>go('Budgets')}/>{data.budgets.slice(0,3).map(b=><BudgetBar key={b.id} budget={b}/>)}</section>
    <section className="panel recent"><PanelHead title="Recent activity" subtitle="Latest account movements" action="See all" onAction={()=>go('Transactions')}/><TransactionTable transactions={data.transactions.slice(0,6)}/></section>
  </div>
}

function PanelHead({title,subtitle,action,onAction}) { return <div className="panel-head"><div><h3>{title}</h3><p>{subtitle}</p></div>{action&&<button onClick={onAction}>{action} <ArrowUpRight size={15}/></button>}</div> }
function BudgetBar({budget}) { const pct=Math.min(100,Math.round(budget.spent/budget.limit*100)); return <div className="budget-bar"><div><b>{budget.category}</b><span>{money(budget.spent)} of {money(budget.limit)}</span></div><div className="track"><i style={{width:`${pct}%`}}/></div><small>{pct}% used</small></div> }

function TransactionTable({ transactions }) { return <div className="transaction-list">{transactions.map(t=><div className="transaction" key={t.id}><span className={`merchant-icon ${t.amount>0?'positive':''}`}>{t.amount>0?<ArrowDownLeft/>:<BadgeDollarSign/>}</span><div className="merchant"><b>{t.merchant}</b><span>{t.category} · {dateLabel(t.date)}</span></div><strong className={t.amount>0?'credit':''}>{money(t.amount)}</strong><span className="status"><Check/> {t.status}</span></div>)}</div> }

function Transactions({ data }) { const [query,setQuery]=useState(''); const [category,setCategory]=useState('All'); const categories=['All',...new Set(data.transactions.map(t=>t.category))]; const filtered=data.transactions.filter(t=>(category==='All'||t.category===category)&&`${t.merchant} ${t.category}`.toLowerCase().includes(query.toLowerCase())); return <section className="panel full"><div className="title-row"><div><p className="kicker">LEDGER</p><h1>Every movement, clearly tracked.</h1><p>Search and filter your synthetic transaction history.</p></div><div className="big-number"><span>NET ACTIVITY</span><b>{money(data.transactions.reduce((s,t)=>s+t.amount,0))}</b></div></div><div className="filters"><label className="search"><Search/><input placeholder="Search merchants or categories" value={query} onChange={e=>setQuery(e.target.value)}/></label><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></div><TransactionTable transactions={filtered}/>{!filtered.length&&<Empty text="No transactions match those filters."/>}</section> }

function Transfer({ data, mutate }) { const [form,setForm]=useState({fromAccountId:'checking',toAccountId:'savings',recipient:'',amount:'',memo:''}); const [message,setMessage]=useState(null); const [busy,setBusy]=useState(false); const submit=async(e)=>{e.preventDefault();setBusy(true);setMessage(null);try{const result=await api('transfers',{method:'POST',body:JSON.stringify(form)});mutate(result.state);setMessage({ok:true,text:`${money(Number(form.amount))} moved successfully.`});setForm({...form,amount:'',memo:''})}catch(err){setMessage({ok:false,text:err.message})}finally{setBusy(false)}}; return <div className="transfer-layout"><form className="panel transfer-form" onSubmit={submit}><p className="kicker">SECURE DEMO TRANSFER</p><h1>Move money with confidence.</h1><p>Try an internal transfer or send to a fictional recipient. Server-side rules prevent invalid amounts and overdrafts.</p><label>From<select value={form.fromAccountId} onChange={e=>setForm({...form,fromAccountId:e.target.value})}>{data.accounts.filter(a=>a.type!=='Credit').map(a=><option value={a.id} key={a.id}>{a.name} — {money(a.balance)}</option>)}</select></label><label>Destination<select value={form.toAccountId} onChange={e=>setForm({...form,toAccountId:e.target.value,recipient:''})}><option value="external">New demo recipient</option>{data.accounts.filter(a=>a.type!=='Credit').map(a=><option value={a.id} key={a.id}>{a.name}</option>)}</select></label>{form.toAccountId==='external'&&<label>Recipient name<input required placeholder="e.g. Taylor Reed" value={form.recipient} onChange={e=>setForm({...form,recipient:e.target.value})}/></label>}<div className="form-split"><label>Amount<input required min="0.01" step="0.01" type="number" placeholder="$0.00" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label><label>Memo<input placeholder="Optional" maxLength="80" value={form.memo} onChange={e=>setForm({...form,memo:e.target.value})}/></label></div>{message&&<div className={message.ok?'success':'error'}>{message.ok&&<Check/>}{message.text}</div>}<button className="primary" disabled={busy}>{busy?'Processing…':'Review & send'} <ArrowUpRight size={18}/></button></form><aside className="panel transfer-aside"><div className="transfer-orb"><ArrowLeftRight/></div><h3>What this demonstrates</h3><ul><li><Check/> Persistent serverless data</li><li><Check/> Backend validation</li><li><Check/> Balance reconciliation</li><li><Check/> Immediate transaction history</li></ul><div className="safety"><ShieldCheck/><div><b>Portfolio-safe</b><span>No transfer leaves this synthetic environment.</span></div></div></aside></div> }

function Budgets({ data, mutate }) { const [editing,setEditing]=useState(null); const [value,setValue]=useState(''); const save=async(id)=>{try{const result=await api('budgets',{method:'POST',body:JSON.stringify({id,limit:value})});mutate(result.state);setEditing(null)}catch(err){alert(err.message)}}; return <section className="panel full"><div className="title-row"><div><p className="kicker">SMART LIMITS</p><h1>Spend with intention.</h1><p>Adjust a limit and watch the progress update across your session.</p></div><div className="big-number"><span>PLANNED</span><b>{money(data.budgets.reduce((s,b)=>s+b.limit,0))}</b></div></div><div className="budget-grid">{data.budgets.map((b,i)=>{const pct=Math.round(b.spent/b.limit*100);return <article className="budget-card" key={b.id}><div className={`budget-icon c${i}`}><PiggyBank/></div><span>{b.category}</span><strong>{money(b.spent)}</strong><small>of {money(b.limit)} planned</small><div className="track"><i style={{width:`${Math.min(pct,100)}%`}}/></div><div className="budget-foot"><b>{pct}% used</b>{editing===b.id?<span className="inline-edit"><input autoFocus type="number" value={value} onChange={e=>setValue(e.target.value)}/><button onClick={()=>save(b.id)}><Check/></button></span>:<button onClick={()=>{setEditing(b.id);setValue(b.limit)}}>Edit limit</button>}</div></article>})}</div></section> }

function Accounts({ data }) { return <section className="panel full"><div className="title-row"><div><p className="kicker">ACCOUNT PORTFOLIO</p><h1>One calm financial picture.</h1><p>Balances update immediately after every sandbox transfer.</p></div></div><div className="account-grid">{data.accounts.map((a,i)=><article className={`account-card ${a.color}`} key={a.id}><div><span>{a.type.toUpperCase()}</span><Building2/></div><h3>{a.name}</h3><strong>{money(a.balance)}</strong><p>•••• {a.mask}</p>{a.limit&&<small>{money(Math.abs(a.balance))} used of {money(a.limit)} limit</small>}<div className="card-glow"/></article>)}</div><div className="panel inset"><PanelHead title="Account activity" subtitle="All linked demo accounts"/><TransactionTable transactions={data.transactions.slice(0,8)}/></div></section> }

function Empty({text}) {return <div className="empty"><Search/><p>{text}</p></div>}

function App() {
  const [data,setData]=useState(null), [loading,setLoading]=useState(true), [page,setPage]=useState('Overview'), [menu,setMenu]=useState(false), [toast,setToast]=useState('')
  const load=()=>{setLoading(true);api('session').then(setData).catch(()=>setData(null)).finally(()=>setLoading(false))}
  useEffect(load,[])
  const logout=async()=>{await api('logout',{method:'POST'}).catch(()=>{});setData(null)}
  const reset=async()=>{const state=await api('reset',{method:'POST'});setData(state);setToast('Demo data restored');setTimeout(()=>setToast(''),2500)}
  if(loading)return <div className="loader"><Logo/><span>Preparing your workspace…</span></div>
  if(!data)return <Login onLogin={load}/>
  const content={Overview:<Overview data={data} go={setPage}/>,Transactions:<Transactions data={data}/>,Transfer:<Transfer data={data} mutate={setData}/>,Budgets:<Budgets data={data} mutate={setData}/>,Accounts:<Accounts data={data}/>}[page]
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} open={menu} setOpen={setMenu} logout={logout}/>{menu&&<div className="backdrop" onClick={()=>setMenu(false)}/>}<div className="main"><Header profile={data.profile} page={page} openMenu={()=>setMenu(true)}/><main className="content">{content}<footer><span>FinFlow is a synthetic portfolio demonstration. No real financial services are provided.</span><button onClick={reset}><RefreshCw/> Reset demo data</button></footer></main></div>{toast&&<div className="toast"><Check/>{toast}</div>}</div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
