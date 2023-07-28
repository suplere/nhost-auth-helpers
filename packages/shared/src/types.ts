import { NhostReactClientConstructorParams } from '@nhost/react';
import type { CookieSerializeOptions } from 'cookie';

export type CookieOptions = Pick<
	CookieSerializeOptions,
	'domain' | 'secure' | 'path' | 'sameSite' | 'maxAge'
>;

export type CookieOptionsWithName = { name?: string } & CookieOptions;

export interface NhostNextClientConstructorParams
  extends Omit<
    NhostReactClientConstructorParams,
    'clientStorage' | 'clientStorageType' | 'clientStorageGetter' | 'clientStorageSetter'
  > {}