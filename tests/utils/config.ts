import type { Response, RequestInit } from 'node-fetch';
import fetch from 'node-fetch';

export const apiUrl = 'http://localhost:8001/api/v1';

export function fetchApi (url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${apiUrl}/${url}`, options);
}
