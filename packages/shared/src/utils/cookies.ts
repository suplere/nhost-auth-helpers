import { parse, serialize } from 'cookie';
import { base64url } from 'jose';
import { NhostSession } from "@nhost/react"

export { parse as parseCookies, serialize as serializeCookie };

/**
 * Based on the environment and the request we know if a secure cookie can be set.
 */
export function isSecureEnvironment(headerHost?: string | string[]) {
	if (!headerHost) {
		throw new Error('The "host" request header is not available');
	}

	const headerHostStr = Array.isArray(headerHost) ? headerHost[0] : headerHost;

	const host = (headerHostStr.indexOf(':') > -1 && headerHostStr.split(':')[0]) || headerHostStr;
	if (['localhost', '127.0.0.1'].indexOf(host) > -1 || host.endsWith('.local')) {
		return false;
	}

	return true;
}

export function parseNhostCookie(str: string | null | undefined): Partial<NhostSession> | null {
	if (!str) {
		return null;
	}

	try {
		const session = JSON.parse(str);
		if (!session) {
			return null;
		}
		// Support previous cookie which was a stringified session object.
		if (session.constructor.name === 'Object') {
			return session;
		}
		if (session.constructor.name !== 'Array') {
			throw new Error(`Unexpected format: ${session.constructor.name}`);
		}

		const [_header, payloadStr, _signature] = session[0].split('.');
		const payload = base64url.decode(payloadStr);
		const decoder = new TextDecoder();

		const { exp, sub } = JSON.parse(decoder.decode(payload));

		return {
			accessTokenExpiresIn: exp,
			accessToken: session[0],
			refreshToken: session[1],
			user: {
				...session[2]
			}
		};
	} catch (err) {
		console.warn('Failed to parse cookie string:', err);
		return null;
	}
}

export function stringifyNhostSession(session: NhostSession): string {
	return JSON.stringify([
		session.accessToken,
		session.refreshToken,
		session.user
	]);
}
