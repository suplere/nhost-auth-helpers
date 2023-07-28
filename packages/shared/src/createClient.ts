import { NhostNextClientConstructorParams } from './types';
import { isBrowser } from './utils';
import { StorageAdapter } from './cookieAuthStorageAdapter';
import { NhostClient, NhostReactClientConstructorParams, VanillaNhostClient } from '@nhost/react';

export function createNhostClient(
	params: NhostNextClientConstructorParams & {
		auth: {
			storage: StorageAdapter;
			storageKey?: string;
		};
	}
): NhostClient  {
	const bowser = isBrowser();

	let clientParams: NhostReactClientConstructorParams = {
		...params
	}

	const nhost = new VanillaNhostClient({
    ...clientParams,
    clientStorageType: 'custom',
    clientStorage: params.auth.storage,
    start: false,
    autoRefreshToken: false,
    autoSignIn: true
  })

	

  return nhost



}
