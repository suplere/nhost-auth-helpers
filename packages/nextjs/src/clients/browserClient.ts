import { NhostClient, NhostClientConstructorParams } from "@nhost/nhost-js"
import { isBrowser, setNhostSessionInCookie } from "../utils"

export class NhostBrowserClient extends NhostClient {
  constructor(params: NhostClientConstructorParams) {
    super({
      ...params,
      autoSignIn: isBrowser() && params.autoSignIn,
      autoRefreshToken: isBrowser() && params.autoRefreshToken,
      clientStorageType: 'cookie'
    })

    this.auth.onAuthStateChanged(() => {
      console.log("AUTH STATE CHANGE")
      setNhostSessionInCookie(this)
    })
    this.auth.onTokenChanged(setNhostSessionInCookie)
  }
}