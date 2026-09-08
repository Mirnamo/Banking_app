import test from 'node:test'
import assert from 'node:assert/strict'
import { createDemoState, transferFunds, updateBudget } from './domain.mjs'

test('internal transfer updates both balances and creates activity', () => {
  const state = createDemoState()
  transferFunds(state, { fromAccountId: 'checking', toAccountId: 'savings', amount: 100, memo: 'Goal' })
  assert.equal(state.accounts[0].balance, 8320.58)
  assert.equal(state.accounts[1].balance, 16425.2)
  assert.equal(state.transfers.length, 1)
  assert.equal(state.transactions[0].amount, -100)
})

test('transfer rejects overdrafts', () => {
  assert.throws(() => transferFunds(createDemoState(), { fromAccountId: 'checking', recipient: 'Demo', amount: 999999 }), /insufficient/)
})

test('budget limits are validated and saved', () => {
  const state = createDemoState()
  updateBudget(state, { id: 'b1', limit: 800 })
  assert.equal(state.budgets[0].limit, 800)
  assert.throws(() => updateBudget(state, { id: 'b1', limit: -2 }), /between/)
})
