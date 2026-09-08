import { getStore } from '@netlify/blobs'
import { createDemoState, transferFunds, updateBudget } from './lib/domain.mjs'

const COOKIE = 'finflow_session'
const DEMO_EMAIL = 'demo@finflow.dev'
const DEMO_PASSWORD = 'finflow2026'

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
})
const parse = async (request) => { try { return await request.json() } catch { return {} } }
const cookies = (header = '') => Object.fromEntries(header.split(';').map((part) => part.trim().split('=')).filter(([key, value]) => key && value))
const route = (request) => new URL(request.url).pathname.replace(/^.*\/api\/?/, '').replace(/^\/+|\/+$/g, '') || 'session'
const store = () => getStore({ name: 'finflow-sessions', consistency: 'strong' })
const sessionId = (request) => cookies(request.headers.get('cookie'))[COOKIE]

async function load(request) {
  const id = sessionId(request)
  if (!id) return null
  return { id, state: await store().get(`session:${id}`, { type: 'json' }) }
}

async function save(id, state) { await store().setJSON(`session:${id}`, state) }

export default async (request) => {
  const path = route(request)
  const method = request.method
  try {
    if (path === 'login' && method === 'POST') {
      const { email, password } = await parse(request)
      if (String(email).toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return json({ error: 'Use the demo credentials shown on screen.' }, 401)
      const id = crypto.randomUUID()
      const state = createDemoState()
      await save(id, state)
      return json({ profile: state.profile }, 200, { 'set-cookie': `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400` })
    }
    if (path === 'logout' && method === 'POST') return json({ ok: true }, 200, { 'set-cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` })
    const session = await load(request)
    if (!session?.state) return json({ error: 'Your demo session has expired. Sign in again.' }, 401)
    if ((path === 'session' || path === 'dashboard') && method === 'GET') return json(session.state)
    if (path === 'transfers' && method === 'POST') {
      const transfer = transferFunds(session.state, await parse(request))
      await save(session.id, session.state)
      return json({ transfer, state: session.state }, 201)
    }
    if (path === 'budgets' && method === 'POST') {
      const budget = updateBudget(session.state, await parse(request))
      await save(session.id, session.state)
      return json({ budget, state: session.state })
    }
    if (path === 'reset' && method === 'POST') {
      const state = createDemoState()
      await save(session.id, state)
      return json(state)
    }
    return json({ error: 'Route not found.' }, 404)
  } catch (error) {
    console.error(error)
    const expected = error?.message?.startsWith('Enter') || error?.message?.includes('account') || error?.message?.includes('Budget') || error?.message?.includes('recipient')
    return json({ error: expected ? error.message : 'The demo service could not complete that request.' }, 400)
  }
}
