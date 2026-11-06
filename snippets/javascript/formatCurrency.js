// @codetype easy | Format numbers as money for a given locale
export function formatCurrency(amount, currency = 'IDR', locale = 'id-ID') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  }).format(amount);
}

console.log(formatCurrency(1250000)); // Rp 1.250.000
console.log(formatCurrency(19.9, 'USD', 'en-US')); // $19.90
