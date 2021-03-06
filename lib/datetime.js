import { format } from 'date-fns'

export function formatDate(date, pattern = 'PPP') {
    return format(new Date(date), pattern);
}

/**
 * sortObjectsByDate
 */

export function sortObjectsByDateDesc(array, { key = 'date' } = {}) {
    return array.sort((a, b) => new Date(a[key]) - new Date(b[key]));
}

export function sortObjectsByDateAsc(array, { key = 'date' } = {}) {
    return array.sort((a, b) => new Date(b[key]) - new Date(a[key]));
}