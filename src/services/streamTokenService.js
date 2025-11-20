const TOKEN_ENDPOINT = import.meta.env.VITE_ZEGO_TOKEN_ENDPOINT || '/api/stream-token';
export const shouldUseDynamicTokens = `${import.meta.env.VITE_ZEGO_STATIC_TOKEN_MODE}`.toLowerCase() === 'false';

/**
 * Request a Zego token from the backend when dynamic token mode is enabled.
 * Falls back to the caller letting the component use static tokens when disabled.
 */
export const fetchZegoToken = async ({ userId, roomId, role }) => {
  if (!shouldUseDynamicTokens) {
    throw new Error('Dynamic token endpoint disabled. Set VITE_ZEGO_STATIC_TOKEN_MODE=false to enable fetch.');
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userId, roomId, role })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token request failed: ${response.status} ${errorText}`);
  }

  return response.json();
};
