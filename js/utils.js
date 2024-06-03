export function generateRandomId(prefix = '') {
    return Math.random().toString(36).replace('0.',prefix || '');
}

