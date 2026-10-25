import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from './api.js';

describe('api service', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends JSON with session credentials and returns response data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: { status: 'ok' } }) });
    vi.stubGlobal('fetch', fetchMock);
    await expect(api('/health')).resolves.toEqual({ status: 'ok' });
    expect(fetchMock).toHaveBeenCalledWith('/api/health', expect.objectContaining({ credentials: 'include' }));
  });

  it('normalizes API errors without exposing response internals', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ success: false, error: { message: 'Case generation is unavailable.' } }) }));
    await expect(api('/mysteries')).rejects.toThrow('Case generation is unavailable.');
  });

  it('returns a useful message when the network request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('internal network detail')));
    await expect(api('/health')).rejects.toThrow('Could not reach the server. Check your connection and try again.');
  });
});
