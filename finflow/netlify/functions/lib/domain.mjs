export const uid = () => crypto.randomUUID()

export function createDemoState() {
  const now = new Date()
  const date = (days) => new Date(now.getTime() - days * 86400000).toISOString()
  const transactions = [
    ['Payroll — Northstar Labs', 4850, 'Income', 1, 'completed'],
    ['Arcadia Apartments', -1850, 'Housing', 2, 'completed'],
    ['Whole Foods Market', -126.42, 'Groceries', 3, 'completed'],
    ['Cloudflare', -24, 'Software', 4, 'completed'],
    ['United Airlines', -384.2, 'Travel', 6, 'completed'],
    ['Spotify', -11.99, 'Subscriptions', 8, 'completed'],
    ['Savings auto-transfer', -600, 'Transfer', 9, 'completed'],
    ['Freelance payment', 1225, 'Income', 11, 'completed'],
    ['Blue Bottle Coffee', -8.75, 'Dining', 12, 'completed'],
    ['Adobe Creative Cloud', -59.99, 'Software', 15, 'completed'],
    ['Trader Joe’s', -82.17, 'Groceries', 17, 'completed'],
    ['Lyft', -31.44, 'Transport', 20, 'completed'],
    ['Electric utility', -96.38, 'Utilities', 22, 'completed'],
    ['Client refund', -140, 'Business', 25, 'completed']
  ].map(([merchant, amount, category, days, status], index) => ({
    id: `txn_${index + 1}`, merchant, amount, category, status, date: date(days), accountId: 'checking'
  }))

  return {
    profile: { name: 'Alex Morgan', email: 'demo@finflow.dev', plan: 'Portfolio sandbox' },
    accounts: [
      { id: 'checking', name: 'Everyday Checking', type: 'Checking', mask: '4821', balance: 8420.58, color: 'mint' },
      { id: 'savings', name: 'Growth Savings', type: 'Savings', mask: '1057', balance: 16325.2, color: 'violet' },
      { id: 'credit', name: 'FinFlow Card', type: 'Credit', mask: '8094', balance: -1240.12, limit: 8000, color: 'coral' }
    ],
    budgets: [
      { id: 'b1', category: 'Groceries', spent: 428, limit: 650 },
      { id: 'b2', category: 'Dining', spent: 186, limit: 350 },
      { id: 'b3', category: 'Travel', spent: 384, limit: 900 },
      { id: 'b4', category: 'Software', spent: 148, limit: 220 }
    ],
    cashflow: [
      { month: 'Apr', income: 5200, spending: 3920 }, { month: 'May', income: 5600, spending: 4210 },
      { month: 'Jun', income: 5350, spending: 3860 }, { month: 'Jul', income: 6075, spending: 4475 },
      { month: 'Aug', income: 5750, spending: 4030 }, { month: 'Sep', income: 6075, spending: 3615 }
    ],
    transactions,
    transfers: []
  }
}

export function transferFunds(state, input) {
  const amount = Number(input.amount)
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter an amount greater than zero.')
  const from = state.accounts.find((account) => account.id === input.fromAccountId)
  if (!from || from.type === 'Credit') throw new Error('Choose a valid funding account.')
  if (from.balance < amount) throw new Error('This demo account has insufficient funds.')
  const to = state.accounts.find((account) => account.id === input.toAccountId)
  const recipient = to?.name || String(input.recipient || '').trim()
  if (!recipient) throw new Error('Choose or enter a recipient.')
  if (to?.id === from.id) throw new Error('Source and destination accounts must be different.')

  from.balance = round(from.balance - amount)
  if (to) to.balance = round(to.balance + amount)
  const transfer = { id: uid(), fromAccountId: from.id, toAccountId: to?.id || null, recipient, amount, memo: String(input.memo || '').slice(0, 80), date: new Date().toISOString(), status: 'completed' }
  state.transfers.unshift(transfer)
  state.transactions.unshift({ id: uid(), merchant: `Transfer to ${recipient}`, amount: -amount, category: 'Transfer', status: 'completed', date: transfer.date, accountId: from.id })
  return transfer
}

export function updateBudget(state, input) {
  const budget = state.budgets.find((item) => item.id === input.id)
  const limit = Number(input.limit)
  if (!budget) throw new Error('Budget not found.')
  if (!Number.isFinite(limit) || limit < 1 || limit > 100000) throw new Error('Budget must be between $1 and $100,000.')
  budget.limit = round(limit)
  return budget
}

export const round = (value) => Math.round(value * 100) / 100
