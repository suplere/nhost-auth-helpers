import { NhostClientConstructorParams } from "@nhost/nhost-js";
import type { CookieSerializeOptions } from 'cookie';

export type CookieOptions = Pick<
	CookieSerializeOptions,
	'domain' | 'secure' | 'path' | 'sameSite' | 'maxAge'
>;

export interface NhostNextClientConstructorParams
  extends Omit<
  NhostClientConstructorParams,
    'clientStorage' | 'clientStorageType' | 'clientStorageGetter' | 'clientStorageSetter'
  > {}
