export function getTeacherInitials(name: string): string {
  const parts = name
    .replace(/^(د\.|أ\.|م\.)\s*/, '')
    .trim()
    .split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2);
  return (parts[0][0] || '') + (parts[parts.length - 1][0] || '');
}

export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}
