import { computed, reactive } from 'vue';
import { bookings as seedBookings, driver as seedDriver, notifications as seedNotifications } from '@/data/mock';
import { stagesFor, stateOf } from '@/data/stages';
import type { Booking, BookingState } from '@/data/types';

// Module-level state so every screen shares the same session.
const bookings = reactive<Booking[]>(structuredClone(seedBookings));
const notifications = reactive(structuredClone(seedNotifications));
const driver = reactive(structuredClone(seedDriver));

export const peso = (n: number) =>
  `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const sum = (rows: { amount: number }[]) => rows.reduce((s, r) => s + r.amount, 0);

function nowStamp() {
  const d = new Date();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${month} ${d.getDate()} · ${time}`;
}

export function useStore() {
  const byState = (state: BookingState) => computed(() => bookings.filter((b) => stateOf(b) === state));

  const active = byState('active');
  const pending = byState('pending');
  const completed = byState('completed');
  const canceled = byState('canceled');

  const today = computed(() => bookings.filter((b) => b.today));
  const todayEarnings = computed(() =>
    today.value.filter((b) => stateOf(b) === 'completed').reduce((s, b) => s + sum(b.earnings), 0),
  );
  const unreadCount = computed(() => notifications.filter((n) => n.unread).length);

  const byId = (id: string) => bookings.find((b) => b.id === id);

  /** Move a booking to its next stage, stamping the time. */
  function advance(id: string) {
    const b = byId(id);
    if (!b) return;
    const last = stagesFor(b).length - 1;
    if (b.stage >= last) return;
    b.stageTimes[b.stage + 1] = nowStamp();
    b.stage += 1;
  }

  function markAllRead() {
    notifications.forEach((n) => (n.unread = false));
  }

  return {
    driver,
    bookings,
    notifications,
    active,
    pending,
    completed,
    canceled,
    today,
    todayEarnings,
    unreadCount,
    byId,
    advance,
    markAllRead,
  };
}
