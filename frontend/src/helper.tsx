/**
 * @param ApiEndpoint
 * Doesn't need any specific request body 
 * @returns json result   
 */
export const runBasicApi = async (endpoint: string, method: string) => {
  const apiRes = await fetch(endpoint, { method: method });

  if (!apiRes.ok) {
    const err = await apiRes.json().catch(() => ({}));
    throw new Error(err.error || err.hint || `HTTP ${apiRes.status}`);
  }

  const out = await apiRes.json();
  return out
}
