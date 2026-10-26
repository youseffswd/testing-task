export function luhnCheck(number: string) {
  const digits = number;
  if (digits.length < 13 || digits.length > 19) return false;
  return digits.split('').reverse().reduce((sum, value, index) => {
    let digit = Number(value);
    if (index % 2 === 1) digit = digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
    return sum + digit;
  }, 0) % 10 === 0;
}
export function relativeTime(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 1209600) return `${Math.floor(seconds / 86400)} days ago`;
  return `${Math.floor(seconds / 604800)} weeks ago`;
}
export function validExpiry(value: string) {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;
  const [month, year] = value.split('/').map(Number); const now = new Date();
  return month >= 1 && month <= 12 && new Date(2000 + year, month, 0) >= now;
}
