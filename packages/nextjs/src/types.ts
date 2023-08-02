import { NhostClientConstructorParams } from "@nhost/nhost-js";

export interface NhostNextClientConstructorParams
  extends Omit<
  NhostClientConstructorParams,
    'clientStorage' | 'clientStorageType' | 'clientStorageGetter' | 'clientStorageSetter'
  > {}
