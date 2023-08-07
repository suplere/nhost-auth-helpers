import { NhostSession } from "@nhost/nhost-js";
import fetch from 'isomorphic-unfetch'

export function isBrowser() {
	return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

export const refresh = async (nhostUrl: string, refreshToken: string): Promise<NhostSession> => {
  const result = await fetch(`${nhostUrl}/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  })
  if (result.ok) {
    return result.json()
  }
  return Promise.reject(result.statusText)
}