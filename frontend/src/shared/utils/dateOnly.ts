type DateParts = [year: number, month: number, day: number];

function isDateOnly(parts: unknown): parts is DateParts {
  if (!Array.isArray(parts) || parts.length !== 3) return false;
  const [year, month, day] = parts;
  if (
    !Number.isInteger(year) || year < 1 || year > 9999 ||
    !Number.isInteger(month) || month < 1 || month > 12 ||
    !Number.isInteger(day) || day < 1
  ) {
    return false;
  }

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthLengths = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= monthLengths[month - 1];
}

// An empty array is the form's unselected value, never a date to send to the API.
export function parseDateOnly(value: string): DateParts | [] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return [];
  const parts = value.split('-').map(Number);
  return isDateOnly(parts) ? parts : [];
}

export function formatDateOnly(value: unknown): string {
  if (!isDateOnly(value)) return '';
  const [year, month, day] = value;
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function todayDateOnly(): DateParts {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()];
}
