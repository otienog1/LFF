import { format } from 'date-fns'

export function formatDate(date: string, pattern = 'PPP'): string {
  return format(new Date(date), pattern)
}

export function sortObjectsByDateDesc<T extends Record<string, string>>(
  array: T[],
  { key = 'date' }: { key?: string } = {}
): T[] {
  return array.sort((a, b) => new Date(a[key]).getTime() - new Date(b[key]).getTime())
}

export function sortObjectsByDateAsc<T extends Record<string, string>>(
  array: T[],
  { key = 'date' }: { key?: string } = {}
): T[] {
  return array.sort((a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime())
}
