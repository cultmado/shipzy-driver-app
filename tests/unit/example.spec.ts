import { mount } from '@vue/test-utils'
import StatusChip from '@/components/StatusChip.vue'
import { peso, sum, useStore } from '@/composables/useStore'
import { bookings } from '@/data/mock'
import { stagesFor, stateOf, statusOf } from '@/data/stages'
import type { Booking } from '@/data/types'
import { describe, expect, test } from 'vitest'

const find = (id: string) => bookings.find((b) => b.id === id) as Booking

describe('StatusChip.vue', () => {
  test('renders its label', () => {
    const wrapper = mount(StatusChip, { props: { tone: 'green', label: 'Delivered' } })
    expect(wrapper.text()).toBe('Delivered')
  })
})

describe('money helpers', () => {
  test('formats pesos', () => {
    expect(peso(1250)).toBe('₱1,250.00')
    expect(peso(85000.5)).toBe('₱85,000.50')
  })

  test('sums fee rows', () => {
    expect(sum(find('pc-0042').invoice.fees)).toBe(1220)
  })
})

describe('booking stages', () => {
  test('builds vehicle stages from its stops', () => {
    const titles = stagesFor(find('vr-0048')).map((s) => s.title)
    expect(titles).toContain('Currently at Stop 2')
    expect(titles.at(-1)).toBe('Delivered')
  })

  test('derives state and status', () => {
    expect(stateOf(find('pc-0051'))).toBe('pending')
    expect(stateOf(find('pc-0042'))).toBe('active')
    expect(stateOf(find('pbl-0011'))).toBe('canceled')
    expect(statusOf(find('pbl-0042')).label).toBe('Out for Delivery')
  })

  test('advance moves to the next stage and stops at the end', () => {
    const { byId, advance } = useStore()
    const b = byId('pbl-0042')!
    advance(b.id)
    expect(stateOf(b)).toBe('completed')
    advance(b.id)
    expect(b.stage).toBe(stagesFor(b).length - 1)
  })
})
