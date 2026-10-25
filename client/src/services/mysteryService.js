import { api } from './api.js';

export const createMystery = (data) => api('/mysteries', { method: 'POST', body: JSON.stringify(data) });
export const listMysteries = () => api('/mysteries');
export const getMystery = (id) => api(`/mysteries/${encodeURIComponent(id)}`);
export const accuse = (id, suspectId) => api(`/mysteries/${encodeURIComponent(id)}/accusations`, { method: 'POST', body: JSON.stringify({ suspectId }) });
export const getResult = (id) => api(`/mysteries/${encodeURIComponent(id)}/result`);
