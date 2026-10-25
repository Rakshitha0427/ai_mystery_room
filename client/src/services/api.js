export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) throw new Error(body?.error?.message || 'Something went wrong. Please try again.');
  return body.data;
}
