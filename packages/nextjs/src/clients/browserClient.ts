import { NhostClient, NhostClientConstructorParams } from "@nhost/nhost-js"
import { isBrowser, parseCookies, serializeCookie, setNhostSessionInCookie } from "../utils"

export class NhostBrowserClient extends NhostClient {
  constructor(params: NhostClientConstructorParams) {
    super({
      ...params,
      autoSignIn: isBrowser() && params.autoSignIn,
      autoRefreshToken: isBrowser() && params.autoRefreshToken,
      clientStorageType: 'custom',
      clientStorage: {
				getItem: (key: string) => {
					if (!isBrowser()) return null;

		      const cookies = parseCookies(document.cookie);
		      return cookies[key];
				},
				setItem: (key, value) => {
					if (!isBrowser()) return null;

          document.cookie = serializeCookie(key, value, {
            path: '/',
	          maxAge: 60 * 60 * 24 * 30,
            sameSite: "strict",
            httpOnly: false
          });
				},
				removeItem: (key) => {
					if (!isBrowser()) return null;

          document.cookie = serializeCookie(key, '', {
            path: '/',
	          maxAge: 0,
            httpOnly: false
          });
				}
			},
    })

    this.auth.onAuthStateChanged(() => {
      setNhostSessionInCookie(this)
    })
    this.auth.onTokenChanged(setNhostSessionInCookie)
  }
}