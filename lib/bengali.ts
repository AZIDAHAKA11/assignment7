const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengali(value: number | string): string {
  const str = String(value);
  return str
    .split('')
    .map((ch) => {
      const d = ch.charCodeAt(0) - 48;
      return d >= 0 && d <= 9 ? BN_DIGITS[d] : ch;
    })
    .join('');
}

export function toBengaliNumber(value: number): string {
  const formatted = new Intl.NumberFormat('en-IN').format(value);
  return toBengali(formatted);
}

export function formatChange(percent: number): {
  arrow: string;
  text: string;
  color: 'up' | 'down' | 'flat';
} {
  const abs = Math.abs(percent);
  const rounded = Math.round(abs * 10) / 10;
  const bengali = toBengali(rounded.toFixed(1));

  if (percent > 0.05) {
    return { arrow: '▲', text: `${bengali}%`, color: 'up' };
  }
  if (percent < -0.05) {
    return { arrow: '▼', text: `${bengali}%`, color: 'down' };
  }
  return { arrow: '—', text: `${bengali}%`, color: 'flat' };
}

export function getBengaliDate(): string {
  try {
    const now = new Date();
    return new Intl.DateTimeFormat('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
  } catch {
    return '';
  }
}

/**
 * Convert unit code ("kg", "litter", "dozen", "pcs") to Bengali label.
 */
export function formatUnit(unit: string): string {
  const map: Record<string, string> = {
    kg: 'প্রতি কেজি',
    litter: 'প্রতি লিটার',
    liter: 'প্রতি লিটার',
    litre: 'প্রতি লিটার',
    dozen: 'প্রতি ডজন',
    pcs: 'প্রতি পিস',
    piece: 'প্রতি পিস',
    gram: 'প্রতি গ্রাম',
    gm: 'প্রতি গ্রাম',
    bundle: 'প্রতি আঁটি',
    hali: 'প্রতি হালি',
  };
  return map[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

/**
 * Convert unit code to short Bengali label ("কেজি", "লিটার").
 */
export function shortUnit(unit: string): string {
  return formatUnit(unit).replace('প্রতি ', '');
}