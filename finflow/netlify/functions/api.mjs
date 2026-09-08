import { getStore } from '@netlify/blobs'
import { createDemoState, transferFunds, updateBudget } from './lib/domain.mjs'

const COOKIE = 'finflow_session'
const DEMO_EMAIL = 'demo@finflow.dev'
const DEMO_PASSWORD = 'finflow2026'

const json = (statusCode, body, headers = {}) => ({ statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }, body: JSON.stringify(body) })
const parse = (event) => { try { return JSON.parse(event.body || '{}') } catch { return {} } }
const cookies = (header = '') => Object.fromEntries(header.split(';').map((part) => part.trim().split('=')).filter(([key, value]) => key && value))
const route = (event) => (event.path || '').replace(/^.*\/api\/?/, '').replace(/^\/+|\/+$/g, '') || 'session'
const store = () => getStore({ name: 'finflow-sessions', consistency: 'strong' })
const sessionId = (event) => cookies(event.headers.cookie || event.headers.Cookie)[COOKIE]

async function load(event) {
  const id = sessionId(event)
  if (!id) return null
  return { id, state: await store().get(`session:${id}`, { type: 'json' }) }
}

async function save(id, state) { await store().setJSON(`session:${id}`, state) }

export const handler = async (event) => {
  const path = route(event)
  const method = event.httpMethod
  try {
    if (path === 'login' && method === 'POST') {
      const { email, password } = parse(event)
      if (String(email).toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return json(401, { error: 'Use the demo credentials shown on screen.' })
      const id = crypto.randomUUID()
      const state = createDemoState()
      await save(id, state)
      return json(200, { profile: state.profile }, { 'set-cookie': `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400` })
    }
    if (path === 'logout' && method === 'POST') return json(200, { ok: true }, { 'set-cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` })
    const session = await load(event)
    if (!session?.state) return json(401, { error: 'Your demo session has expired. Sign in again.' })
    if ((path === 'session' || path === 'dashboard') && method === 'GET') return json(200, session.state)
    if (path === 'transfers' && method === 'POST') {
      const transfer = transferFunds(session.state, parse(event))
      await save(session.id, session.state)
      return json(201, { transfer, state: session.state })
    }
    if (path === 'budgets' && method === 'POST') {
      const budget = updateBudget(session.state, parse(event))
      await save(session.id, session.state)
      return json(200, { budget, state: session.state })
    }
    if (path === 'reset' && method === 'POST') {
      const state = createDemoState()
      await save(session.id, state)
      return json(200, state)
    }
    if (path === 'reset' && method === 'POST') {
      const state = createDemoState()
      await save(session.id, state)
      return json(200, state)
    }
    return json(404, { error: 'Route not found.' })
  } catch (error) {
    console.error(error)
    const known = /amount|account|recipient|Budget|insufficient|different/.test(error.message)
    return json(known ? 400 : 500, { error: known ? error.message : 'The demo service could not complete that request.' })
  }
}
