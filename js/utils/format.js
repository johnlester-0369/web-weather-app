// Show "Today" for the first forecast row so the user has immediate orientation
// without needing to infer which row is current from the day abbreviation
export function formatDay(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function round(n) { return Math.round(n); }