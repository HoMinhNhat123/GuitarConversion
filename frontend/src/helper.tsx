/**
 * @param ApiEndpoint
 * @returns json result   
 */
export const runApi = async (endpoint: string, method: string) => {
  const apiRes = await fetch(endpoint, { method: method });

  if (!apiRes.ok) {
    const err = await apiRes.json().catch(() => ({}));
    throw new Error(err.error || err.hint || `HTTP ${apiRes.status}`);
  }

  const out = await apiRes.json();
  return out
}
