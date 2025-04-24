export function logMessage(message, level = 'info', source) {
  const origin = source || (typeof window !== 'undefined' ? window.location.pathname : 'server');
  fetch('/api/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      level,
      source: origin,
      timestamp: new Date().toISOString()
    })
  });
} 