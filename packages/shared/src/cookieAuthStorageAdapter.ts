import { ClientStorage, NhostSession } from "@nhost/hasura-auth-js"
import { DEFAULT_COOKIE_OPTIONS, parseNhostCookie, stringifyNhostSession } from './utils';
import { CookieOptions } from './types';

export type StorageAdapter = ClientStorage
export abstract class CookieAuthStorageAdapter implements ClientStorage {
	protected readonly cookieOptions: CookieOptions;

	constructor(cookieOptions?: CookieOptions) {
		this.cookieOptions = {
			...DEFAULT_COOKIE_OPTIONS,
			...cookieOptions
		};
	}

	protected abstract getCookie(name: string): string | undefined | null;
	protected abstract setCookie(name: string, value: string): void;
	protected abstract deleteCookie(name: string): void;

	getItem(key: string): string | Promise<string | null> | null {
		const value = this.getCookie(key);

		if (!value) return null;

		// pkce code verifier
		if (key.endsWith('-code-verifier')) {
			return value;
		}

		return JSON.stringify(parseNhostCookie(value));
	}

	setItem(key: string, value: string): void | Promise<void> {
		// pkce code verifier
		if (key.endsWith('-code-verifier')) {
			this.setCookie(key, value);
			return;
		}

		let session: NhostSession = JSON.parse(value);
		const sessionStr = stringifyNhostSession(session);

		this.setCookie(key, sessionStr);
	}

	removeItem(key: string): void | Promise<void> {
		this.deleteCookie(key);
	}
}
