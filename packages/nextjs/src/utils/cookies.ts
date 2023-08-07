import {
	NhostClient,
  NhostSession
} from '@nhost/nhost-js'
import { NHOST_SESSION_KEY } from './constants';
import Cookies from 'js-cookie'
import { parse, serialize } from 'cookie';


export { parse as parseCookies, serialize as serializeCookie };


export const setNhostSessionInCookie = (param: NhostClient | NhostSession | null) => {
  const session = param && 'auth' in param ? param.auth.getSession() : param
  if (!session) {
    Cookies.remove(NHOST_SESSION_KEY)
    return
  }
  const { refreshToken, ...rest } = session
  const expires = new Date()
  // * Expire the cookie 60 seconds before the token expires
  expires.setSeconds(expires.getSeconds() + session.accessTokenExpiresIn - 60)
  Cookies.set(NHOST_SESSION_KEY, JSON.stringify(rest), {
    sameSite: 'strict',
    expires
  })
}
